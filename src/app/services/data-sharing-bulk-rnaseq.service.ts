import { Injectable } from '@angular/core';
import { Subject, forkJoin, from, of } from 'rxjs';
import { BulkRNASeqDEPerGene } from '../models/bulk-rnaseq-data';
import { WGCNAData, WGCNAGene, WGCNAPathwayResult } from '../models/wgcna-data';
import { GetDataService } from './get-data.service';
import { ImgService } from './img.service';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { SampleMeta } from '../models/sample-meta';
import { CellClusterMarker, scRNASeqData } from '../models/scRNASeq-data';

@Injectable({
  providedIn: 'root'
})
export class DataSharingCRService {
  SampleMetaData: Map<string, Map<string, SampleMeta>> = new Map<string, Map<string, SampleMeta>>();
  GeneExprData: Map<string, any> = new Map<string, any>();
  DEData: Map<string, Map<string, BulkRNASeqDEPerGene[]>> = new Map<string, Map<string, BulkRNASeqDEPerGene[]>>();

  selectedStudy: string = '';
  isSelectedStudyChanged: boolean = false;
  selectedStudyChange: Subject<boolean> = new Subject<boolean>();

  selectedGene: string = '';
  isSelectedGeneChanged: boolean = false;
  selectedGeneChange: Subject<boolean> = new Subject<boolean>();

  selectedComparison: string = '';
  isSelectedComparisonChanged: boolean = false;
  selectedComparisonChange: Subject<boolean> = new Subject<boolean>();

  exprWGCNAData: Map<string, WGCNAData> = new Map<string, WGCNAData>();
  isExprWGCNADataChanged: boolean = false;
  exprWGCNADataChange: Subject<boolean> = new Subject<boolean>();

  scRNASeqData: Map<string, scRNASeqData> = new Map<string, scRNASeqData>();
  isScRNASeqDataChanged: boolean = false;
  scRNASeqDataChange: Subject<boolean> = new Subject<boolean>();

  
  constructor(private imgService: ImgService) {
  }


  importDEResult(data: any[]) {
    for (let i = 0; i < data.length; i++) {
      let study = data[i].Study;
      this.GeneExprData.set(study, data[i].GeneExprData);

      this.SampleMetaData.set(study, new Map<string, SampleMeta>());
      data[i].SampleMetaData.forEach(s => {
        this.SampleMetaData.get(study).set(s.Sample, new SampleMeta(s));
      });

      let cmprMap = new Map<string, BulkRNASeqDEPerGene[]>();
      data[i].DEData.forEach(v => {
        let cmprStr = v.Case + "_VS_" + v.Ctrl;
        let arr = new Array<BulkRNASeqDEPerGene>();
        v.Results.forEach(function (v2) {
          arr.push(new BulkRNASeqDEPerGene(v2.Gene, v2.LFC, v2.PVal));
        })
        cmprMap.set(cmprStr, arr);
      });

      this.DEData.set(study, cmprMap);
    }

    if (this.selectedStudy == undefined || this.selectedStudy == '') {
      this.pickDefaultStudy();
    }
    this.pickDefaultComparison(this.selectedStudy);
    this.toggleSelectedComparisonChanged();
    this.toggleSelectedStudyChanged();
  }

  async loadWGCNAData(data: any[]): Promise<boolean> {
    let allSuccessful = true;
    for (const item of data) {
      const study = item.Study;
      const w = new WGCNAData(item.DendroFile, item.CorFile, item.SampleTreeFile);
      w.populateModMap(item.WGCNAResult.ModInfoList);
      w.populateGeneMap(item.WGCNAResult.GeneInfoList);
      this.exprWGCNAData.set(study, w);

      try {
        const wasSuccessful = await this.fetchWGCNAImages(w, study).toPromise();
        if (wasSuccessful) {
          console.log("successful");
        } else {
          console.log("unsuccessful");
        }
      } catch (error) {
        console.error(error);
        allSuccessful = false;
      }
    }
    return allSuccessful;
  }

  fetchWGCNAImages(w: WGCNAData, study: string) {
    return forkJoin([
      this.imgService.getImgByPath(w.CorImgFile, "png"),
      this.imgService.getImgByPath(w.DendroImgFile, "png"),
      this.imgService.getImgByPath(w.SampleTreeFile, "png"),
    ]).pipe(
      tap(([corImgBlob, dendroImgBlob, sampleTreeImgBlob]) => {
        this.exprWGCNAData.get(study).CorImgBlob = corImgBlob;
        this.exprWGCNAData.get(study).DendroImgBlob = dendroImgBlob;
        this.exprWGCNAData.get(study).SampleTreeBlob = sampleTreeImgBlob;
      }),
      map(() => true),
      catchError((error) => {
        console.log(error);
        return of(false);
      })
    );
  }

  importWGCNAResult(data: any[]) {
    const imageLoader = from(this.loadWGCNAData(data));
    imageLoader.subscribe(
      (successful) => {
        if (this.selectedStudy == undefined || this.selectedStudy == '') {
          this.pickDefaultStudy();
        }
        this.toggleExprWGCNADataChanged();
        this.toggleSelectedStudyChanged();
        console.log(successful)
      });
  }

  
  fetchScRNASeqImages(d: scRNASeqData, study:string) {
    return forkJoin([
      this.imgService.getImgByPath(d.ExprPlotFile, "png"),
    ]).pipe(
      tap(([exprImgBlob]) => {
        this.scRNASeqData.get(study).ExprPlotBlob = exprImgBlob;
      }),
      map(() => true),
      catchError((error) => {
        console.log(error);
        return of(false);
      })
    );
  }

  async loadScRNASeqData(data: any[]): Promise<boolean> {
    let allSuccessful = true;
    for (const item of data) {
      const study = item.Study;
      const d = new scRNASeqData(item.Study, item.Gene, item.plotImgFile, item.markerList);
      this.scRNASeqData.set(study, d);

      try {
        const wasSuccessful = await this.fetchScRNASeqImages(d, study).toPromise();
        if (wasSuccessful) {
          console.log("successful");
        } else {
          console.log("unsuccessful");
        }
      } catch (error) {
        console.error(error);
        allSuccessful = false;
      }
    }
    return allSuccessful;
  }

  importScRNASeqResult(data: any[]) {
    const dataLoader = from(this.loadScRNASeqData(data));
    dataLoader.subscribe(
      (successful) => {
        console.log(successful)
        this.toggleScRNASeqDataChanged();
      });
  }

  pickDefaultStudy() {
    let keys = Array.from(this.exprWGCNAData.keys()).sort();
    this.selectedStudy = keys[0];
  }

  pickDefaultComparison(study: string) {
    let keys = Array.from(this.DEData.get(study).keys()).sort();
    this.selectedComparison = keys[0];
  }

  getSampleMetaData() {
    if (this.SampleMetaData == undefined || !this.SampleMetaData.has(this.selectedStudy)) {
      return [];
    }
    let r =Array.from(this.SampleMetaData.get(this.selectedStudy).values()).sort();
    return r;
  }

  getDETableData() {
    if (this.DEData == undefined || !this.DEData.has(this.selectedStudy)) {
      console.log("DEData is not initiated or selectedStudy is not set");
      return [];
    }

    if (!this.DEData.get(this.selectedStudy).has(this.selectedComparison))
    {
      console.log("Comparison doesn't exist");
      return [];
    }

    return this.DEData.get(this.selectedStudy).get(this.selectedComparison);
  }

  getGeneExprData(genes: string[]) {
    let r: any[] = [];
    let geneIdx = genes.map(x => {
      return this.GeneExprData.get(this.selectedStudy).Genes.indexOf(x);
    });
    for (let i = 0; i < this.GeneExprData.get(this.selectedStudy).Samples.length; i++) {
      let group = this.SampleMetaData.get(this.selectedStudy).get(this.GeneExprData.get(this.selectedStudy).Samples[i]).MergeConditions;
      let iGroup = r.map(x=>x.name).indexOf(group);
      if (iGroup < 0) {
        r.push({ "name": group, "series": [] });
        iGroup = r.length - 1;
      }
      for (let i2 = 0; i2 < genes.length; i2++) {
        r[iGroup].series.push({
          "name": this.GeneExprData.get(this.selectedStudy).Samples[i],
          "value": this.GeneExprData.get(this.selectedStudy).Counts[geneIdx[i2]][i]
        });
      }
    }
    return r;
  }

  getWGCNAPathwayTableData() {
    let r: WGCNAPathwayResult[] = [];
    for (let [key, value] of this.exprWGCNAData.get(this.selectedStudy).ModInfoMap) {
      r = r.concat(value.Pathways);
    }
    return r;
  }

  getWGCNAGeneTableData() {
    let r: WGCNAGene[] = [];
    r.push(this.exprWGCNAData.get(this.selectedStudy).GeneInfoMap.get(this.selectedGene));
    return r;
  }

  getCellClusterMarkerTableData() {
    let r: CellClusterMarker[] = [];
    for (let [key, value] of this.scRNASeqData) {
      value.clusterMarkers.forEach(x=>{
        x.Study = key;
        r.push(x);
      });
    }
    return r;
  }

  toggleSelectedComparisonChanged() {
    this.selectedComparisonChange.next(!this.isSelectedComparisonChanged);
  }

  toggleExprWGCNADataChanged() {
    this.exprWGCNADataChange.next(!this.isExprWGCNADataChanged);
  }

  toggleSelectedStudyChanged() {
    this.selectedStudyChange.next(!this.isSelectedStudyChanged);
  }

  toggleSelectedGeneChanged() {
    this.selectedGeneChange.next(!this.isSelectedGeneChanged);
  }

  toggleScRNASeqDataChanged() {
    this.scRNASeqDataChange.next(!this.isScRNASeqDataChanged);
  }
}
