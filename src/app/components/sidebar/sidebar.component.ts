import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ConstantsService } from 'src/app/services/constants.service';
import { UserService } from 'src/app/services/user.service';
import { LoginSignupModalComponent } from 'src/app/modals/login-signup-modal/login-signup-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit{
  id: any = null;
  loggedIn: boolean = false;

  userService: UserService;

  constructor(
    userService: UserService, 
    public router: Router,
    private dialog: MatDialog
  ) {
    this.userService = userService;
    this.id = ConstantsService.getID()
  }

  ngOnInit(): void {
    this.loggedIn = ConstantsService.loggedIn();
  }


  openLoginModal() {
    const dialogRef = this.dialog.open(LoginSignupModalComponent, {
      width: '400px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.success) {
        window.location.reload();
      }
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