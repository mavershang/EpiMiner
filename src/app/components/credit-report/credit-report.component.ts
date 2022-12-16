import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';
import { GetDataService } from 'src/app/services/get-data.service';
import { ImgService } from 'src/app/services/img.service';
import { SearchParam } from 'src/app/models/search-param';
import { HyperColocResult } from 'src/app/models/hypercoloc-result';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableFilter } from 'mat-table-filter';
import { EpiData } from 'src/app/models/epi-data';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DataTissueCell } from 'src/app/models/data-tissue-cell';


@Component({
  selector: 'app-credit-report',
  templateUrl: './credit-report.component.html',
  styleUrls: ['./credit-report.component.css']
})
export class CreditReportComponent implements OnInit {
  // loading spiner
  loading$ = this.loader.loading$;

  // input gene
  geneInput: string = "";

  // Ref Genome
  refGenomeArr = ["hg19", "hg38"];
  selectedRefGenome:string;
  currentRefGenome:string;

  // disease 
  diseaseArr = ["Renal disease"];
  selectedDisease:string;
  currentDisease:string;

  //  List of tissues in EPi data
  tissueOptions: string[]=[];
  tissueCellOptions: DataTissueCell[] = [];
  dropdownSettings: IDropdownSettings;

  // search parameters
  searchParam: SearchParam = new SearchParam();

  // tabs
  tabOptions:string[] = ['Genetics', 'Epigenomics', 'RNASeq', 'scRNASeq']
  activeTab:string=this.tabOptions[0];

  // genetics tab
  // --- hypercoloc result table
  hypercolocResults: HyperColocResult[] = [];
  displayedColumns: string[] = ['QueryGene', 'Iteration', 'Traits', 'PosteriorProb', 'RegionalProb', 'CandidateSNP', 'PosteriorExplainedBySNP', 'DroppedTrait'];
  hasData:boolean=false;
  tableDataSource = new MatTableDataSource<HyperColocResult>(); 
  @ViewChild('paginatorQuery') paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  filterEntity: HyperColocResult;
  filterType: MatTableFilter;
  lastIdx: number;
  // --- locuszoom plot
  lzpFiles: string[] = [];
  lzpImgs: any[] = [];

  // epigenetics tab
  displayedColumns2: string[] = ['Chr', 'SnpPosition', 'ChunkStartPos', 'ChunkEndPos', 'Gene', 'EpiLinkScore', 'QTLPValue', 'Tissue', 'CellType', 'CellLine', 'DataSource', 'Description', 'DataType'];
  epiResultData: EpiData[] = [];
  hasData2:boolean=false;
  tableDataSource2 = new MatTableDataSource<EpiData>(); 
  @ViewChild('paginatorQuery') paginator2: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort2: MatSort;
  filterEntity2: EpiData;
  filterType2: MatTableFilter;
  lastIdx2: number;

  constructor( 
    private dialog: MatDialog,
    public loader: LoadingService,
    private getDataService: GetDataService,
    private imgService: ImgService) {
      this.initRefGenome();
      this.getTissueCellList(this.currentRefGenome);
    }

  ngOnInit(): void {
    this.filterEntity = new HyperColocResult();
    this.filterType = MatTableFilter.ANYWHERE;
    this.lastIdx = -1;

    this.filterEntity2 = new EpiData();
    this.filterType2 = MatTableFilter.ANYWHERE;
    this.lastIdx2 = -1;

    this.reset();
  }

  ngAfterViewInit() {
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.sort;
  }

  initRefGenome() {
    this.selectedRefGenome = this.refGenomeArr[0];
    this.currentRefGenome = this.selectedRefGenome;
  }

  reset() {
    this.initRefGenome();
    this.searchParam = new SearchParam();
  }

  onItemSelect(item: any) {
    console.log(item);
  }

  onSelectAll(items: any) {
    console.log(items);
  }

  openDialog(description:string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = description;
    this.dialog.open(DialogComponent, dialogConfig);
  }

  getTissueCellList(refGenome:string) {
    this.getDataService.getTissueCellList(refGenome).subscribe(
      data => {
        //this.tissueOptions = data;
        this.tissueCellOptions = data;
        this.tissueOptions = this.tissueCellOptions.map(x=>x.InfoType+":"+x.InfoValue);
        this.tissueOptions = this.tissueOptions.filter(function(ele, index, self){
          return index == self.indexOf(ele);
        })
        this.tissueOptions = this.tissueOptions.sort();
      }, error => {
        this.openDialog("Failed to fetch all tissues: " + error.message);
      });
  }

  diseaseOnChange(){
    if (this.selectedDisease == this.currentDisease) {
      // do nothing
      return;
    }

    // reset selected disease and fetch dataset
    this.currentDisease = this.selectedDisease
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.activeTab = this.tabOptions[tabChangeEvent.index];
  }


  submitGene() {
    let verifyError = this.verifyInput();
    if (verifyError.length > 0){
      this.openDialog(verifyError);
      return;
    }
    
    // verify max distance
    if (this.searchParam.maxDist == undefined ||  this.searchParam.maxDist.length == 0)
    {
      this.searchParam.maxDist = '500000';
    }

    // genetics: hypercoloc and locuszoom
/*     this.getDataService.getCRGeneticsByGene(this.geneInput, this.selectedDisease, this.selectedRefGenome, this.searchParam).subscribe(
      data => {
        console.log(data);
        this.hypercolocResults = data.HCRList;
        this.tableDataSource.data = this.hypercolocResults;
        this.tableDataSource.paginator = this.paginator;
        this.tableDataSource.sort = this.sort;
        this.lzpFiles = data.LZPImgList;
        this.getImages(this.lzpFiles);
      },error => {
        this.openDialog("Failed to run Credit Report genetics: " + error.message);
      }); */
    
    // epigenomics
    this.getDataService.queryByStr(this.geneInput, this.selectedRefGenome, this.searchParam).subscribe(
      data => {
        this.epiResultData = data.epiDataList;
        this.tableDataSource2.data = this.epiResultData;
        this.hasData2 = this.epiResultData.length > 0;
        this.tableDataSource2.paginator = this.paginator2;
        this.tableDataSource.sort = this.sort;      
      }, error => {
        this.openDialog("Failed to query gene for epigenomics: " + error.message);
      }
    );
  }

  verifyInput() {
    if (this.geneInput == "" ) {
      return "Please fill gene search textbox before continue.";
    } else if (this.geneInput.split(',').length > 1) {
      return "Please submit one gene for each search.";
    }  else if (this.searchParam.tissues == undefined || this.searchParam.tissues.length==0) {
      return "Please select Tissue and Celltype before continue";
    }
    return "";
  }

  onRowClicked(row: any, i: number) {
    console.log('Row clicked: ', row);
    if (this.lastIdx > -1) {
      this.tableDataSource.data[this.lastIdx].highlighted = false;
    }
    row.highlighted = !row.highlighted;
    this.lastIdx = i;
  }

  onRowClicked2(row: any, i: number) {
    console.log('Row clicked: ', row);
    if (this.lastIdx2 > -1) {
      this.tableDataSource.data[this.lastIdx].highlighted = false;
    }
    row.highlighted = !row.highlighted;
    this.lastIdx2 = i;

  }

  getImages(files) {
    files.forEach(file => {
      this.imgService.getLzpImageByFname(file).subscribe(
        Response => {
          this.createImageFromBlob(Response, file);
        }, error => {
          console.log(error);
        }
      )
    });
  }

  createImageFromBlob(image: Blob, fname:string) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      let i = this.lzpFiles.indexOf(fname);
      this.lzpImgs[i] = reader.result;
    }, false);
 
    if (image) {
       reader.readAsDataURL(image);
    }
 }
}