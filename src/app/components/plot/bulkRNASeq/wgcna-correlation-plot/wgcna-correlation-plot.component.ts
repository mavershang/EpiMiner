import { Component, Input, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { multi } from './data';
import { WGCNAData } from 'src/app/models/wgcna-data';
import { DataSharingCRService } from 'src/app/services/data-sharing-bulk-rnaseq.service';

@Component({
  selector: 'app-plot-wgcna-correlation-heatmap',
  templateUrl: './wgcna-correlation-plot.component.html',
  styleUrls: ['./wgcna-correlation-plot.component.css']
})
export class WGCNACorrelationComponent implements OnInit {
  @Input() data: Map<string, WGCNAData>;
  img: any;

  multi: any[];
  view = [700, 300];

  // // options
  // legend: boolean = true;
  // showLabels: boolean = true;
  // animations: boolean = true;
  // xAxis: boolean = true;
  // yAxis: boolean = true;
  // showYAxisLabel: boolean = true;
  // showXAxisLabel: boolean = true;
  // xAxisLabel: string = 'Country';
  // yAxisLabel: string = 'Year';
  // colorScheme = ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5'];

  constructor(
    public dataShareService: DataSharingCRService
  ) {
    //
    //Object.assign(this, { multi });
    if (this.data != undefined && this.data.size > 0) {
      this.refreshPlot('');
    }
  }

  ngOnInit(): void {
    this.dataShareService.selectedStudyChange.subscribe((value) => {
      this.refreshPlot(this.dataShareService.selectedStudy);
    });
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

  PickDefaultStudy() {
    let keys = Array.from(this.dataShareService.exprWGCNAData.keys()).sort();
    return keys[0];
  }

  refreshPlot(study: string) {
    if (study == '') {
      this.dataShareService.pickDefaultStudy();
    }

    let blob = this.dataShareService.getWGCNAImgBlob(this.dataShareService.selectedStudy, 'cor');
    if (blob != null) {
      this.createImageFromBlob(blob);
    } else {
      this.dataShareService.createNAImgBlob().then(b => {
        blob=b;
        this.createImageFromBlob(blob);
      })
      .catch(error => {
        console.error(error);
      }) 
    }
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.img = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }
}
