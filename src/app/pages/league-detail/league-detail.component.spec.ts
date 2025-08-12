import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeagueDetailComponent } from './league-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LeagueService } from '../../services/league.service';
import { of, throwError } from 'rxjs';

describe('LeagueDetailComponent', () => {
  let component: LeagueDetailComponent;
  let fixture: ComponentFixture<LeagueDetailComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockLeagueService: jasmine.SpyObj<LeagueService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockLeagueService = jasmine.createSpyObj('LeagueService', [
      'getLeague',
      'startDraft',
      'makeDraftPick'
    ]);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [ LeagueDetailComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '123' })
          }
        },
        { provide: Router, useValue: mockRouter },
        { provide: LeagueService, useValue: mockLeagueService },
        { provide: MatDialog, useValue: mockDialog }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeagueDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load league on init', () => {
    const mockLeague = { _id: '123', Name: 'Test League' };
    mockLeagueService.getLeague.and.returnValue(of(mockLeague));

    component.ngOnInit();

    expect(mockLeagueService.getLeague).toHaveBeenCalledWith('123');
    expect(component.league).toEqual(mockLeague);
    expect(component.loading).toBeFalse();
  });

  it('should handle league loading error', () => {
    mockLeagueService.getLeague.and.returnValue(throwError(() => new Error('Test error')));

    component.loadLeague('123');

    expect(component.error).toBe('Failed to load league');
    expect(component.loading).toBeFalse();
  });

  it('should start draft successfully', () => {
    const mockResponse = { success: true };
    component.league = { _id: '123' };
    
    spyOn(window, 'confirm').and.returnValue(true);
    mockLeagueService.startDraft.and.returnValue(of(mockResponse));
    spyOn(component, 'loadLeague');
    spyOn(window, 'alert');

    component.startDraft();

    expect(mockLeagueService.startDraft).toHaveBeenCalledWith('123');
    expect(component.loadLeague).toHaveBeenCalledWith('123');
  });

  it('should make draft pick successfully', () => {
    const mockResponse = { success: true };
    component.league = { _id: '123' };
    
    mockLeagueService.makeDraftPick.and.returnValue(of(mockResponse));
    spyOn(component, 'loadLeague');

    component.makeDraftPick('wrestler123');

    expect(mockLeagueService.makeDraftPick).toHaveBeenCalledWith('123', { wrestlerId: 'wrestler123' });
    expect(component.loadLeague).toHaveBeenCalledWith('123');
  });

  it('should get current drafter correctly', () => {
    const mockLeague = {
      Draft: {
        status: 'active',
        order: ['user1', 'user2'],
        current_pick: 0
      },
      League_Members: [
        { user: { _id: 'user1' }, team_name: 'Team A' },
        { user: { _id: 'user2' }, team_name: 'Team B' }
      ]
    };

    component.league = mockLeague;
    const currentDrafter = component.getCurrentDrafter();

    expect(currentDrafter.team_name).toBe('Team A');
  });

  it('should return null for current drafter when draft not active', () => {
    const mockLeague = {
      Draft: { status: 'pending' }
    };

    component.league = mockLeague;
    const currentDrafter = component.getCurrentDrafter();

    expect(currentDrafter).toBeNull();
  });

  it('should calculate draft progress correctly', () => {
    const mockLeague = {
      League_Members: [{}, {}, {}], // 3 members
      Draft: {
        picks: [{}, {}, {}, {}, {}, {}] // 6 picks
      }
    };

    component.league = mockLeague;
    const progress = component.getDraftProgress();

    // 6 picks / (3 members * 15 wrestlers) * 100 = 13.33%
    expect(progress).toBeCloseTo(13.33, 1);
  });

  it('should get available wrestlers correctly', () => {
    const mockLeague = {
      Pool: [
        { _id: 'wrestler1', Name: 'Wrestler 1' },
        { _id: 'wrestler2', Name: 'Wrestler 2' }
      ],
      Draft: {
        picks: [
          { wrestler: { _id: 'wrestler1' } }
        ]
      }
    };

    component.league = mockLeague;
    const availableWrestlers = component.getAvailableWrestlers();

    expect(availableWrestlers.length).toBe(1);
    expect(availableWrestlers[0]._id).toBe('wrestler2');
  });

  it('should get team wrestlers correctly', () => {
    const mockLeague = {
      Draft: {
        picks: [
          { user: 'user1', wrestler: { _id: 'wrestler1', Name: 'Wrestler A' } },
          { user: 'user2', wrestler: { _id: 'wrestler2', Name: 'Wrestler B' } },
          { user: 'user1', wrestler: { _id: 'wrestler3', Name: 'Wrestler C' } }
        ]
      }
    };

    component.league = mockLeague;
    const teamWrestlers = component.getTeamWrestlers('user1');

    expect(teamWrestlers.length).toBe(2);
    expect(teamWrestlers[0].Name).toBe('Wrestler A');
    expect(teamWrestlers[1].Name).toBe('Wrestler C');
  });

  it('should get pool type label correctly', () => {
    expect(component.getPoolTypeLabel(1)).toBe('All Wrestlers');
    expect(component.getPoolTypeLabel(3)).toBe('WWE Only');
    expect(component.getPoolTypeLabel(99)).toBe('Unknown');
  });

  it('should get team name by user ID correctly', () => {
    const mockLeague = {
      League_Members: [
        { user: { _id: 'user1' }, team_name: 'Team A' },
        { user: { _id: 'user2' }, team_name: 'Team B' }
      ]
    };

    component.league = mockLeague;
    
    expect(component.getTeamNameByUserId('user1')).toBe('Team A');
    expect(component.getTeamNameByUserId('user2')).toBe('Team B');
    expect(component.getTeamNameByUserId('user3')).toBe('Unknown Team');
  });

  it('should check if user can start draft', () => {
    const mockLeague = {
      Draft: { status: 'pending' },
      League_Members: [{}, {}]
    };

    spyOn(component, 'isOwner').and.returnValue(true);
    expect(component.canStartDraft()).toBeTrue();

    spyOn(component, 'isOwner').and.returnValue(false);
    expect(component.canStartDraft()).toBeFalse();
  });

  it('should handle tab change', () => {
    const mockEvent = { index: 2 };
    
    component.onTabChange(mockEvent);
    
    expect(component.activeTab).toBe(2);
  });
});
