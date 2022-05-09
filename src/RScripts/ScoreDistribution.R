
library(ggplot2)

df<-read.csv('D:/EpiMiner_WorkingDir/Cache/ScorePerTissue/epimap.hg19.adipose.csv')
df<-read.csv('C:/Users/shangl02/Downloads/epimap.hg19.adipose.csv')

gene<-'FOXP2'
tissue<-'Adipose'

density(df$Score)

density(df[df$GeneName==gene,'Score'])

plot(density(df$Score))
abline(v=0.3, col="red", lwd=3, lty=2)

s=0.217


hist(df$Score, freq=TRUE)


bin_size=0.05
df$group = ifelse(df$Score%/%bin_size==s%/%bin_size,'Bin with target score','Others')

 # df %>% 
 #   mutate(
 #      grp = Score%/%bin_size==s%/%bin_size
 #      group=ifelse(grp, 'Bin with target score','Others')
 #   ) %>%
ggplot(df, aes(x=Score, y=..count../sum(..count..)*100, fill=group)) + 
  geom_histogram(binwidth=bin_size, boundary=0, closed="left", alpha=0.8, color="black") + 
  ggtitle("Distribution of Score") +
  xlab("Score") + ylab("Percent") + 
  theme(legend.position = "top", plot.title=element_text(hjust=0.5, size=18))









plot(density(df[df$GeneName==gene,'Score']), lwd=2, col="blue")
abline(v=0.3, col="red", lwd=3, lty=2)
range(df$Score)




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
