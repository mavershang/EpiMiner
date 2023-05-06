import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableFilter } from 'mat-table-filter';
import { CellClusterMarker } from 'src/app/models/scRNASeq-data';

@Component({
  selector: 'app-cluster-marker-table',
  templateUrl: './cluster-marker-table.component.html',
  styleUrls: ['./cluster-marker-table.component.css']
})

export class ClusterMarkerTableComponent implements OnInit {
  @Input() data:CellClusterMarker[] = [];

  displayedColumns: string[] = ['Study', 'Cluster', 'Gene', 'LFC', "AdjPValue", "Rank"]; 
  tableDataSource = new MatTableDataSource<CellClusterMarker>(); 
  @ViewChild('paginatorQuery') paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  filterEntity: CellClusterMarker;
  filterType: MatTableFilter;
  lastIdx: number;
  
  constructor() {
    if (this.data != undefined && this.data.length > 0) {
      this.refresh();
    }
  }

  ngOnInit(): void {
    this.filterEntity = new CellClusterMarker();
    this.filterType = MatTableFilter.ANYWHERE;
    this.lastIdx= -1;
    this.refresh();

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
    this.tableDataSource.data = this.data;
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.sort; 
  }
}
