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
import {ServiceManagementService} from "../../../../services/service-management/service-management.service";
import {AppParamsService} from "../../../../services/app-params/app-params.service";
import {NzModalRef, NzModalService} from 'ng-zorro-antd';
import {ToastService} from "@shared";

@Component({
  selector: 'app-list-service',
  templateUrl: './list-service.component.html',
  styleUrls: ['./list-service.component.less']
})
export class ListServiceComponent implements OnInit, AfterViewInit, AfterViewChecked {
  searchForm: any;
  breadcrumbs: any = [];
  isBreadcrumb = false;
  total = 0;
  serviceModels: any = [];
  lstData: any[] = [];
  currentPage = 0;
  request: any = {
    page: 0,
    name: null,
    currentPage: 0,
    size: 10,
    sort: 'code'
  };
  loading = false;
  SCROLL_TABLE = SCROLL_TABLE;
  isVisibleModalDelete: any;
  selectedCode: any;
  modelId: any;
  @ViewChild('codeRef', {static: false}) codeRef: InputTextComponent;


  constructor(public translateService: TranslateService,
              injector: Injector,
              private router: Router,
              private formBuilder: FormBuilder,
              private changeDetectorRef: ChangeDetectorRef,
              private spinner: NgxSpinnerService,
              private serviceMgmtService: ServiceManagementService,
              private modal: NzModalService,
              private toastService: ToastService,
              private appParamService: AppParamsService) { }

  ngOnInit() {
    this.setBreadcrumb();
    this.appParamService.getAppParamsByType(APP_PARAMS_TYPE.SERVICE_STATUS).subscribe(res => {
      this.serviceModels = res.data;
    });
    console.log(this.router.getCurrentNavigation() ? this.router.getCurrentNavigation().extras.state.request : "1");
    this.buildForm();
    this.initSearchService();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngAfterViewInit(): void {

    this.codeRef.focus();
  }
  buildForm() {
    this.searchForm = this.formBuilder.group({
      code: new FormControl(null),
      name: new FormControl(null),
      serviceModel: new FormControl(null),
    });
  }
  setBreadcrumb() {
    this.breadcrumbs = [
      {
        name: this.translateService.instant('breadcrumb.catalog-management'),
        route: '',
      },
      {
        name: this.translateService.instant('breadcrumb.service-management'),
        route: '/catalog-management/service',
      },
    ];
    this.isBreadcrumb = true;
  }

  initSearchService() {
    this.request.sort = 'code';
    this.serviceMgmtService.getDataService(this.searchForm.value, this.request).subscribe(rs => {
      this.lstData = rs.data.content;
      this.total = rs.data.totalElements;
      console.log(this.lstData);
    });
  }
  nzOnSearch() {
    this.request.page = 0;
    this.initSearchService();
  }
  onCreate() {
    this.router.navigate(['/catalog-management/service/add']);
  }
  showEdit(id) {
    this.router.navigateByUrl('/catalog-management/service/update/'+`${id}`, {state: {page: this.request}});
  }
  showDeleteConfirm(data: any): void {
    this.isVisibleModalDelete = true;
    this.selectedCode = data.code;
    this.modelId = data.id;
  }
  delete(id) {
    this.spinner.show();
    this.serviceMgmtService.deleteService(id).subscribe(res => {
      this.spinner.hide();
      if (res.data.code === '-2') {
        this.toastService.openErrorToast(this.translateService.instant('catalog-management.service.not.delete.exists.inventory'));
        this.isVisibleModalDelete = false;
        return;
      } else {
        this.toastService.openSuccessToast(this.translateService.instant('catalog-management.service.delete.success'));
        if (this.lstData.length === 1) {
          this.request.page = this.request.page > 1 ? this.request.page - 1: this.request.page;
        }
        this.initSearchService();
        this.isVisibleModalDelete = false;
      }

    });
  }
  callBackModalDelete(event: any) {
  }

  onCancelModalDelete() {
    this.isVisibleModalDelete = false;
  }
  clearService() {
    this.searchForm.get('serviceModel').setValue(null);
  }
  selectChangeService() {
  }
  changeCurrentPage(currentPage: number) {
    this.request.page = currentPage;
    this.request.currentPage = currentPage;
    this.initSearchService();
  }
  changeItemPerPage(itemPerPage: number) {
    this.request.page = 0;
    this.request.size = itemPerPage;
    this.initSearchService();
  }


}
