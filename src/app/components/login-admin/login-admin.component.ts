import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { InterconnectionService } from 'src/app/service/interconnection.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from 'src/app/service/shared.service';
import { ApiAdminService } from 'src/app/service/api-admin.service';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent implements OnInit {
  loginForm!: FormGroup;
  passwordType: string = 'password';
  passwordShown: boolean = false;
  loading: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    public api: ApiAdminService,
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
    this.change.changeHandlerLogin$.emit(true);
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

  univeristy() {
    this.router.navigate(['login']);
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
            this.change.changeHandlerAdmin$.emit(true);
            this.loginForm.reset();
            this.router.navigate(['principal-admin']);
            this.showSnackBar('Inicio de sesión exitoso');
            this.loading = false;
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
