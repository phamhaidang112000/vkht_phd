import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListServiceComponent } from './service-management/list-service/list-service.component';
import {CatalogManagerRoutingModule} from "./catalog-manager-routing.module";
import { ListInventoryPlaybookComponent } from './inventory-playbook-management/list-inventory-playbook/list-inventory-playbook.component';
import {SharedModule} from "@shared";
import {ComponentsModule} from "../components/components.module";
import { DetailInventoryPlaybookComponent } from './inventory-playbook-management/detail-inventory-playbook/detail-inventory-playbook.component';
import { DetailServiceComponent } from './service-management/detail-service/detail-service.component';
import { ListServerComponent } from './server-management/list-server/list-server.component';
import { DetailServerComponent } from './server-management/detail-server/detail-server.component';
import { ListSrComponent } from './sr-management/list-sr/list-sr.component';
import { DetailSrComponent } from './sr-management/detail-sr/detail-sr.component';
import { DetailSettingComponent } from './setting-management/detail-setting/detail-setting.component';
import { ListStorageComponent } from './storage-management/list-storage/list-storage.component';
import { DetailStorageComponent } from './storage-management/detail-storage/detail-storage.component';
import { ListServerServiceComponent } from './server-service-management/list-server-service/list-server-service.component';
import { DetailServerServiceComponent } from './server-service-management/detail-server-service/detail-server-service.component';
import { ListServerGroupComponent } from './server-group-management/list-server-group/list-server-group.component';
import { DetailServerGroupComponent } from './server-group-management/detail-server-group/detail-server-group.component';
import { DetailFlavorComponent } from './flavor-management/detail-flavor/detail-flavor.component';
import { ListFlavorComponent } from './flavor-management/list-flavor/list-flavor.component';
import { DetailNetworkComponent } from './network-management/detail-network/detail-network.component';
import { ListNetworkComponent } from './network-management/list-network/list-network.component';
import { ListOsComponent } from './Os-management/list-os/list-os.component';
import { DetailOsComponent } from './Os-management/detail-os/detail-os.component';



@NgModule({
  declarations: [ListServiceComponent, ListInventoryPlaybookComponent, DetailInventoryPlaybookComponent, DetailServiceComponent, ListServerComponent, DetailServerComponent, ListSrComponent, DetailSrComponent, DetailSettingComponent, ListStorageComponent, DetailStorageComponent, ListServerServiceComponent, DetailServerServiceComponent, ListServerGroupComponent, DetailServerGroupComponent, DetailFlavorComponent, ListFlavorComponent, DetailNetworkComponent, ListNetworkComponent, ListOsComponent, DetailOsComponent],
  imports: [
    CommonModule,
    CatalogManagerRoutingModule,
    SharedModule,
    ComponentsModule
  ]
})
export class CatalogManagerModule { }
