import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TopSnp } from 'src/app/models/top-snp';
import { DomSanitizer } from '@angular/platform-browser';
import { ImgService } from 'src/app/services/img.service';
import { LoadingService } from 'src/app/services/loading.service';



@Component({
  selector: 'app-top-snp-modal',
  templateUrl: './top-snp-modal.component.html',
  styleUrls: ['./top-snp-modal.component.css']
})
export class TopSnpModalComponent implements OnInit {
  displayedColumns: string[] = ["SNP", "SNP.PP.H4"]
  dataSource: TopSnp[] = [];
  indexSnp: string;
  workDir: string;
  qtlDataset1: string;
  qtlDataset2: string;

  // Locuszoom plots to display
  lzpImg1: any;
  lzpImg2: any;
  lzpTag1: string = "lzp1";
  lzpTag2: string = "lzp2";


  // loading spiner
  loading$ = this.loader.loading$;

  constructor(
    public dialogRef: MatDialogRef<TopSnpModalComponent>,
    private sanitizer: DomSanitizer,
    private imgService: ImgService,
    public loader: LoadingService,
    @Inject(MAT_DIALOG_DATA) public data:any) { 
      this.indexSnp = data.indexSnp;
      this.workDir = data.workDir;
      this.dataSource = this.addData(data.topSnps);
      this.qtlDataset1 = data.dataset1;
      this.qtlDataset2 = data.dataset2;
      console.log("");
  }

  ngOnInit(): void {
    this.imgService.getLzpImage(this.workDir, this.lzpTag1).subscribe(
      response => {
      //alert(JSON.stringify(data.image));
      this.createImageFromBlob(response,this.lzpTag1);
    }, error => {
      console.log(error);
    });

    this.imgService.getLzpImage(this.workDir, this.lzpTag2).subscribe(
      response => {
      //alert(JSON.stringify(data.image));
      this.createImageFromBlob(response,this.lzpTag2);
    }, error => {
      console.log(error);
    });
  }

  addData(str:string): TopSnp[]{
    let r: TopSnp[] = [];
    let arr = str.split(";")
    arr.map(x=> r.push(this.parseSnp(x)));
    return r;
  }

  parseSnp(str: string): TopSnp {
    let arr = str.split(":");
    if (arr.length == 2)
    {
      return new TopSnp(arr[0], parseFloat(arr[1]));
    }
    return null;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createImageFromBlob(image: Blob, tag:string) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      if (tag == this.lzpTag1) {
       this.lzpImg1 = reader.result;
      } else if (tag = this.lzpTag2) {
        this.lzpImg2 = reader.result;
      }
    }, false);
 
    if (image) {
       reader.readAsDataURL(image);
    }
 }
}
