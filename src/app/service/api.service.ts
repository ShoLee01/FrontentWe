import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  user : any ;
  basePath = 'http://api.westudy.global/';
 
  constructor(private http: HttpClient, private sharedService: SharedService) {
    this.user=this.sharedService.getAddUsuario();
    if(this.user==null){
      this.user={};
    }
  }
  // List end points Login

  login(data: any) {
    return this.http.post(this.basePath + 'login', data);
  }

  registerUniversity(data: any) {
    return this.http.post(this.basePath + 'registerUniversity', data);
  }

}
