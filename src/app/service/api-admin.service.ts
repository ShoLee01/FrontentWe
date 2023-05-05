import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from './shared.service';
import * as jwt from 'jsonwebtoken';
import { map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { InterconnectionService } from './interconnection.service';

@Injectable({
  providedIn: 'root'
})
export class ApiAdminService {
  user : any ;
  basePath = 'https://westudyapp.onrender.com/';
  //basePath = 'http://127.0.0.1:8000/';
  headers:any;
  constructor(private http: HttpClient, 
    private sharedService: SharedService,
    private change: InterconnectionService,
    private router: Router,) {
    this.user=JSON.parse(localStorage.getItem('addUsuario')!);
    console.log(this.user);
    
    if(this.user!=null){
      const decodedToken = jwt.decode(this.user.token) as {[key: string]: any};
      const expirationDate = new Date(decodedToken['exp'] * 1000);
      const currentDate = new Date();
      const isTokenActive = expirationDate > currentDate;
      if(isTokenActive){
        this.router.navigate(['/principal-admin']);
        this.change.changeHandlerLogin$.emit(true);
        this.change.changeHandlerAdmin$.emit(true);
        this.headers = new HttpHeaders().set('Authorization', `Bearer ${this.user.token}`);
      }else{
        this.router.navigate(['/login-admin']);
        console.log('token expirado');
        localStorage.removeItem('addUsuario');
      }
    }else{
      this.router.navigate(['/login-admin']);
      localStorage.removeItem('addUsuario');
    }
    
  }
  // List end points Login

  login(data: any) {
    return this.http.post(this.basePath + 'user/login/', data);
  }

  getUniversities() {
    this.user=JSON.parse(localStorage.getItem('addUsuario')!);
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${this.user.token}`);
    return this.http.get(this.basePath + 'university/inactive/', { headers: this.headers });
  }
}


