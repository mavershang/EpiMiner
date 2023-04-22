import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableFilter } from 'mat-table-filter';
import { BulkRNASeqDEPerGene } from 'src/app/models/bulk-rnaseq-data';
import { DataSharingBulkRNASeqService } from 'src/app/services/data-sharing-bulk-rnaseq.service';

@Component({
  selector: 'app-study-de-table',
  templateUrl: './study-de-table.component.html',
  styleUrls: ['./study-de-table.component.css']
})
export class StudyDETableComponent implements OnInit {

  displayedColumns: string[] = ['Gene', 'LFC', 'PValue'];
  DETableDataSource = new MatTableDataSource<BulkRNASeqDEPerGene>();
  @ViewChild('paginatorQuery') paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  filterEntity: BulkRNASeqDEPerGene;
  filterType: MatTableFilter;
  lastIdx: number;

  constructor(public dataShareService: DataSharingBulkRNASeqService) { }

  ngOnInit(): void {
    this.filterEntity = new BulkRNASeqDEPerGene();
    this.filterType = MatTableFilter.ANYWHERE;
    this.lastIdx = -1;

    this.dataShareService.DEDataChange.subscribe((value) => {
      this.refresh();
    });
  }

  onRowClicked(row: any, i: number) {
    console.log('Row clicked: ', row);
    if (this.lastIdx > -1) {
      this.DETableDataSource.data[this.lastIdx].highlighted = false;
    }
    row.highlighted = !row.highlighted;
    this.lastIdx = i;

    // filter on guide targeting the gene
    if (row.Gene != this.dataShareService.selectedGene) {
      this.dataShareService.selectedGene = row.Gene;
      this.dataShareService.toggleSelectedGeneChanged();
    }
  }

  refresh() {
    // what to do to refresh each plot
    this.DETableDataSource.data = this.dataShareService.getDETableData();
    this.DETableDataSource.paginator = this.paginator;
    this.DETableDataSource.sort = this.sort;
  }
}
