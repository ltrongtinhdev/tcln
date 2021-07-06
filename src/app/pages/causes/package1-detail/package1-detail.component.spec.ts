import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Package1DetailComponent } from './package1-detail.component';

describe('CausesDetailComponent', () => {
  let component: Package1DetailComponent;
  let fixture: ComponentFixture<Package1DetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Package1DetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Package1DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
