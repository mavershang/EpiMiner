import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {

  coordinates: string[] = [];

  // isShowViewerChanged:boolean=false;
  // showViewerChange: Subject<boolean> = new Subject<boolean>();

  // constructor() { }

  // toggleShowViewerChanged() {
  //   this.showViewerChange.next(!this.isShowViewerChanged);
  // }
}
