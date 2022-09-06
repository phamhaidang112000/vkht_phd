import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
  ViewChild
} from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { FormBuilder, FormControl } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd";
import { AppParamsService } from "../../../services/app-params/app-params.service";
import { APP_PARAMS_TYPE, SCROLL_TABLE } from "../../../utils";
// @ts-ignore
import { InstallationManagementService } from '../../../services/installation-management/installation-management.service';
import { ServiceManagementService } from "../../../services/service-management/service-management.service";
import { BehaviorSubject, Observable } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { FileManagerService } from "../../../services/file-manager/file-manager.service";
import { InputTextComponent } from "../../components/inputs/input-text/input-text.component";
import { ToastService } from "@shared";

@Component({
  selector: 'app-resource-setting',
  templateUrl: './resource-setting.component.html',
  styleUrls: ['./resource-setting.component.less']
})
export class ResourceSettingComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('codeRef', { static: false }) codeRef: InputTextComponent;
  breadcrumbs: any = [];
  isBreadcrumb = false;
  searchForm: any;
  lstData: any[] = [];
  total = 0;
  currentPage = 0;
  request: any = {
    page: 0,
    name: null,
    currentPage: 0,
    size: 10,
    sort: 'code,DESC'
  };
  searchService$ = new BehaviorSubject('');
  lstStatus: any[] = [];
  lstService: any[] = [];
  lstConnect: any[] = [];
  SCROLL_TABLE = SCROLL_TABLE;
  connectObj: any;
  // ********* EDIT START **************
  isViewConfirmCancel: any;
  lstFileImport: any[] = [];
  lstServiceModel: any[] = [];
  serviceModels: any[] = [];
  //********** EDIT END ****************

  constructor(
    private translateService: TranslateService,
    injector: Injector,
    private router: Router,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private modal: NzModalService,
    private appParamService: AppParamsService,
    private installationManagementService: InstallationManagementService,
    private serviceMgmtService: ServiceManagementService,
    private fileManagerService: FileManagerService,
    private toastService: ToastService,
  ) { }

  ngOnInit() {
    this.setBreadcrumb();
    this.appParamService.getAppParamsByType(APP_PARAMS_TYPE.SETTING_STATUS).subscribe(res => {
      this.lstStatus = res.data;
    });
    this.appParamService.getAppParamsByType(APP_PARAMS_TYPE.CONNECT_STATUS).subscribe(res => {
      this.lstConnect = res.data;
      this.searchForm.get('connectServer').patchValue(0);
    });
    this.serviceMgmtService.getAllServiceByName(null).subscribe(res => {
      this.lstService = res.data;
    })
    this.buildForm();
    this.initSearchService();
    this.nzOnSearch();
    // ****** EDIT START ***********
    setInterval(() => {
      this.nzOnSearch();
    }, 30000);
    // ****** EDIT END ************
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngAfterViewInit(): void {

    this.codeRef.focus();
  }
  setBreadcrumb() {
    this.breadcrumbs = [
      {
        name: this.translateService.instant('breadcrumb.resource-setting'),
        route: '',
      }
    ];
    this.isBreadcrumb = true;
  }
  buildForm() {
    this.searchForm = this.formBuilder.group({
      code: [null],
      name: null,
      serviceId: [null],
      unitRequest: [null],
      emailRequest: [null],
      connectServer: 0,
      statusSetting: [null],
      // ******** EDIT START *********
      fileImport: [null],
      serviceModel: [null]
      // ******* EDIT END *************
    });
  }
  initSearchService() {
    const optionList$: Observable<any> = this.searchService$.asObservable().pipe(debounceTime(500));
    optionList$.subscribe(value => {
      this.fetchService(value);
    });
  }

  fetchService(txtSearch) {
    this.serviceMgmtService.getAllServiceByName(txtSearch).subscribe(rs => {
      this.lstService = rs.data;
    });
  }
  nzOnSearch() {
    this.request.page = 0;
    this.fetchInstallation();
  }

  fetchInstallation() {
    this.installationManagementService.search(this.searchForm.value, this.request).subscribe(test => {
      this.lstData = test.data.content;
      this.total = test.data.totalElements;
    });
  }
  showEdit(id) {
    this.installationManagementService.getDetail(id).subscribe(res => {
      if (res && res.data.statusSetting == 4) {
        this.toastService.openErrorToast(this.translateService.instant('common.update.request.setting'));
        return;
      }
      this.router.navigate(['/installation/update' + `/${id}`]);
    }, error => {
    })
  }
  downFile(idx: number, fileName: any) {
    this.fileManagerService.downloadFileById(idx, fileName);
  }
  getConnectName(value) {
    const obj = this.lstConnect.find(x => x.value === value);
    return obj ? obj.name : '';
  }
  getColorTagConnect(value) {
    switch (value) {
      case 1: return 'disconnect';
      case 2: return 'connect';
    }
  }
  reSync(data) {
    this.spinner.show();
    this.installationManagementService.getDetail(data.id).subscribe(res => {
      if (res && res.data.statusSetting == 4) {
        this.toastService.openErrorToast(this.translateService.instant('common.update.request.setting'));
        return;
      }
      this.installationManagementService.reSyncData(data.id).subscribe(resData => {
        if (resData) {
          this.fetchInstallation();
          this.spinner.hide();
        }
      }, error => {
      }, () => {
        this.spinner.hide();
      });
    }, error => {
    }, () => {
      this.spinner.hide();
    });

  }
  getResultName(value) {
    const obj = this.lstStatus.find(x => x.value === value);
    return obj ? obj.name : '';
  }
  changeCurrentPage(currentPage: number) {
    this.request.page = currentPage;
    this.request.currentPage = currentPage;
    this.fetchInstallation();
  }
  changeItemPerPage(itemPerPage: number) {
    this.request.page = 0;
    this.request.size = itemPerPage;
    this.fetchInstallation();
  }
  getBackGround(data): string {
    if (data.statusSetting === 1) {
      return 'table-tr-not-setting';
    } else return '';
  }

  syncSR() {
    this.spinner.show();
    this.installationManagementService.syncSR().subscribe(res => {
      if (res) {
        this.fetchInstallation();
        this.spinner.hide();
      }
    }, error => {
    }, () => {
      this.spinner.hide();
    });
  }

  // ******** EDIT START ***********
  importExcel() {
    this.isViewConfirmCancel = true;
  }

  onCancelImport() {
    this.isViewConfirmCancel = false;
  }

  onCallBack() {
    this.nzOnSearch();
  }
  // ******** EDIT END ************
}
