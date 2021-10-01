import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TopSnp } from 'src/app/models/top-snp';


@Component({
  selector: 'app-top-snp-modal',
  templateUrl: './top-snp-modal.component.html',
  styleUrls: ['./top-snp-modal.component.css']
})
export class TopSnpModalComponent implements OnInit {

  displayedColumns: string[] = ["SNP", "SNP.PP.H4"]
  dataSource: TopSnp[] = [];
  indexSnp: string;
  // food:string;

  constructor(
    public dialogRef: MatDialogRef<TopSnpModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any) { 
      this.indexSnp = data.indexSnp;
      this.dataSource = this.addData(data.topSnps);
      console.log("");
  }

  ngOnInit(): void {
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
}
