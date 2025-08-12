import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeagueModalComponent } from './league-modal.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LeagueService } from '../../services/league.service';
import { of } from 'rxjs';

describe('LeagueModalComponent', () => {
  let component: LeagueModalComponent;
  let fixture: ComponentFixture<LeagueModalComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<LeagueModalComponent>>;
  let mockLeagueService: jasmine.SpyObj<LeagueService>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockLeagueService = jasmine.createSpyObj('LeagueService', ['createLeague']);

    await TestBed.configureTestingModule({
      declarations: [ LeagueModalComponent ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: LeagueService, useValue: mockLeagueService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeagueModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.leagueData.name).toBe('');
    expect(component.leagueData.poolType).toBe(1);
    expect(component.leagueData.maxMembers).toBe(10);
    expect(component.leagueData.leagueType).toBe('public');
  });

  it('should validate form correctly', () => {
    // Test empty name
    component.leagueData.name = '';
    expect(component.validateForm()).toBeFalse();
    expect(component.error).toBe('League name is required');

    // Test valid form
    component.leagueData.name = 'Test League';
    component.leagueData.draftDay = new Date();
    component.leagueData.seasonStart = new Date();
    expect(component.validateForm()).toBeTrue();
    expect(component.error).toBe('');
  });

  it('should create league successfully', () => {
    const mockResponse = { success: true, league: { _id: '123' }, inviteCode: 'ABC123' };
    mockLeagueService.createLeague.and.returnValue(of(mockResponse));

    component.leagueData.name = 'Test League';
    component.leagueData.draftDay = new Date();
    component.leagueData.seasonStart = new Date();

    component.onSubmit();

    expect(mockLeagueService.createLeague).toHaveBeenCalledWith(component.leagueData);
    expect(mockDialogRef.close).toHaveBeenCalledWith(mockResponse);
  });

  it('should handle league creation error', () => {
    const mockError = { error: { error: 'Test error' } };
    mockLeagueService.createLeague.and.returnValue(of(mockError));

    component.leagueData.name = 'Test League';
    component.leagueData.draftDay = new Date();
    component.leagueData.seasonStart = new Date();

    component.onSubmit();

    expect(component.error).toBe('Test error');
  });

  it('should close dialog on cancel', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
