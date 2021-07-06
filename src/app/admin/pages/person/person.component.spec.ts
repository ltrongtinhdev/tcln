import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoorPeopleListComponent } from './poor-people-list.component';

describe('PoorPeopleListComponent', () => {
  let component: PoorPeopleListComponent;
  let fixture: ComponentFixture<PoorPeopleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoorPeopleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoorPeopleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
