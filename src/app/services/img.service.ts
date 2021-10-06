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

  getImage(dir:string, tag:string): Observable<Blob>{
    let params = new HttpParams();
    params = params.append('wd', dir);
    params = params.append('tag', tag);
    return this.http.get(this.rootURL+'/GetQTLColoc/lzp/',  { params: params, responseType: 'blob' });
  }
}
