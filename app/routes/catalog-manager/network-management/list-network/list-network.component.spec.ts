import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNetworkComponent } from './list-network.component';

describe('ListNetworkComponent', () => {
  let component: ListNetworkComponent;
  let fixture: ComponentFixture<ListNetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListNetworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
