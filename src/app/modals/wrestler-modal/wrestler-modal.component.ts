import { Component, ComponentFactoryResolver, EventEmitter, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConstantsService } from 'src/app/services/constants.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './wrestler-modal.component.html',
  styleUrls: ['./wrestler-modal.component.scss']
})
export class WrestlerModalComponent implements OnInit {

  @Output() close = new EventEmitter<any>();
  IMG_X = ConstantsService.IMG_X;

  wrestler: any;
  
  constructor(
    private userService: UserService
  ) { }

  async ngOnInit() {
    console.log(this.wrestler)
  }


  closeModal(data: any) {
    console.log('Closed')
    this.close.emit(data);
  }

  saveToStorage(user_id: number) {
    ConstantsService.setUserID(user_id.toString());
  }

}
