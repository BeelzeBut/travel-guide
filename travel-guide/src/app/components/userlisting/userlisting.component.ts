import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserDto, UserService, UserType } from 'src/app/service/user.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateDialogComponent } from '../update-dialog/update-dialog.component';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-userlisting',
  templateUrl: './userlisting.component.html',
  styleUrls: ['./userlisting.component.scss']
})
export class UserlistingComponent implements OnInit {
  displayedColumns: string[] = ['username', 'firstName', 'lastName', 'email', 'userType', 'edit'];
  usersList: UserDto[] = [];
  dataSource = new MatTableDataSource<UserDto>(this.usersList);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private userService: UserService, private dialog: MatDialog, private authService: AuthService) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(res => {
      this.usersList = res;
      this.dataSource = new MatTableDataSource(this.usersList);
      this.dataSource.paginator = this.paginator;
    })
  }

  updateUser(userId: string) {
    const dialog = this.dialog.open(UpdateDialogComponent, {
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
      data: {
        userId: userId
      }
    });

    dialog.afterClosed().subscribe(res => {
      this.loadUsers();
    })
  }

  deleteUser(userId: string) {
    this.userService.deleteUser(userId).subscribe(res => {
      this.loadUsers();
    })
  }

  isNotLoggedInUser(userId: string) {
    return this.authService.getUserId() !== userId;
  }

}
