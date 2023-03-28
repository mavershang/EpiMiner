import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BulkRNASeqData } from 'src/app/models/bulk-rnaseq-data';
import { LoadingService } from 'src/app/services/loading.service';

import { DialogComponent } from '../../dialog/dialog.component';
import { BubblePlotBase } from '../bubble-plot-base/bubble-plot-base.component';


@Component({
  selector: 'app-plot-bulk-rnaseq-expr',
  templateUrl: './plot-bulk-rnaseq-expr.component.html',
  styleUrls: ['./plot-bulk-rnaseq-expr.component.css']
})
export class PlotBulkRNASeqExprComponent extends BubblePlotBase {
  @Input() data: Map<string, BulkRNASeqData[]>;
  //view: any[] = [400, 400];

  bubbleData: any[];  

  
  constructor(
    private dialog: MatDialog,
    private loader: LoadingService,
    //public dataShareService: DataSharingService,
  ) { 
    super();
  }

  ngOnInit(): void {
    this.RefreshPlot('');
  }

  PickDefaultComparison() {
    let keys = Array.from(this.data.keys()).sort();
    return keys[0];
    // for (let key  of Array.from(this.data.keys())) {

    // }
  }

  ConvertToBubbleData(DEData:BulkRNASeqData[]) {
    let list: Array<any> = [];
    for (let i = 0; i < DEData.length; i++) {
      list.push({
        name: "Gene",
        series: [
          {
            name: DEData[i].Gene,
            x: DEData[i].LFC,
            y: -1 * Math.log10(DEData[i].PValue),
            r: 8,
          }
        ]
      });
    }
    return list;
  }

  RefreshPlot(comparison: string) {
    if (comparison == '') {
      comparison = this.PickDefaultComparison();
    }

    this.bubbleData = this.ConvertToBubbleData(this.data.get(comparison));
  }
}
