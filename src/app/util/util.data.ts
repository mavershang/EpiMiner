import { EpiData } from "../models/epi-data";
import { scEpiLockResult } from "../models/scEpiLock-result";

export class DataUtil {
    static calcOverlap(x1:number, x2:number, y1:number, y2:number)
    {
        let startX = Math.min(x1, x2);
        let endX = Math.max(x1, x2);
        let startY = Math.min(y1, y2);
        let endY = Math.max(y1, y2);

        let o = Math.min(endX, endY) - Math.max(startX, startY) + 1;
        return o;
    }

    
    static match(ed: EpiData, er: scEpiLockResult, coreLen:number=400): number {
        // snp position match
        if (this.getEdTag(ed) != this.getErTag(er)) {
            return -1;
        }

        // chunk position match
        let chunkLen = er.ChunkEndPos - er.ChunkStartPos + 1;
        let lCore = er.ChunkStartPos + (chunkLen - coreLen)/2;
        let rCore = er.ChunkEndPos - (chunkLen - coreLen)/2;
        let overlap = this.calcOverlap(lCore, rCore, ed.ChunkStartPos, ed.ChunkEndPos);
        return overlap
    }

    static getEdTag(ed:EpiData): string {
        return `${ed.Chr}:${ed.SnpPosition}-${ed.SnpPosition+1}_${ed.CellType}`
    }

    static getErTag(er:scEpiLockResult):string {
        return `${er.SnpChr}:${er.SnpStartPos}-${er.SnpEndPos}_${er.CellType}`;
    }

    static merge(data1: EpiData[], data2: scEpiLockResult[], peakLen=1000, minOverlap=0.2, coreLen=400, coreOverlap=0.8) {
        // wait for scEpiLock result 
        if (data2.length == 0) {
            return data1;
        }

        // build scEpiLock map 
        const dict2 = new Map();
        for (let er of data2) {
            let tag = this.getErTag(er);
            dict2.set(tag, er)
        }

        for (let ed of data1) {
            // match snp
            let tag = this.getEdTag(ed);
            if (!dict2.has(tag)) {
                ed.scEpiLockPeakOverlap = "SNP not in scEpiLock result";
                ed.scEpiLockPred = 'N/A'
                continue;
            } 

            // match celltype
            if (ed.CellType != dict2.get(tag).CellType) {
                continue;
            }
            
            // check overall overlap
            let overlapAll = this.match(ed, dict2.get(tag), peakLen);
            if (overlapAll < minOverlap) {
                ed.scEpiLockPeakOverlap = "No local peak overlap";
                ed.scEpiLockPred = 'N/A'
                continue;
            }

            // set values
            ed.scEpiLockPred =  dict2.get(tag).DiffMetric.toString();
            let overlap = this.match(ed, dict2.get(tag), coreLen);
            ed.scEpiLockPeakOverlap = overlap >= coreOverlap? "high": "low";            
        }
        
        return data1;
    }
}