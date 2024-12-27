import { AfterViewInit, Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.scss']
})
export class ReportTableComponent implements AfterViewInit {
  today_date = new Date().toLocaleDateString();
  displayedColumns: string[] = ['work yesterday', 'to be done today', 'obstacles'];
  dataSource = new MatTableDataSource([]);

  selectedUserID: any = undefined;

  @ViewChild('modalHolder', { read: ViewContainerRef, static: false })
  modalHolder!: ViewContainerRef;
  userService: UserService;
  user: any;
  
  public now: Date = new Date();
  constructor(private resolver: ComponentFactoryResolver, userService: UserService, private route: ActivatedRoute) {
    this.userService = userService;
  }

  ngOnInit(): void {
    const userParam = this.route.snapshot.queryParamMap.get('user');
    if (userParam) {
      this.user = JSON.parse(decodeURIComponent(userParam));
    }
    // this.route.params.subscribe(params => {
    //   this.selectedUserID = params['id'];
    //   if(this.selectedUserID) this.setUserTable()
    // })
  }

  setUserTable() {
    this.userService.getUsers().subscribe((data: any) => {
      let user = data.users.filter((u: any) => u.Slack_ID == this.selectedUserID)[0]
      let task_strings = user.Task_String
      this.dataSource = new MatTableDataSource(task_strings);
    });
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit() {
  }
}