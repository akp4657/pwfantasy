import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrestlersTableComponent } from './wrestlers-table.component';

describe('WrestlersTableComponent', () => {
  let component: WrestlersTableComponent;
  let fixture: ComponentFixture<WrestlersTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WrestlersTableComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrestlersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
