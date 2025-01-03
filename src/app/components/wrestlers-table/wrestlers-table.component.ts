import { AfterViewInit, Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { GameService } from 'src/app/services/game.service';
import { ConstantsService } from 'src/app/services/constants.service';

@Component({
  selector: 'app-wrestlers-table',
  templateUrl: './wrestlers-table.component.html',
  styleUrls: ['./wrestlers-table.component.scss']
})
export class WrestlersTableComponent implements AfterViewInit {
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

    this.setWrestlersTable()
    // if(this.id) {
    //   this.setWrestlerTable(this.id)
    // }
  }

  setWrestlersTable() {
    // this.userService.getUsers().subscribe((data: any) => {
    //   let user = data.users.filter((u: any) => u.Slack_ID == this.selectedUserID)[0]
    //   let task_strings = user.Task_String
    //   this.dataSource = new MatTableDataSource(task_strings);
    // });
    this.gameService.getWrestlers().subscribe((data: any) => {
      console.log(data)
    })
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit() {
  }
}