import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataSharingCRService } from 'src/app/services/data-sharing-bulk-rnaseq.service';

@Component({
  selector: 'app-sample-pca-plot',
  templateUrl: './sample-pca-plot.component.html',
  styleUrls: ['./sample-pca-plot.component.css']
})
export class SamplePCAPlotComponent implements OnInit {
  img: any;
  study: string;
  multi: any[];
  view=[600,500];

  constructor(
    public dialogRef: MatDialogRef<SamplePCAPlotComponent>,
    public dataShareService: DataSharingCRService,
    @Inject(MAT_DIALOG_DATA) public data) {
      this.study = data.study;
   }

  ngOnInit(): void {
    this.dataShareService.getSamplePCAImgBlob(this.study, 'png').subscribe(
      response => {
        this.createImageFromBlob(response);
      }, error => {
        console.log(error);
      }
    );
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
