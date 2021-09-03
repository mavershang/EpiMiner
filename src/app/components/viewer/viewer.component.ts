import { Component, OnInit } from '@angular/core';
import { DataSharingService } from 'src/app/services/data-sharing.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit {
  showViewer:boolean=false;

  constructor(public dataSharingService: DataSharingService) { }

  ngOnInit(): void {
    this.dataSharingService.showViewerChange.subscribe((value) => {
      this.showViewer = true;
    });
  }
}
