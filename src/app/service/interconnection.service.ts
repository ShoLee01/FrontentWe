import { Injectable,EventEmitter } from '@angular/core';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class InterconnectionService {

  public changeHandler$: EventEmitter<boolean>;
  public changeHandlerAdmin$: EventEmitter<boolean>;
  public changeHandlerLogin$: EventEmitter<boolean>;
  public changeHandlerLoginUser$: EventEmitter<boolean>;
  public informationChanged$: EventEmitter<SharedService>;

  
  constructor() {
    this.changeHandler$ = new EventEmitter();
    this.informationChanged$ = new EventEmitter();
    this.changeHandlerAdmin$ = new EventEmitter();
    this.changeHandlerLogin$ = new EventEmitter();
    this.changeHandlerLoginUser$ = new EventEmitter();
  }
  public changeHandler =() => this.changeHandler$.emit(true);
  public changeHandlerAdmin =() => this.changeHandlerAdmin$.emit(true);
  public changeHandlerLogin =() => this.changeHandlerLogin$.emit(true);
  public changeHandlerLoginUser =() => this.changeHandlerLoginUser$.emit(true);
  public informationChanged = (sharedService: SharedService) => this.informationChanged$.emit(sharedService);

}
