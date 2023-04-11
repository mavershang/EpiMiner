import { Component, OnInit } from '@angular/core';
import { BulkRNASeqDEPerGene } from 'src/app/models/bulk-rnaseq-data';
import { DataSharingBulkRNASeqService } from 'src/app/services/data-sharing-bulk-rnaseq.service';

@Component({
  selector: 'app-plot-holder-expr',
  templateUrl: './plot-holder-expr.component.html',
  styleUrls: ['./plot-holder-expr.component.css']
})
export class PlotHolderExprComponent implements OnInit {

  testData: Map<string, BulkRNASeqDEPerGene[]> = new Map<string, BulkRNASeqDEPerGene[]>()
  testData2: any[] = [
    {
      "name": "Example1",
      "series": [
        {
          "name": "a",
          "x": 0,
          "y": 0,
          "r": 1
        },
        {
            "name": "b",
            "x":10,
            "y":3,
            "r":10
        }
      ]
    },
    {
        "name":"Example2",
        "series": [
            {
                "name":"1",
                "x":20,
                "y":1,
                "r":30
            },
            {
                "name":"2",
                "x":3,
                "y":3,
                "r":500
            }
          ]
    }
  ];

  constructor(
    public dataService: DataSharingBulkRNASeqService,
    ) {
      //debug 
      let d: BulkRNASeqDEPerGene[] = [];
      d.push(new BulkRNASeqDEPerGene("geneA", 1.2, 0.1));
      d.push(new BulkRNASeqDEPerGene("geneA", 1.5, 0.05));
      this.testData.set("TestComparison_VS_TestCtrl", d);
    }

  ngOnInit(): void {
    this.dataService.exprDEDataChange.subscribe((value) => {
      this.refresh();
    });
  }

  refresh() {
    // what to do to refresh each plot
  }
  
}
