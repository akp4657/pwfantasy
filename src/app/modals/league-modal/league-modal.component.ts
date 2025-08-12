import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LeagueService } from '../../services/league.service';

@Component({
  selector: 'app-league-modal',
  templateUrl: './league-modal.component.html',
  styleUrls: ['./league-modal.component.scss']
})
export class LeagueModalComponent implements OnInit {
  leagueData: any = {
    name: '',
    description: '',
    poolType: 1,
    maxMembers: 10,
    draftDay: '',
    seasonStart: '',
    seasonEnd: '',
    leagueType: 'public'
  };

  poolTypes = [
    { value: 1, label: 'All Wrestlers' },
    { value: 2, label: 'Randomized (15+ increments)' },
    { value: 3, label: 'WWE Only' },
    { value: 4, label: 'AEW Only' },
    { value: 5, label: 'Custom Pool' }
  ];

  leagueTypes = [
    { value: 'public', label: 'Public' },
    { value: 'private', label: 'Private' },
    { value: 'invite_only', label: 'Invite Only' }
  ];

  loading = false;
  error = '';

  constructor(
    public dialogRef: MatDialogRef<LeagueModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private leagueService: LeagueService
  ) { }

  ngOnInit(): void {
    if (this.data && this.data.league) {
      this.leagueData = { ...this.data.league };
    }
  }

  onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.leagueService.createLeague(this.leagueData).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.dialogRef.close({ success: true, league: response.league, inviteCode: response.inviteCode });
      },
      error: (error: any) => {
        this.loading = false;
        this.error = error.error?.error || 'Failed to create league';
      }
    });
  }

  validateForm(): boolean {
    if (!this.leagueData.name || this.leagueData.name.trim() === '') {
      this.error = 'League name is required';
      return false;
    }

    if (!this.leagueData.draftDay) {
      this.error = 'Draft day is required';
      return false;
    }

    if (!this.leagueData.seasonStart) {
      this.error = 'Season start date is required';
      return false;
    }

    if (this.leagueData.maxMembers < 2 || this.leagueData.maxMembers > 20) {
      this.error = 'Maximum members must be between 2 and 20';
      return false;
    }

    this.error = '';
    return true;
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
