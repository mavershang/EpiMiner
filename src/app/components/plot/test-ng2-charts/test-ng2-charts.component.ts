import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';


@Component({
  selector: 'app-test-ng2-charts',
  templateUrl: './test-ng2-charts.component.html',
  styleUrls: ['./test-ng2-charts.component.css']
})
export class TestNg2ChartsComponent implements OnInit {


  title = 'ng2-charts-demo';

  public bubbleChartOptions: ChartConfiguration<'bubble'>['options'] = {
    responsive: false,
    scales: {
      x: {
        title: {
                  display: true,
                  text: '-log10(P-value)'
                },
        min: 0,
        max: 30,
      },
      y: {
        title: {
                  display: true,
                  text: 'log2 Fold Change'
                },
        min: 0,
        max: 30,
      }
    },
   
  };
  public bubbleChartLegend = true;

  public bubbleChartDatasets: ChartConfiguration<'bubble'>['data']['datasets'] = [
    {
      data: [
        { x: 10, y: 10, r: 10 },
        { x: 15, y: 5, r: 15 },
        { x: 26, y: 12, r: 23 },
        { x: 7, y: 8, r: 8 },
      ],
      label: 'Series A',
    },
  ];
  
  constructor() { }

  ngOnInit(): void {
  }

}
