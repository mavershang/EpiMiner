library(coloc)
library(dplyr)

print("test")
args = commandArgs(trailingOnly=TRUE)

if (length(args) < 1) {
  stop("At least One argument required");
} else if (length(args) > 7) {
  stop("Too many arguments. Syntax: folder datatype1 datatyp2  p1 p2 p12");
}

adjustColocDF<-function(df){
  ## remove rows with MAF==0 or 1
  df<-df[df$MAF!=1 & df$MAF!=0,]
  
  ## replace rows with varbeta==nan
  df<-df[!is.nan(df$varbeta),]
  
  ## remove rows with beta is NA
  df<-df[!is.na(df$beta),]
  
  return(df)
}

dir=args[1]
type1=args[2]
type2=args[3]

# dir='X:/projects/p028_GeneticsPlusEpigenetics/Test/COLOC/chr7_113962313.d1_chr7_112000001-114000000.AD.23Me.UKBB.COLOC.Subset.d2_chr7_112000001-114000000.SCALLOP.hg38.GCST90012071.Subset'
# type1="cc"
# type2="quant"

file1=file.path(dir, 'file1.txt')
file2=file.path(dir, 'file2.txt')
outSummary=file.path(dir,"coloc_output.summary.txt")
outTopSnp=file.path(dir, "coloc_output.topSnp.txt")

p1c=1e-04
p2c=1e-04
p12c=1e-06
topNSnp=10
if(length(args) > 3) {
  p1c=as.numeric(args[4])
} else if (length(args) > 4) {
  p2c=as.numeric(args[5])
} else if (length(args) > 5) {
  p12c=as.numeric(args[6])
} else if (length(args) > 6) {
  topNSnp=args[7]
}  

print(sprintf("p1:%s p2:%s p12:%s",p1c, p2c, p12c))
print(sprintf("type1:%s type2:%s", type1, type2))

df1 = read.table(file1, sep="\t", header=TRUE, stringsAsFactors=F)
df2 = read.table(file2, sep="\t", header=TRUE, stringsAsFactors=F)

df1=adjustColocDF(df1)
df2=adjustColocDF(df2)

r<-coloc.abf(dataset1 = list(pvalues=df1$pvalue, N=df1$N, MAF=df1$MAF, beta=df1$beta, varbeta=df1$varbeta, type=type1, s=df1$s, snp=df1$snp), dataset2 = list(pvalues=df2$pvalue, N=df2$N, MAF=df2$MAF, beta=df2$beta, varbeta=df2$varbeta, type=type2, s=df2$s, snp=df2$snp), p1=p1c, p2=p2c, p12=p12c)
df_summary=t(data.frame(r$summary))
df_topSnp=data.frame(r$result$snp, r$results$SNP.PP.H4)
colnames(df_topSnp)=c("snp","SNP.PP.H4")
df_topSnp=df_topSnp[order(df_topSnp$SNP.PP.H4, decreasing = TRUE),]
df_topSnp=df_topSnp[1:topNSnp,]
write.table(df_summary, outSummary, row.names=FALSE, quote=FALSE, sep="\t")
write.table(df_topSnp, outTopSnp, row.names=FALSE, quote=FALSE, sep="\t")
