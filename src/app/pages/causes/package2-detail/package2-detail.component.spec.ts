import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Package2DetailComponent } from './package2-detail.component';

describe('Package2DetailComponent', () => {
  let component: Package2DetailComponent;
  let fixture: ComponentFixture<Package2DetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Package2DetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Package2DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
