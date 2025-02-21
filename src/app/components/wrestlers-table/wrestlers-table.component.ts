import { AfterViewInit, Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { GameService } from 'src/app/services/game.service';
import { ConstantsService } from 'src/app/services/constants.service';
import { WrestlerModalComponent } from 'src/app/modals/wrestler-modal/wrestler-modal.component';

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

    // Refresh table data
    setInterval(() => {
      this.setWrestlersTable();
    }, 60000);
  }

  setWrestlersTable() {
    this.gameService.getWrestlers().subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(res.data);
    })
  }

  openWrestlerModal(wrestler: any) {
    const modal = this.modalHolder.createComponent(WrestlerModalComponent)
    
    modal.instance.wrestler = wrestler;
    modal.instance.close.subscribe(res => {
      this.modalHolder.clear();
    });
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit() {
  }
}