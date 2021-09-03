import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataSharingService } from 'src/app/services/data-sharing.service';

@Component({
  selector: 'app-snp-query',
  templateUrl: './snp-query.component.html',
  styleUrls: ['./snp-query.component.css']
})
export class SnpQueryComponent implements OnInit {
  snpInput: string = "";

  showViewer: boolean = false;
  constructor(public dataSharingService: DataSharingService) { }

  ngOnInit(): void {

  }

  onSubmit(form: NgForm) {
    // this.projService.post(this.projInput)
    //   .subscribe(
    //     (response) =>{
    //       this.projCreated = response;
    //       this.openDialog("New project created: " + this.projCreated.ID + " | " + this.projCreated.Name + " | " + this.projCreated.Type);
    //       this.router.navigate(['/','query']);
    //     },
    //     (error) => {
    //       console.error('error caught in adding project:' + error.message)
    //       this.errorMsg = this.projService.translateError(error);
    //       this.openDialog(this.errorMsg);
    //     }
    // );

    this.dataSharingService.inputSnpArr = this.snpInput.split(",");
    this.dataSharingService.toggleShowViewerChanged();
  }
}

