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
export class ApiService {
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
      const decodedToken = jwt.decode(this.user.access) as {[key: string]: any};
      const expirationDate = new Date(decodedToken['exp'] * 1000);
      const currentDate = new Date();
      const isTokenActive = expirationDate > currentDate;
      if(isTokenActive){
        this.router.navigate(['/principal']);
        console.log('token activo');
        this.headers = new HttpHeaders().set('Authorization', `Bearer ${this.user.access}`);
      }else{
        this.router.navigate(['/login']);
        console.log('token expirado');
        localStorage.removeItem('addUsuario');
        this.change.changeHandler$.emit(false);
      }
    }else{
      this.router.navigate(['/login']);
      console.log('token expirado');
      localStorage.removeItem('addUsuario');
      this.change.changeHandler$.emit(false);
    }
    
  }
  // List end points Login

  login(data: any) {
    return this.http.post(this.basePath + 'university/login/', data);
  }

  createAccount(data: any) {
    return this.http.post(this.basePath + 'university/create/', data);
  }

  activateAccount(data: any) {
    return this.http.post(this.basePath + 'university/active/', data);
  }

  getProfile() {
    this.user=JSON.parse(localStorage.getItem('addUsuario')!);
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${this.user.access}`);
    return this.http.get(this.basePath + 'university/detail/' + this.user?.university?.id, { headers: this.headers });
  }

  registeredAccount(data: any) {
    return this.http.post(this.basePath + 'university/registered_accounts/', data);
  }

  updateProfile(data: any, id: any=0) {
    let id_dig = (id==0) ? this.user.university.id : id;
    return this.http.patch(this.basePath + 'university/update/' + id_dig , data, { headers: this.headers });
  }

  registerUniversity(data: any) {
    return this.http.post(this.basePath + 'registerUniversity', data);
  }

  getPrograms() {
    return this.http.get(this.basePath + 'type-of-program/');
  }

  getCategories() {
    return this.http.get(this.basePath + 'category/');
  }

  getModalities() {
    return this.http.get(this.basePath + 'modality/');
  }

  createCourse(data: any) {
    return this.http.post(this.basePath + 'course/create/university/'+ this.user.university.id +'/', data, { headers: this.headers });
  }

  /* Conecciones entre Modalidades, Categorias y Tipo de programas */

  createCategoryAndCourse(categoryId: any, CourseId: any) {
    let data = {}
    return this.http.post(this.basePath + 'course/create/category/'+categoryId+'/course/'+CourseId+'/', data, { headers: this.headers });
  }

  createModalityAndCourse(modalityId: any, CourseId: any) {
    let data = {}
    return this.http.post(this.basePath + 'course/create/modality/'+modalityId+'/course/'+CourseId+'/', data, { headers: this.headers });
  }

  createProgramTypeAndCourse(programTypeId: any, CourseId: any) {
    let data = {}
    return this.http.post(this.basePath + 'course/create/typeofprogram/'+programTypeId+'/course/'+CourseId+'/', data, { headers: this.headers });
  }

  /* Horarios */

  createSchedule(CourseId: any, data: any) {
    return this.http.post(this.basePath + 'shift/create/course/'+CourseId+'/', data, { headers: this.headers });
  }

  getCoursesByUniversity() {
    return this.http.get(this.basePath + 'course/university/'+this.user.university.id+'/', { headers: this.headers });
  }

  getShiftsByCourse(CourseId: any) {
    return this.http.get(this.basePath + 'shift/course/'+CourseId+'/', { headers: this.headers });
  }

  getShiftsBySchedule(CourseId: any) {
    return this.http.get(this.basePath + 'shift/course/'+CourseId+'/shifts/', { headers: this.headers });
  }
  // Delete course
  deleteCourse(CourseId: any) {
    return this.http.delete(this.basePath + 'course/delete/'+CourseId+'/', { headers: this.headers });
  }

  deleteCategoryAndCourse(categoryId: any, CourseId: any) {
    return this.http.delete(this.basePath + 'course/delete/category/'+categoryId+'/course/'+CourseId+'/', { headers: this.headers });
  }

  deleteModalityAndCourse(modalityId: any, CourseId: any) {
    return this.http.delete(this.basePath + 'course/delete/modality/'+modalityId+'/course/'+CourseId+'/', { headers: this.headers });
  }

  deleteProgramTypeAndCourse(programTypeId: any, CourseId: any) {
    return this.http.delete(this.basePath + 'course/delete/typeofprogram/'+programTypeId+'/course/'+CourseId+'/', { headers: this.headers });
  }

  deleteShift(shiftId: any) {
    return this.http.delete(this.basePath + 'shift/delete/'+shiftId+'/', { headers: this.headers });
  }

  updateCourse(CourseId: any, data: any) {
    return this.http.put(this.basePath + 'course/update/'+CourseId+'/', data, { headers: this.headers });
  }
}
