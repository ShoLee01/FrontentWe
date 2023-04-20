import { Component, OnInit, ChangeDetectorRef, ViewChild  } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { InterconnectionService } from 'src/app/service/interconnection.service';
import { ApiService } from 'src/app/service/api.service';
import { SharedService } from 'src/app/service/shared.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  RegisterForm!: FormGroup;
  RegisterProcessForm!: FormGroup;
  RegisterConfirmForm!: FormGroup;
  passwordType: string = 'password';
  passwordShown: boolean = false;
  isRegister: boolean = false;
  passwordTypeConfirm: string = 'password';
  passwordShownConfirm: boolean = false;
  isSmallScreen: boolean = false;
  backgroundFile: File | null = null;
  logoFile: File | null = null;
  backgroundName: string = '';
  logoName: string = '';
  isConfirm: boolean = false;
  isActive: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    public api: ApiService,
    private router: Router,
    private change: InterconnectionService,
    private sharedService: SharedService,
    private breakpointObserver: BreakpointObserver,
    private changeDetector: ChangeDetectorRef,
    private snackBar: MatSnackBar,
  ) {
    // Formulario de registro
    this.RegisterProcessForm = this.formBuilder.group({
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
      verified_tc: [false],
      verified_pp: [false],
    }, { validator: this.checkPasswords });

    // Formulario de proceso de registro
    this.RegisterForm = this.formBuilder.group({
      name: ['', Validators.required],
      background_image: [''],
      verified: [false],
      global_ranking: [''],
      national_level_ranking: ['', Validators.required],
      latin_american_ranking: ['', Validators.required],
      number_of_courses: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      logo: ['']
    });

    this.RegisterConfirmForm = this.formBuilder.group({
      code: ['', Validators.required]
    });

  }

  showSnackBar(word: string): void {
    this.snackBar.open(word, 'Cerrar', {
      duration: 3000,
    });
  }

  signUpBack() {
    this.isRegister = false;
    this.isActive = false;
    this.isConfirm = false;
  }



  Active() {
    this.isConfirm = true;
    this.isActive = true;
  }

  signUpConfirm() {
    this.isActive = true;
    this.isConfirm = true;
  }

  activeCode() {
    this.showSnackBar('Cuenta activada');
    this.router.navigate(['/login']);
  }
  
  onFileChange(event: any, type: 'background' | 'logo') {
    if (event.target.files.length > 0) {
      if (type === 'background') {
        this.backgroundName = event.target.files[0].name;
        this.backgroundFile = event.target.files[0];
      } else if (type === 'logo') {
        this.logoName = event.target.files[0].name;
        this.logoFile = event.target.files[0];
      }
    }
  }

  checkPasswords(group: FormGroup) {
    const password = group.controls['password'].value;
    const passwordConfirm = group.controls['passwordConfirm'].value;
    return password === passwordConfirm ? null : { passwordMismatch: true };
  }

  ngOnInit(): void {
    this.breakpointObserver
    .observe([Breakpoints.Small, Breakpoints.XSmall])
    .subscribe((state) => {
      this.isSmallScreen = state.matches;
      this.changeDetector.markForCheck(); // Añade esta línea
    });
  }

  togglePassword() {
    this.passwordShown = !this.passwordShown;
    this.passwordType = this.passwordShown ? 'text' : 'password';
  }

  togglePasswordConfirm() {
    this.passwordShownConfirm = !this.passwordShownConfirm;
    this.passwordTypeConfirm = this.passwordShownConfirm ? 'text' : 'password';
  }

  signUpProcess() {
    this.isRegister = true;
  }

  generateCode(){
    this.showSnackBar('Código de activación generado');
  }

  signIn() {
    let token: {};
    if (this.RegisterForm.valid) {
      console.log(this.RegisterForm.value);
      let data = {
        email: this.RegisterForm.value.email,
        password: this.RegisterForm.value.password,
      };
      this.api.login(this.RegisterForm.value).subscribe(
        (res: any) => { 
          console.log(res);
          this.api
        .login(data)
        .subscribe(
          (data: any) => {
            token = {...res, ...data};
            localStorage.setItem('addUsuario', JSON.stringify(token));
            this.change.changeHandler$.emit(true);
            this.RegisterForm.reset();
            alert('Bienvenido ' + data.firstName + ' ' + data.lastName);
            this.router.navigate(['']);
          },
          (error: any) => {
            alert('User or password incorrect');
          }
        );
        });
    } else {
      alert('Please fill in all the fields');
    }
  }
}
