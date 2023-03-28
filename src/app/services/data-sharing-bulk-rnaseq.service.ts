import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BulkRNASeqData } from '../models/bulk-rnaseq-data';

@Injectable({
  providedIn: 'root'
})
export class DataSharingBulkRNASeqService {

  exprData: Map<string, Map<string, BulkRNASeqData[]>> = new Map<string, Map<string, BulkRNASeqData[]>>();
  isExprDataChanged: boolean;
  exprDataChange: Subject<boolean> = new Subject<boolean>();
  studyChanged: string[];

  constructor() { 
  }

  import(data: any[]) {
    for (let i=0; i<data.length; i++){
      let study = data[i].Study;
      let cmprMap = new Map<string, BulkRNASeqData[]>();

      data[i].DEData.forEach(function(v) {
        let cmprStr = v.Case + "_VS_" + v.Ctrl;
        let arr = new Array<BulkRNASeqData>();
        v.Results.forEach(function(v2) {
          arr.push(new BulkRNASeqData(v2.Gene, v2.LFC, v2.PVal));
        })
        cmprMap.set(cmprStr, arr);
      });

      this.exprData.set(study, cmprMap);
    }

    this.toggleExprDataChanged([...this.exprData.keys()]);
  }


  toggleExprDataChanged(studies:string[]) {
    this.exprDataChange.next(!this.isExprDataChanged);
    this.studyChanged = studies;
  }
}
