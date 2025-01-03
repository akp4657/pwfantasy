import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WrestlersComponent } from './wrestlers.component';

describe('WrestlersComponent', () => {
  let component: WrestlersComponent;
  let fixture: ComponentFixture<WrestlersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrestlersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrestlersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});