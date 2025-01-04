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
  displayedColumns: string[] = ['name', 'promotion', 'division','total'];
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
    this.gameService.getWrestlers().subscribe((res: any) => {
      console.log(res)
      this.dataSource = new MatTableDataSource(res.data);
    })
  }

  openWrestlerModal(wrestler: any) {
    console.log(wrestler)
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit() {
  }
}