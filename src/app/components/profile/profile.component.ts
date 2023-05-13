import { Component, OnInit, ChangeDetectorRef, ViewChild  } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { InterconnectionService } from 'src/app/service/interconnection.service';
import { ApiService } from 'src/app/service/api.service';
import { SharedService } from 'src/app/service/shared.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  ProfileForm!: FormGroup;
  countries = ["Argentina", "Bolivia", "Brasil", "Chile", "Colombia", "Costa Rica", "Cuba", "Ecuador", "El Salvador", "Guatemala", "Honduras", "México", "Nicaragua", "Panamá", "Paraguay", "Perú", "Puerto Rico", "República Dominicana", "Uruguay", "Venezuela"]
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
  password: string = '';
  passwordConfirm: string = '';
  passwordSame: boolean = false;
  user: any;


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
    this.ProfileForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      passwordConfirm: [''],
      name: ['', Validators.required],
      background_image: [''],
      logo: [''],
      latin_american_ranking: [0],
      national_level_ranking: [0],
      global_ranking: [0],
      country: ['', Validators.required],
      city: ['', Validators.required],
    }, { validator: this.checkPasswords });

    this.getInformation();
    console.log(this.passwordSame);
  }
  ngOnInit(): void {
    this.change.changeHandler$.emit(true);
  }



  togglePassword() {
    this.passwordShown = !this.passwordShown;
    this.passwordType = this.passwordShown ? 'text' : 'password';
  }

  togglePasswordConfirm() {
    this.passwordShownConfirm = !this.passwordShownConfirm;
    this.passwordTypeConfirm = this.passwordShownConfirm ? 'text' : 'password';
  }

  checkPasswords(group: FormGroup) {
    const password = group.controls['password'].value;
    const passwordConfirm = group.controls['passwordConfirm'].value;
    return password === passwordConfirm ? null : { passwordMismatch: true };
  }

  getInformation() {
      this.api.getProfile().subscribe({
        next: (result: any) => {
          this.user = result;
          this.ProfileForm.patchValue(result);
          this.changeDetector.detectChanges();
        },
        error: (error: any) => {
          console.log(error);
        }
      });
    }


  onFileChange(event: any, type: 'background' | 'logo') {
    if (event.target.files.length > 0) {
      if (type === 'background') {
        this.backgroundName = event.target.files[0].name;
        this.backgroundFile = event.target.files[0];
        let data = new FormData();
        data.append('background_image', this.backgroundFile as Blob);
        this.api.updateProfile(data).subscribe({
          next: (result: any) => {
            this.getInformation();
            this.showSnackBar('Imagen de fondo actualizada correctamente');
          },
          error: (error: any) => {
            this.showSnackBar('Error al actualizar la imagen de fondo');
            console.log(error);
          }
        });
      } else if (type === 'logo') {
        this.logoName = event.target.files[0].name;
        this.logoFile = event.target.files[0];
        const logo = new FormData();
        logo.append('logo', this.logoFile as Blob);
        this.api.updateProfile(logo).subscribe({
          next: (result: any) => {
            this.getInformation();
            this.showSnackBar('Logo actualizado correctamente');
          },
          error: (error: any) => {
            this.showSnackBar('Error al actualizar el logo');
            console.log({ logo: this.logoFile });
            console.log(this.logoFile);
            console.log(error);
          }
        });
      }
    }
  }

  showSnackBar(word: string): void {
    this.snackBar.open(word, 'Cerrar', {
      duration: 3000,
    });
  }
  
  save(){
    let data = this.ProfileForm.value;
    delete data.logo;
    delete data.background_image;
    delete data.passwordConfirm;
    delete data.password;

    this.api.registeredAccount({password: this.ProfileForm.value.email}).subscribe({
      next: (result: any) => {
        if(result.university || this.ProfileForm.value.email == this.user.email){
          this.api.updateProfile(data).subscribe({
            next: (result: any) => {
              this.showSnackBar('Perfil actualizado correctamente');
            },
            error: (error: any) => {
              console.log(error);
            }
          });
        }else{
          this.showSnackBar('email en uso');
        }
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  samePassword(){
    if(this.password != '' && this.passwordConfirm != '' && this.password === this.passwordConfirm)
    {
      this.passwordSame = true;
    }
    else{
      this.passwordSame = false;
    }
  }


  changePassword(){
    this.api.updateProfile({password: this.ProfileForm.value.password}).subscribe({
      next: (result: any) => {
        this.ProfileForm.patchValue({password: ''});
        this.ProfileForm.patchValue({passwordConfirm: ''});
        this.snackBar.open('Contraseña actualizada correctamente', 'Cerrar', {
          duration: 2000,
        });
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }
}
