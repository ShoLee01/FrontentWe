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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  RegisterForm!: FormGroup;
  passwordType: string = 'password';
  passwordShown: boolean = false;
  passwordTypeConfirm: string = 'password';
  passwordShownConfirm: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public api: ApiService,
    private router: Router,
    private change: InterconnectionService,
    private sharedService: SharedService
  ) {
    // Formulario de registro
    this.RegisterForm = this.formBuilder.group({
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required]
    }, { validator: this.checkPasswords });
  }

  checkPasswords(group: FormGroup) {
    const password = group.controls['password'].value;
    const passwordConfirm = group.controls['passwordConfirm'].value;
    return password === passwordConfirm ? null : { passwordMismatch: true };
  }

  ngOnInit(): void {}

  togglePassword() {
    this.passwordShown = !this.passwordShown;
    this.passwordType = this.passwordShown ? 'text' : 'password';
  }

  togglePasswordConfirm() {
    this.passwordShownConfirm = !this.passwordShownConfirm;
    this.passwordTypeConfirm = this.passwordShownConfirm ? 'text' : 'password';
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
