import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  readonly rootURL = 'https://localhost:44326/api' //'http://10.132.10.11:5050/api'; // 
  constructor() { }

  concatList2Str(list:any) {
    return list.map(function(e:any) {
      return e.item_text;
    }).join(",");
  }

  handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }

  translateError(error: HttpErrorResponse) {
    switch (error.status) {
      case 0:
        return "A client-side or network error occur";
      case 409:
          return "A server side conflict error occur. This is mostly due to duplicate entries"
      case 500:
        return "Internal server error";
    }
    return "Something bad happened; please try again later.";
  }
}