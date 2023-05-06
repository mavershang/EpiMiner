export class scRNASeqData {

    Study: string;
    Gene: string;
    ExprPlotFile: string;
    ExprPlotBlob: any;
    clusterMarkers: CellClusterMarker[];
    //clusterMarkerMap: Map<string, CellClusterMarker[]>;

    constructor(study: string, gene: string, exprPlotFile: string, markerData: any[]) {
        this.Study = study;
        this.Gene = gene;
        this.ExprPlotFile = exprPlotFile;
        this.clusterMarkers = [];
        markerData.forEach(md => {
            let ccm = new CellClusterMarker(md);
            ccm.Study = study;
            this.clusterMarkers.push(ccm);
        });
        //this.clusterMarkerMap = new Map<string, CellClusterMarker[]>();
    }

    // populateMarkerMap(markerData: any[]) {
    //     markerData.forEach(md => {
    //         const cluster = md.CellCluster;
    //         if (!this.clusterMarkerMap.has(cluster)){
    //             this.clusterMarkerMap.set(cluster, []);
    //         }
    //         const ccm = new CellClusterMarker(md);
    //         this.clusterMarkerMap.get(cluster).push(ccm);
    //     })
    // }
}

export class CellClusterMarker {
    Study: string;
    Cluster: string;
    Gene: string;
    LFC: number;
    AdjPValue: number;
    Rank: number;
    highlighted?: boolean = false;
    hovered?: boolean = false;

    constructor(m?: any) {
        if (m != undefined) {
            this.Cluster = m.CellCluster;
            this.Gene = m.Gene;
            this.LFC = m.LFC;
            this.AdjPValue = m.AdjPValue;
            this.Rank = m.Rank;
        }
    }
}
