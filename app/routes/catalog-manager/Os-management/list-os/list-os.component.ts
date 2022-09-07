import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '@shared';
import { NzModalService } from 'ng-zorro-antd';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppParamsService } from 'src/app/services/app-params/app-params.service';
import { OsManagementService } from 'src/app/services/os-management/os-management.service';
import { SCROLL_TABLE } from 'src/app/utils';

@Component({
  selector: 'app-list-os',
  templateUrl: './list-os.component.html',
  styleUrls: ['./list-os.component.less']
})
export class ListOsComponent implements OnInit, AfterViewInit, AfterViewChecked {
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

  };
  loading = false;
  SCROLL_TABLE = SCROLL_TABLE;
  isVisibleModalDelete: any;
  selectedCode: any;
  modelId: any;
  selectedId: any;
  // @ViewChild('codeRef', { static: false }) codeRef: InputTextComponent;


  constructor(public translateService: TranslateService,
    injector: Injector,
    private router: Router,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private osService: OsManagementService,
    private modal: NzModalService,
    private toastService: ToastService,
    private appParamService: AppParamsService) { }

  ngOnInit() {

    this.setBreadcrumb();
    this.buildForm();
    console.log(this.router.getCurrentNavigation() ? this.router.getCurrentNavigation().extras.state.request : "1");
    this.nzOnSearch(null);
  }

  ngAfterViewInit() {
    // this.codeRef.focus();
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
        name: this.translateService.instant('breadcrumb.os-management'),
        route: '/catalog-management/os',
      },
    ];
    this.isBreadcrumb = true;
  }

  nzOnSearch(event: any) {
    this.request.page = 0;
    this.request.size = 10;
    this.fetchSr();
  }

  fetchSr() {
    this.request.sort = 'name'
    this.osService.search(this.searchForm.value, this.request).subscribe(res => {
      this.lstData = res.data.content;
      this.total = res.data.totalElements;
    })
  }

  buildForm() {
    this.searchForm = this.formBuilder.group({
      name: new FormControl(null),
      image: new FormControl(null)
    });
  }

  onCreate() {
    this.router.navigate(['/catalog-management/os/add'])
  }


  changeCurrentPage(currentPage: number) {
    this.request.page = currentPage;
    this.fetchSr();
  }

  changeItemPerPage(itemPerPage: number) {
    this.request.page = 0;
    this.request.size = itemPerPage;
    this.fetchSr();
  }

  goToEdit(data: any) {
    this.router.navigate(['/catalog-management/os/detail/' + data.id], { state: { page: this.request } });
    console.log(data.id)
  }

  openModalDelete(data: any) {
    this.isVisibleModalDelete = true;
    this.selectedId = data.id;
  }

  callBackModalDelete(event: any) {
    this.osService.delete(this.selectedId).subscribe(res => {
      if (res.data != "1") {
        this.toastService.openErrorToast(this.translateService.instant('catalog-management.sr.delete.error', {
          code: this.selectedCode,
          srCode: res.data
        }), null);
        this.isVisibleModalDelete = false;
      } else {
        this.toastService.openSuccessToast(this.translateService.instant('catalog-management.sr.delete.success'), null);
        this.isVisibleModalDelete = false;
        if (this.lstData.length == 1) {
          this.request.page = this.request.page > 0 ? this.request.page - 1 : 0;
        }
        this.fetchSr();
      }
    })
  }

  onCancelModalDelete() {
    this.isVisibleModalDelete = false;
  }


}
