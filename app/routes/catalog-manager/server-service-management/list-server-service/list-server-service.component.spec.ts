import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListServerServiceComponent } from './list-server-service.component';

describe('ListServerServiceComponent', () => {
  let component: ListServerServiceComponent;
  let fixture: ComponentFixture<ListServerServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListServerServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListServerServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
