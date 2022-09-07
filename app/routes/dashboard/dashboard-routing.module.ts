import { DashboardComponent } from './dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CanActiveService} from "../../common/can-active.service";
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [CanActiveService],
    // children: [
    //   { path: '', component: DashboardComponent },
    // ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
