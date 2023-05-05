import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
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
  isLoggedAdmin: boolean = false;
  isAdmin : boolean = true;
  isSmallScreen: boolean = false;
  
  constructor(private router: Router, 
    private sharedService: SharedService, 
    private refresh:ChangeDetectorRef,
    private change: InterconnectionService,
    private breakpointObserver: BreakpointObserver,
    private changeDetector: ChangeDetectorRef) { 
    }

  ngOnInit(): void {
    this.breakpointObserver
    .observe([Breakpoints.Small, Breakpoints.XSmall])
    .subscribe((state) => {
      this.isSmallScreen = state.matches;
      this.changeDetector.markForCheck(); // Añade esta línea
    });
    this.changeHandler();
    this.changeHandlerAdmin();
    this.changeHandlerLogin();
    this.validateUserExistLogin();
    
  }

  logout(){
    this.isLoggedAdmin = false;
    this.isAdmin = true;
    this.isLogged = false;
    this.change.changeHandler$.emit(true);
    localStorage.removeItem('addUsuario');
    this.router.navigate(['/login']);
  }

  logoutAdmin(){
    this.isLoggedAdmin = false;
    this.isAdmin = true;
    this.isLogged = false;/* 
    this.change.changeHandlerAdmin$.emit(true); */
    localStorage.removeItem('addUsuario');
    this.router.navigate(['/login-admin']);
  }

  getUser(){
    this.user=this.sharedService.getAddUsuario();
  }

  changeHandler(){
    this.change.changeHandler$.subscribe((data: any) => {
      this.validateUserExist();
      
    });
  }
  changeHandlerAdmin(){
    this.change.changeHandlerAdmin$.subscribe((data: any) => {
      this.validateUserExistAdmin();
    });
  }

  validateUserExistLogin(){
    this.change.changeHandlerLoginUser$.subscribe((data: any) => {
      this.validateUserExist();
      this.isAdmin = true;
    });
  }

  changeHandlerLogin(){
    this.change.changeHandlerLogin$.subscribe((data: any) => {
      this.isAdmin = false;
    });
   
  }

  validateUserExistAdmin(){
    if(this.sharedService.getAddUsuario()){
      this.isLoggedAdmin = true;
    }else{;
      this.isLoggedAdmin = false;
      this.router.navigate(['/login-admin']);
    }
  }

  validateUserExist(){
    if(this.sharedService.getAddUsuario()){
      this.isLogged = true;
      this.getUser();
    }else{;
      this.isLogged = false;
      this.router.navigate(['/login']);
    }
  }

  nextPage(rute: String){
    this.router.navigate([rute]);
  }
}
