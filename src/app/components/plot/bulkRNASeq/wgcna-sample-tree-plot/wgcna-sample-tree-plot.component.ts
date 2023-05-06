import { Component, OnInit } from '@angular/core';
import { DataSharingCRService } from 'src/app/services/data-sharing-bulk-rnaseq.service';

@Component({
  selector: 'app-wgcna-sample-tree-plot',
  templateUrl: './wgcna-sample-tree-plot.component.html',
  styleUrls: ['./wgcna-sample-tree-plot.component.css']
})
export class WgcnaSampleTreePlotComponent implements OnInit {
  img: any;

  constructor(
    public dataShareService: DataSharingCRService
    ) { }

  ngOnInit(): void {
    this.dataShareService.selectedStudyChange.subscribe((value) => {
      this.refreshPlot(this.dataShareService.selectedStudy);
    });
  }

  refreshPlot(study: string) {
    if (study == undefined || study == '') {
      this.dataShareService.pickDefaultStudy();
    }
    let blob = this.dataShareService.exprWGCNAData.get(this.dataShareService.selectedStudy).SampleTreeBlob;
    this.createImageFromBlob(blob);
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
