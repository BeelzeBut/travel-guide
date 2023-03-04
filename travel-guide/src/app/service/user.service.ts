import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export interface UserDto {
  id: string,
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  userType: UserType
}

export enum UserType {
  Admin,
  Regular
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private toastr: ToastrService) { }
  // private apiUrl = 'https://travel-guide.azurewebsites.net/api/user/';
  private apiUrl = 'https://localhost:7244/api/user/';

  getAllUsers() {
    return this.http.get<UserDto[]>(this.apiUrl + 'getAllUsers');
  }

  getUser(userId: string) {
    return this.http.get<UserDto>(this.apiUrl + 'getUser/' + userId)
  }

  updateUser(user: UserDto, userId: string) {
    return this.http.put<boolean>(this.apiUrl + 'update/' + userId, user).subscribe(res => {
      if (res) {
        this.toastr.success('User updated successfully!');
      } else {
        this.toastr.error('User update failed.');
      }
    });
  }

  deleteUser(userId: string) {
    return this.http.delete(this.apiUrl + 'delete/' + userId);
  }
}
