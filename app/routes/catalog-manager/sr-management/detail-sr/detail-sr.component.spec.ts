import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSrComponent } from './detail-sr.component';

describe('DetailSrComponent', () => {
  let component: DetailSrComponent;
  let fixture: ComponentFixture<DetailSrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailSrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailSrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
