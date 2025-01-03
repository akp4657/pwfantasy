import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConstantsService } from './constants.service';
import { NetworkService } from './network.service';

@Injectable({
    providedIn: 'root'
  })

export class GameService {
    api_url = '';

    constructor(private networkService: NetworkService) {
        this.api_url = ConstantsService.getApiUrl();
    }

    getWrestler(_id: string) {
        const url = `${this.api_url}/wrestler?wrestler=${_id}`;
        return this.networkService.httpGet(url);
    }

    getWrestlers() {
        const url = `${this.api_url}/wrestler/all`;
        return this.networkService.httpGet(url);
    }

    editUser(teamObj: any) {
        const body = {
            user: teamObj.user_id,
            team_name: teamObj.team_name
        }
        const url = `${this.api_url}/team`;
        return this.networkService.httpPut(url, body);
    }

    draftWrestler(wresObj: any) {
        const body = {
            user: wresObj.user_id,
            wrestler_id: wresObj.wrestler_id
        }
        const url = `${this.api_url}/team`;
        return this.networkService.httpPut(url, body);
    }

    getTeam(user_id: any) {
        const url = `${this.api_url}/team?user=${user_id}`;
        return this.networkService.httpGet(url);
    }

    getAllTeams() {
        const url = `${this.api_url}/team/all`;
        return this.networkService.httpGet(url);
    }
}