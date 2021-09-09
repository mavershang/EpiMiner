import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableFilter } from 'mat-table-filter';
import { EpiData } from 'src/app/models/epi-data';
import { GetDataService } from 'src/app/services/get-data.service';

@Component({
  selector: 'app-snp-query',
  templateUrl: './snp-query.component.html',
  styleUrls: ['./snp-query.component.css']
})
export class SnpQueryComponent implements OnInit {
  snpInput: string = "";
  fileToUpload: File = null;
  fileName: string = "";

  displayedColumns: string[] = ['chr', 'startPos', 'endPos', 'linkedGene', 'score','pvalue'];
  tableDataSource = new MatTableDataSource<EpiData>(); 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  filterEntity: EpiData;
  filterType: MatTableFilter;

  constructor(
    private getDataService: GetDataService,
    public dataSharingService: DataSharingService) {
  }

  ngOnInit(): void {
    this.filterEntity = new EpiData();
    this.filterType = MatTableFilter.ANYWHERE;
  }

  ngAfterViewInit() {
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.sort;
  }

  onFileSelected(event:any) {
    this.fileToUpload = event.target.files[0];
    if (this.fileToUpload) {
      this.fileName = this.fileToUpload.name;
    }
  }
  
  onSubmit(form: NgForm) {
    this.dataSharingService.inputSnpArr = this.snpInput.split(",");
    this.dataSharingService.toggleShowViewerChanged();

    this.getDataService
  }

  refresh(){
    // this.getDataService.get(this.dataShareService.selectedProjectID).subscribe(
    //   data => {
    //     console.log(data);
    //     this.existingExpList = data;
    //     this.tableDataSource.data = this.existingExpList;
    //   },
    //   error => {
    //     console.log(error.message);
    //     this.openDialog("Failed to get existing subjects: " + error.message);
    //   }
    // )
  }
}
