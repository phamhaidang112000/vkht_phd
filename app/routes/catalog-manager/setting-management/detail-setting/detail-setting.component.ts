import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {APP_PARAMS_TYPE, REGEX, SCROLL_TABLE} from "../../../../utils";
import {AppParamsService} from "../../../../services/app-params/app-params.service";
import {BehaviorSubject, Observable} from "rxjs";
import {ToastService} from "@shared";
import {ActivatedRoute, Router} from "@angular/router";
import {InputTextComponent} from "../../../components/inputs/input-text/input-text.component";
import { SettingService } from 'src/app/services/setting-management/setting.service';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-detail-setting',
  templateUrl: './detail-setting.component.html',
  styleUrls: ['./detail-setting.component.less']
})
export class DetailSettingComponent implements OnInit , AfterViewInit {
  @ViewChild('codeRef', {static: false}) codeRef: InputTextComponent;
  @ViewChild('nameRef', {static: false}) nameRef: InputTextComponent;
  @ViewChild('location', {static: false}) locationRef: InputTextComponent;
  breadcrumbs: any = [];
  SCROLL_TABLE = SCROLL_TABLE;
  isBreadcrumb;
  addForm: any;
  continueAdd: any = false;
  services: any;
  listExcelFile: any = [];
  total: any = 0;
  searchService$ = new BehaviorSubject('');
  isSubmit: any = false;
  id: any;
  data: any;
  isViewConfirmCancel: any;
  isEdit = false;
  isMappingNull = false;
  code: any;
  request: any = {
    page: 0,
    name: null,
    currentPage: 0,
    size: 10,
    sort: 'code'
  };
  constructor(private translateService: TranslateService,
    private formBuilder: FormBuilder,
    private settingService: SettingService,
    private toastService: ToastService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private timeRefreshPage: DataService) { }

  ngOnInit() {
    this.buildForm();
    console.log(this.router.getCurrentNavigation() ? this.router.getCurrentNavigation().extras.state.request : "1");
    this.id = this.activatedRouter.snapshot.params['id'];
    if (this.id) {
      this.isEdit = true;
      this.loadData(this.id);
    }
    this.setBreadcrumb();
  }

  ngAfterViewInit() {
    if (this.id) {
      this.nameRef.focus()
    } else {
      this.codeRef.focus();
    }
  }

  buildForm() {
    this.addForm = this.formBuilder.group({
      id: null,
      projectName: new FormControl(null, Validators.maxLength(500)),
      openStackUser: new FormControl(null, Validators.maxLength(500)),
      openStackPass: new FormControl(null, Validators.maxLength(500)),
      openStackApi: new FormControl(null, Validators.maxLength(500)),
      timeRefreshPage: new FormControl(null, Validators.maxLength(500)),
    });
  }

  setBreadcrumb() {
    this.breadcrumbs = [
      {
        name: this.translateService.instant('breadcrumb.catalog-management'),
        route: '',
      },
      {
        name: this.translateService.instant('breadcrumb.setting-management'),
        route: '/catalog-management/setting',
      },
      {
        name: this.translateService.instant(!this.isEdit ? 'breadcrumb.setting-management.add' : 'breadcrumb.setting-management.edit'),
        route: '',
      },

    ];
    this.isBreadcrumb = true;
  }

  cancel() {
    this.router.navigate(["/catalog-management/setting/detail/1"]);
  }

  submitForm(checked: any) {
    this.isSubmit = true;
    for (const i in this.addForm.controls) {
      this.addForm.controls[i].markAsDirty();
      this.addForm.controls[i].updateValueAndValidity();
    }
    if (this.addForm.invalid) {
      const invalidFields = [].slice.call(
        document.getElementsByClassName("ng-invalid")
      );
      for (let i = 0; i < invalidFields.length; i++) {
        if (invalidFields[i].tagName.toLocaleUpperCase() === "INPUT") {
          invalidFields[i].focus();
          break;
        }
      }
    }

    if (this.addForm.valid) {
      let mapping = [];
      let fData = this.addForm.getRawValue();
      this.timeRefreshPage.setTimeRefreshPage(fData.timeRefreshPage);
      let data = {
        id: this.id,
        projectName: fData.projectName,
        openStackUser: fData.openStackUser,
        openStackPass: fData.openStackPass,
        openStackApi: fData.openStackApi,
        timeRefreshPage: fData.timeRefreshPage
      }
      this.settingService.save(data).subscribe(res => {
        console.log(res);
        if (res) {
          this.toastService.openSuccessToast(this.translateService.instant('catalog-management.setting.update.success'));
          this.cancel();
        }
      });
    }
  }

  loadData(id) {
    this.settingService.detail(id).subscribe(res => {
      this.data = res.data;
      this.code = res.data.projectName;
      console.log(this.data);
      this.addForm.patchValue(res.data);
    })
  }
  getValueField(item) {
    return this.addForm.get(item).value;
  }
}
