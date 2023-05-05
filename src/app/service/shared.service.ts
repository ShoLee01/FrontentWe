import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() {
  }

  private subject = new Subject<any>();

  getClickEvent(): Observable<any> {
    return this.subject.asObservable();
  }

  public getAddUsuario() {
    let userInfo =JSON.parse(localStorage.getItem('addUsuario')!);
    return userInfo;
  }
}
