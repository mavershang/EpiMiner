import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableFilter } from 'mat-table-filter';
import { WGCNAGene } from 'src/app/models/wgcna-data';
import { DataSharingCRService } from 'src/app/services/data-sharing-bulk-rnaseq.service';

@Component({
  selector: 'app-wgcna-gene-table',
  templateUrl: './wgcna-gene-table.component.html',
  styleUrls: ['./wgcna-gene-table.component.css']
})
export class WgcnaGeneTableComponent implements OnInit {

  
  displayedColumns: string[] = ['GeneSymbol', 'GeneID', 'Module', "MMScore", "MMPValue"]; 
  tableDataSource = new MatTableDataSource<WGCNAGene>(); 
  @ViewChild('paginatorQuery') paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  filterEntity: WGCNAGene;
  filterType: MatTableFilter;
  lastIdx: number;
  
  constructor(public dataShareService: DataSharingCRService) {}

  ngOnInit(): void {
    this.filterEntity = new WGCNAGene();
    this.filterType = MatTableFilter.ANYWHERE;
    this.lastIdx= -1;

    this.dataShareService.selectedGeneChange.subscribe((value) => {
      this.refresh();
    });
    this.dataShareService.selectedStudyChange.subscribe((value) => {
      this.refresh();
    })

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
    this.tableDataSource.data = this.dataShareService.getWGCNAGeneTableData();
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.sort; 
  }
}
