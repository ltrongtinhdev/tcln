import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Package2ManagerComponent } from './package2-manager.component';

describe('Package2ManagerComponent', () => {
  let component: Package2ManagerComponent;
  let fixture: ComponentFixture<Package2ManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Package2ManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Package2ManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
