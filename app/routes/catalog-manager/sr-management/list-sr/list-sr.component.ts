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
import {AppParamsService} from "../../../../services/app-params/app-params.service";
import {ToastService} from "@shared";
import {FileManagerService} from "../../../../services/file-manager/file-manager.service";
import { SrService } from 'src/app/services/sr-management/sr.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-list-sr',
  templateUrl: './list-sr.component.html',
  styleUrls: ['./list-sr.component.less']
})
export class ListSrComponent implements OnInit, AfterViewInit, AfterViewChecked {
  private refreshPage: Subscription;
  searchForm: any;
  searchForm2: any;
  breadcrumbs: any = [];
  isBreadcrumb = false;
  total = 0;
  @ViewChild('codeRef', {static: false}) codeRef: InputTextComponent;
  lstData: any[] = [];
  request: any = {
    ...defaultRequestList,
  };
  SCROLL_TABLE = SCROLL_TABLE;
  isVisibleModalDelete: any;
  selectedCode: any;
  selectedId: any;

  constructor(public translateService: TranslateService,
              injector: Injector,
              private router: Router,
              private formBuilder: FormBuilder,
              private changeDetectorRef: ChangeDetectorRef,
              private spinner: NgxSpinnerService,
              private appParamService: AppParamsService,
              private srService: SrService,
              private toastService: ToastService,
              private fileManagerService: FileManagerService) {
  }

  ngOnInit() {

    this.setBreadcrumb();
    this.buildForm();
    console.log(this.router.getCurrentNavigation() ? this.router.getCurrentNavigation().extras.state.request : "1");
    this.nzOnSearch(null);
    this.refreshPage = interval(30000).subscribe(
      (val) => { this.refreshListSr() }
    )
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
        name: this.translateService.instant('breadcrumb.sr-management'),
        route: '/catalog-management/sr',
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
    this.request.sort = 'code,name'
    this.srService.search(this.searchForm.value, this.request).subscribe(res => {
      this.lstData = res.data.content;
      this.total = res.data.totalElements;
    })
  }

  refreshListSr() {
    this.searchForm2 = this.formBuilder.group({
      code: new FormControl(null),
      name: new FormControl(null),
      service: new FormControl(null),
    });
    this.request.sort = 'code,name';
    this.srService.search(this.searchForm2.value, this.request).subscribe(res => {
      this.lstData = res.data.content;
      this.total = res.data.totalElements;
    })
  }

  buildForm() {
    this.searchForm = this.formBuilder.group({
      code: new FormControl(null),
      name: new FormControl(null),
      service: new FormControl(null),
    });
  }

  onCreate() {
    this.router.navigate(['/catalog-management/sr/add'])
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

  onDownloadFile(fileId: any, fileName: any) {
    this.fileManagerService.downloadFileById(fileId, fileName);
  }

  goToEdit(data: any) {
    this.router.navigate(['/catalog-management/sr/detail/' + data.id], {state: {page: this.request}});
  }

  openModalDelete(data: any) {
    this.isVisibleModalDelete = true;
    this.selectedCode = data.code;
    this.selectedId = data.id;
  }

  callBackModalDelete(event: any) {
    this.srService.delete(this.selectedId).subscribe(res => {
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
