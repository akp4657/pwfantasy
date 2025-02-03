import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConstantsService } from 'src/app/services/constants.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './login-signup-modal.component.html',
  styleUrls: ['./login-signup-modal.component.scss']
})
export class LoginSignupModalComponent implements OnInit {

  @Output() close = new EventEmitter<any>();
  IMG_X = ConstantsService.IMG_X;

  username: string = '';
  password: string = '';
  email: string = '';
  isSignup: boolean = false;
  title: string = 'Login'
  
  constructor(
    private userService: UserService
  ) { }

  async ngOnInit() {
  }

  toggleSignup() {
    this.isSignup = !this.isSignup;
    this.title = this.isSignup ? 'Sign Up' : 'Login'
  }

  login() {
    let userObj = {
      username: this.username,
      password: this.password,
    }

    this.userService.login(userObj).subscribe((data: any) => {
      console.log(data.User)
      this.saveToStorage(data.User._id) 
      this.closeModal(data)
    })
  }

  signup() {
    let userObj = {
      username: this.username,
      password: this.password,
    }

    this.userService.signup(userObj).subscribe((data: any) => {
      console.log(data.User)
      this.saveToStorage(data.User._id) 
      this.closeModal(data)
    })
  }

  closeModal(data: any) {
    this.close.emit(data);
  }

  saveToStorage(user_id: number) {
    ConstantsService.setUserID(user_id.toString());
  }

}
