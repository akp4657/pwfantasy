import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { DraftComponent } from './pages/draft/draft.component';
import { MyTeamComponent } from './pages/myteam/myteam.component';
import { WrestlersComponent } from './pages/wrestlers/wrestlers.component';
import { FormsModule } from '@angular/forms';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
//import { LoginComponent } from './pages/login/login.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { WrestlersTableComponent } from './components/wrestlers-table/wrestlers-table.component';
import { DraftTableComponent } from './components/draft-table/draft-table.component';
import { MyTeamTableComponent } from './components/myteam-table/myteam-table.component';
import { HomeTableComponent } from  './components/home-table/home-table.component'
import { HttpClientModule } from '@angular/common/http';
import { LoginSignupModalComponent } from './modals/login-signup-modal/login-signup-modal.component';
import { EditTeamModalComponent } from './modals/edit-team-modal/edit-team-modal.component';
import { WrestlerModalComponent } from './modals/wrestler-modal/wrestler-modal.component';
import { LeagueModalComponent } from './modals/league-modal/league-modal.component';
import { LeaguesComponent } from './pages/leagues/leagues.component';
import { LeagueDetailComponent } from './pages/league-detail/league-detail.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatListModule } from '@angular/material/list'; 
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MyTeamComponent,
    DraftComponent,
    WrestlersComponent,
    //LoginComponent,
    TopbarComponent,
    SidebarComponent,
    WrestlersTableComponent,
    DraftTableComponent,
    MyTeamTableComponent,
    HomeTableComponent,
    LoginSignupModalComponent,
    EditTeamModalComponent,
    WrestlerModalComponent,
    WelcomeComponent,
    LeaguesComponent,
    LeagueDetailComponent,
    LeagueModalComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatTableModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatSortModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    FontAwesomeModule,
    MatDialogModule,
    MatCardModule,
    MatTabsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }