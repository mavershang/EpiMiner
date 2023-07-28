import { Component, Inject, Input, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { multi } from '../../evidence-matrix//data';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataSharingCRService } from 'src/app/services/data-sharing-bulk-rnaseq.service';
import { DataUtil } from 'src/app/util/util.data';

@Component({
  selector: 'app-study-multi-gene-expr-plot',
  templateUrl: './study-multi-gene-expr-plot.component.html',
  styleUrls: ['./study-multi-gene-expr-plot.component.css']
})
export class StudyMultiGeneExprPlotComponent implements OnInit {
  geneInput:string='';

  multi: any[];
  study: string = "";
  width:number;

  view: [number, number] = [1200, 600];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Omics Type';
  yAxisLabel: string = 'Gene';

  colorScheme="ocean";
  // colorScheme = {
  //   domain: ['#5AA454', '#E44D25']
  //   // domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  // };

  constructor(
    public dialogRef: MatDialogRef<StudyMultiGeneExprPlotComponent>,
    public dataShareService: DataSharingCRService,
    @Inject(MAT_DIALOG_DATA) public data:any) { 
      this.study = data.study;
      this.width  =data.width;
  }

  ngOnInit(): void {
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }
  
  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  multiGeneExprPlotRefresh() {
    const genes = DataUtil.splitGeneInput(this.geneInput);
    const exprData = this.dataShareService.getGeneExprData(genes, "heatmap", "normCount");
    this.view = [Math.min(this.width, exprData.length*60+200), genes.length*50+200];
    this.multi = exprData;
  }
}
