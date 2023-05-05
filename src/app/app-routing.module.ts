import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginAdminComponent } from './components/login-admin/login-admin.component';
import { PrincipalAdminComponent } from './components/principal-admin/principal-admin.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'register' , component: RegisterComponent },
  { path: 'principal' , component: DashboardComponent },
  { path: 'profile' , component: ProfileComponent },
  { path: 'login-admin' , component: LoginAdminComponent },
  { path: 'principal-admin' , component: PrincipalAdminComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
