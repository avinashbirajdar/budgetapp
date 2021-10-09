import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from './config';

import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  options: any = {
    headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', })
      .set('Authorization', 'Bearer ' + localStorage.getItem('userToken'))
    // this.append.headers('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept')
  };

  constructor(public http: HttpClient, private route: Router) {
    this.options.headers.append('Content-Type', 'application/json');
  }

  //To Call the Post Apis
  public CallPostApi(url: string, data: any): any {
    return this.http.post(config.ApiUrl + url, data, this.options);
  }


  //To Call the Post Apis
  public CallPostFileApi(url: string, formData: any): any {
    const headers = new HttpHeaders({ 'Content-Type': 'multipart/form-data' });
    return this.http.post(config.ApiUrl + url, formData, this.options);

  }
  public CallPostAuthApi(url: string, data: any): any {
    this.options.headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.http.post(config.ApiUrl + url, data, this.options);
  }

  //To Call the Get Apis
  public CallGetApi(url: string): any {
    return this.http.get(config.ApiUrl + url, this.options);
  }
  //To Call the Get Apis
  public CallGetByIdApi(url: string, id: number): any {
    return this.http.get(config.ApiUrl + url + id, this.options);
  }
  //To Call the Put Apis
  public CallPutApi(url: string, data: any): any {
    return this.http.post(config.ApiUrl + url, data, this.options);
  }

  //To Call the Delete Apis
  public CallDeleteApi(url: string, id: number): any {
    return this.http.post(config.ApiUrl + url + id, this.options);
  }

  //To Call the get Apis
  public CallGetValueApi(url: string, paymenttype: string): any {
    return this.http.get(config.ApiUrl + url + paymenttype, this.options);
  }


}
