import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaguesComponent } from './leagues.component';
import { MatDialog } from '@angular/material/dialog';
import { LeagueService } from '../../services/league.service';
import { of, throwError } from 'rxjs';
import { LeagueModalComponent } from '../../modals/league-modal/league-modal.component';

describe('LeaguesComponent', () => {
  let component: LeaguesComponent;
  let fixture: ComponentFixture<LeaguesComponent>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockLeagueService: jasmine.SpyObj<LeagueService>;

  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockLeagueService = jasmine.createSpyObj('LeagueService', [
      'getPublicLeagues',
      'getUserLeagues',
      'joinLeague',
      'leaveLeague',
      'startDraft'
    ]);

    await TestBed.configureTestingModule({
      declarations: [ LeaguesComponent ],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: LeagueService, useValue: mockLeagueService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaguesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load leagues on init', () => {
    const mockPublicLeagues = [{ _id: '1', Name: 'Test League' }];
    const mockUserLeagues = [{ _id: '2', Name: 'My League' }];

    mockLeagueService.getPublicLeagues.and.returnValue(of(mockPublicLeagues));
    mockLeagueService.getUserLeagues.and.returnValue(of(mockUserLeagues));

    component.ngOnInit();

    expect(mockLeagueService.getPublicLeagues).toHaveBeenCalled();
    expect(mockLeagueService.getUserLeagues).toHaveBeenCalled();
  });

  it('should handle public leagues loading error', () => {
    mockLeagueService.getPublicLeagues.and.returnValue(throwError(() => new Error('Test error')));

    component.loadLeagues();

    expect(component.error).toBe('Failed to load public leagues');
    expect(component.loading).toBeFalse();
  });

  it('should open create league modal', () => {
    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    mockDialogRef.afterClosed.and.returnValue(of({ success: true }));
    mockDialog.open.and.returnValue(mockDialogRef);

    component.openCreateLeagueModal();

    expect(mockDialog.open).toHaveBeenCalledWith(LeagueModalComponent, {
      width: '600px',
      data: {}
    });
  });

  it('should join league successfully', () => {
    const mockLeague = { _id: '123', League_Type: 'public' };
    const mockResponse = { success: true };
    
    spyOn(window, 'prompt').and.returnValue('Test Team');
    mockLeagueService.joinLeague.and.returnValue(of(mockResponse));
    spyOn(component, 'loadLeagues');
    spyOn(window, 'alert');

    component.joinLeague(mockLeague);

    expect(mockLeagueService.joinLeague).toHaveBeenCalledWith('123', { teamName: 'Test Team', inviteCode: null });
    expect(component.loadLeagues).toHaveBeenCalled();
  });

  it('should leave league successfully', () => {
    const mockLeague = { _id: '123' };
    const mockResponse = { success: true };
    
    spyOn(window, 'confirm').and.returnValue(true);
    mockLeagueService.leaveLeague.and.returnValue(of(mockResponse));
    spyOn(component, 'loadLeagues');
    spyOn(window, 'alert');

    component.leaveLeague(mockLeague);

    expect(mockLeagueService.leaveLeague).toHaveBeenCalledWith('123');
    expect(component.loadLeagues).toHaveBeenCalled();
  });

  it('should start draft successfully', () => {
    const mockLeague = { _id: '123' };
    const mockResponse = { success: true };
    
    spyOn(window, 'confirm').and.returnValue(true);
    mockLeagueService.startDraft.and.returnValue(of(mockResponse));
    spyOn(component, 'loadLeagues');
    spyOn(window, 'alert');

    component.startDraft(mockLeague);

    expect(mockLeagueService.startDraft).toHaveBeenCalledWith('123');
    expect(component.loadLeagues).toHaveBeenCalled();
  });

  it('should get league status correctly', () => {
    const leagueWithCompletedDraft = { Draft: { status: 'completed' } };
    const leagueWithActiveDraft = { Draft: { status: 'active' } };
    const leagueWithPendingDraft = { Draft: { status: 'pending' } };
    const leagueWithoutDraft = {};

    expect(component.getLeagueStatus(leagueWithCompletedDraft)).toBe('Draft Complete');
    expect(component.getLeagueStatus(leagueWithActiveDraft)).toBe('Draft Active');
    expect(component.getLeagueStatus(leagueWithPendingDraft)).toBe('Draft Pending');
    expect(component.getLeagueStatus(leagueWithoutDraft)).toBe('Unknown');
  });

  it('should check if user can start draft', () => {
    const mockLeague = {
      Draft: { status: 'pending' },
      League_Members: [{}, {}]
    };

    spyOn(component, 'isOwner').and.returnValue(true);
    expect(component.canStartDraft(mockLeague)).toBeTrue();

    spyOn(component, 'isOwner').and.returnValue(false);
    expect(component.canStartDraft(mockLeague)).toBeFalse();
  });
});
