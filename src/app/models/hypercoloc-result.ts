export class HyperColocResult {
    QueryGene: string;
    Iteration: number;
    Traits: string;     
    PosteriorProb: number;
    RegionalProb: number;
    CandidateSNP: string;
    PosteriorExplainedBySNP: number;
    DroppedTrait: string;
    highlighted?:boolean;
    hovered?:boolean;
}
