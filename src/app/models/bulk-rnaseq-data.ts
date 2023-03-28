export class BulkRNASeqData {
    Gene: string;
    LFC: number;
    PValue: number;  

    // constructor(t?:any) {
    //     if (t) {
    //         Object.assign(this, t);
    //     }
    // }
    constructor(gene:string, lfc:number, pval:number){
        this.Gene = gene;
        this.LFC = lfc;
        this.PValue = pval;
    }
}