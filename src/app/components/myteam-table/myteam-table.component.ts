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
  displayedColumns: string[] = ['name', 'promotion', 'division','total'];
  dataSource = new MatTableDataSource([]);

  selectedUserID: any = undefined;

  @ViewChild('modalHolder', { read: ViewContainerRef, static: false })
  modalHolder!: ViewContainerRef;
  gameService: GameService;
  user: any;
  id: any = null;
  teamName: any = "My Team"

  
  public now: Date = new Date();
  constructor(private resolver: ComponentFactoryResolver, gameService: GameService, private route: ActivatedRoute) {
    this.gameService = gameService;
  }

  ngOnInit(): void {
    this.id = ConstantsService.getID();
    this.setMyTeamTable(this.id)
  }

  setMyTeamTable(id: any) {
    this.gameService.getTeam(this.id).subscribe((res: any) => {
      this.teamName = res.data.Team_Name;
      this.dataSource = new MatTableDataSource(res.data.Team);
    })
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit() {
  }
}