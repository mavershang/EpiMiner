import { Component, OnInit } from '@angular/core';
import { DataSharingBulkRNASeqService } from 'src/app/services/data-sharing-bulk-rnaseq.service';

@Component({
  selector: 'app-wgcna-dendrogram-plot',
  templateUrl: './wgcna-dendrogram-plot.component.html',
  styleUrls: ['./wgcna-dendrogram-plot.component.css']
})
export class WgcnaDendrogramPlotComponent implements OnInit {
  img: any;

  constructor(
    public dataShareService: DataSharingBulkRNASeqService
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
    let blob = this.dataShareService.exprWGCNAData.get(this.dataShareService.selectedStudy).DendroImgBlob;
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
