import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { WrestlersComponent } from './pages/wrestlers/wrestlers.component';
import { MyTeamComponent } from './pages/myteam/myteam.component';
import { DraftComponent } from './pages/draft/draft.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent},
  { path: 'leaderboard', component: HomeComponent},
  { path: 'wrestlers', component: WrestlersComponent},
  { path: 'myTeam', component: MyTeamComponent},
  { path: 'draft', component: DraftComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }