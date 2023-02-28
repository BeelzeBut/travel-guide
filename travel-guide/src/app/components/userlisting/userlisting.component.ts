import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserDto, UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-userlisting',
  templateUrl: './userlisting.component.html',
  styleUrls: ['./userlisting.component.scss']
})
export class UserlistingComponent implements OnInit {
  displayedColumns: string[] = ['username', 'firstName', 'lastName', 'email', 'userType'];
  usersList: UserDto[] = [];
  dataSource = new MatTableDataSource<UserDto>(this.usersList);

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(res => {
      this.usersList = res;
      this.dataSource = new MatTableDataSource(this.usersList);
    })
  }


}
