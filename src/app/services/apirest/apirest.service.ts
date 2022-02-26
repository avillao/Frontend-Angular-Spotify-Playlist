import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApirestService {
  headers = new HttpHeaders({credentials:"true"})
  constructor(private http:HttpClient) { }

  get(url:string,withCredentials=false): Observable<any> {
    if (!withCredentials){
      return this.http.get(url,{withCredentials:true})
    }else{
      return this.http.get(url,{headers:this.headers})
    }
  }

  post(url:string,json:any): Observable<any>{
    return this.http.post(url,json)
  }
}
