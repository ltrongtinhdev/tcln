import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCausesComponent } from './create-causes.component';

describe('CreateCausesComponent', () => {
  let component: CreateCausesComponent;
  let fixture: ComponentFixture<CreateCausesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCausesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCausesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
