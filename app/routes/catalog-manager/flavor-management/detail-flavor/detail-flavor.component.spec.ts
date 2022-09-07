import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailFlavorComponent } from './detail-flavor.component';

describe('DetailFlavorComponent', () => {
  let component: DetailFlavorComponent;
  let fixture: ComponentFixture<DetailFlavorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailFlavorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailFlavorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
