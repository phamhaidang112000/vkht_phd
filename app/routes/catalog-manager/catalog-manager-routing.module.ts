import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CanActiveService} from "../../common/can-active.service";
import {ListServiceComponent} from "./service-management/list-service/list-service.component";
import {ListInventoryPlaybookComponent} from "./inventory-playbook-management/list-inventory-playbook/list-inventory-playbook.component";
import {DetailInventoryPlaybookComponent} from "./inventory-playbook-management/detail-inventory-playbook/detail-inventory-playbook.component";
import {DetailServiceComponent} from "./service-management/detail-service/detail-service.component";

const routes: Routes = [
  {
    path: '',
    children: [
      // { path: '', redirectTo: 'danh-muc-he-thong', pathMatch: 'full' },
      {
        path: 'service', component: ListServiceComponent,
           canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'service/add', component: DetailServiceComponent,
           canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'service/detail/:id', component: DetailServiceComponent,
           canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'service/update/:id', component: DetailServiceComponent
      },
      {
        path: 'inventory-playbook', component: ListInventoryPlaybookComponent,
          canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'inventory-playbook/add', component: DetailInventoryPlaybookComponent,
        canActivate: [CanActiveService],
        // data: {role: ROLE_LIST.DIRECTORY_PARTNER_VIEW_LIST}
      },
      {
        path: 'inventory-playbook/detail/:id', component: DetailInventoryPlaybookComponent,
        canActivate: [CanActiveService],
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
