import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableFilter } from 'mat-table-filter';
import { WGCNAPathwayResult } from 'src/app/models/wgcna-data';
import { DataSharingBulkRNASeqService } from 'src/app/services/data-sharing-bulk-rnaseq.service';

@Component({
  selector: 'app-wgcna-pathway-table',
  templateUrl: './wgcna-pathway-table.component.html',
  styleUrls: ['./wgcna-pathway-table.component.css']
})
export class WgcnaPathwayTableComponent implements OnInit {

  displayedColumns: string[] = ['Module', 'TermID', 'TermName', "Rank", "AdjustPValue"]; 
  tableDataSource = new MatTableDataSource<WGCNAPathwayResult>(); 
  @ViewChild('paginatorQuery') paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  filterEntity: WGCNAPathwayResult;
  filterType: MatTableFilter;
  lastIdx: number;
  
  constructor(public dataShareService: DataSharingBulkRNASeqService) {}

  ngOnInit(): void {
    this.filterEntity = new WGCNAPathwayResult();
    this.filterType = MatTableFilter.ANYWHERE;
    this.lastIdx= -1;

    this.dataShareService.selectedStudyChange.subscribe((value) => {
      this.refresh();
    });
  }

  onRowClicked(row: any, i: number) {
    console.log('Row clicked: ', row);
    if (this.lastIdx > -1) {
      this.tableDataSource.data[this.lastIdx].highlighted = false;
    }
    row.highlighted = !row.highlighted;
    this.lastIdx = i;
  }

  refresh() {
    this.tableDataSource.data = this.dataShareService.getWGCNAPathwayTableData();
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.sort; 
  }
}
