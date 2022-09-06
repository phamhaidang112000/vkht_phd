import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInventoryPlaybookComponent } from './list-inventory-playbook.component';

describe('ListInventoryPlaybookComponent', () => {
  let component: ListInventoryPlaybookComponent;
  let fixture: ComponentFixture<ListInventoryPlaybookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListInventoryPlaybookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInventoryPlaybookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
