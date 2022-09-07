import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ResourceSettingComponent} from "./resource-setting-management/resource-setting.component";
import {DetailInstallationComponent} from "./detail-installation/detail-installation.component";

const  routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: ResourceSettingComponent
      },
      {
        path: 'update/:id', component: DetailInstallationComponent
      },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstallationManagementRoutingModule {}
