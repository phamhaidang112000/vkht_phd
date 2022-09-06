import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CanActiveService} from "../../common/can-active.service";
import {ListServiceComponent} from "./service-management/list-service/list-service.component";
import {ListInventoryPlaybookComponent} from "./inventory-playbook-management/list-inventory-playbook/list-inventory-playbook.component";
import {DetailInventoryPlaybookComponent} from "./inventory-playbook-management/detail-inventory-playbook/detail-inventory-playbook.component";
import {DetailServiceComponent} from "./service-management/detail-service/detail-service.component";
import { ListServerComponent } from './server-management/list-server/list-server.component';
import { DetailServerComponent } from './server-management/detail-server/detail-server.component';
import { ListSrComponent } from './sr-management/list-sr/list-sr.component';
import { DetailSrComponent } from './sr-management/detail-sr/detail-sr.component';
import { DetailSettingComponent } from './setting-management/detail-setting/detail-setting.component';
import { DetailServerServiceComponent } from './server-service-management/detail-server-service/detail-server-service.component';
import { ListServerServiceComponent } from './server-service-management/list-server-service/list-server-service.component';
import { DetailServerGroupComponent } from './server-group-management/detail-server-group/detail-server-group.component';
import { ListServerGroupComponent } from './server-group-management/list-server-group/list-server-group.component';
import { DetailStorageComponent } from './storage-management/detail-storage/detail-storage.component';
import { ListStorageComponent } from './storage-management/list-storage/list-storage.component';
import { DetailFlavorComponent } from './flavor-management/detail-flavor/detail-flavor.component';
import { ListFlavorComponent } from './flavor-management/list-flavor/list-flavor.component';
import { DetailNetworkComponent } from './network-management/detail-network/detail-network.component';
import { ListNetworkComponent } from './network-management/list-network/list-network.component';
import { DetailOsComponent } from './Os-management/detail-os/detail-os.component';
import { ListOsComponent } from './Os-management/list-os/list-os.component';


const routes: Routes = [
  {
    path: '',
    children: [
      // { path: '', redirectTo: 'danh-muc-he-thong', pathMatch: 'full' },
      {
        path: 'service', component: ListServiceComponent,
        // canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'service/add', component: DetailServiceComponent,
        // canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'service/detail/:id', component: DetailServiceComponent,
        // canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'service/update/:id', component: DetailServiceComponent
      },
      {
        path: 'inventory-playbook', component: ListInventoryPlaybookComponent,
        // canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'inventory-playbook/add', component: DetailInventoryPlaybookComponent,
        // canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'inventory-playbook/detail/:id', component: DetailInventoryPlaybookComponent,
        // canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'server', component: ListServerComponent,
        // canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'server/add', component: DetailServerComponent,
        // canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'server/detail/:id', component: DetailServerComponent,
        // canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'sr', component: ListSrComponent,
        // canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'sr/add', component: DetailSrComponent,
        // canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'sr/detail/:id', component: DetailSrComponent,
        // canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'setting/detail/:id', component: DetailSettingComponent,
        // canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'storage', component: ListStorageComponent,
        // canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'storage/add', component: DetailStorageComponent,
        // canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'storage/detail/:id', component: DetailStorageComponent,
        // canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'server-group', component: ListServerGroupComponent,
        // canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'server-group/add', component: DetailServerGroupComponent,
        // canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'server-group/detail/:id', component: DetailServerGroupComponent,
        // canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'server-service', component: ListServerServiceComponent,
        // canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'server-service/add', component: DetailServerServiceComponent,
        // canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'server-service/detail/:id', component: DetailServerServiceComponent,
        // canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'flavor', component: ListFlavorComponent,
        // canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'flavor/add', component: DetailFlavorComponent,
        // canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'flavor/detail/:id', component: DetailFlavorComponent,
        // canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'network', component: ListNetworkComponent,
        // canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'network/add', component: DetailNetworkComponent,
        // canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'network/detail/:id', component: DetailNetworkComponent,
        // canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'os', component: ListOsComponent,
        // canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'os/add', component: DetailOsComponent,
        // canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'os/detail/:id', component: DetailOsComponent,
        // canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogManagerRoutingModule {
}
