import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {APP_PARAMS_TYPE, REGEX, SCROLL_TABLE} from "../../../../utils";
import {AppParamsService} from "../../../../services/app-params/app-params.service";
import {BehaviorSubject, Observable} from "rxjs";
import {ToastService} from "@shared";
import {ActivatedRoute, Router} from "@angular/router";
import {InputTextComponent} from "../../../components/inputs/input-text/input-text.component";
import { SrService } from 'src/app/services/sr-management/sr.service';

@Component({
  selector: 'app-detail-sr',
  templateUrl: './detail-sr.component.html',
  styleUrls: ['./detail-sr.component.less']
})
export class DetailSrComponent implements OnInit, AfterViewInit {
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
              private srService: SrService,
              private toastService: ToastService,
              private router: Router,
              private activatedRouter: ActivatedRoute) {
  }

  ngOnInit() {

    this.buildForm();
    console.log(this.router.getCurrentNavigation() ? this.router.getCurrentNavigation().extras.state.request : "1");
    this.id = this.activatedRouter.snapshot.params['id'];
    if (this.id) {
      this.isEdit = true;
      this.loadData(this.id);
      this.addForm.get('code').disable()
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
      code: new FormControl(null, [Validators.maxLength(500), Validators.pattern(REGEX.VALIDATE_CODE_NOT_SPACE)]),
      name: new FormControl(null, Validators.maxLength(500)),
      service: new FormControl(null, Validators.maxLength(500)),
      unit: new FormControl(null, Validators.maxLength(500)),
      email: new FormControl(null, Validators.maxLength(500)),
      fileExcel: new FormControl()
    });
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
      {
        name: this.translateService.instant(!this.isEdit ? 'breadcrumb.sr-management.add' : 'breadcrumb.sr-management.edit'),
        route: '',
      },

    ];
    this.isBreadcrumb = true;
  }
  cancelConfirm() {
    if (this.data) {
      if (this.checkDataForm()) {
        this.isViewConfirmCancel = true;
      } else {
        this.cancel();
      }
    } else {
      if (this.getValueField('code') || this.getValueField('name')
      || this.getValueField('fileExcel')) {
        this.isViewConfirmCancel = true;
      } else this.cancel();
    }
  }

  cancel() {
    this.router.navigate(["/catalog-management/sr"]);
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
      let data = {
        id: this.id,
        code: fData.code,
        name: fData.name,
        service: fData.service,
        unit: fData.unit,
        email: fData.email,
        excelFileId: this.listExcelFile[0].id,
      }
      this.srService.save(data).subscribe(res => {
        console.log(res);
        if (res) {
          if (!this.id) {
            if (res.data == "-2") {
              this.addForm.get('code').setErrors({'unique': true})
            } else {
              this.toastService.openSuccessToast(this.translateService.instant('catalog-management.sr.add.success'));
              if (!this.continueAdd) {
                this.cancel();
              } else {
                this.addForm.reset();
                this.listExcelFile = [];
              }
            }
          } else {
            if (res.data != "1") {
              this.toastService.openErrorToast(this.translateService.instant('catalog-management.sr.delete.error', {
                code: this.addForm.get('code').value,
                srCode: res.data
              }), null);
            }  else {
              this.toastService.openSuccessToast(this.translateService.instant('catalog-management.sr.update.success'));
              this.cancel();
            }
          }
        }
      });
    }
  }

  eventDeleteFileFromModal(event: any, number: number) {
    console.log(event);
    if (number == 1) {
      this.listExcelFile.remove(event);
    }
  }

  fetchFile(event: any, number: number) {
    console.log(event);
    if (number == 1) {
      this.listExcelFile = event;
    }
  }

  loadData(id) {
    this.srService.detail(id).subscribe(res => {
      this.data = res.data;
      this.code = res.data.code;
      console.log(this.data);
      this.addForm.patchValue(res.data);
      this.listExcelFile = res.data.excelFileDTO ? [res.data.excelFileDTO] : [];
    })
  }
  checkDataForm(): boolean {
    console.log(this.addForm.value);
    console.log(this.data);
    if (this.getValueField('name') != this.data.name
      || this.listExcelFile[0].fileName != (this.data.excelFileDTO ? this.data.excelFileDTO.fileName : null)) {
      return true;
    }
    return false;
  }

  onblurChange(event: any, place: any, type: any) {
    if(type === 2 && place.control.value){
      place.control.patchValue(place.control.value.toUpperCase());
    }

    if (!event.target.value.match(REGEX.VALIDATE_CODE_NOT_SPACE)) {
      place.control.setErrors({'pattern': true});
      return;
    }
    if (!event.target.value) {
      place.control.setErrors({'required': true});
      return;
    }
    if (!event.target.value.match(REGEX.LIMIT) && type !== 1) {
      place.control.setErrors({'excelPattern': true});
      return;
    }
  }
  onCancelConfirm() {
    this.isViewConfirmCancel = false;
  }
  getValueField(item) {
    return this.addForm.get(item).value;
  }
}
