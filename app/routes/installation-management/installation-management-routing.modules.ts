import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ResourceSettingComponent} from "./resource-setting-management/resource-setting.component";
import {DetailInstallationComponent} from "./detail-installation/detail-installation.component";
import {CanActiveService} from "../../common/can-active.service";
const  routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: ResourceSettingComponent,
        canActivate: [CanActiveService],
      },
      {
        path: 'update/:id', component: DetailInstallationComponent,
        canActivate: [CanActiveService],
      },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstallationManagementRoutingModule {}
