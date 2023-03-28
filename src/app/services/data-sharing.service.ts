import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  coordinate: string = '';

  // bulk RNASeq data sharing 


  // isShowViewerChanged:boolean=false;
  // showViewerChange: Subject<boolean> = new Subject<boolean>();

  // constructor() { }

  // toggleShowViewerChanged() {
  //   this.showViewerChange.next(!this.isShowViewerChanged);
  // }
}
