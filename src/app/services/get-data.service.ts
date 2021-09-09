import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  getBySnpInput(snpStr: string): Observable<EpiData[]> {
    let params = new HttpParams();
    params = params.append('snpStr', snpStr);
    return this.http.get<EpiData[]>(this.rootURL+'/experiment/byProjID', {params});
  }

  getByFileInput(fileToUpload: File, param: SearchParam) {
    const delim="||||";
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    // modify this section as needed
    // formData.append("guideCol", param.guideRNACol);
    // formData.append("subject", param.subject);
    // formData.append("sourceLibID", param.guideSourceLibID);
    // formData.append("sourceLibCol", param.guideSourceLibCol);
    // formData.append("conditionCols", param.condCols.join(delim));
    // formData.append("readoutCols", param.readoutCols.join(delim));

    return this.http.post<EpiData[]>(this.rootURL + "/FileUpload/ExpResult", formData);

    //return this.http.post<ParsedExpData>(this.rootURL + "/FileUpload/ExpResult", formData);
  }
}