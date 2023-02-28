import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private builder: FormBuilder, private authService: AuthService, private toastr: ToastrService, private router: Router) {

  }

  loginForm = this.builder.group({
    username: this.builder.control('',
      Validators.required,
    ),
    password: this.builder.control('',
      Validators.required,
    ),
  });

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.loginForm.reset();
      }
    });
  }

  proceedLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.get('username')!.value!, this.loginForm.get('password')!.value!)
    } else {
      this.toastr.warning('Please enter valid data!')
    }
  }
}
