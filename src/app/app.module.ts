import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
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
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatListModule } from '@angular/material/list'; 
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatSortModule } from '@angular/material/sort';


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
    LoginSignupModalComponent
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
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }