import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConstantsService } from 'src/app/services/constants.service';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-edit-team-modal',
  templateUrl: './edit-team-modal.component.html',
  styleUrls: ['./edit-team-modal.component.scss']
})
export class EditTeamModalComponent implements OnInit {

  @Output() close = new EventEmitter<any>();
  IMG_X = ConstantsService.IMG_X;

  teamname: string = '';
  id: any;
  
  constructor(
    private gameService: GameService,
  ) { }

  async ngOnInit() {
  }

  editTeamName() {
    let teamObj = {
      user_id: this.id,
      team_name: this.teamname,
    }
    this.gameService.editTeam(teamObj).subscribe((res: any) => {
      if(res.success) {
        this.closeModal(true);
      }
    })
  }

  closeModal(data: any) {
    this.close.emit(data);
  }

  saveToStorage(user_id: number) {
    ConstantsService.setUserID(user_id.toString());
  }

}
