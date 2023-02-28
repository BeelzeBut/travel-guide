import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface UserDto {
  id: string,
  firstName: string,
  lastName: string,
  username: string,
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

  constructor(private http: HttpClient) { }
  private apiUrl = 'https://localhost:7244/api/user/';

  getAllUsers() {
    return this.http.get<UserDto[]>(this.apiUrl + 'getAllUsers');
  }

  getUser(userId: string) {
    return this.http.get(this.apiUrl + 'getUser/' + userId)
  }

  updateUser(user: UserDto, userId: string) {
    return this.http.put(this.apiUrl + 'update/' + userId, user);
  }

  deleteUser(userId: string) {
    return this.http.get(this.apiUrl + 'delete/' + userId);
  }
}
