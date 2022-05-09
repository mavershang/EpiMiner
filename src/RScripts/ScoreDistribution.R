library(ggplot2)

df<-read.csv('C:/Users/shangl02/Downloads/epimap.hg19.adipose.csv')
gene<-'FOXP2'
tissue<-'Adipose'
s=0.217

hist(df$Score, freq=TRUE)

bin_size=0.05

## histogram 
df$group = ifelse(df$Score%/%bin_size==s%/%bin_size,'Bin with target score','Others')
ggplot(df, aes(x=Score, y=..count../sum(..count..)*100, fill=group)) + 
  geom_histogram(binwidth=bin_size, boundary=0, closed="left", alpha=0.8, color="black") + 
  ggtitle("Distribution of Score") +
  xlab("Score") + ylab("Percent") + 
  theme(legend.position = "top", plot.title=element_text(hjust=0.5, size=18))


## density plot
df2<-read.csv('D:/EpiMiner_WorkingDir/Cache/ScorePerTissue/epimap.hg19.blood_t-cell.csv')
df$group=NULL
df$Tissue='adipose'
df2$Tissue='blood_t-cell'
rbind(df, df2) %>%
  ggplot(aes(x=Score, fill=Tissue))+
    geom_density(alpha=0.2) + 
    geom_vline(xintercept = s, linetype="dashed", color="red", size=1)
  
getScoreFile <- function(dataSource, refGenome, tissue) {
  dir='D:/EpiMiner_WorkingDir/Cache/ScorePerTissue'
  file = file.path(dir, paste(dataSource, refGenome, tissue, "csv", sep='.'))
}

getScoreDistribution <- function(df, tissue, s, gene) {
  bin_size=0.05
  df$group = ifelse(df$Score%/%bin_size==s%/%bin_size,'Bin with target score','Others')
  p1 <- ggplot(df, aes(x=Score, y=..count../sum(..count..)*100, fill=group)) + 
    geom_histogram(binwidth=bin_size, boundary=0, closed="left", alpha=0.8, color="black") + 
    ggtitle(paste0("Distribution of all Scores (", tissue, ")")) +
    xlab("Score") + ylab("Percent") + 
    theme(legend.position = "top", plot.title=element_text(hjust=0.5, size=18))
  
  p2<-ggplot(df[df$GeneName==gene,], aes(x=Score, y=..count../sum(..count..)*100, fill=group)) + 
    geom_histogram(binwidth=bin_size, boundary=0, closed="left", alpha=0.8, color="black") + 
    ggtitle(paste0("Distribution of Scores in Gene ", gene, "(", tissue, ")")) +
    xlab("Score") + ylab("Percent") + 
    theme(legend.position = "top", plot.title=element_text(hjust=0.5, size=18))
  
  return(c(p1, p2))
}
