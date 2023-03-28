export class EpiData {
    Chr: string;
    SnpPosition: number;
    ChunkStartPos: number;
    ChunkEndPos: number;
    Gene: string;
    DataSource: string;
    DataType: string;
    Tissue: string;
    CellType: string;
    CellLine: string;
    EpiLinkScore: number;
    QTLPValue: number;
    Description: string;
    scEpiLockPred: string;
    scEpiLockPeakOverlap: string;
    highlighted?:boolean;
    hovered?:boolean;   
}
