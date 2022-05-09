library(ggplot2)
#library(tidyverse)
library(dplyr)
library(reshape2)
library(tidyr)

args <- commandArgs(trailingOnly = TRUE)
file=args[1]
imgFile=args[2]
#file='D:\\EpiMiner_WorkingDir\\Search\\epiSearch.03-24-2022_10-19-20\\epiResult.txt'
#imgFile='D:\\EpiMiner_WorkingDir\\Search\\epiSearch.03-24-2022_10-19-20\\epiResult.heatmap.png'

plotOption=1	

## Tile plot of downstream analysis
pickTopGenePlot=function(df, plotOption, title){
  ## summarize gene for each SNP with highest score
  df2=df %>%
    group_by(snp, tissue_cell) %>%
    filter(EpiLinkScore==max(EpiLinkScore, na.rm=TRUE)) %>%
    select(snp, tissue_cell, DataType, Gene, EpiLinkScore)
  
  df2$snpGene = paste(df2$snp, df2$Gene, sep="_")
  df2$snp=NULL
  df2$Gene=NULL
  
  ## convert rows to columns
  x <- melt(df2)
  
  ## Option 1, use ggplot
  if (plotOption==1) {
    colnames(x)=c('Tissue_CellType', 'DataType', 'SNP_Gene','Variable', 'Score')
    ggplot(x, aes(Tissue_CellType, SNP_Gene)) +
      geom_tile(aes(fill=Score)) + 
      ggtitle(title) + 
      scale_fill_gradient(low="gray", high="red") + 
      theme(legend.position="right", axis.text.x=element_text(angle=90,vjust=0.3,hjust=0.3)) 
  } else if (plotOption==2) {
    ## Option 2, use base R heatmap function
    x2 <- dcast(x, snpGene ~ tissue_cell + variable)
    colnames(x2)=trimws(colnames(x2),'right','_EpiLinkScore')
    row.names(x2)<-x2$snpGene
    x2$snpGene=NULL
    x2[is.na(x2)] = 0
    heatmap.2(as.matrix(x2, replace = TRUE))
  }
}


## find the pre-processed score-per-tissue file
getScoreFile <- function(dataSource, refGenome, tissue) {
  dir='D:/EpiMiner_WorkingDir/Cache/ScorePerTissue'
  file = file.path(dir, paste(dataSource, refGenome, tissue, "csv", sep='.'))
}

## histogram plot of all scores and subset of target gene
getScoreDistribution <- function(df, gene) {
  bin_size=0.05
  df$group = ifelse(df$Score%/%bin_size==s%/%bin_size,'Bin with target score','Others')
  p1<-ggplot(df, aes(x=Score, y=..count../sum(..count..)*100, fill=group)) + 
    geom_histogram(binwidth=bin_size, boundary=0, closed="left", alpha=0.8, color="black") + 
    ggtitle("Distribution of Score") +
    xlab("Score") + ylab("Percent") + 
    theme(legend.position = "top", plot.title=element_text(hjust=0.5, size=18))
  
  p2<-ggplot(df[df$GeneName==gene,], aes(x=Score, y=..count../sum(..count..)*100, fill=group)) + 
    geom_histogram(binwidth=bin_size, boundary=0, closed="left", alpha=0.8, color="black") + 
    ggtitle("Distribution of Score") +
    xlab("Score") + ylab("Percent") + 
    theme(legend.position = "top", plot.title=element_text(hjust=0.5, size=18))
  
  return(c(p1, p2))
}


df=read.table(file, header = TRUE, sep='\t')

## merge snp position column and it's target gene (via overlapped chunk)
df$snp = paste(df$Chr,df$SnpPosition,sep=':')

## The scale of EpiScore and ABCScore is very different, thus separate into two plots
## Epi subset

df_tissue=df[is.na(df$CellType)|df$CellType=='',]
df_tissue$CellType=NULL
df_tissue=rename(df_tissue,c('tissue_cell'='Tissue'))
p1<-pickTopGenePlot(df_tissue, plotOption, 'EpiMap with EpiScore')

tissues<-levels(as.factor(df_tissue$tissue_cell))


## ABC subset
df_celltype=df[df$CellType!='',]
df_celltype$Tssue=NULL
df_celltype=rename(df_celltype, c('tissue_cell'='CellType'))
p2<-pickTopGenePlot(df_celltype, plotOption, 'ATACSeq/scATACSeq with ABC Score')

library(patchwork)
png(file=imgFile, unit='in', width=10, height=4,res=150)
p1+p2
dev.off()

# if (plotSeparately) {
#   png(file=paste0(imgFile,'.epi.png'), unit='in', width=4, height=4,res=300)
#   print(p1)
#   dev.off()
#   png(file=paste0(imgFile,'.abc.png'), unit='in', width=4, height=4,res=300)
#   print(p2)
#   dev.off()
# } else {
#   library(patchwork)
#   png(file=paste0(imgFile,'.png'), unit='in', width=10, height=4,res=150)
#   p1+p2
#   dev.off()
# }

# 
# ## merge tissue and cell-type
# df$tissue_cell = paste(df$Tissue, df$CellType, sep = '_')
# df$tissue_cell=trimws(df$tissue_cell,'left','_')
# df$tissue_cell=trimws(df$tissue_cell,'right','_')


