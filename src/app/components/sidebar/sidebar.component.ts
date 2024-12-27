import { Component, OnInit, AfterViewInit, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ConstantsService } from 'src/app/services/constants.service';
import { UserService } from 'src/app/services/user.service';
import { EditUserModalComponent } from 'src/app/modals/submission-checklist-modal/edit-user-modal.component';

interface SidebarItem {
  name: string;
  url: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit{

  // Default Items which will show 'Loading...'
  sidebarItems: SidebarItem[] = [{
    name: 'Loading...',
    url: ''
  }];
  userService: UserService;
  @ViewChild('modalHolder', { read: ViewContainerRef, static: false })
  modalHolder!: ViewContainerRef;

  constructor(userService: UserService, public router: Router) {
    this.userService = userService;
  }

  ngOnInit(): void {
    // Fetch all users
    // this.userService.getUsers().subscribe(async (data: any) => {
    //   this.sidebarItems = data.users.map((obj: any) => ({
    //     name: `${obj.First_Name} ${obj.Last_Name}`,
    //     url: '/user/' + obj.Slack_ID
    //   }));
    // });
  }

  // Move to a specific user's page
  login() {
    // Redirect to the backend's Google Auth endpoint
    window.location.href = 'http://localhost:3000/auth/google';
  }

  openLoginModal() {
    const modal = this.modalHolder.createComponent(EditUserModalComponent)

    modal.instance.close.subscribe(res => {
      this.modalHolder.clear();
      if(res.success) window.location.reload();
      //window.location.reload();
    });
  }
}