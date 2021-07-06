import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CausesDetailComponent } from './causes-detail.component';

describe('CausesDetailComponent', () => {
  let component: CausesDetailComponent;
  let fixture: ComponentFixture<CausesDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CausesDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CausesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
