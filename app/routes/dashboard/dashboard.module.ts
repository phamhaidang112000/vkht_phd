import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '../components/components.module';
import { SharedModule } from '@shared';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ComponentsModule,
    DashboardRoutingModule
  ],
})
export class DashboardModule {
}
