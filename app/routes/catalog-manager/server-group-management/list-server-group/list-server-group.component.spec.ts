import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListServerGroupComponent } from './list-server-group.component';

describe('ListServerGroupComponent', () => {
  let component: ListServerGroupComponent;
  let fixture: ComponentFixture<ListServerGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListServerGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListServerGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
