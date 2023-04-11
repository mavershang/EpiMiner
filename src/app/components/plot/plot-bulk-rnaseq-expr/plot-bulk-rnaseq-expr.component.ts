import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BulkRNASeqDEPerGene } from 'src/app/models/bulk-rnaseq-data';
import { LoadingService } from 'src/app/services/loading.service';

import { DialogComponent } from '../../dialog/dialog.component';
import { BubblePlotBase } from '../bubble-plot-base/bubble-plot-base.component';
import { ChartConfiguration, ChartDataset, ChartOptions } from 'chart.js'


@Component({
  selector: 'app-plot-bulk-rnaseq-expr',
  templateUrl: './plot-bulk-rnaseq-expr.component.html',
  styleUrls: ['./plot-bulk-rnaseq-expr.component.css']
})
export class PlotBulkRNASeqExprComponent extends BubblePlotBase {
  @Input() data: Map<string, BulkRNASeqDEPerGene[]>;
  //view: any[] = [400, 400];

  lfcCutoff:number=1;
  pvalCutoff:number=0.05;
  DE_otherData: Array<any> = []; 
  DE_upData: Array<any> = [];
  DE_downData: Array<any> = []

  public bubbleChartDatasets: ChartConfiguration<'bubble'>['data']['datasets'];


  bubbleChartOptions: ChartConfiguration<'bubble'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
      scales: {
        y: {
          title: {
            display: true,
            text: '-log10(P-value)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'log2 Fold Change'
          }
        },
      },
    
    plugins: {
      title: {
        display: true,
        text: 'test study',
      },
      
      tooltip: {
        callbacks: {
          label: function(context) {
            console.log(context['raw']["name"]);
            return context['raw']["name"] + " LFC:" + context["raw"]["x"].toFixed(2) + " P-Value:" + context["raw"]["y"].toFixed(4);
          }
        }
      }
    },
  };

  bubbleChartLegend = false;
  
  selectedComparison: string = '';

  constructor(
    private dialog: MatDialog,
    private loader: LoadingService,
    //public dataShareService: DataSharingService,
  ) { 
    super();
  }

  ngOnInit(): void {
    this.refreshPlot('');
  }

  PickDefaultComparison() {
    let keys = Array.from(this.data.keys()).sort();
    return keys[0];
    // for (let key  of Array.from(this.data.keys())) {

    // }
  }

  resetData(){
    this.DE_otherData = [];
    this.DE_upData = [];
    this.DE_downData = [];
    this.bubbleChartDatasets = [];
  }

  convertToBubbleData_ng2Charts(DEData: BulkRNASeqDEPerGene[]) {
    this.resetData();
    for (let i = 0; i < DEData.length; i++) {
      let d = {
        name: DEData[i].Gene,
        x: DEData[i].LFC,
        y: -1 * Math.log10(DEData[i].PValue),
      };

      switch(DEData[i].whichGroup(this.lfcCutoff, this.pvalCutoff)) {
        case 0:
          this.DE_otherData.push(d);
          break;
        case 1:
          this.DE_upData.push(d);
          break;
        case -1:
          this.DE_downData.push(d);
          break;
      }
    }
  }

  convertToBubbleData_ngxCharts(DEData:BulkRNASeqDEPerGene[]) {
    this.resetData();
    for (let i = 0; i < DEData.length; i++) {
      this.DE_otherData.push({
        name: "Gene",
        series: [
          {
            name: DEData[i].Gene,
            x: DEData[i].LFC,
            y: -1 * Math.log10(DEData[i].PValue),
          }
        ]
      });
    }
  }

  setChartData() {

     this.bubbleChartDatasets = [
      {
        data: this.DE_otherData,
        label: "Others",
        radius: 2,
        backgroundColor: 'rgba(100, 100, 100, 1)',
        // pointBackgroundColor: 'rgba(100, 100, 100, 1)',
      },
      {
        data: this.DE_upData,
        label: "Up regulated",
        radius: 3,
        backgroundColor: 'rgba(255, 99, 71, 1)',
        // pointRadius: 2,
        // pointBackgroundColor: 'rgba(255, 99, 71, 1)',
      },
      {
        data: this.DE_downData,
        label: "Down regulated", 
        radius: 3,
        backgroundColor: 'rgba(2, 221, 36, 1)',
        // pointRadius: 2,
        // pointBackgroundColor: 'rgba(2, 221, 36, 1)',
      },
    ];
  }

  refreshPlot(comparison: string) {
    if (comparison == '') {
      this.selectedComparison = this.PickDefaultComparison();
    }

    this.convertToBubbleData_ng2Charts(this.data.get(this.selectedComparison));
    this.setChartData();

    console.log(this.bubbleChartDatasets);
  }
}
