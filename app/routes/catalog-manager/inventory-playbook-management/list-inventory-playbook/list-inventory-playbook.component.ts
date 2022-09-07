import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
  ViewChild
} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {InputTextComponent} from "../../../components/inputs/input-text/input-text.component";
import {Router} from "@angular/router";
import {FormBuilder, FormControl} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {APP_PARAMS_TYPE, COLUMNS, defaultRequestList, SCROLL_TABLE} from "../../../../utils";
import {BehaviorSubject, Observable} from "rxjs";
import {debounceTime} from "rxjs/operators";
import {ServiceManagementService} from "../../../../services/service-management/service-management.service";
import {AppParamsService} from "../../../../services/app-params/app-params.service";
import {InventoryPlaybookService} from "../../../../services/inventory-playbook/inventory-playbook.service";
import {ToastService} from "@shared";
import {FileManagerService} from "../../../../services/file-manager/file-manager.service";

@Component({
  selector: 'app-list-inventory-playbook',
  templateUrl: './list-inventory-playbook.component.html',
  styleUrls: ['./list-inventory-playbook.component.less']
})
export class ListInventoryPlaybookComponent implements OnInit, AfterViewInit, AfterViewChecked {
  searchForm: any;
  breadcrumbs: any = [];
  isBreadcrumb = false;
  total = 0;
  @ViewChild('codeRef', {static: false}) codeRef: InputTextComponent;
  lstData: any[] = [];
  request: any = {
    ...defaultRequestList,
  };
  SCROLL_TABLE = SCROLL_TABLE;
  services: any = [];
  serviceModels: any = [];
  searchService$ = new BehaviorSubject('');
  isVisibleModalDelete: any;
  selectedCode: any;
  selectedId: any;

  constructor(public translateService: TranslateService,
              injector: Injector,
              private router: Router,
              private formBuilder: FormBuilder,
              private changeDetectorRef: ChangeDetectorRef,
              private spinner: NgxSpinnerService,
              private serviceMgmtService: ServiceManagementService,
              private appParamService: AppParamsService,
              private inventoryPlaybookService: InventoryPlaybookService,
              private toastService: ToastService,
              private fileManagerService: FileManagerService) {
  }

  ngOnInit() {

    this.setBreadcrumb();
    this.buildForm();
    this.initSearchService();
    this.appParamService.getAppParamsByType(APP_PARAMS_TYPE.SERVICE_STATUS).subscribe(res => {
      this.serviceModels = res.data;
    })
    console.log(this.router.getCurrentNavigation() ? this.router.getCurrentNavigation().extras.state.request : "1");
    this.nzOnSearch(null);
  }

  ngAfterViewInit() {
    this.codeRef.focus();
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  setBreadcrumb() {
    this.breadcrumbs = [
      {
        name: this.translateService.instant('breadcrumb.catalog-management'),
        route: '',
      },
      {
        name: this.translateService.instant('breadcrumb.inventory-playbook-management'),
        route: '/catalog-management/department',
      },
    ];
    this.isBreadcrumb = true;
  }

  nzOnSearch(event: any) {
    this.request.page = 0;
    this.request.size = 10;
    this.fetchInventory();
  }

  fetchInventory() {
    this.request.sort = 'code,name,serviceModelName'
    this.inventoryPlaybookService.search(this.searchForm.value, this.request).subscribe(res => {
      this.lstData = res.data.content;
      this.total = res.data.totalElements;
    })
  }

  buildForm() {
    this.searchForm = this.formBuilder.group({
      code: new FormControl(null),
      name: new FormControl(null),
      service: new FormControl(null),
      serviceModel: new FormControl(null)
    });
  }

  onCreate() {
    this.router.navigate(['/catalog-management/inventory-playbook/add'])
  }


  changeCurrentPage(currentPage: number) {
    this.request.page = currentPage;
    this.fetchInventory();
  }

  changeItemPerPage(itemPerPage: number) {
    this.request.page = 0;
    this.request.size = itemPerPage;
    this.fetchInventory();
  }

  clearService() {

  }

  selectChangeService() {

  }

  initSearchService() {
    const optionList$: Observable<any> = this.searchService$.asObservable().pipe(debounceTime(500));
    optionList$.subscribe(value => {
      this.fetchService(value);
    });
  }

  fetchService(txtSearch) {
    this.serviceMgmtService.getAllServiceByName(txtSearch).subscribe(rs => {
      this.services = rs.data;
    });
  }

  onDownloadFile(fileId: any, fileName: any) {
    this.fileManagerService.downloadFileById(fileId, fileName);
  }

  goToEdit(data: any) {
    this.router.navigate(['/catalog-management/inventory-playbook/detail/' + data.id], {state: {page: this.request}});
  }

  openModalDelete(data: any) {
    this.isVisibleModalDelete = true;
    this.selectedCode = data.code;
    this.selectedId = data.id;
  }

  callBackModalDelete(event: any) {
    this.inventoryPlaybookService.delete(this.selectedId).subscribe(res => {
      if (res.data != "1") {
        this.toastService.openErrorToast(this.translateService.instant('catalog-management.inventory.delete.error', {
          code: this.selectedCode,
          srCode: res.data
        }), null);
        this.isVisibleModalDelete = false;
      } else {
        this.toastService.openSuccessToast(this.translateService.instant('catalog-management.inventory.delete.success'), null);
        this.isVisibleModalDelete = false;
        if (this.lstData.length == 1) {
          this.request.page = this.request.page > 0 ? this.request.page - 1 : 0;
        }
        this.fetchInventory();
      }
    })
  }

  onCancelModalDelete() {
    this.isVisibleModalDelete = false;
  }
}
