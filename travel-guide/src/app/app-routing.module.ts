import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserlistingComponent } from './components/userlisting/userlisting.component';
import { AdminGuard } from './guard/admin.guard';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  { component: LoginComponent, path: 'login' },
  { component: RegisterComponent, path: 'register' },
  { component: UserlistingComponent, path: 'users', canActivate: [AuthGuard, AdminGuard] },
  { component: HomeComponent, path: '', canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
