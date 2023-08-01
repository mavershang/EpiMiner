import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DataSharingCRService } from 'src/app/services/data-sharing-bulk-rnaseq.service';
import { GetDataService } from 'src/app/services/get-data.service';
import { GeneSignatureAnalysisComponent } from '../gene-signature-analysis/gene-signature-analysis.component';
import { StudyMultiGeneExprPlotComponent } from '../study-multi-gene-expr-plot/study-multi-gene-expr-plot.component';
import { utils } from 'xlsx';


@Component({
  selector: 'app-plot-holder-expr',
  templateUrl: './plot-holder-expr.component.html',
  styleUrls: ['./plot-holder-expr.component.css']
})
export class PlotHolderExprComponent implements OnInit {
  
  studies: string[];

  constructor(
    private dialog: MatDialog,
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

  launchAnalysis() {
    const dialogRef = this.dialog.open(GeneSignatureAnalysisComponent, {
      width: '1400px',
      data:{
        // indexSnp: row.IndexSnp,
        // topSnps:row.TopSnps,
        // workDir:row.WorkDir,
        // dataset1: this.qtlParam.dataset1,
        // dataset2: this.qtlParam.dataset2
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  launchMultiGeneExpr() {
    const dialogRef = this.dialog.open(StudyMultiGeneExprPlotComponent, {
      width: '1800px',
      data:{
          study: this.dataShareService.selectedStudy,
          width: 1800,
        // topSnps:row.TopSnps,
        // workDir:row.WorkDir,
        // dataset1: this.qtlParam.dataset1,
        // dataset2: this.qtlParam.dataset2
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
}
