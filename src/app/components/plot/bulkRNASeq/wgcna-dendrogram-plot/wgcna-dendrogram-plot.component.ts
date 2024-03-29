import { Component, OnInit } from '@angular/core';
import { DataSharingCRService } from 'src/app/services/data-sharing-bulk-rnaseq.service';

@Component({
  selector: 'app-wgcna-dendrogram-plot',
  templateUrl: './wgcna-dendrogram-plot.component.html',
  styleUrls: ['./wgcna-dendrogram-plot.component.css']
})
export class WgcnaDendrogramPlotComponent implements OnInit {
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
    let blob = this.dataShareService.getWGCNAImgBlob(this.dataShareService.selectedStudy, 'dendro');
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
    }  }

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
