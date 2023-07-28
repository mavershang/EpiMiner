import { Component, OnInit } from '@angular/core';
//import { multi } from './data';
import { DataSharingCRService } from 'src/app/services/data-sharing-bulk-rnaseq.service';


@Component({
  selector: 'app-study-gene-expr-plot',
  templateUrl: './study-gene-expr-plot.component.html',
  styleUrls: ['./study-gene-expr-plot.component.css']
})
export class StudyGeneExprPlotComponent implements OnInit {
  data: any[] = [];
  //multi: any[];
  view: [number, number] = [700, 400];


  selectedExprMetric: string;
  exprMetrics: string[]

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Group';
  yAxisLabel: string = 'Expression';
  // timeline: boolean = true;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor(public dataShareService: DataSharingCRService) {
    //Object.assign(this, { multi });
    console.log("constructor")
  }

  ngOnInit(): void {

    console.log("ngOnInit")
    this.populateExprMetrics();

    this.dataShareService.selectedGeneChange.subscribe((value) => {
      this.refresh();
    });
    this.dataShareService.selectedStudyChange.subscribe((value) => {
      this.populateExprMetrics();
      this.refresh();
    })
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    this.dataShareService.selectedGene=data;
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  exprMetricOnChange() {
    this.refresh();
  }

  populateExprMetrics() {
    // update gene expression metric types (normCount or TPM)
    this.exprMetrics = this.dataShareService.getExprMetricTypes(this.dataShareService.selectedStudy);
    if (this.exprMetrics.length > 0) {
      this.selectedExprMetric = this.exprMetrics[0];
    }
  }

  refresh() {
    if (this.dataShareService.selectedGene != undefined && this.dataShareService.selectedGene.length > 0) {
      this.data = this.dataShareService.getGeneExprData([this.dataShareService.selectedGene], "barplot", this.selectedExprMetric);
    }
  }
}
