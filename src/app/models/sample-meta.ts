export class SampleMeta {
    Sample: string;
    Organism: string;
    Tissue: string;
    CellType: string;
    AssayType: string;
    DiseaseState: string;
    Treatment: string;
    MergeConditions: string;
    highlighted?: boolean;
    hovered?: boolean;

    constructor(s?: any) {
        if (s != undefined) {
            this.Sample = s.Sample;
            this.Organism = s.Organism;
            this.Tissue = s.Tissue;
            this.CellType = s.CellType;
            this.AssayType = s.AssayType;
            this.DiseaseState = s.DiseaseState;
            this.Treatment = s.Treatment;
            this.MergeConditions = s.MergeConditions;
        }
    }
}