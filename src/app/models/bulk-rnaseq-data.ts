export class BulkRNASeqDEPerGene {
    Gene: string;
    LFC: number;
    PValue: number;  
    highlighted?:boolean;
    hovered?:boolean;  

    constructor(gene?:string, lfc?:number, pval?:number){
        if (gene != undefined) {
            this.Gene = gene.toUpperCase();
            this.LFC = lfc;
            this.PValue = pval;
        }
    }

    whichGroup(lfc:number=1, pval:number=0.05) {
        if (this.PValue > pval) {
            return 0;
        } else if (this.LFC >= Math.abs(lfc)) {
            return 1;
        } else if (this.LFC <= Math.abs(lfc)*-1) {
            return -1;
        }
        return 0;
    }
    
    isSigUp(lfc:number=1, pval:number=0.05) {
        return this.LFC >= lfc && this.PValue <= pval;
    }

    isSigDown(lfc:number=-1, pval:number=0.05) {
        return this.LFC <= lfc && this.PValue <= pval;
    }
}