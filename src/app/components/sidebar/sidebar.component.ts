import { Component, OnInit, AfterViewInit, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ConstantsService } from 'src/app/services/constants.service';
import { UserService } from 'src/app/services/user.service';
import { LoginSignupModalComponent } from 'src/app/modals/login-signup-modal/login-signup-modal.component';



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit{
  id: any = null;
  loggedIn: boolean = false;

  userService: UserService;
  @ViewChild('modalHolder', { read: ViewContainerRef, static: false })
  modalHolder!: ViewContainerRef;

  constructor(userService: UserService, public router: Router) {
    this.userService = userService;
    this.id = ConstantsService.getID()
  }

  ngOnInit(): void {
    this.loggedIn = ConstantsService.loggedIn();
    console.log(this.loggedIn)
    console.log(this.id)
  }


  openLoginModal() {
    const modal = this.modalHolder.createComponent(LoginSignupModalComponent)

    modal.instance.close.subscribe(res => {
      if(res.success) window.location.reload();
      this.modalHolder.clear();
    });
  }

  logout() {
    ConstantsService.logout();
    window.location.reload();
  }

  // Move to a specific page
  navigateToPage(url: string) {
    this.router.navigate([url]);
  }
}