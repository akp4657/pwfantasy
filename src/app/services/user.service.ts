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

    login(userObj: any) {
      const body = {
        username: userObj.username,
        password: userObj.password,
      };
      const url = `${this.api_url}/login`;
      return this.networkService.httpPost(url, body);
    }

    getUser(userID: any) {
      const url = `${this.api_url}/user?user_id=${userID}`;
      return this.networkService.httpGet(url);
    }

    signup(userObj: any) {
      const body = {
        username: userObj.username,
        password: userObj.password,
      };
      const url = `${this.api_url}/signup`;
      return this.networkService.httpPost(url, body);
    }
  }