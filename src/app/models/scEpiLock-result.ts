export class scEpiLockResult {
    SnpID: string;
    SnpChr: string;
    SnpStartPos: number;     
    SnpEndPos: number;
    SnpRef: string;
    SnpAlt: string;
    ChunkChr: string;
    ChunkStartPos: number;
    ChunkEndPos:number;
    DiffMetric:number;
    Is0Based:boolean;
    CellType: string;

/*     getSnpTag() {
        return `${this.SnpChr}:${this.SnpStartPos}-${this.SnpEndPos}`;
    } */
}
