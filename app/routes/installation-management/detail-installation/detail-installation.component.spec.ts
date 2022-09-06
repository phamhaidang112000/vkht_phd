import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailInstallationComponent } from './detail-installation.component';

describe('DetailInstallationComponent', () => {
  let component: DetailInstallationComponent;
  let fixture: ComponentFixture<DetailInstallationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailInstallationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailInstallationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
