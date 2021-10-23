export class EpiData {
    Chr: string;
    SnpPosition: number;
    ChunkStartPos: number;
    ChunkEndPos: number;
    Gene: string;
    DataSource: string;
    DataType: string;
    Tissue: string;
    EpiLinkScore: number;
    QTLPValue: number;
    highlighted?:boolean;
    hovered?:boolean;
}
