import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImgService } from 'src/app/services/img.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-analysis-plot',
  templateUrl: './analysis-plot.component.html',
  styleUrls: ['./analysis-plot.component.css']
})
export class AnalysisPlotComponent implements OnInit {

  // analysis plots to display
  heatmapImg1: any;
  heatmapTag1: string = "heatmap";

  workDir: string;

  // loading spiner
  loading$ = this.loader.loading$;

  constructor(
    public dialogRef: MatDialogRef<AnalysisPlotComponent>,
    private imgService: ImgService,
    public loader: LoadingService,
    @Inject(MAT_DIALOG_DATA) public data:any) { 
      this.workDir = data.workDir;
  }

  ngOnInit(): void {
    this.imgService.getHeatmapImage(this.workDir).subscribe(
      response => {
      this.createImageFromBlob(response);
    }, error => {
      console.log(error);
    });
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.heatmapImg1 = reader.result;
    }, false);
 
    if (image) {
       reader.readAsDataURL(image);
    }
 }
}
