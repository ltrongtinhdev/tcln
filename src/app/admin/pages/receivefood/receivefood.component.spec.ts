import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivefoodComponent } from './receivefood.component';

describe('ReceivefoodComponent', () => {
  let component: ReceivefoodComponent;
  let fixture: ComponentFixture<ReceivefoodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceivefoodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivefoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
