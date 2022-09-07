import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailServerGroupComponent } from './detail-server-group.component';

describe('DetailServerGroupComponent', () => {
  let component: DetailServerGroupComponent;
  let fixture: ComponentFixture<DetailServerGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailServerGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailServerGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
