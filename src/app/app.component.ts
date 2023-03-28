import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { InterconnectionService } from './service/interconnection.service';
import { SharedService } from './service/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'ClimbAway';
  user : any ;
  isLogged: boolean = false;
  constructor(private router: Router, 
    private sharedService: SharedService, 
    private refresh:ChangeDetectorRef,
    private change: InterconnectionService) { }

  ngOnInit(): void {
    this.changeHandler();
    this.validateUserExist();
  }

  logout(){
    localStorage.removeItem('addUsuario');
    this.router.navigate(['/login']);
    this.change.changeHandler$.emit(true);
  }

  getUser(){
    this.user=this.sharedService.getAddUsuario();
  }

  changeHandler(){
    this.change.changeHandler$.subscribe((data: any) => {
      this.validateUserExist();
    });
  }

  validateUserExist(){
    if(this.sharedService.getAddUsuario()){
      this.isLogged = true;
      this.getUser();
    }else{
      this.isLogged = false;
      this.router.navigate(['/login']);
    }
  }

  nextPage(rute: String){
    this.router.navigate([rute]);
  }
}
