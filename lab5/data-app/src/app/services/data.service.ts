import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; // Abilty to invoke method asynchronously


// This identifies that this is a service
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpClient:HttpClient) { }

  getStudentData():Observable<any> {
    return this.httpClient.get('https://jsonblob.com/api/jsonBlob/1346789136996163584');
  }
}
