import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConstantsService } from './constants.service';
import { NetworkService } from './network.service';

@Injectable({
    providedIn: 'root'
})

export class LeagueService {
    api_url = '';

    constructor(private networkService: NetworkService) {
        this.api_url = ConstantsService.getApiUrl();
    }

    createLeague(leagueObj: any) {
        const body = {
            name: leagueObj.name,
            description: leagueObj.description,
            poolType: leagueObj.poolType,
            maxMembers: leagueObj.maxMembers,
            draftDay: leagueObj.draftDay,
            seasonStart: leagueObj.seasonStart,
            seasonEnd: leagueObj.seasonEnd,
            leagueType: leagueObj.leagueType,
            ownerId: ConstantsService.getID()
        };
        const url = `${this.api_url}/league`;
        return this.networkService.httpPost(url, body);
    }

    getPublicLeagues() {
        const url = `${this.api_url}/league/public`;
        return this.networkService.httpGet(url);
    }

    getUserLeagues() {
        const userId = ConstantsService.getID();
        const url = `${this.api_url}/league/user?userId=${userId}`;
        return this.networkService.httpGet(url);
    }

    getLeague(leagueId: string) {
        const url = `${this.api_url}/league/${leagueId}`;
        return this.networkService.httpGet(url);
    }

    joinLeague(leagueId: string, joinObj: any) {
        const body = {
            teamName: joinObj.teamName,
            inviteCode: joinObj.inviteCode,
            userId: ConstantsService.getID()
        };
        const url = `${this.api_url}/league/${leagueId}/join`;
        return this.networkService.httpPost(url, body);
    }

    leaveLeague(leagueId: string) {
        const body = {
            userId: ConstantsService.getID()
        };
        const url = `${this.api_url}/league/${leagueId}/leave`;
        return this.networkService.httpDelete(url, body);
    }

    startDraft(leagueId: string) {
        const body = {
            userId: ConstantsService.getID()
        };
        const url = `${this.api_url}/league/${leagueId}/draft/start`;
        return this.networkService.httpPost(url, body);
    }

    makeDraftPick(leagueId: string, pickObj: any) {
        const body = {
            wrestlerId: pickObj.wrestlerId,
            userId: ConstantsService.getID()
        };
        const url = `${this.api_url}/league/${leagueId}/draft/pick`;
        return this.networkService.httpPost(url, body);
    }

    getDraftStatus(leagueId: string) {
        const url = `${this.api_url}/league/${leagueId}/draft/status`;
        return this.networkService.httpGet(url);
    }

    updateLeague(leagueId: string, updateObj: any) {
        const body = {
            ...updateObj,
            userId: ConstantsService.getID()
        };
        const url = `${this.api_url}/league/${leagueId}`;
        return this.networkService.httpPut(url, body);
    }

    deleteLeague(leagueId: string) {
        const body = {
            userId: ConstantsService.getID()
        };
        const url = `${this.api_url}/league/${leagueId}`;
        return this.networkService.httpDelete(url, body);
    }
}
