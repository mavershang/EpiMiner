
import { getMultipleValuesInSingleSelectionError } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { DataSharingBulkRNASeqService } from 'src/app/services/data-sharing-bulk-rnaseq.service';
  
  @Component({
    selector: 'app-bubble-plot-base',
    templateUrl: './bubble-plot-base.component.html',
    styleUrls: ['./bubble-plot-base.component.css']
  })
  export class BubblePlotBase {
    dataSource: string;

    metricOptions: string[];
    xAxisMetric: string;
    yAxisMetric: string;

    transformOptions: string[];
    xTransform: string;
    yTransform: string;
    // view: number[] = [800, 800];
  
    // options
    showXAxis: boolean = true;
    showYAxis: boolean = true;
    gradient: boolean = false;
    showLegend: boolean = true;
    //legendPosition=LegendPosition.Below;
    showXAxisLabel: boolean = true;
    yAxisLabel: string = "";
    showYAxisLabel: boolean = true;
    xAxisLabel: string = "";
    maxRadius: number = 5;
    minRadius: number = 2;
    xScaleMin: number = -1;
    xScaleMax: number = 1;
    yScaleMin: number = 0;
    yScaleMax: number = 10;
    colorScheme = {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '170777', '#700E72', '#175D67', '#7FA200']
    };

    constructor() {
    }
  
    onSelect(data:any): void {
      console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    }

    onActivate(data:any): void {
      console.log('Activate', JSON.parse(JSON.stringify(data)));
    }

    onDeactivate(data:any): void {
      console.log('Deactivate', JSON.parse(JSON.stringify(data)));
    }
  

    getValues(metric: string, dataSource: string) {
      switch (dataSource) {
        case "pool screen":
          switch(metric.toLowerCase()) {
            // case "beta score":
            //   return this.dataService.poolData.map(x=>x.RawValue);
            // case "p-value":
            //   return this.dataService.poolData.map(x=>x.Pvalue);
            // case "fdr":
            //   return this.dataService.poolData.map(x=>x.FDR);
            default:
              return null;
          }
        case "arrayed screen":
          switch(metric.toLowerCase()) {
            // case "mean value":
            //   return this.dataService.arrayData.map(x=>x.MeanValue);
            // case "p-value":
            //   return this.dataService.arrayData.map(x=>x.AdjPvalue);
            default:
              return null;
          }
        default:
          return null;
      }
    }

    transformValue(values: number[], transform: string) {
      switch (transform.toLowerCase()) {
        case "original":
          return values;
        case "ranked":
          var sorted = values.slice().sort(function(a,b){return b-a})
          var ranks = values.map(function(v){ return sorted.indexOf(v)+1 });
          return ranks;
        case "-log":
          return values.map(x=> Math.log10(x + 0.00001)*(-1));
        default:
          return null;
      }
    }

    setAxisLabel() {
      this.xAxisLabel = this.xTransform + " " + this.xAxisMetric;
      this.yAxisLabel = this.yTransform + " " + this.yAxisMetric;
    }
  }