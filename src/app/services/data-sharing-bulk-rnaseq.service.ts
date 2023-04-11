import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BulkRNASeqDEPerGene } from '../models/bulk-rnaseq-data';

@Injectable({
  providedIn: 'root'
})
export class DataSharingBulkRNASeqService {

  exprDEData: Map<string, Map<string, BulkRNASeqDEPerGene[]>> = new Map<string, Map<string, BulkRNASeqDEPerGene[]>>();
  isExprDEDataChanged: boolean;
  exprDEDataChange: Subject<boolean> = new Subject<boolean>();
  studyChanged: string[];

  //WGCNAData: Map<string,



  constructor() { 
  }

  importDEResult(data: any[]) {
    for (let i=0; i<data.length; i++){
      let study = data[i].Study;
      let cmprMap = new Map<string, BulkRNASeqDEPerGene[]>();

      data[i].DEData.forEach(function(v) {
        let cmprStr = v.Case + "_VS_" + v.Ctrl;
        let arr = new Array<BulkRNASeqDEPerGene>();
        v.Results.forEach(function(v2) {
          arr.push(new BulkRNASeqDEPerGene(v2.Gene, v2.LFC, v2.PVal));
        })
        cmprMap.set(cmprStr, arr);
      });

      this.exprDEData.set(study, cmprMap);
    }

    this.toggleExprDataChanged([...this.exprDEData.keys()]);
  }

  importWGCNAResult(data: any[]) {
    
  }

  toggleExprDataChanged(studies:string[]) {
    this.exprDEDataChange.next(!this.isExprDEDataChanged);
    this.studyChanged = studies;
  }
}
