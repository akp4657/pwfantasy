import { AfterViewInit, Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { GameService } from 'src/app/services/game.service';
import { ConstantsService } from 'src/app/services/constants.service';
import { WrestlerModalComponent } from 'src/app/modals/wrestler-modal/wrestler-modal.component';
import { EditTeamModalComponent } from 'src/app/modals/edit-team-modal/edit-team-modal.component';

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
  otherUser: Boolean = false;
  queryId: any;

  
  public now: Date = new Date();
  constructor(private resolver: ComponentFactoryResolver, gameService: GameService, private route: ActivatedRoute) {
    this.gameService = gameService;
  }

  ngOnInit(): void {
    this.id = ConstantsService.getID();
    this.otherUser = false;

    this.route.queryParams.subscribe(params => {
      if(params['user_id']) {
        this.otherUser = true;
        this.queryId = params['user_id']
      }
    })

    if(this.otherUser && (this.queryId !== this.id)) {
      this.setMyTeamTable(this.queryId)
  
      // Refresh table data
      setInterval(() => {
        this.setMyTeamTable(this.queryId);
      }, 60000);
    } else {
      this.otherUser = false;
      this.setMyTeamTable(this.id)

      // Refresh table data
      setInterval(() => {
        this.setMyTeamTable(this.id);
      }, 60000);
    }
    
  }

  setMyTeamTable(id: any) {
    this.gameService.getTeam(id).subscribe((res: any) => {
      this.teamName = res.data.Team_Name;
      this.dataSource = new MatTableDataSource(res.data.Team);
    })
  }

  openWrestlerModal(wrestler: any) {
    const modal = this.modalHolder.createComponent(WrestlerModalComponent)
    
    modal.instance.wrestler = wrestler;
    modal.instance.myTeam = true;
    modal.instance.id = this.id
    modal.instance.close.subscribe(res => {
      this.modalHolder.clear();
    });
  }

  openEditTeamModal() {
    if(this.otherUser) return;
    const modal = this.modalHolder.createComponent(EditTeamModalComponent);

    modal.instance.id = this.id;
    modal.instance.teamname = this.teamName;
    modal.instance.close.subscribe(res => {
      this.modalHolder.clear();
      window.location.reload();
    })
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit() {
  }
}