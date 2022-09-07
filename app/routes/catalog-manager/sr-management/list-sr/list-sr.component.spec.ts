import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSrComponent } from './list-sr.component';

describe('ListSrComponent', () => {
  let component: ListSrComponent;
  let fixture: ComponentFixture<ListSrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
