import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { UserDto, UserService, UserType } from 'src/app/service/user.service';

@Component({
  selector: 'app-update-dialog',
  templateUrl: './update-dialog.component.html',
  styleUrls: ['./update-dialog.component.scss']
})
export class UpdateDialogComponent implements OnInit {
  constructor(private builder: FormBuilder, private toastr: ToastrService,
    private userService: UserService, private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialogRef<UpdateDialogComponent>) { }

  userTypes = [UserType.Admin, UserType.Regular];

  ngOnInit(): void {
    this.userService.getUser(this.data.userId).subscribe(res => {
      this.updateForm.setValue({
        firstName: res.firstName,
        lastName: res.lastName,
        userType: res.userType,
        password: '',
        confirmPassword: ''
      })
    });
  }

  updateForm = this.builder.group({
    firstName: this.builder.control('', Validators.required),
    lastName: this.builder.control('', Validators.required),
    userType: this.builder.control<UserType>(UserType.Regular),
    password: this.builder.control('', Validators.minLength(6)),
    confirmPassword: this.builder.control(''),
  },
    {
      validators: this.passwordValidator.bind(this)
    });

  passwordValidator(formGroup: FormGroup) {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');
    return password?.value === confirmPassword?.value ? null : { passwordNotMatch: true };
  }

  updateUser() {
    if (this.updateForm.valid) {
      this.userService.updateUser(this.updateForm.value, this.data.userId);
      this.dialog.close();
    } else {
      this.toastr.warning('Please enter valid data!')
    }
  }

  getOptionLabel(option: UserType) {
    switch (option) {
      case UserType.Admin:
        return "Admin";
      case UserType.Regular:
        return "Regular";
      default:
        throw new Error("Unsupported option");
    }
  }
}
