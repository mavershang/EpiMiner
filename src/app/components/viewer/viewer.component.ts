import { Component, OnInit } from '@angular/core';
import { DataSharingService } from 'src/app/services/data-sharing.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit {
  coordinates:string[]=[]
  showViewer:boolean=false;

  constructor(public dataSharingService: DataSharingService) {
      this.coordinates=this.dataSharingService.inputSnpArr
   }

  ngOnInit(): void {
    this.dataSharingService.showViewerChange.subscribe((value) => {
      this.showViewer = true;
    });
  }
}
