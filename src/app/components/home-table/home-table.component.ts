import { AfterViewInit, Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { GameService } from 'src/app/services/game.service';
import { MatSort } from '@angular/material/sort';
import { ConstantsService } from 'src/app/services/constants.service';

@Component({
  selector: 'app-home-table',
  templateUrl: './home-table.component.html',
  styleUrls: ['./home-table.component.scss']
})
export class HomeTableComponent implements AfterViewInit {
  today_date = new Date().toLocaleDateString();
  displayedColumns: string[] = ['owner', 'teamName','total'];
  dataSource = new MatTableDataSource([]);

  selectedUserID: any = undefined;

  @ViewChild('modalHolder', { read: ViewContainerRef, static: false }) modalHolder!: ViewContainerRef;
  gameService: GameService;
  user: any;
  id: any = null;

  
  public now: Date = new Date();
  constructor(private resolver: ComponentFactoryResolver, gameService: GameService, private route: ActivatedRoute) {
    this.gameService = gameService;
  }

  ngOnInit(): void {
    this.setLeaderboard()
  }

  setLeaderboard() {
    this.gameService.getAllTeams().subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(res.data);
    })
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit() {
  }
}