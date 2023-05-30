import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule, Color } from '@swimlane/ngx-charts';
import { multi } from './data';

@Component({
  selector: 'app-evidence-matrix',
  templateUrl: './evidence-matrix.component.html',
  styleUrls: ['./evidence-matrix.component.css']
})

export class EvidenceMatrixComponent implements OnInit {

  multi: any[];
  view: [number, number] = [1200, 800];

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

  // colorScheme = {
  //   // domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  // };

  
  constructor() {
    Object.assign(this, { multi });
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

  customColors(value) {
    return '#123';
  }
}
