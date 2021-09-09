import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-finemapping',
  templateUrl: './finemapping.component.html',
  styleUrls: ['./finemapping.component.css']
})
export class FinemappingComponent implements OnInit {
  fileToUpload: File = null;
  fileName: string = "";

  constructor() { }

  ngOnInit(): void {
  }

  onFileSelected(event:any) {
    this.fileToUpload = event.target.files[0];
    if (this.fileToUpload) {
      this.fileName = this.fileToUpload.name;
    }
  }

  onSubmit() {

  }
}
