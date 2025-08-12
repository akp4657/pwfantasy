import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LeagueService } from '../../services/league.service';
import { ConstantsService } from 'src/app/services/constants.service';

@Component({
  selector: 'app-league-detail',
  templateUrl: './league-detail.component.html',
  styleUrls: ['./league-detail.component.scss']
})
export class LeagueDetailComponent implements OnInit {
  league: any = null;
  loading = false;
  error = '';
  activeTab = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private leagueService: LeagueService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const leagueId = params['id'];
      if (leagueId) {
        this.loadLeague(leagueId);
      }
    });
  }

  loadLeague(leagueId: string) {
    this.loading = true;
    this.error = '';

    this.leagueService.getLeague(leagueId).subscribe({
      next: (league: any) => {
        this.league = league;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load league';
        this.loading = false;
      }
    });
  }

  startDraft() {
    if (confirm('Are you sure you want to start the draft? This action cannot be undone.')) {
      this.leagueService.startDraft(this.league._id).subscribe({
        next: (response: any) => {
          alert('Draft started successfully!');
          this.loadLeague(this.league._id);
        },
        error: (error: any) => {
          alert(error.error?.error || 'Failed to start draft');
        }
      });
    }
  }

  makeDraftPick(wrestlerId: string) {
    this.leagueService.makeDraftPick(this.league._id, { wrestlerId }).subscribe({
      next: (response: any) => {
        this.loadLeague(this.league._id);
      },
      error: (error: any) => {
        alert(error.error?.error || 'Failed to make draft pick');
      }
    });
  }

  getCurrentDrafter(): any {
    if (!this.league?.Draft?.order || this.league.Draft.status !== 'active') {
      return null;
    }
    const currentIndex = this.league.Draft.current_pick;
    const currentUserId = this.league.Draft.order[currentIndex];
    return this.league.League_Members.find((member: any) => 
      member.user._id === currentUserId
    );
  }

  isUserTurn(): boolean {
    // This would need to be implemented based on your user authentication system
    return false; // Placeholder
  }

  getDraftProgress(): number {
    if (!this.league?.Draft?.picks) return 0;
    const totalPicks = this.league.League_Members.length * 15; // Assuming 15 wrestlers per team
    return (this.league.Draft.picks.length / totalPicks) * 100;
  }

  getAvailableWrestlers(): any[] {
    if (!this.league?.Pool) return [];
    return this.league.Pool.filter((wrestler: any) => {
      return !this.league.Draft.picks.some((pick: any) => 
        pick.wrestler._id === wrestler._id
      );
    });
  }

  getTeamWrestlers(userId: string): any[] {
    if (!this.league?.Draft?.picks) return [];
    return this.league.Draft.picks
      .filter((pick: any) => pick.user === userId)
      .map((pick: any) => pick.wrestler)
      .sort((a: any, b: any) => a.Name.localeCompare(b.Name));
  }

  getTeamScore(userId: string): number {
    // TODO: Implement this with the specific team from this league
    return Math.floor(Math.random() * 1000);
  }

  isOwner(): boolean {
    // Just check between the owner id and the user id
    return this.league.Owner._id === ConstantsService.getID();
  }

  canStartDraft(): boolean {
    return this.isOwner() && 
           this.league?.Draft?.status === 'pending' && 
           this.league?.League_Members?.length >= 2;
  }

  onTabChange(event: any) {
    this.activeTab = event.index;
  }

  getPoolTypeLabel(poolType: number): string {
    const poolTypes = {
      1: 'All Wrestlers',
      2: 'Randomized',
      3: 'WWE Only',
      4: 'AEW Only',
      5: 'Custom Pool'
    };
    return poolTypes[poolType as keyof typeof poolTypes] || 'Unknown'; // I hate TypeScript
  }

  getTeamNameByUserId(userId: string): string {
    const member = this.league.League_Members.find((m: any) => m.user._id === userId);
    return member ? member.team_name : 'Unknown Team';
  }
}
