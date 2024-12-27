import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConstantsService } from 'src/app/services/constants.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss']
})
export class EditUserModalComponent implements OnInit {

  @Output() close = new EventEmitter<any>();
  IMG_X = ConstantsService.IMG_X;

  username: string = '';
  password: string = '';
  email: string = '';
  isSignup: boolean = false;
  
  constructor(
    private userService: UserService
  ) { }

  async ngOnInit() {
  }

  toggleSignup() {
    this.isSignup = !this.isSignup;
  }

  loginSignup() {
    let userObj = {
      username: this.username,
      password: this.password,
      email: this.email,
      login: 1
    }

    this.userService.loginSignup(userObj).subscribe((data: any) => {
      this.closeModal(data)
    })
  }

  closeModal(data: any) {
    this.close.emit(data);
  }

}
