import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyTeamComponent } from './myteam.component';

describe('MyTeamComponent', () => {
  let component: MyTeamComponent;
  let fixture: ComponentFixture<MyTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyTeamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});