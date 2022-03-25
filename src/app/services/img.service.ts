import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ImgService  extends BaseService{

  constructor(private http: HttpClient) {
    super();
  }

  getLzpImage(dir:string, tag:string): Observable<Blob>{
    let params = new HttpParams();
    params = params.append('wd', dir);
    params = params.append('tag', tag);
    return this.http.get(this.rootURL+'/lzp',  { params: params, responseType: 'blob' });
  }

  getHeatmapImage(dir: string): Observable<Blob> {
    let params = new HttpParams();
    params = params.append('wd', dir);
    params = params.append('type', 'heatmap');
    return this.http.get(this.rootURL+'/analysisPlot',  { params: params, responseType: 'blob' });  }
}
