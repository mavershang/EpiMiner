import { Component, OnInit, ViewChild } from '@angular/core';

import { DataSharingBulkRNASeqService } from 'src/app/services/data-sharing-bulk-rnaseq.service';
import { GetDataService } from 'src/app/services/get-data.service';

@Component({
  selector: 'app-plot-holder-expr',
  templateUrl: './plot-holder-expr.component.html',
  styleUrls: ['./plot-holder-expr.component.css']
})
export class PlotHolderExprComponent implements OnInit {

  studies: string[];
  //mapWgcnaCorImg: Map<string, Blob>;
  //mapWgcnaDendroImg: Map<string, Blob>;
  // mapStudyMeta: Map<string, SampleMeta>;


  //testData: Map<string, BulkRNASeqDEPerGene[]> = new Map<string, BulkRNASeqDEPerGene[]>()

  constructor(
    private getDataServcie: GetDataService,
    public dataShareService: DataSharingBulkRNASeqService,
  ) {
    //debug 
    // let d: BulkRNASeqDEPerGene[] = [];
    // d.push(new BulkRNASeqDEPerGene("geneA", 1.2, 0.1));
    // d.push(new BulkRNASeqDEPerGene("geneA", 1.5, 0.05));
    // this.testData.set("TestComparison_VS_TestCtrl", d);
  }

  ngOnInit(): void {
    this.dataShareService.DEDataChange.subscribe((value) => {
      this.refreshStudyList();
    });
  }

  refreshStudyList() {
    this.studies = Array.from(this.dataShareService.DEData.keys()).sort();
  }

  refreshStudyPlots() {
    this.dataShareService.toggleSelectedStudyChanged();
    // change metadata table
    // plan: create the table dynamically

    // update the WGCNA correlation map
  }
}
