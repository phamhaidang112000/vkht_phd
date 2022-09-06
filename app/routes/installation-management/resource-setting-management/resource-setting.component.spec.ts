import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceSettingComponent } from './resource-setting.component';

describe('ResourceSettingComponent', () => {
  let component: ResourceSettingComponent;
  let fixture: ComponentFixture<ResourceSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
