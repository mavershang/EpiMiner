import { Component, OnInit } from '@angular/core';
import { DataSharingService } from 'src/app/services/data-sharing.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit {
  coordinates:string[]=[];
  showViewer:boolean=false;

  constructor(public dataSharingService: DataSharingService) {
      let c = localStorage.getItem("coordinate");
      this.coordinates = c.split(",");
   }

  ngOnInit(): void {
  }
}