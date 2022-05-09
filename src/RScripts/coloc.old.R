library(coloc)
library(dplyr)

print("test")
args = commandArgs(trailingOnly=TRUE)

if (length(args) < 1) {
  stop("At least One argument required");
} else if (length(args) > 7) {
  stop("Too many arguments. Syntax: folder datatype1 datatyp2  p1 p2 p12");
}
  

convertType <- function(t) {
  t2 = tolower(t);
  if (t2 == 'gwas') {
    return('cc');
  } else if (t2 == 'qtl') {
    return('quant');
  }else {
    return('');
  }
}

#dir='X:\\projects\\p028_GeneticsPlusEpigenetics\\Test'
#file1='X:\\users\\yingwu\\From_Old\\ANALYSIS_COLOC\\IBD-Loci\\test\\AD.extractList.Known110.forR.txt'
#file2='X:\\users\\yingwu\\From_Old\\ANALYSIS_COLOC\\IBD-Loci\\test\\IBD.extractList.Known110.forR.txt'
#dataType1="GWAS"
#dataType2="QTL"

dir=args[1]
file1=file.path(dir, 'file1.txt')
file2=file.path(dir, 'file2.txt')
outSummary=file.path(dir,"coloc_output.summary.txt")
outTopSnp=file.path(dir, "coloc_output.topSnp.txt")

dataType1=args[2]
dataType2=args[3]

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
print(p1c)
print(p2c)
print(p12c)

df1 = read.table(file1, sep="\t", header=TRUE, stringsAsFactors=F)
df2 = read.table(file2, sep="\t", header=TRUE, stringsAsFactors=F)
r<-coloc.abf(dataset1 = list(pvalues=df1$pvalues, N=df1$N, MAF=df1$MAF, beta=df1$beta, varbeta=df1$varbeta, type=convertType(dataType1), s=df1$s, snp=df1$snp), dataset2 = list(pvalues=df2$pvalues, N=df2$N, MAF=df2$MAF, beta=df2$beta, varbeta=df2$varbeta, type=convertType(dataType2), s=df2$s, snp=df2$snp), p1=p1c, p2=p2c, p12=p12c)
df_summary=t(data.frame(r$summary))
df_topSnp=data.frame(r$result$snp, r$results$SNP.PP.H4)
colnames(df_topSnp)=c("snp","SNP.PP.H4")
df_topSnp=df_topSnp[order(df_topSnp$SNP.PP.H4, decreasing = TRUE),]
df_topSnp=df_topSnp[1:topNSnp,]
write.table(df_summary, outSummary, row.names=FALSE, quote=FALSE, sep="\t")
write.table(df_topSnp, outTopSnp, row.names=FALSE, quote=FALSE, sep="\t")


  
