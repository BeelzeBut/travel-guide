import { HttpStatusCode } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  constructor(private builder: FormBuilder, private toastr: ToastrService, private authService: AuthService, private router: Router) {

  }

  registerForm = this.builder.group({
    firstName: this.builder.control('', Validators.required),
    lastName: this.builder.control('', Validators.required),
    username: this.builder.control('', Validators.required),
    password: this.builder.control('', Validators.compose([
      Validators.required,
      Validators.minLength(6),
    ])),
    confirmPassword: this.builder.control('', Validators.required),
  },
    {
      validators: this.passwordValidator.bind(this)
    });

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.registerForm.reset();
      }
    });
  }

  passwordValidator(formGroup: FormGroup) {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');
    return password?.value === confirmPassword?.value ? null : { passwordNotMatch: true };
  }

  proceedRegistration() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value);
    } else {
      this.toastr.warning('Please enter valid data!')
    }
  }
}
