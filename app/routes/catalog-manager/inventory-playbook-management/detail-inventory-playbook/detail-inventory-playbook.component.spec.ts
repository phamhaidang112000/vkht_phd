import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailInventoryPlaybookComponent } from './detail-inventory-playbook.component';

describe('DetailInventoryPlaybookComponent', () => {
  let component: DetailInventoryPlaybookComponent;
  let fixture: ComponentFixture<DetailInventoryPlaybookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailInventoryPlaybookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailInventoryPlaybookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
