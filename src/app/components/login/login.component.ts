import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { InterconnectionService } from 'src/app/service/interconnection.service';
import { ApiService } from 'src/app/service/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from 'src/app/service/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  passwordType: string = 'password';
  passwordShown: boolean = false;
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public api: ApiService,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private change: InterconnectionService,
    private sharedService: SharedService,
    private snackBar: MatSnackBar,
    
  ) {
    // Formulario de registro
    this.loginForm = this.formBuilder.group({
      password: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  ngOnInit(): void {
    this.change.changeHandlerLoginUser$.emit(true);
  }

  togglePassword() {
    this.passwordShown = !this.passwordShown;
    this.passwordType = this.passwordShown ? 'text' : 'password';
  }

  showSnackBar(word: string): void {
    this.snackBar.open(word, 'Cerrar', {
      duration: 3000,
    });
  }

  Administrator() {
    this.router.navigate(['login-admin']);
  }

  signIn() {
    this.loading = true;
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.api.login(this.loginForm.value).subscribe(
        {
          next: (data) => {
            console.log(data, 'data de login');
            localStorage.setItem('addUsuario', JSON.stringify(data));
            this.change.changeHandler$.emit(true);
            this.loginForm.reset();
            this.showSnackBar('Inicio de sesión exitoso');
            this.loading = false;
            this.router.navigate(['principal']);
            this.changeDetector.markForCheck();
          },
          error: (error) => {
            console.log(error, 'error de login');
            this.showSnackBar('Creedenciales incorrectas o usuario no activo');
            this.loading = false;
            this.changeDetector.markForCheck();
          }
        }
      );
        
    } else {
      this.showSnackBar('Campos incompletos');
      this.loading = false;
      this.changeDetector.markForCheck();
    }
  }

  
}
