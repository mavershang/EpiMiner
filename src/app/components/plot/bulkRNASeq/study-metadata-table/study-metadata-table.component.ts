import { Component, OnInit, ViewChild } from '@angular/core';
import { SampleMeta } from 'src/app/models/sample-meta';
import { DataSharingCRService } from 'src/app/services/data-sharing-bulk-rnaseq.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableFilter } from 'mat-table-filter';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-study-metadata-table',
  templateUrl: './study-metadata-table.component.html',
  styleUrls: ['./study-metadata-table.component.css']
})
export class StudyMetadataTableComponent implements OnInit {


  displayedColumns: string[] = ['Sample', 'Organism', 'Tissue', 'CellType', 'DiseaseState', 'Treatment', 'AssayType', 'MergeConditions']; 
  tableDataSource = new MatTableDataSource<SampleMeta>(); 
  @ViewChild('paginatorQuery') paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  filterEntity: SampleMeta;
  filterType: MatTableFilter;
  lastIdx: number;
  
  constructor(public dataShareService: DataSharingCRService) {}

  ngOnInit(): void {
    this.filterEntity = new SampleMeta();
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
    this.tableDataSource.data = this.dataShareService.getSampleMetaData();
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.sort; 
  }
}
