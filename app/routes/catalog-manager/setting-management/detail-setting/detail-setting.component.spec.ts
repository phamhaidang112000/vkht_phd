import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSettingComponent } from './detail-setting.component';

describe('DetailSettingComponent', () => {
  let component: DetailSettingComponent;
  let fixture: ComponentFixture<DetailSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
