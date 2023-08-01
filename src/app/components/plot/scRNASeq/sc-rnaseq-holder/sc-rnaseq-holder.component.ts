import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DataSharingCRService } from 'src/app/services/data-sharing-bulk-rnaseq.service';
import { GetDataService } from 'src/app/services/get-data.service';
import { DataUtil } from 'src/app/util/util.data';

@Component({
  selector: 'app-sc-rnaseq-holder',
  templateUrl: './sc-rnaseq-holder.component.html',
  styleUrls: ['./sc-rnaseq-holder.component.css']
})
export class ScRNASeqHolderComponent implements OnInit {
  dataMapPath: string = '../../../../../assets/dataMaps/scRNASeqAtlas-dataMap.tsv'
  idMapPath: string = '../../../../../assets/dataMaps/geneMap.tsv'

  dataMap: { [disease: string]: any[] } = {};
  idMap: { [gene: string]: { [species: string]: string } } = {};

  baseUrl: string = 'http://heist.pfizer.com';
  iframeSrc: SafeResourceUrl;

  studyId: string = '';
  taxId: string = '9606' // use human as example
  omicsId: string = '';

  dataArr: any[] = []
  selectedDataIdx:number;


  constructor(
      public dataShareService: DataSharingCRService,
      private getDataService: GetDataService,
      private sanitizer: DomSanitizer) {
    // load data and ID map
    this.loadScRNASeqMap();

    // initiate URL
    this.iframeSrc =  this.sanitizer.bypassSecurityTrustResourceUrl(this.baseUrl);
  }

  ngOnInit(): void {
    this.dataShareService.selectedDiseaseChange.subscribe((value) => {
      if (this.dataMap[this.dataShareService.selectedDisease]) {
        this.dataArr = this.dataMap[this.dataShareService.selectedDisease];
        this.selectedDataIdx = 0;
        this.setID(this.selectedDataIdx);
        this.updateUrl();
      }
    });

    this.dataShareService.selectedGeneChange.subscribe((value) => {
      if (this.idMap[this.dataShareService.selectedGene] &&
          this.idMap[this.dataShareService.selectedGene][this.taxId]) {
        this.omicsId = this.idMap[this.dataShareService.selectedGene][this.taxId];
        this.updateUrl();
      }
    });

  }
  // load scRNASeq Atlas data map and omicsId map
  async loadScRNASeqMap() {
    try {
      const tmpDataMap = await this.getDataService.loadTSV(this.dataMapPath)
      const tmpIdMap = await this.getDataService.loadTSV(this.idMapPath);

      this.dataMap = tmpDataMap.reduce((acc, item) => {
        if (!acc[item.disease]) {
          acc[item.disease] = [];
        }
        acc[item.disease].push(item);
        return acc;
      }, {});

      this.idMap = tmpIdMap.reduce((acc, item) => {
        acc[item.display_symbol] = {};
        acc[item.display_symbol][item.tax_id] = item.omics_id;
        return acc;
      }, {});
    } catch (error) {
      console.error(error);
    }
  }

  setID(i:number) {
    this.studyId = this.dataArr[i].studyID;
    this.taxId = this.dataArr[i].taxID;
  }

  isValidId(id: string) {
    return id != undefined &&
      id != null &&
      id !== ''
  }

  updateUrl() {
    if (!this.isValidId(this.studyId) ||
      !this.isValidId(this.taxId) ||
      !this.isValidId(this.omicsId)) {
      return;
    }

    this.buildScRNASeqAtlasUrl(this.studyId, this.taxId, this.omicsId);
  }

  // build URL to access scRNASeq Atlas
  buildScRNASeqAtlasUrl(studyId: string, taxId: string, omicsId: string) {
    const url = `${this.baseUrl}/study/${studyId}?page=CellMarkerAnalysis&annotationGroupId=14&omicsId=${omicsId}`;
    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  selectedDataOnChange() {
    this.setID(this.selectedDataIdx);
    this.updateUrl();
  }
}