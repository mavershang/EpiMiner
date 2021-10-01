import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableFilter } from 'mat-table-filter';
import { EpiData } from 'src/app/models/epi-data';
import { GetDataService } from 'src/app/services/get-data.service';
import { SearchParam } from 'src/app/models/search-param';
import { DialogComponent } from '../dialog/dialog.component';
import { Router } from '@angular/router';
import { ColocResult } from 'src/app/models/coloc-result';
import { LoadingService } from 'src/app/services/loading.service';
import { TopSnpModalComponent } from 'src/app/modals/top-snp-modal/top-snp-modal.component';

@Component({
  selector: 'app-snp-query',
  templateUrl: './snp-query.component.html',
  styleUrls: ['./snp-query.component.css']
})
export class SnpQueryComponent implements OnInit {
  // Input
  snpInput: string = "";
  fileToUpload: File = null;
  fileName: string = "";
  searchParam: SearchParam = new SearchParam();

  // loading spiner
  loading$ = this.loader.loading$;

  // List of available GWAS and QTL data 
  gwasDataList: string[] = [];
  qtlDataList: string[] = [];
  qtlParam: QtlParam;

  // // selected GWAS and QTL data
  // selectedGwasData: string;
  // selectedQtlData: string;

  // // pval cutoff
  // p1:number;
  // p2:number;
  // p12:number;

  // epi data table
  displayedColumns: string[] = ['Chr', 'SnpPosition', 'ChunkStartPos', 'ChunkEndPos', 'Gene', 'Score'];
  epiResultData: EpiData[];
  hasData:boolean=false;
  tableDataSource = new MatTableDataSource<EpiData>(); 
  @ViewChild(MatPaginator, {static: false} ) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  filterEntity: EpiData;
  filterType: MatTableFilter;
  lastIdx: number;

  // coloc data table
  displayedColumns2: string[] = ['IndexSnp', 'NumOfSnp', 'H0_abf', 'H1_abf', 'H2_abf', 'H3_abf', 'H4_abf'];
  colocResultData: ColocResult[];
  tableDataSource2 = new MatTableDataSource<ColocResult>(); 
  @ViewChild(MatPaginator, {static: false} ) paginator2: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort2: MatSort;
  filterEntity2: ColocResult;
  filterType2: MatTableFilter;
  lastIdx2:number;

  // last highlighted row index
  flankingNt: number = 500000;  // flanking area of the SNP 

  constructor(
    private getDataService: GetDataService,
    public dataSharingService: DataSharingService,
    private changeDetectorRefs: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router,
    public loader: LoadingService
    ) {
      console.log("");
      this.epiResultData=[];

      this.getDataService.getDataList().subscribe(
        data => {
          console.log(data);
          this.gwasDataList = data.GWAS;
          this.qtlDataList = data.QTL;
          // this.changeDetectorRefs.detectChanges();
        },error => {
          this.openDialog("Failed to : " + error.message);
        });
  }

  ngOnInit(): void {
    // for table 1
    this.filterEntity = new EpiData();
    this.filterType = MatTableFilter.ANYWHERE;
    this.lastIdx = -1;

    // for table 2
    this.filterEntity2 = new ColocResult();
    this.filterType2 = MatTableFilter.ANYWHERE;
    this.lastIdx2 = -1;

    // qtl param
    this.qtlParam= {
      dataset1: '',
      dataset2: '',
      p1: '',
      p2: '',
      p12: ''
    }
  }

  ngAfterViewInit() {
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.sort;
    this.tableDataSource2.paginator = this.paginator2;
    this.tableDataSource2.sort = this.sort2;
  }

  onFileSelected(event:any) {
    this.fileToUpload = event.target.files[0];
    if (this.fileToUpload) {
      this.fileName = this.fileToUpload.name;
    }
  }

  openDialog(description:string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = description;
    this.dialog.open(DialogComponent, dialogConfig);
  }

  searchDB() {
    // verify SNP input
    let verifyError = this.verifyInput("searchDB");
    if (verifyError.length > 0){
      this.openDialog(verifyError);
      return;
    }

    // this.dataSharingService.inputSnpArr = this.snpInput.split(",");
    // this.dataSharingService.toggleShowViewerChanged();
    if (this.snpInput.length > 0)
    {
      this.getDataService.getBySnpInput(this.snpInput, this.searchParam).subscribe(
        data => {
          console.log(data);
          this.epiResultData = data;
          this.tableDataSource.data = this.epiResultData;
          this.hasData = this.epiResultData.length > 0;
          this.tableDataSource.paginator = this.paginator;
          this.tableDataSource.sort = this.sort;
          // this.changeDetectorRefs.detectChanges();
        },error => {
          this.openDialog("Failed to : " + error.message);
        });
    } else if (this.fileName.length > 0) {
      this.getDataService.getByFileInput(this.fileToUpload, this.searchParam).subscribe(
        data => {
          console.log(data);
          this.epiResultData = data;
          this.hasData = this.epiResultData.length > 0;
          this.tableDataSource.data = this.epiResultData;
          this.tableDataSource.paginator = this.paginator;
          this.tableDataSource.sort = this.sort;
          // this.changeDetectorRefs.detectChanges();
        },error => {
          this.openDialog("Failed to : " + error.message);
        });
    }
  }

  runQTL() {
    let verifyError = this.verifyInput("qtl");
    if (verifyError.length > 0){
      this.openDialog(verifyError);
      return;
    }

    this.getDataService.runQTLByFileInput(this.fileToUpload, this.qtlParam).subscribe(
      data => {
         console.log(data);
        this.colocResultData = data;
        // this.hasData = this.resultData.length > 0;
        this.tableDataSource2.data = this.colocResultData;
        this.tableDataSource2.paginator = this.paginator2;
        this.tableDataSource2.sort = this.sort2;
        this.changeDetectorRefs.detectChanges();
      },error => {
        this.openDialog("Failed to : " + error.message);
      });
  }

  // verify SNP input
  verifyInput(mode:string) {
    switch (mode.toLowerCase()) {
      case "searchdb":
        if (this.snpInput == "" && this.fileName == "") {
          return "Please fill SNP search textbox or upload a file.";
        } else if (this.snpInput.length > 0 && this.fileName.length >0 ){
          return "Please search with EITHER SNP textbox or upload a file.";
        }
        return "";

      case "qtl":
        if (this.fileName == "")
          return "Please select the GWAS SNP file to be uploaded";
        else if (this.snpInput != "")
          return "QTL can only be ran by uploading a GWAS file";
        return "";

      default:
        return "Unable to verify input under mode " + mode;
    } 
  }

  onRowClicked(row: any, i: number) {
    console.log('Row clicked: ', row);
    if (this.lastIdx > -1) {
      this.tableDataSource.data[this.lastIdx].highlighted = false;
    }
    row.highlighted = !row.highlighted;
    this.lastIdx = i;

    // this.dataSharingService.coordinates.push(coordinate);
  }

  onRowClicked2(row: any, i: number) {
    console.log('Row clicked: ', row);
    if (this.lastIdx2 > -1) {
      this.tableDataSource2.data[this.lastIdx2].highlighted = false;
    }
    row.highlighted = !row.highlighted;
    this.lastIdx2 = i;

    // // open topSNP modal
    // this.openTopSnpDialog(
    //   this.tableDataSource2.data[i].IndexSnp,
    //   this.tableDataSource2.data[i].TopSnps);

    // this.dataSharingService.coordinates.push(coordinate);
  }

  openTopSnpDialog(row:ColocResult){
    const dialogRef = this.dialog.open(TopSnpModalComponent, {
    width: '400px',
    data:{indexSnp: row.IndexSnp, topSnps:row.TopSnps}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      // this.city = result;
      // this.food_from_modal = result.food;
    });
  }

  // openTopSnpDialog(indexSnp:string, topSnpStr:string): void {
  //   const dialogRef = this.dialog.open(TopSnpModalComponent, {
  //     width: '400px',
  //     // data: "A:0.01;B:0;C:1"
  //     data:{indexSnp: indexSnp, topSnps:topSnpStr}
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed', result);
  //     // this.city = result;
  //     // this.food_from_modal = result.food;
  //   });
  // }

  getCoordinate(idx:number) {
    if (idx<0 || idx >= this.epiResultData.length) {
      return null;
    }

    let startPos = this.epiResultData[idx].SnpPosition - this.flankingNt;
    let endPos = this.epiResultData[idx].SnpPosition + this.flankingNt;
    return this.epiResultData[idx].Chr + ":" + (startPos > 0? startPos: 0) + "-" + endPos;
  }

  openViewer() {
    let coordinate = this.getCoordinate(this.lastIdx);
    // let coordinate = "chr18:19140000-19450000";
    if (coordinate == null)
    {
      this.openDialog("Please select a SNP from the table");
      return;
    }

    localStorage.setItem("coordinate",  coordinate);
    window.open('/viewer', '_blank'); 
  }
}

export interface QtlParam {
  dataset1: string;
  dataset2: string;
  p1: string;
  p2: string;
  p12: string;
}