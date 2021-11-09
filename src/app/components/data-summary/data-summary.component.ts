import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableFilter } from 'mat-table-filter';
import { DataSummary } from 'src/app/models/data-summary';
import { GetDataService } from 'src/app/services/get-data.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-data-summary',
  templateUrl: './data-summary.component.html',
  styleUrls: ['./data-summary.component.css']
})
export class DataSummaryComponent implements OnInit {
  existingDataList: DataSummary[];
  displayedColumns: string[] = ['Category', 'DataSource', 'DataType','Tissue','Description','RefAssembly'];
  tableDataSource = new MatTableDataSource<DataSummary>(); 

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  filterEntity: DataSummary;
  filterType: MatTableFilter;

  constructor(
    private dataService: GetDataService,
    private dialog: MatDialog
    // private dialogService: DialogService,
  ) { }

  ngOnInit(): void {
    this.filterEntity = new DataSummary();
    this.filterType = MatTableFilter.ANYWHERE;

    this.dataService.getDataSummary().subscribe(
      data => {
        console.log(data);
        this.existingDataList = data;
        this.tableDataSource.data = this.existingDataList;
      },
      error => {
        console.log(error.message);
        this.openDialog("Failed to get existing projectID: " + error.message);
      }
    )
  }

  ngAfterViewInit() {
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.sort;
  }

  openDialog(description:string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = description;
    this.dialog.open(DialogComponent, dialogConfig);
  }
}