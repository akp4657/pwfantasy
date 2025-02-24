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
  displayedColumns: string[] = ['name', 'promotion','cost', 'division', 'total', 'draft'];
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
    this.gameService.getWrestlers().subscribe((res: any) => {
      console.log(res.data)
      let fullWrestlers = res.data.sort((a: any, b: any) => b.Cost - a.Cost)

      this.gameService.getTeam(this.id).subscribe((team_res: any) => {
        let myTeam = team_res.data.Team;

        this.wrestlers = fullWrestlers.map((wrestler: any) => ({
          ...wrestler,
          Drafted: myTeam.some((draftedWrestler: any) => draftedWrestler._id === wrestler._id),
        }));

        this.dataSource = new MatTableDataSource(this.wrestlers);
      })
    })
  }

  draftWrestler(wrestler: any) {
    let userObj = {
      user_id: this.id,
      wrestler_id: wrestler._id
    }

    this.gameService.draftWrestler(userObj).subscribe((res: any) => {
      if(res.success) {
        //console.log(res)
        window.location.reload();
      }
    })
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit() {
  }
}