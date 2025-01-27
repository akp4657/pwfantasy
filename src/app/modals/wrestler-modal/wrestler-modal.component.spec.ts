import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrestlerModalComponent } from './wrestler-modal.component';

describe('WrestlerModalComponent', () => {
  let component: WrestlerModalComponent;
  let fixture: ComponentFixture<WrestlerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrestlerModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WrestlerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
