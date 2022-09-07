import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailNetworkComponent } from './detail-network.component';

describe('DetailNetworkComponent', () => {
  let component: DetailNetworkComponent;
  let fixture: ComponentFixture<DetailNetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailNetworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
