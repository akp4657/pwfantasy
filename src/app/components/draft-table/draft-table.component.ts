import { AfterViewInit, Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { GameService } from 'src/app/services/game.service';
import { ConstantsService } from 'src/app/services/constants.service';

@Component({
  selector: 'app-draft-table',
  templateUrl: './draft-table.component.html',
  styleUrls: ['./draft-table.component.scss']
})
export class DraftTableComponent implements AfterViewInit {
  today_date = new Date().toLocaleDateString();
  displayedColumns: string[] = ['work yesterday', 'to be done today', 'obstacles'];
  dataSource = new MatTableDataSource([]);

  selectedUserID: any = undefined;

  @ViewChild('modalHolder', { read: ViewContainerRef, static: false })
  modalHolder!: ViewContainerRef;
  userService: UserService;
  gameService: GameService;
  user: any = {
    Budget: 500
  }; // Initialize to 500 default
  wrestlers: any;
  id: any = null;

  
  public now: Date = new Date();
  constructor(private resolver: ComponentFactoryResolver, userService: UserService, gameService: GameService, private route: ActivatedRoute) {
    this.userService = userService;
    this.gameService = gameService;
  }

  async ngOnInit(): Promise<void> {
    this.id = ConstantsService.getID();
    this.userService.getUser(this.id).subscribe((data: any) => {
      this.user = data.data;
    })
    this.setWrestlersTable()
  }

  setWrestlersTable() {
    // this.userService.getUsers().subscribe((data: any) => {
    //   let user = data.users.filter((u: any) => u.Slack_ID == this.selectedUserID)[0]
    //   let task_strings = user.Task_String
    //   this.dataSource = new MatTableDataSource(task_strings);
    // });
    this.gameService.getWrestlers().subscribe((data: any) => {
      console.log(data)
      this.wrestlers = data.data
      console.log(this.wrestlers)
    })
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit() {
  }
}