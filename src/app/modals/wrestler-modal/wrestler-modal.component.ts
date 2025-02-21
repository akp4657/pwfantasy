import { Component, ComponentFactoryResolver, EventEmitter, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConstantsService } from 'src/app/services/constants.service';
import { UserService } from 'src/app/services/user.service';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './wrestler-modal.component.html',
  styleUrls: ['./wrestler-modal.component.scss']
})
export class WrestlerModalComponent implements OnInit {

  @Output() close = new EventEmitter<any>();
  IMG_X = ConstantsService.IMG_X;

  wrestler: any;
  myTeam: boolean = false;
  id: any;
  gameService: GameService;
  
  constructor(
    private userService: UserService,
    gameService: GameService
  ) {
    this.gameService = gameService;
   }

  async ngOnInit() {
    //console.log(this.wrestler)
  }


  closeModal(data: any) {
    this.close.emit(data);
  }

  saveToStorage(user_id: number) {
    ConstantsService.setUserID(user_id.toString());
  }
  dropWrestler(wrestler: any) {
    let userObj = {
      user_id: this.id,
      wrestler_id: wrestler._id
    }

    this.gameService.dropWrestler(userObj).subscribe((res: any) => {
      if(res.success) {
        //console.log(res)
        window.location.reload();
      }
    })
  }

}
