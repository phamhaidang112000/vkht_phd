import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFlavorComponent } from './list-flavor.component';

describe('ListFlavorComponent', () => {
  let component: ListFlavorComponent;
  let fixture: ComponentFixture<ListFlavorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListFlavorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFlavorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
