import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListServiceComponent } from './service-management/list-service/list-service.component';
import {CatalogManagerRoutingModule} from "./catalog-manager-routing.module";
import { ListInventoryPlaybookComponent } from './inventory-playbook-management/list-inventory-playbook/list-inventory-playbook.component';
import {SharedModule} from "@shared";
import {ComponentsModule} from "../components/components.module";
import { DetailInventoryPlaybookComponent } from './inventory-playbook-management/detail-inventory-playbook/detail-inventory-playbook.component';
import { DetailServiceComponent } from './service-management/detail-service/detail-service.component';



@NgModule({
  declarations: [ListServiceComponent, ListInventoryPlaybookComponent, DetailInventoryPlaybookComponent, DetailServiceComponent],
  imports: [
    CommonModule,
    CatalogManagerRoutingModule,
    SharedModule,
    ComponentsModule
  ]
})
export class CatalogManagerModule { }
