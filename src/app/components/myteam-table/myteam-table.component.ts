import { AfterViewInit, Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { GameService } from 'src/app/services/game.service';
import { ConstantsService } from 'src/app/services/constants.service';

@Component({
  selector: 'app-myteam-table',
  templateUrl: './myteam-table.component.html',
  styleUrls: ['./myteam-table.component.scss']
})
export class MyTeamTableComponent implements AfterViewInit {
  today_date = new Date().toLocaleDateString();
  displayedColumns: string[] = ['work yesterday', 'to be done today', 'obstacles'];
  dataSource = new MatTableDataSource([]);

  selectedUserID: any = undefined;

  @ViewChild('modalHolder', { read: ViewContainerRef, static: false })
  modalHolder!: ViewContainerRef;
  gameService: GameService;
  user: any;
  id: any = null;

  
  public now: Date = new Date();
  constructor(private resolver: ComponentFactoryResolver, gameService: GameService, private route: ActivatedRoute) {
    this.gameService = gameService;
  }

  ngOnInit(): void {
    this.id = ConstantsService.getID();

    if(this.id) {
      this.setMyTeamTable(this.id)
    }
  }

  setMyTeamTable(id: any) {
    // this.userService.getUsers().subscribe((data: any) => {
    //   let user = data.users.filter((u: any) => u.Slack_ID == this.selectedUserID)[0]
    //   let task_strings = user.Task_String
    //   this.dataSource = new MatTableDataSource(task_strings);
    // });

    this.gameService.getTeam(this.id).subscribe((data: any) => {
      console.log(data)
    })
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit() {
  }
}