import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailServerServiceComponent } from './detail-server-service.component';

describe('DetailServerServiceComponent', () => {
  let component: DetailServerServiceComponent;
  let fixture: ComponentFixture<DetailServerServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailServerServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailServerServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
