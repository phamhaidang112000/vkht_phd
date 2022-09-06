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
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {ServiceManagementService} from "../../../../services/service-management/service-management.service";
import {AppParamsService} from "../../../../services/app-params/app-params.service";
import {InputTextComponent} from "../../../components/inputs/input-text/input-text.component";
import {APP_PARAMS_TYPE, REGEX} from "../../../../utils";
import {ToastService} from "@shared";
import {Observable} from "rxjs";

@Component({
  selector: 'app-detail-service',
  templateUrl: './detail-service.component.html',
  styleUrls: ['./detail-service.component.less']
})
export class DetailServiceComponent implements OnInit, AfterViewInit, AfterViewChecked {
  action: any;
  data: any;
  isEdit: any;
  breadcrumbs: any = [];
  isBreadcrumb = false;
  formSave!: FormGroup;
  services: any[] = [];
  continue = false;
  isViewConfirmCancel: any;
  id: any;

  @ViewChild('codeRef', {static: false}) codeRef: InputTextComponent;
  @ViewChild('nameRef', {static: false}) nameRef: InputTextComponent;

  constructor(private translateService: TranslateService,
              injector: Injector,
              private router: Router,
              private formBuilder: FormBuilder,
              private changeDetectorRef: ChangeDetectorRef,
              private spinner: NgxSpinnerService,
              private serviceMgmtService: ServiceManagementService,
              private toastService: ToastService,
              private appParamService: AppParamsService,
              private activatedRouter: ActivatedRoute) {
    this.buildForm();

  }

  ngOnInit() {
    console.log(this.router.getCurrentNavigation() ? this.router.getCurrentNavigation().extras.state.request : "1");
    this.appParamService.getAppParamsByType(APP_PARAMS_TYPE.SERVICE_STATUS).subscribe(res => {
      this.services = res.data;
    });
    this.id = this.activatedRouter.snapshot.params.id;
    if (this.id) {
      this.action = 'UPDATE';
      this.loadData(this.id);
    } else {
      this.action = 'INSERT';
    }
    this.setBreadcrumb();
  }

  buildForm() {
    this.formSave = this.formBuilder.group({
      id: null,
      code: [null, [Validators.required, Validators.maxLength(500), Validators.pattern(REGEX.VALIDATE_CODE_NOT_SPACE)]],
      name: [null, [Validators.required, Validators.maxLength(500)]],
      serviceModelIds: [null, [Validators.required]],
      serviceModelLocation: new FormControl(null, [Validators.pattern(REGEX.LIMIT), Validators.maxLength(5), Validators.required]),
      note: [null, [Validators.maxLength(5000)]]
    });
  }

  async loadData(id: any) {
    this.serviceMgmtService.getDetail(id).subscribe(res => {
      if (res) {
        this.data = res.data;
        this.setValueForm(this.data);
      }
    });
  }

  submitForm() {
    if (this.formSave.valid) {
      this.serviceMgmtService.saveService(this.formSave.value).subscribe(res => {
        if (res.data.code === '-2') {
          this.codeRef.ngControl.control.setErrors({'unique': true});
          return;
        }
        if (this.continue) {
          this.toastService.openSuccessToast(this.translateService.instant('catalog-management.service.save.success'))
          this.formSave.reset();
        } else {
          if (this.action === 'INSERT')
            this.toastService.openSuccessToast(this.translateService.instant('catalog-management.service.save.success'));
          else this.toastService.openSuccessToast(this.translateService.instant('catalog-management.service.update.success'));
          this.router.navigate(['/catalog-management/service'])
        }
      }, error => {
        this.toastService.openErrorToast(this.translateService.instant(''), null);
        return;
      });
    } else {
      Object.values(this.formSave.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }

  confirmCancel() {
    if (this.action === 'INSERT') {
      if (this.validValueFormAdd()) {
        this.isViewConfirmCancel = true;
      } else {
        this.cancel();
      }
    } else {
      if (this.validValueFormEdit()) {
        this.isViewConfirmCancel = true;
      } else {
        this.cancel();
      }
    }
  }

  cancel() {
    this.router.navigate(['/catalog-management/service'])
  }

  clearService() {

  }

  blur(event) {
    event.target.value = event.target.value.replace(REGEX.$NOT_SPECIAL_CHARACTERS, '');
  }

  setValueForm(item: any) {
    this.setValueField('id', item.id);
    this.setValueField('code', item.code);
    this.setValueField('name', item.name);
    const serviceModel = item.serviceModel.split(',');
    const arrayModel = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < serviceModel.length; i++) {
      if (serviceModel[i]) {
        arrayModel.push(+(serviceModel[i]));
      }
    }
    this.setValueField('serviceModelIds', arrayModel);
    this.setValueField('serviceModelLocation', item.serviceModelLocation);
    this.setValueField('note', item.note);
  }

  selectChangeService() {
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
      {
        name: this.translateService.instant(this.action === "INSERT" ? 'breadcrumb.service-management-add' : 'breadcrumb.service-management-edit'),
        route: ''
      }
    ];
    this.isBreadcrumb = true;
  }

  setValueField(item: any, value: any) {
    this.formSave.get(item).patchValue(value);
  }

  ngAfterViewChecked(): void {

  }

  ngAfterViewInit(): void {
    if (this.action === 'INSERT') {
      this.codeRef.focus();
    } else if (this.action === 'UPDATE') {
      this.nameRef.focus();
      this.codeRef.disabled = true;
    }
  }

  validValueFormEdit(): boolean {
    const serviceModel = this.data.serviceModel.split(',');
    const arrayModel = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < serviceModel.length; i++) {
      if (serviceModel[i]) {
        arrayModel.push(+(serviceModel[i]));
      }
    }
    if (this.getValueField('code') !== this.data.code ||
      this.getValueField('name') !== this.data.name ||
      !this.compareList(this.getValueField('serviceModelIds'), arrayModel) ||
      this.getValueField('serviceModelLocation') !== this.data.serviceModelLocation ||
      this.getValueField('note') !== this.data.note) {
      return true;
    }
  }

  compareList(lst1, lst2): boolean {
    if (lst1.length != lst2.length) {
      return false;
    }
    let err = true;
    lst1.forEach(it => {
      if (lst2.indexOf(it) == -1) {
        err = false;
      }
    })
    lst2.forEach(it => {
      if (lst1.indexOf(it) == -1) {
        err = false;
      }
    })
    return err;
  }

  validValueFormAdd(): boolean {
    if (this.getValueField('code') || this.getValueField('name')
      || this.getValueField('serviceModelLocation')
      || this.getValueField('note') || this.getValueField('serviceModelIds')) {
      return true;
    }
    return false;
  }

  onCancelConfirm() {
    this.isViewConfirmCancel = false;
  }

  getValueField(item) {
    return this.formSave.get(item).value;
  }

  onUpperCase(event) {
    this.formSave.get('serviceModelLocation').setValue(event.target.value.toUpperCase());
  }
}
