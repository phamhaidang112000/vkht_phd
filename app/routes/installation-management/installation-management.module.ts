import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ResourceSettingComponent} from "./resource-setting-management/resource-setting.component";
import {SharedModule} from "@shared";
import {ComponentsModule} from "../components/components.module";
import {InstallationManagementRoutingModule} from "./installation-management-routing.modules";
import { DetailInstallationComponent } from './detail-installation/detail-installation.component';
import {ButtonSettingComponent} from "../components/buttons/button-setting/button-setting.component";



@NgModule({
  declarations: [ResourceSettingComponent, DetailInstallationComponent, ButtonSettingComponent],
  imports: [
    CommonModule,
    SharedModule,
    ComponentsModule,
    InstallationManagementRoutingModule
  ]
})
export class InstallationManagementModule { }
