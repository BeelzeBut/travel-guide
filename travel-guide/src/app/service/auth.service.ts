import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { catchError, mergeMap, of, throwError } from 'rxjs';
import { UserDto, UserType } from './user.service';

export interface LoginResponseDto {
  userId: string,
  token: string,
  expiration: number,
  firstName: string,
  lastName: string,
  userType: UserType
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }
  private apiUrl = 'https://localhost:7244/api/authentication/';

  login(username: string, password: string) {
    return this.http.post<LoginResponseDto>(this.apiUrl + 'login', {
      username,
      password
    }, { observe: 'response' })
      .pipe(
        catchError(err => {
          this.toastr.error('Login failed!');
          this.router.navigate(['/login'], { onSameUrlNavigation: 'reload' });

          return throwError(err)
        })
      )
      .subscribe(res => {
        this.setSession(res.body!);
        this.toastr.success('Logged in successfully!');

        if (res.body?.userType === UserType.Admin)
          this.router.navigate(['/users']);
        else
          this.router.navigate(['/']);
      });
  }

  register(user: UserDto) {
    return this.http.post(this.apiUrl + 'register', {
      ...user,
      userType: UserType.Regular
    }, { observe: 'response' })
      .pipe(
        catchError(err => {
          this.toastr.error('Registration failed!');
          this.router.navigate(['register'], { onSameUrlNavigation: 'reload' })

          return throwError(err)
        })
      )
      .subscribe((res) => {
        this.toastr.success('Registered successfully!');
        this.router.navigate(['login']);
      });
  }

  private setSession(authResult: LoginResponseDto) {
    const expiresAt = new Date(authResult.expiration);

    localStorage.setItem('token', authResult.token);
    localStorage.setItem("expiration", JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem("expiration");
    if (expiration === null) {
      return null;
    }

    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}
