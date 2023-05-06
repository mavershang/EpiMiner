import { Component, OnInit } from '@angular/core';
import { DataSharingCRService } from 'src/app/services/data-sharing-bulk-rnaseq.service';

@Component({
  selector: 'app-sc-rnaseq-holder',
  templateUrl: './sc-rnaseq-holder.component.html',
  styleUrls: ['./sc-rnaseq-holder.component.css']
})
export class ScRNASeqHolderComponent implements OnInit {

  constructor(public dataShareService: DataSharingCRService) {
  }

  ngOnInit(): void {
    this.dataShareService.selectedGeneChange.subscribe((value) => {
      console.log("");
    });
  }

}
