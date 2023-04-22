export class WGCNAData {
    // Study: string;
    // SoftPowerPlot: string;
    CorImgFile: string;
    DendroImgFile: string;
    CorImgBlob: any;
    DendroImgBlob: any;

    ModInfoMap: Map<string, WGCNAMod>;
    GeneInfoMap: Map<string, any>;

    constructor(dendImg: any, corImg: any) {
        this.DendroImgFile = dendImg;
        this.CorImgFile = corImg;
        this.ModInfoMap = new Map<string, WGCNAMod>();
        this.GeneInfoMap = new Map<string, any>();
    }

    populateModMap(modData: any[]) {
        modData.forEach(mod => {
            const m = new WGCNAMod(mod);
            this.ModInfoMap.set(m.Module, m);
        });
    }

    populateGeneMap(geneData: any[]) {
        geneData.forEach(gene => {
            const g = new WGCNAGene(gene);
            this.GeneInfoMap.set(g.GeneSymbol, g);
        });
    }
}

export class WGCNAMod {
    Module: string;
    HubGeneID: string;
    HubGeneSymbol: string;
    HubGeneName: string

    Pathways: WGCNAPathwayResult[] = [];
    TraitCors: WGCNATraitCor[] = [];

    constructor(m?: any) {
        this.Module = m.Module;
        this.HubGeneID = m.HubGeneEnsemblID;
        this.HubGeneSymbol = m.HubGeneSymbol;
        this.HubGeneName = m.HubGeneName;

        m.PathwayEnrichList.forEach(path => {
            const p = new WGCNAPathwayResult(path);
            this.Pathways.push(p);
        });

        m.TraitCorList.forEach(tc => {
            const t = new WGCNATraitCor(tc);
            this.TraitCors.push(t);
        });
    }
}

export class WGCNAPathwayResult {
    Module: string;
    TermID: string;
    TermOntology: string;
    TermName: string;
    HitSize: number;
    ModuleSize: number;
    BkgHitSize: number;
    BkgTermSize: number;
    Rank: number;
    PValue: number;
    AdjustPValue: number;
    highlighted?: boolean;
    hovered?: boolean;

    constructor(p?: any) {
        if (p != undefined) {
            this.Module = p.Module;
            this.TermID = p.Term;
            this.TermOntology = p.TermOntology;
            this.TermName = p.TermDefinition;
            this.HitSize = p.nModGenesInTerm;
            this.ModuleSize = p.ModSize;
            this.BkgHitSize = p.BkgrModSize;
            this.BkgTermSize = p.BkgrTermSize;
            this.PValue = p.EnrichPvalue;
            this.AdjustPValue = p.BonferoniPvalue;
            this.Rank = p.Rank;
        }
    }
}

export class WGCNATraitCor {
    TraitName: string;
    Correlation: number;
    PValue: number;

    constructor(t?: any) {
        if (t != undefined) {
            this.TraitName = t.Module;
            this.Correlation = t.Correlation;
            this.PValue = t.PValue;
        }
    }
}

export class WGCNAGene {
    GeneSymbol: string;
    GeneID: string;
    Module: string;
    MMPValue: number;
    MMScore: number;

    constructor(g?: any) {
        if (g != undefined) {
            this.GeneID = g.GeneEnsemblID;
            this.GeneSymbol = g.GeneSymbol;
            this.Module = g.Module;
            this.MMScore = g.MMScore;
            this.MMPValue = g.MMPvalue;
        }
    }
}