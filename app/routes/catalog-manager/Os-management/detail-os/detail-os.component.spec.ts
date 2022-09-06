import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailOsComponent } from './detail-os.component';

describe('DetailOsComponent', () => {
  let component: DetailOsComponent;
  let fixture: ComponentFixture<DetailOsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailOsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailOsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
