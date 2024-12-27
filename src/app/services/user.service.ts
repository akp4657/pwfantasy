import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConstantsService } from './constants.service';
import { NetworkService } from './network.service';

@Injectable({
    providedIn: 'root'
  })

  export class UserService {
    api_url = '';
  
    constructor(private networkService: NetworkService) {
      this.api_url = ConstantsService.getApiUrl();
    }
  
    getUsers() {
      return this.networkService.httpGet(this.api_url + '/getUsers');
    }

    loginSignup(userObj: any) {
      const body = {
        username: userObj.username,
        password: userObj.password,
        email: userObj.email,
        login: userObj.login
      };
      const url = `${this.api_url}/login`;
      return this.networkService.httpPost(url, body);
    }

    getGoogleLogin() {
      const url = `${this.api_url}/authenticate/google`
      return this.networkService.httpGet(url)
    }
  }