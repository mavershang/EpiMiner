import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QtlParam } from '../components/snp-query/snp-query.component';
import { ColocResult } from '../models/coloc-result';
import { EpiData } from '../models/epi-data';
import { SearchParam } from '../models/search-param';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class GetDataService extends BaseService{
  epiDataList: EpiData[] = [];

  constructor(private http: HttpClient) {
    super();
   }

  getBySnpInput(snpStr: string, sp:SearchParam): Observable<EpiData[]> {
    let params = new HttpParams();
    params = params.append('snpStr', snpStr);
    params = params.append("maxDist", sp.maxDist);
    params = params.append("tissues", sp.tissues.join(","));
    return this.http.get<EpiData[]>(this.rootURL+'/GetEpiData/id', {params});
  }

  getByFileInput(fileToUpload: File, param: SearchParam): Observable<EpiData[]> {
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append('maxDist', param.maxDist);
    formData.append('tissues', param.tissues.join(","));
    return this.http.post<EpiData[]>(this.rootURL + "/GetEpiData", formData);
  }

  getColocDataList() {
    return this.http.get<any>(this.rootURL+'/GetQTLColoc');
  }

  getTissueList() {
    return this.http.get<any[]>(this.rootURL + "/GetEpiData");
  }

  colocBySnpInput(snpStr: string, qp:QtlParam) {
    let params = new HttpParams();
    params=params.append('snpStr', snpStr);
    params=params.append("dataset1", qp.dataset1);
    params=params.append("dataset2", qp.dataset2);
    params=params.append("datatype1", qp.dataType1);
    params=params.append("datatype2", qp.dataType2);
    params=params.append("p1Str", qp.p1);
    params=params.append("p2Str", qp.p2);
    params=params.append("p12Str", qp.p12);
    params=params.append("maxDistStr", qp.maxDist);
    return this.http.get<any[]>(this.rootURL + "/GetQTLColoc/id", {params});
  }
  
  colocByFileInput(fileToUpload: File, qp: QtlParam): Observable<ColocResult[]> {
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append("dataset1", qp.dataset1);
    formData.append("dataset2", qp.dataset2);
    formData.append("datatype1", qp.dataType1);
    formData.append("datatype2", qp.dataType2);
    formData.append("p1Str", qp.p1);
    formData.append("p2Str", qp.p2);
    formData.append("p12Str", qp.p12);
    formData.append("maxDistStr", qp.maxDist);
    return this.http.post<ColocResult[]>(this.rootURL + "/GetQTLColoc", formData);
  }

  getExistingTrackType():Observable<string[]> {
    return this.http.get<string[]>(this.rootURL + "/egHelper/getTrackTypes");
  }

  getExistingDataSource(trackTypes:string[]):Observable<string[]> {
    let params = new HttpParams();
    params = params.append('trackTypes', trackTypes.join(","));
    return this.http.get<string[]>(this.rootURL + "/egHelper/getDataSources", {params});
  }

  getExistingTissue(trackTypes:string[], dataSources:string[]):Observable<string[]> {
    let params = new HttpParams();
    params = params.append('trackTypes', trackTypes.join(","));
    params = params.append('dataSources', dataSources.join(","));
    return this.http.get<string[]>(this.rootURL + "/egHelper/getTissues", {params});
  }

  // Get the path of the dynamically generated datahub file for epigenome browser
  getEGHubFile(trackTypes:string[], dataSources:string[], tissues:string[]):Observable<any> {
    let params = new HttpParams();
    params = params.append('trackTypes', trackTypes.join(","));
    params = params.append('dataSources', dataSources.join(","));
    params = params.append('tissues', tissues.join(","));
    return this.http.get<any>(this.rootURL + "/egHelper/getHub", {params});
  }

  testCORS() {
    return this.http.get('http://10.132.10.11:81/testTrack/FINAL_ATAC-seq_BSS00007.sub_VS_Uniform_BKG_CONTROL_36_50000000.pval.signal.bedgraph.gz.bigWig');
  }
}