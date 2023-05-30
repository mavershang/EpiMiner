import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { MatTableFilter } from 'mat-table-filter';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ImgService } from 'src/app/services/img.service';
import { GeneClusterResult } from 'src/app/models/geneCluster-result';

@Component({
  selector: 'app-gene-signature-analysis',
  templateUrl: './gene-signature-analysis.component.html',
  styleUrls: ['./gene-signature-analysis.component.css']
})
export class GeneSignatureAnalysisComponent implements OnInit {
  // k-means params
  k:number;
  imgK:any;

  // classification params
  algoOptions: string[] = ["SVM REF", "RF Buruto"];
  dropdownSettings: IDropdownSettings;
  selectedAlgo: string[];

  // clustering table
  displayedColumns: string[] = ['GeneSymbol', 'Module', "GroupScore", "GSPValue", "Cluster"]; 
  tableDataSource = new MatTableDataSource<GeneClusterResult>(); 
  @ViewChild('paginatorQuery') paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  filterEntity: GeneClusterResult;
  filterType: MatTableFilter;
  lastIdx: number;

  constructor(public dialogRef: MatDialogRef<GeneSignatureAnalysisComponent>,
    private sanitizer: DomSanitizer,
    private imgService: ImgService,
    @Inject(MAT_DIALOG_DATA) public data:any) { }

  ngOnInit(): void {
    this.filterEntity = new GeneClusterResult();
    this.filterType = MatTableFilter.ANYWHERE;
    this.lastIdx= -1;
  }

  onItemSelect(item: any) {
    console.log(item);
  }

  onSelectAll(items: any) {
    console.log(items);
  }

  onRowClicked(row: any, i: number) {
    console.log('Row clicked: ', row);
    if (this.lastIdx > -1) {
      this.tableDataSource.data[this.lastIdx].highlighted = false;
    }
    row.highlighted = !row.highlighted;
    this.lastIdx = i;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
