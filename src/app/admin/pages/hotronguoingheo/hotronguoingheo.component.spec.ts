import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotronguoingheoComponent } from './hotronguoingheo.component';

describe('HotronguoingheoComponent', () => {
  let component: HotronguoingheoComponent;
  let fixture: ComponentFixture<HotronguoingheoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotronguoingheoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotronguoingheoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
