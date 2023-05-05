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
  countries = ["Argentina", "Bolivia", "Brasil", "Chile", "Colombia", "Costa Rica", "Cuba", "Ecuador", "El Salvador", "Guatemala", "Honduras", "México", "Nicaragua", "Panamá", "Paraguay", "Perú", "Puerto Rico", "República Dominicana", "Uruguay", "Venezuela"]
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
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
      verified_tc: [false],
      verified_pp: [false],
    }, { validator: this.checkPasswords });

    // Formulario de proceso de registro
    this.RegisterForm = this.formBuilder.group({
      name: ['', Validators.required],
      background_image: [null],
      country: ['', Validators.required],
      city: ['', Validators.required],
      logo: [null],
      verified: [false]
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
    if(this.RegisterForm.valid){
      let data = {...this.RegisterProcessForm.value, ...this.RegisterForm.value};
      this.api.createAccount(data).subscribe({
        next: (result: any) => {
          this.showSnackBar('Cuenta creada');
          this.isActive = true;
          this.isConfirm = true;
          this.changeDetector.detectChanges();
        },
        error: (error: any) => {
          this.showSnackBar('Error al crear la cuenta');
        }
      });
      
    }
  }

  activeCode() {
    if(this.RegisterConfirmForm.valid){
      this.api.activateAccount({activation_code: this.RegisterConfirmForm.value.code}).subscribe({
        next: (result: any) => {
          if(result.message === 'University activated'){
            this.showSnackBar('Cuenta activada');
            this.router.navigate(['/login']);
            this.changeDetector.detectChanges();
          }else if(result.message === 'University is already active'){
            this.showSnackBar('Universidad ya se encuentra activa');
          }else{
            this.showSnackBar('Código incorrecto');
          }
        },
        error: (error: any) => {
          this.showSnackBar('Código incorrecto');
        }
      });
    }
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
    if(this.RegisterProcessForm.valid){
      if(this.RegisterProcessForm.value.verified_pp && this.RegisterProcessForm.value.verified_tc){
        this.api.registeredAccount({email: this.RegisterProcessForm.value.email}).subscribe({
          next: (result: any) => {
            if(!result.university){
              this.isRegister = true;
            this.changeDetector.detectChanges();
            }else{
              this.showSnackBar('email en uso');
            }
          }
        });
      }else{
        this.showSnackBar('Debe aceptar los términos y condiciones y la política de privacidad');
      }
      
    }
  }

  generateCode(){
    this.showSnackBar('Código de activación generado');
  }

  
}
