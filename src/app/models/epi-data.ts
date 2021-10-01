export class EpiData {
    Chr: string;
    SnpPosition: number;
    ChunkStartPos: number;
    ChunkEndPos: number;
    Gene: string;
    Score: number;
    //pvalue: number;

    highlighted?:boolean;
    hovered?:boolean;
}
