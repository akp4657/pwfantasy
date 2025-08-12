import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LeagueModalComponent } from '../../modals/league-modal/league-modal.component';
import { LeagueService } from '../../services/league.service';

@Component({
  selector: 'app-leagues',
  templateUrl: './leagues.component.html',
  styleUrls: ['./leagues.component.scss']
})
export class LeaguesComponent implements OnInit {
  publicLeagues: any[] = [];
  userLeagues: any[] = [];
  loading = false;
  error = '';

  constructor(
    private leagueService: LeagueService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadLeagues();
  }

  loadLeagues() {
    this.loading = true;
    this.error = '';

    // Load public leagues
    this.leagueService.getPublicLeagues().subscribe({
      next: (leagues: any) => {
        this.publicLeagues = leagues;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load public leagues';
        this.loading = false;
      }
    });

    // Load user's leagues
    this.leagueService.getUserLeagues().subscribe({
      next: (leagues: any) => {
        this.userLeagues = leagues;
      },
      error: (error: any) => {
        console.error('Failed to load user leagues:', error);
      }
    });
  }

  openCreateLeagueModal() {
    const dialogRef = this.dialog.open(LeagueModalComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.loadLeagues();
        // Show success message with invite code if applicable
        if (result.inviteCode) {
          alert(`League created successfully! Invite code: ${result.inviteCode}`);
        } else {
          alert('League created successfully!');
        }
      }
    });
  }

  joinLeague(league: any) {
    const teamName = prompt('Enter your team name:');
    if (!teamName) return;

    let inviteCode = null;
    if (league.League_Type === 'private' || league.League_Type === 'invite_only') {
      inviteCode = prompt('Enter invite code:');
      if (!inviteCode) return;
    }

    this.leagueService.joinLeague(league._id, { teamName, inviteCode }).subscribe({
      next: (response: any) => {
        alert('Successfully joined league!');
        this.loadLeagues();
      },
      error: (error: any) => {
        alert(error.error?.error || 'Failed to join league');
      }
    });
  }

  leaveLeague(league: any) {
    if (confirm('Are you sure you want to leave this league?')) {
      this.leagueService.leaveLeague(league._id).subscribe({
        next: (response: any) => {
          alert('Successfully left league');
          this.loadLeagues();
        },
        error: (error: any) => {
          alert(error.error?.error || 'Failed to leave league');
        }
      });
    }
  }

  startDraft(league: any) {
    if (confirm('Are you sure you want to start the draft? This action cannot be undone.')) {
      this.leagueService.startDraft(league._id).subscribe({
        next: (response: any) => {
          alert('Draft started successfully!');
          this.loadLeagues();
        },
        error: (error: any) => {
          alert(error.error?.error || 'Failed to start draft');
        }
      });
    }
  }

  getLeagueStatus(league: any): string {
    if (league.Draft?.status === 'completed') {
      return 'Draft Complete';
    } else if (league.Draft?.status === 'active') {
      return 'Draft Active';
    } else if (league.Draft?.status === 'pending') {
      return 'Draft Pending';
    }
    return 'Unknown';
  }

  isOwner(league: any): boolean {
    // This would need to be implemented based on your user authentication system
    return false; // Placeholder
  }

  canStartDraft(league: any): boolean {
    return this.isOwner(league) && 
           league.Draft?.status === 'pending' && 
           league.League_Members?.length >= 2;
  }
}
