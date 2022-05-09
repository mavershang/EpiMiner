library(biomaRt) # biomaRt_2.30.0
library(dplyr)

args = commandArgs(trailingOnly=TRUE)
infile=args[1]
outfile=args[2]
ref_genome=args[3]
#infile='D:\\EpiMiner_WorkingDir\\Search\\epiSearch.10-28-2021_09-32-40\\rs2coor.in.tmp.txt'
#outfile='D:\\EpiMiner_WorkingDir\\Search\\epiSearch.10-28-2021_09-32-40\\rs2coor.out.tmp.txt'

getSnpMart <- function(species, refGenome) {
  if (refGenome %in% c('hg19','hg37')) {
    return(useEnsembl(biomart="ENSEMBL_MART_SNP", dataset=species, GRCh = 37))
  } else {
    return(useEnsembl(biomart="ENSEMBL_MART_SNP", dataset=species))
  }
}

snp_ids=scan(infile, character(), quote="")
#snp_mart = useMart("ENSEMBL_MART_SNP", dataset="hsapiens_snp")
snp_mart <- getSnpMart("hsapiens_snp", ref_genome)
snp_attributes = c("refsnp_id", "chr_name", "chrom_start")

snp_locations = getBM(attributes=snp_attributes,
                      filters="snp_filter", 
                      values=snp_ids,
                      mart=snp_mart,
                      useCache=FALSE)

df=as.data.frame(snp_locations)
colnames(df)=c("rsID", "Chr", "Position")
write.table(df, outfile, row.names=FALSE, quote=FALSE, sep="\t")
