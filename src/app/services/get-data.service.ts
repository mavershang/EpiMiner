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

  getBySnpInput(snpStr: string, param:SearchParam): Observable<EpiData[]> {
    let params = new HttpParams();
    params = params.append('snpStr', snpStr);
    return this.http.get<EpiData[]>(this.rootURL+'/GetEpiData', {params});
  }

  getByFileInput(fileToUpload: File, param: SearchParam): Observable<EpiData[]> {
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    // modify this section as needed
    // formData.append("guideCol", param.guideRNACol);

    return this.http.post<EpiData[]>(this.rootURL + "/GetEpiData", formData);
  }

  getDataList() {
    return this.http.get<any>(this.rootURL+'/GetQTLColoc');
  }

  runQTLByFileInput(fileToUpload: File, param: QtlParam): Observable<ColocResult[]> {
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append("dataset1", param.dataset1);
    formData.append("dataset2", param.dataset2);
    formData.append("p1", param.p1);
    formData.append("p2", param.p2);
    formData.append("p12", param.p12);


    return this.http.post<ColocResult[]>(this.rootURL + "/GetQTLColoc", formData);
  }
}