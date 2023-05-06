import { Component, OnInit, ViewChild } from '@angular/core';

import { DataSharingCRService } from 'src/app/services/data-sharing-bulk-rnaseq.service';
import { GetDataService } from 'src/app/services/get-data.service';

@Component({
  selector: 'app-plot-holder-expr',
  templateUrl: './plot-holder-expr.component.html',
  styleUrls: ['./plot-holder-expr.component.css']
})
export class PlotHolderExprComponent implements OnInit {
  studies: string[];

  constructor(
    private getDataServcie: GetDataService,
    public dataShareService: DataSharingCRService,
  ) {  }

  ngOnInit(): void {
    this.dataShareService.selectedComparisonChange.subscribe((value) => {
      this.refreshStudyList();
    });
  }

  refreshStudyList() {
    this.studies = Array.from(this.dataShareService.DEData.keys()).sort();
  }

  refreshStudyPlots() {
    this.dataShareService.pickDefaultComparison(this.dataShareService.selectedStudy);
    this.dataShareService.toggleSelectedStudyChanged();
  }
}
