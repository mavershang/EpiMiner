import { Injectable } from '@angular/core';
import { Subject, forkJoin, from, of } from 'rxjs';
import { BulkRNASeqDEPerGene } from '../models/bulk-rnaseq-data';
import { WGCNAData, WGCNAGene, WGCNAPathwayResult } from '../models/wgcna-data';
import { GetDataService } from './get-data.service';
import { ImgService } from './img.service';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { SampleMeta } from '../models/sample-meta';
import { CellClusterMarker, scRNASeqData } from '../models/scRNASeq-data';
import { DataUtil } from '../util/util.data';

@Injectable({
  providedIn: 'root'
})
export class DataSharingCRService {
  SampleMetaData: Map<string, Map<string, SampleMeta>> = new Map<string, Map<string, SampleMeta>>();
  SamplePCAData: Map<string, string> = new Map<string, string>();
  GeneExprData: Map<string, any> = new Map<string, any>();
  TpmData: Map<string, any> = new Map<string, any>();
  DEData: Map<string, Map<string, BulkRNASeqDEPerGene[]>> = new Map<string, Map<string, BulkRNASeqDEPerGene[]>>();

  selectedStudy: string = '';
  isSelectedStudyChanged: boolean = false;
  selectedStudyChange: Subject<boolean> = new Subject<boolean>();

  lastSelectedGene: string = '';
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

  resetDEData() {
    this.DEData = new Map<string, Map<string, BulkRNASeqDEPerGene[]>>();
    this.GeneExprData = new Map<string, any>();
    this.TpmData = new Map<string, any>();
  }

  resetWGCNAData() {
    this.exprWGCNAData = new Map<string, WGCNAData>();
  }

  resetTxData() {
    this.selectedStudy = '';
    this.selectedComparison = '';
    this.resetDEData();
    this.resetWGCNAData();
  }

  importDEResult(data: any[]) {
    for (let i = 0; i < data.length; i++) {
      let study = data[i].Study;
      this.GeneExprData.set(study, data[i].GeneExprData);
      this.TpmData.set(study, data[i].TpmData);

      this.SampleMetaData.set(study, new Map<string, SampleMeta>());
      data[i].SampleMetaData.forEach(s => {
        this.SampleMetaData.get(study).set(s.Sample, new SampleMeta(s));
      });

      this.SamplePCAData.set(study, data[i].SamplePCAPlot);

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

  checkImgBlob(blob: any) {
    if (blob == undefined) {
      return this.createNAImgBlob();
    } else {
      return blob;
    }
  }

  createNAImgBlob() {
    const file = new File(['../assets/img/image_not_available.png'], 'image_not_available', { type: "image/png" });
    return DataUtil.createBlobFromFile(file);
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

  fetchSamplePCAPlots(file: string, study: string) {
    return forkJoin([
      this.imgService.getImgByPath(file, "png"),
    ]).pipe(
      tap(([pcaImgBlob]) => {
        this.SamplePCAData.get(study)
      })
    )
  }

  fetchScRNASeqImages(d: scRNASeqData, study: string) {
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

  getSampleMetaData(collapse: boolean) {
    if (collapse) {
      return this.getCollapseSampleMetaData();
    }
    else {
      return this.getFlatSampleMetaData();
    }
  }

  getFlatSampleMetaData() {
    if (this.SampleMetaData == undefined || !this.SampleMetaData.has(this.selectedStudy)) {
      return [];
    }

    let r = Array.from(this.SampleMetaData.get(this.selectedStudy).values()).sort();
    return r;
  }

  getCollapseSampleMetaData() {
    if (this.selectedStudy == undefined || !this.SampleMetaData.has(this.selectedStudy)) {
      return [];
    }

    let r: Map<string, SampleMeta> = new Map<string, SampleMeta>();
    for (let a of this.SampleMetaData.get(this.selectedStudy).values()) {
      const tag = a.getTag();
      if (r.has(tag)) {
        r.get(tag).addSample(a.Sample);
      }
      else {
        let copy = new SampleMeta();
        Object.assign(copy, a);
        r.set(tag, copy);
      }
    }
    return Array.from(r.values()).sort();
  }

  getDETableData() {
    if (this.DEData == undefined || !this.DEData.has(this.selectedStudy)) {
      console.log("DEData is not initiated or selectedStudy is not set");
      return [];
    }

    if (!this.DEData.get(this.selectedStudy).has(this.selectedComparison)) {
      console.log("Comparison doesn't exist");
      return [];
    }

    return this.DEData.get(this.selectedStudy).get(this.selectedComparison);
  }

  getExprMetricTypes(study: string) {
    let r: string[] = []
    if (this.GeneExprData.get(study) != null && this.GeneExprData.get(study).Samples.length > 0) {
      r.push('NormCount');
    }
    if (this.TpmData.get(study) != null && this.TpmData.get(study).Samples.length > 0) {
      r.push('TPM');
    }
    return r;
  }

  getGeneExprData(genes: string[], plotType: any, exprMetric: string) {
    if (this.selectedStudy == undefined || !this.GeneExprData.has(this.selectedStudy)) {
      return [];
    }

    let data = this.getExprDataPointer(exprMetric);
    let geneIdx = genes.map(gene => {
      return data.get(this.selectedStudy).Genes.findIndex(
        e => e.toLowerCase() === gene.toLowerCase());
    });

    // geneIdx = geneIdx.filter(x => x >= 0);
    // if (geneIdx.length == 0) {
    //   return [];
    // }

    switch (plotType.toLowerCase()) {
      case "barplot":
        return this.getGeneExprDataForBarPlot(this.selectedStudy, geneIdx[0], exprMetric);
      case "heatmap":
        return this.getGeneExprDataForHeatmap(this.selectedStudy, geneIdx, genes, exprMetric);
      default:
        return [];
    }

    // let r: any[] = [];
    // for (let i = 0; i < this.GeneExprData.get(this.selectedStudy).Samples.length; i++) {
    //   let group = this.SampleMetaData.get(this.selectedStudy).get(this.GeneExprData.get(this.selectedStudy).Samples[i]).MergeConditions;
    //   let iGroup = r.map(x => x.name).indexOf(group);
    //   if (iGroup < 0) {
    //     r.push({ "name": group, "series": [] });
    //     iGroup = r.length - 1;
    //   }
    //   for (let i2 = 0; i2 < genes.length; i2++) {
    //     r[iGroup].series.push({
    //       "name": this.GeneExprData.get(this.selectedStudy).Samples[i],
    //       "value": this.GeneExprData.get(this.selectedStudy).Counts[geneIdx[i2]][i]
    //     });
    //   }
    // }
    // return r;
  }

  getExprDataPointer(exprMetric: string) {
    let data: any;
    switch (exprMetric.toLowerCase()) {
      case "tpm":
        data = this.TpmData;
        break;
      case "normcount":
        data = this.GeneExprData;
        break;
    }
    return data;
  }

  getGeneExprDataForBarPlot(study: string, geneIdx: number, exprMetric: string) {
    if (geneIdx < 0) {
      return [];
    }
    let r: any[] = [];

    let data = this.getExprDataPointer(exprMetric);
    for (let i = 0; i < data.get(study).Samples.length; i++) {
      let group = this.SampleMetaData.get(study).get(data.get(study).Samples[i]).MergeConditions;
      let iGroup = r.map(x => x.name).indexOf(group);
      if (iGroup < 0) {
        r.push({ "name": group, "series": [] });
        iGroup = r.length - 1;
      }

      r[iGroup].series.push({
        "name": data.get(study).Samples[i],
        "value": data.get(study).Counts[geneIdx][i]
      });
    }
    return r;
  }

  getGeneExprDataForHeatmap(study: string, geneIdxArr: number[], geneArr: string[], exprMetric: string) {
    let r: any[] = [];

    let data: any;
    switch (exprMetric.toLowerCase()) {
      case "tpm":
        data = this.GeneExprData;
        break;
      case "normcount":
        data = this.TpmData;
        break;
    }

    for (let i = 0; i < data.get(study).Samples.length; i++) {
      const group = this.SampleMetaData.get(study).get(this.GeneExprData.get(study).Samples[i]).MergeConditions;
      const sample = data.get(study).Samples[i];
      const name = sample + "_" + group;

      let iGroup = r.map(x => x.name).indexOf(group);
      if (iGroup < 0) {
        r.push({ "name": name, "series": [] });
        iGroup = r.length - 1;
      }

      for (let i2 = 0; i2 < geneIdxArr.length; i2++) {
        if (geneIdxArr[i2] < 0) {
          continue;
        }
        r[iGroup].series.push({
          "name": geneArr[i2],
          "value": data.get(study).Counts[geneIdxArr[i2]][i]
        });
      }
    }
    return r;
  }

  getSamplePCAImgBlob(file: string, type: string) {
    return this.imgService.getImgByPath(file, type);
  }

  getWGCNAImgBlob(study: string, type: string) {
    if (this.exprWGCNAData.has(study)) {
      switch (type.toLowerCase()) {
        case "cor":
          return this.exprWGCNAData.get(study).CorImgBlob;
        case "dendro":
          return this.exprWGCNAData.get(study).DendroImgBlob;
        case "sampletree":
          return this.exprWGCNAData.get(study).SampleTreeBlob;
      }
    } else {
      return null;
    }
  }

  getWGCNAPathwayTableData() {
    if (!this.exprWGCNAData.has(this.selectedStudy)) { return []; }
    let r: WGCNAPathwayResult[] = [];
    for (let [key, value] of this.exprWGCNAData.get(this.selectedStudy).ModInfoMap) {
      r = r.concat(value.Pathways);
    }
    return r;
  }

  getWGCNAGeneTableData() {
    if (!this.exprWGCNAData.has(this.selectedStudy)) { return []; }
    let r: WGCNAGene[] = [];
    r.push(this.exprWGCNAData.get(this.selectedStudy).GeneInfoMap.get(this.selectedGene.toUpperCase()));
    return r;
  }

  getCellClusterMarkerTableData() {
    let r: CellClusterMarker[] = [];
    for (let [key, value] of this.scRNASeqData) {
      value.clusterMarkers.forEach(x => {
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
    if (this.lastSelectedGene != this.selectedGene) {
      this.selectedGeneChange.next(!this.isSelectedGeneChanged);
      this.lastSelectedGene = this.selectedGene
    }
  }

  toggleScRNASeqDataChanged() {
    this.scRNASeqDataChange.next(!this.isScRNASeqDataChanged);
  }
}
