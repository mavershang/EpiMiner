import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableFilter } from 'mat-table-filter';
import { CellClusterMarker, scRNASeqData } from 'src/app/models/scRNASeq-data';
import { DataSharingCRService } from 'src/app/services/data-sharing-bulk-rnaseq.service';

@Component({
  selector: 'app-study-sc-rnaseq',
  templateUrl: './study-sc-rnaseq.component.html',
  styleUrls: ['./study-sc-rnaseq.component.css']
})
export class StudyScRNASeqComponent implements OnInit {
  @Input() study: string = '';
  @Input() data: scRNASeqData;
  
  // cluster expr image
  img:any;

  displayedColumns: string[] = ['Study', 'Cluster', 'Gene', 'LFC', "AdjPValue", "Rank"]; 
  tableDataSource = new MatTableDataSource<CellClusterMarker>(); 
  @ViewChild('paginatorQuery') paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  filterEntity: CellClusterMarker;
  filterType: MatTableFilter;
  lastIdx: number;

  constructor(public dataShareService: DataSharingCRService) { }

  ngOnInit(): void {
    this.filterEntity = new CellClusterMarker();
    this.filterType = MatTableFilter.ANYWHERE;
    this.lastIdx= -1;

    this.dataShareService.scRNASeqDataChange.subscribe((value) => {
      this.refresh(this.study);
    });
  }

  refresh(study: string) {
    // refresh cluster expr plot
    let blob = this.dataShareService.scRNASeqData.get(this.study).ExprPlotBlob;
    this.createImageFromBlob(blob);

  this.refreshMarkerTable();
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.img = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  onRowClicked(row: any, i: number) {
    console.log('Row clicked: ', row);
    if (this.lastIdx > -1) {
      this.tableDataSource.data[this.lastIdx].highlighted = false;
    }
    row.highlighted = !row.highlighted;
    this.lastIdx = i;
  }

  refreshMarkerTable() {
    this.tableDataSource.data = this.data.clusterMarkers;
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.sort; 
  }
}
