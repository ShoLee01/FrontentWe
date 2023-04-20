import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  passwordType: string = 'password';
  passwordShown: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public api: ApiService,
    private router: Router,
    private change: InterconnectionService,
    private sharedService: SharedService
  ) {
    // Formulario de registro
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  togglePassword() {
    this.passwordShown = !this.passwordShown;
    this.passwordType = this.passwordShown ? 'text' : 'password';
  }

  signIn() {
    this.router.navigate(['/principal']);
/*     let token: {};
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      let data = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      };
      this.api.login(this.loginForm.value).subscribe(
        (res: any) => { 
          console.log(res);
          this.api
        .login(data)
        .subscribe(
          (data: any) => {
            token = {...res, ...data};
            localStorage.setItem('addUsuario', JSON.stringify(token));
            this.change.changeHandler$.emit(true);
            this.loginForm.reset();
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
    } */
  }
}
