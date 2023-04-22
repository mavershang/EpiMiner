import { Component, OnInit } from '@angular/core';
//import { multi } from './data';
import { DataSharingBulkRNASeqService } from 'src/app/services/data-sharing-bulk-rnaseq.service';


@Component({
  selector: 'app-study-gene-expr-plot',
  templateUrl: './study-gene-expr-plot.component.html',
  styleUrls: ['./study-gene-expr-plot.component.css']
})
export class StudyGeneExprPlotComponent implements OnInit {
  data:any[] = [];
  //multi: any[];
  view: [number, number] = [700, 400];

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

  constructor(public dataShareService: DataSharingBulkRNASeqService) {
    //Object.assign(this, { multi });
  }

  ngOnInit(): void {

    this.dataShareService.selectedGeneChange.subscribe((value) => {
      this.refresh();
    })
  }

  onSelect(data): void {
    //console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  refresh() {
    this.data = this.dataShareService.getGeneExprData([this.dataShareService.selectedGene]);
  }
}
