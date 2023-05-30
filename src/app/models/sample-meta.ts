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

    public getTag() {
        const delim="||";
        return this.Organism+delim+this.Tissue+delim+this.CellType+delim+
        this.AssayType + delim + this.DiseaseState+delim+this.Treatment+delim+this.MergeConditions;
    }

    public addSample(s:string){
        this.Sample += ", "+s;
    }

    public isSameGroup(b:SampleMeta) {
        return  this.Organism == b.Organism &&
                this.Tissue == b.Tissue &&
                this.CellType == b.CellType &&
                this.AssayType == b.AssayType &&
                this.DiseaseState == b.DiseaseState &&
                this.Treatment == b.Treatment &&
                this.MergeConditions == b.MergeConditions;
    }
}