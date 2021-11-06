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
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';

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

  // 
  activeTab:string='';

  // List of tissues in EPi data
  tissueOptions: string[]=[];
  // selectedTissues: string[] = [];
  dropdownSettings: IDropdownSettings;

  // List of available GWAS and QTL data 
  gwasDataList: string[];
  qtlDataList: string[];
  allColocDataList: string[] = [];
  qtlParam: QtlParam;

  // epi data table
  displayedColumns: string[] = ['Chr', 'SnpPosition', 'ChunkStartPos', 'ChunkEndPos', 'Gene', 'EpiLinkScore', 'QTLPValue', 'Tissue', 'DataSource', 'Description', 'DataType'];
  epiResultData: EpiData[];
  hasData:boolean=false;
  tableDataSource = new MatTableDataSource<EpiData>(); 
  @ViewChild(MatPaginator, {static: false} ) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  filterEntity: EpiData;
  filterType: MatTableFilter;
  lastIdx: number;

  // coloc data table
  displayedColumns2: string[] = ['IndexSnp', "Gene", 'NumOfSnp', 'H0_abf', 'H1_abf', 'H2_abf', 'H3_abf', 'H4_abf'];
  colocResultData: ColocResult[];
  tableDataSource2 = new MatTableDataSource<ColocResult>(); 
  @ViewChild(MatPaginator, {static: false} ) paginator2: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort2: MatSort;
  filterEntity2: ColocResult;
  filterType2: MatTableFilter;
  lastIdx2:number;

  // last highlighted row index
  flankingNt: number = 100000;  // flanking area of the SNP 

  // test CORS
  corsData:any;

  //#region genome browser parameters
  // this is the trick to solve the bug of ng-multiselect-dropdown onDropDownClose triggered all the time
  trackTypeDropDownClick = false;
  trackDataSourceDropDownClick = false;

  trackTypeOptions:string[]; // ["interaction", "bigwig", "bed"];
  trackDataSourceOptions: string[] = []; // ["EpiMap"];
  trackTissueOptions:string[] = [];
  selectedTrackTypes: string[] = [];
  selectedTrackDataSources: string[] = [];
  selectedTrackTissues: string[] = [];
  //#endregion

  constructor(
    private getDataService: GetDataService,
    public dataSharingService: DataSharingService,
    private changeDetectorRefs: ChangeDetectorRef,
    private dialog: MatDialog,
    public loader: LoadingService
    ) {
      //this.openTopSnpDialogTest();
      //       this.getDataService.testCORS().subscribe(
      //   data=>{
      //     this.corsData=data;
      //   }, error =>{
      //     console.log(error); 
      //   }
      // )

      console.log("");
      this.epiResultData=[];

      this.getDataService.getTissueList().subscribe(
        data => {
          this.tissueOptions = data;
        }, error => {
          this.openDialog("Failed to fetch all tissues: " + error.message);
        });

      this.getDataService.getExistingTrackType().subscribe(
        data => {
          this.trackTypeOptions = data;
          this.changeDetectorRefs.detectChanges();
        }, error => {
          this.openDialog("Failed to retrieve existing track types");
        }
      )

      this.getDataService.getColocDataList().subscribe(
        data => {
          console.log(data);
          this.gwasDataList = data.GWAS;
          this.qtlDataList = data.QTL;
          this.allColocDataList = this.gwasDataList.concat(this.qtlDataList);
          // this.changeDetectorRefs.detectChanges();
        },error => {
          this.openDialog("Failed to get QTL data list: " + error.message);
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
      dataset1: '', dataset2: '', dataType1:'', dataType2:'', p1: '', p2: '', p12: '', maxDist: ''
    };

    // tissue dropdown box
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'ID',
      textField: 'Name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: true
    };
  }

  ngAfterViewInit() {
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.sort;
    this.tableDataSource2.paginator = this.paginator2;
    this.tableDataSource2.sort = this.sort2;
  }

  onItemSelect(item: any) {
    console.log(item);
  }

  onSelectAll(items: any) {
    console.log(items);
  }
  
  onFileSelected(event:any) {
    this.fileToUpload = event.target.files[0];
    if (this.fileToUpload) {
      this.fileName = this.fileToUpload.name;
    } else {
      this.fileName = "";
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

    // verify max distance
    if (this.searchParam.maxDist == undefined ||  this.searchParam.maxDist.length == 0)
    {
      this.searchParam.maxDist = '500000';
    }

    // this.dataSharingService.inputSnpArr = this.snpInput.split(",");
    // this.dataSharingService.toggleShowViewerChanged();
    if (this.snpInput.length > 0)
    {
      this.getDataService.getBySnpInput(this.snpInput, this.searchParam).subscribe(
        data => {
          //console.log(data);
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
          //console.log(data);
          this.epiResultData = data;
          this.hasData = this.epiResultData.length > 0;
          this.tableDataSource.data = this.epiResultData;
          this.tableDataSource.paginator = this.paginator;
          this.tableDataSource.sort = this.sort;
          // this.changeDetectorRefs.detectChanges();
        },error => {
          this.openDialog("Failed to : " + error.message);
          this.epiResultData = [];
        });
    }
  }

  runQTL() {
    // get datatypes of COLOC datasets 
    this.getColocDatTypes(this.qtlParam);

    // verify niput
    let verifyError = this.verifyInput("qtl");
    if (verifyError.length > 0){
      this.openDialog(verifyError);
      return;
    }

    if (this.snpInput.length > 0)
    {
      this.getDataService.colocBySnpInput(this.snpInput, this.qtlParam).subscribe(
        data =>{
          this.colocResultData = data;
          this.tableDataSource2.data = this.colocResultData;
          this.tableDataSource2.paginator = this.paginator2;
          this.tableDataSource2.sort = this.sort2;
        }, error => {
          this.openDialog("Failed to run colocolization. " + error.message + ". " + error.error);
        });
    }
    else if (this.fileName.length > 0) {
        this.getDataService.colocByFileInput(this.fileToUpload, this.qtlParam).subscribe(
        data => {
          this.colocResultData = data;
          this.tableDataSource2.data = this.colocResultData;
          this.tableDataSource2.paginator = this.paginator2;
          this.tableDataSource2.sort = this.sort2;
        },error => {
          this.openDialog("Failed to run colocolization. " + error.message + ". " + error.error);
        });
    }
  }

  getColocDatTypes(param: QtlParam) {
    param.dataType1 = this.getColocDataType(param.dataset1);
    param.dataType2 = this.getColocDataType(param.dataset2);
  }

  getColocDataType(dataset:string) {
    if (this.gwasDataList.indexOf(dataset) >= 0)
      return 'GWAS';
    else if (this.qtlDataList.indexOf(dataset) >= 0)
      return 'QTL';
    return 'undefined';
  }

  //#region Input validation
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
        if (this.snpInput == "" && this.fileName == "") {
          return "Please fill SNP search textbox or upload a file.";
        } else if (this.snpInput.length > 0 && this.fileName.length >0 ){
          return "Please search with EITHER SNP textbox or upload a file.";
        } else if (this.qtlParam.dataset1 == "" || this.qtlParam.dataset2 == "")
        {
          return "Please select dataset 1 and dataset 2 for coloc analysis.";
        }
        return "";

      default:
        return "Unable to verify input under mode " + mode;
    } 
  }

  //#endregion

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
      width: '1400px',
      data:{
        indexSnp: row.IndexSnp,
        topSnps:row.TopSnps,
        workDir:row.WorkDir,
        dataset1: this.qtlParam.dataset1,
        dataset2: this.qtlParam.dataset2
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  // openTopSnpDialogTest(): void {
  //   const dialogRef = this.dialog.open(TopSnpModalComponent, {
  //     width: '1400px',
  //     data:{
  //       indexSnp: "testSNP",
  //       topSnps: "A:0.01;B:0;C:1",
  //       workDir:"test",
  //       dataset1: "data1",
  //       dataset2: "data2"
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed', result);
  //   });
  // }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index==0)
    {
      this.activeTab="epi";
    } 
    else if (tabChangeEvent.index ==1)
    {
      this.activeTab="coloc";
    }
  }

  getCoordinate(idx:number) {
    if (idx < 0 || idx >= this.epiResultData.length) {
      return null;
    }

    let startPos = this.epiResultData[idx].SnpPosition - this.flankingNt;
    let endPos = this.epiResultData[idx].SnpPosition + this.flankingNt;
    return this.epiResultData[idx].Chr + ":" + (startPos > 0? startPos: 0) + "-" + endPos;
  }

  getCoordinate2(idx:number) {
    if (idx < 0 || idx >= this.colocResultData.length) {
      return null;
    }
    return this.colocResultData[idx].IndexSnp; 
  }

  //#region Genome Browser parameter multi-select data retrieving
  turnOnTrackTypeDropDownClick(){
    this.trackTypeDropDownClick=true;
  }

  turnOnTrackDataSourceDropDownClick(){
    this.trackDataSourceDropDownClick=true;
  }

  updateTrackDataSource(event:any) {
    if (this.trackTypeDropDownClick && this.selectedTrackTypes.length > 0) {
      this.trackTypeDropDownClick = false;
      this.getDataService.getExistingDataSource(this.selectedTrackTypes).subscribe(
        data => {
          this.trackDataSourceOptions = data;
        }, error => {
          this.openDialog("Failed to retrieve existing dataSource given track type " + this.selectedTrackTypes.join(","));
        }
      )
    }
  }

  updateTrackTissue(event: any){
    if (this.trackDataSourceDropDownClick && this.selectedTrackDataSources.length > 0) {
      this.trackDataSourceDropDownClick = false;
    
      this.getDataService.getExistingTissue(this.selectedTrackTypes, this.selectedTrackDataSources).subscribe(
        data => {
          this.trackTissueOptions = data;
        }, error => {
          this.openDialog("Failed to retrieve existing tissues given track type " + this.selectedTrackTypes.join(",") + " and data source " + this.selectedTrackDataSources.join(","));
        }
      )
    }
  }

  // Verify track type, data source and tissue 
  verifyTrackSelection() {
    if (this.selectedTrackTypes == null || this.selectedTrackTypes.length == 0) {
      return "To view genome tracks, please select at least one track type on the left side bar";
    } else if (this.selectedTrackDataSources == null || this.selectedTrackDataSources.length == 0) {
      return "There are " + this.selectedTrackDataSources.length + " data sources under track type " + this.selectedTrackTypes.join(",") +". To avoid long loading time, please select at least one data source on the left side bar";
    }
    return "";
  }
  //#endregion

  //#region Open EpiGenome Browser with url parameters
  openEpiBrowser() {
    // verify track selection 
    let err = this.verifyTrackSelection();
    if (err.length > 0){
      this.openDialog(err);
      return;
    }

    // generate data hub file
    this.getDataService.getEGHubFile(this.selectedTrackTypes, this.selectedTrackDataSources, this.selectedTrackTissues).subscribe(
      data =>{
        let hubJsonUrl = data.Value;

        // get coordinate
        let coordinate = '';

        if (this.activeTab == "epi"){
          coordinate = this.getCoordinate(this.lastIdx);
        }
        else if (this.activeTab = "coloc") {
          coordinate = this.getCoordinate2(this.lastIdx2);
        }

        if (coordinate == null)
        {
          this.openDialog("Please select a SNP from the table");
          return;
        }

        // build URL
        let eg_url = this.buildEGUrl(coordinate, hubJsonUrl);
        window.open(eg_url, '_blank');                          
      }, error => {
        this.openDialog("Failed to generate data hub for epigenome browser: " + error.message);
      }
    )

    

    // localStorage.setItem("coordinate",  coordinate);
    // opne GIVE
    //window.open('/viewer', '_blank'); 
    // open Washington Epigenome Browser
    // window.open("http://localhost:3000/?genome=hg19&hub=http://10.132.10.11:81/testHub/test.json")
    // window.open("http://epigenomegateway.wustl.edu/legacy?genome=hg19&?hub=https://vizhub.wustl.edu/public/tmp/a.json")
  }

  buildEGUrl(position:string, hubUrl:string) {
    let arr = position.split("-");
    if (arr.length == 1)
    {
      arr = position.split(":");
      let pos = parseInt(arr[1]);
      position = arr[0] + ":" + (pos - 100000) + "-" + (pos + 100000);
    }

    return "http://localhost:3000/browser?genome=hg19&position=" + position + "&hub=" + hubUrl;
  }
  //#endregion
}

export interface QtlParam {
  dataset1: string;
  dataset2: string;
  dataType1: string;
  dataType2: string;
  p1: string;
  p2: string;
  p12: string;
  maxDist: string;
}