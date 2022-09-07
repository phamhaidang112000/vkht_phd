import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Injector,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {InputTextComponent} from "../../../components/inputs/input-text/input-text.component";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {APP_PARAMS_TYPE, COLUMNS, defaultRequestList, SCROLL_TABLE} from "../../../../utils";
import {AppParamsService} from "../../../../services/app-params/app-params.service";
import {ToastService} from "@shared";
import {FileManagerService} from "../../../../services/file-manager/file-manager.service";
import {ServerService} from "../../../../services/server-management/server.service";
import { interval, Subscription } from 'rxjs';
import { DataService } from '../../data.service';
import { SettingService } from 'src/app/services/setting-management/setting.service';

@Component({
  selector: 'app-list-server',
  templateUrl: './list-server.component.html',
  styleUrls: ['./list-server.component.less']
})
export class ListServerComponent implements OnInit, AfterViewInit, AfterViewChecked {
  searchForm: any;
  breadcrumbs: any = [];
  isBreadcrumb = false;
  total = 0;
  @ViewChild('codeRef', {static: false}) codeRef: InputTextComponent;
  lstData: any[] = [];
  listVM: any[] = [];
  private refreshPage: Subscription;
  request: any = {
    ...defaultRequestList,
  };
  SCROLL_TABLE = SCROLL_TABLE;
  isVisibleModalDelete: any;
  isRunAll: any;
  selectedCode: any;
  selectedName: any;
  searchForm2: any;
  selectedId: any;
  timeRefresh: string = "";
  check : boolean = true;
  @Input() isChecked = false;
  @Input() isCheckedAll = false;
  checkedChooseAll = false;

  constructor(public translateService: TranslateService,
              injector: Injector,
              private router: Router,
              private formBuilder: FormBuilder,
              private changeDetectorRef: ChangeDetectorRef,
              private serverService: ServerService,
              private toastService: ToastService,
              private fileManagerService: FileManagerService,
              private timeRefreshPage: DataService,
              private settingService: SettingService,
              private activatedRouter: ActivatedRoute,
              private dataService: DataService,
              ) {
  }

  ngOnInit() {
    this.setBreadcrumb();
    this.buildForm();
    console.log(this.router.getCurrentNavigation() ? this.router.getCurrentNavigation().extras.state.request : "1");
    this.nzOnSearch(null);
    this.timeRefreshPage.timeRefreshPage.subscribe((data) => {
      this.timeRefresh = data
    })
    this.refreshPage = interval(30000).subscribe(
      (val) => { this.refreshListVM() }
    );
    // if(this.timeRefresh == '') {
    //   this.settingService.detail(1).subscribe(
    //     (data) => {
    //       console.log("Refresh Page 1: " + data.data.timeRefreshPage);
    //       this.refreshPage = interval(parseInt(data.data.timeRefreshPage)).subscribe(
    //         (val) => { this.refreshListVM(data.data.timeRefreshPage) }
    //       );
    //     }
    //   )
    // } else {
    //   console.log("Refresh Page 2: " + this.timeRefresh);
    //   this.refreshPage = interval(parseInt(this.timeRefresh)).subscribe(
    //     (val) => { this.refreshListVM(this.timeRefresh) }
    //   );
    // }
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
        name: this.translateService.instant('breadcrumb.vm-management'),
        route: '/catalog-management/server',
      },
    ];
    this.isBreadcrumb = true;
  }

  nzOnSearch(event: any) {
    this.request.page = 0;
    this.request.size = 10;
    this.fetchServer();
  }

  refreshListVM() {
    this.searchForm2 = this.formBuilder.group({
      code: new FormControl(null),
      name: new FormControl(null),
      service: new FormControl(null),
    });
    this.request.sort = 'code,name';
    this.serverService.search(this.searchForm2.value, this.request).subscribe(res => {
      this.lstData = res.data.content;
      this.total = res.data.totalElements;
      if(this.check == false){
        this.lstData.sort((a,b)=>(a.isActive > b.isActive) ? 1 : -1);
        this.check=false;
      }
    })

  }
  fetchServer() {
    // this.request.sort = 'code,name'
    this.serverService.search(this.searchForm.value, this.request).subscribe(res => {
      this.lstData = res.data.content;
      this.total = res.data.totalElements;
    })
  }

  buildForm() {
    this.searchForm = this.formBuilder.group({
      code: new FormControl(null),
      name: new FormControl(null),
      ip: new FormControl(null),
    });
  }

  onCreate() {
    this.router.navigate(['/catalog-management/server/add'])
  }


  changeCurrentPage(currentPage: number) {
    this.request.page = currentPage;
    if(this.checkedChooseAll) {
      this.checkedChooseAll = false;
      this.listVM = [];
    }
    this.fetchServer();
  }

  changeItemPerPage(itemPerPage: number) {
    this.request.page = 0;
    this.request.size = itemPerPage;
    this.fetchServer();
  }

  onDownloadFile(fileId: any, fileName: any) {
    this.fileManagerService.downloadFileById(fileId, fileName);
  }

  goToEdit(data: any) {
    this.router.navigate(['/catalog-management/server/detail/' + data.id], {state: {page: this.request}});
  }

  goToEdits() {
    console.log(this.listVM);

    this.router.navigate(['/catalog-management/server/detail/' + this.listVM[0]], {state: {page: this.request}});
    this.listVM.shift();
    this.dataService.setListVM(this.listVM);
  }

  openModalDelete(data: any) {
    this.isVisibleModalDelete = true;
    this.selectedCode = data.code;
    this.selectedName = data.name;
    this.selectedId = data.id;
  }

  openModalRunAll() {
    if(this.listVM.length > 0) {
      console.log(this.listVM);
      this.isVisibleModalDelete = true;
      this.isRunAll = true;
    } else {
      this.toastService.openErrorToast(this.translateService.instant('catalog-management.vm.play.all.error'), null);
    }
  }
  callBackModalDelete(event: any) {
    if(this.isRunAll) {
      this.checkedChooseAll = false;
      this.listVM.forEach(idServer => {
        this.serverService.delete(idServer).subscribe(res => {
          if (res.data != "1") {
            this.toastService.openErrorToast(this.translateService.instant('catalog-management.vm.play.error'), null);
            this.isVisibleModalDelete = false;
          } else {
            this.toastService.openSuccessToast(this.translateService.instant('catalog-management.vm.play.success'), null);
            this.isVisibleModalDelete = false;
            if (this.lstData.length == 1) {
              this.request.page = this.request.page > 0 ? this.request.page - 1 : 0;
            }
            this.fetchServer();
          }
        })
      })
      this.listVM = []
    } else {
      this.serverService.delete(this.selectedId).subscribe(res => {
        if (res.data != "1") {
          this.toastService.openErrorToast(this.translateService.instant('catalog-management.vm.play.error', {
            code: this.selectedCode,
            name: this.selectedName,
            srCode: res.data
          }), null);
          this.isVisibleModalDelete = false;
        } else {
          this.toastService.openSuccessToast(this.translateService.instant('catalog-management.vm.play.success'), null);
          this.isVisibleModalDelete = false;
          if (this.lstData.length == 1) {
            this.request.page = this.request.page > 0 ? this.request.page - 1 : 0;
          }
          this.fetchServer();
        }
      })
    }
  }

  onCancelModalDelete() {
    this.isVisibleModalDelete = false;
  }

  sortIsActive(){
    if(this.check){
      this.lstData.sort((a,b)=>(a.isActive > b.isActive) ? 1 : -1);
      this.check=false;
    }else{
      this.serverService.search(this.searchForm.value, this.request).subscribe(res => {
        this.lstData = res.data.content;
        this.total = res.data.totalElements;
      });
      this.check=true;
    }
  }

  onChangeChecked(isChecked, data: any){
    if(isChecked) {
      this.listVM.push(data.id);
    }
    else {
      this.listVM = this.listVM.filter((value, index) => value != data.id)
    }
  }

  checkedAll(isCheckedAll) {
    this.listVM = [];
    if(isCheckedAll) {
      this.lstData.forEach((data, index) => {
        this.listVM.push(data);
      })
    } else {
      this.listVM = [];
    }
  }
}
