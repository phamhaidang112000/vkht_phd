import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {APP_PARAMS_TYPE, REGEX, SCROLL_TABLE} from "../../../../utils";
import {AppParamsService} from "../../../../services/app-params/app-params.service";
import {BehaviorSubject, Observable} from "rxjs";
import {ToastService} from "@shared";
import {ActivatedRoute, Router} from "@angular/router";
import {InputTextComponent} from "../../../components/inputs/input-text/input-text.component";
import { ServerGroupService } from 'src/app/services/server-group-management/server-group.service';

@Component({
  selector: 'app-detail-server-group',
  templateUrl: './detail-server-group.component.html',
  styleUrls: ['./detail-server-group.component.less']
})
export class DetailServerGroupComponent implements OnInit , AfterViewInit{
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
    private serverGroupService: ServerGroupService,
    private toastService: ToastService,
    private router: Router,
    private activatedRouter: ActivatedRoute) { }

  ngOnInit() {    this.buildForm();
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
      id: new FormControl(null, [Validators.maxLength(500), Validators.pattern(REGEX.VALIDATE_CODE_NOT_SPACE)]),
      name: new FormControl(null, Validators.maxLength(500)),
      serverGroup: new FormControl(null, Validators.maxLength(500)),
    });
  }

  setBreadcrumb() {
    this.breadcrumbs = [
      {
        name: this.translateService.instant('breadcrumb.catalog-management'),
        route: '',
      },
      {
        name: this.translateService.instant('breadcrumb.server-group-management'),
        route: '/catalog-management/server-group',
      },
      {
        name: this.translateService.instant(!this.isEdit ? 'breadcrumb.server-group-management.add' : 'breadcrumb.server-group-management.edit'),
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
    }else this.cancel();
  }

  cancel() {
    this.router.navigate(["/catalog-management/server-group"]);
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
        name: fData.name,
        serverGroup: fData.serverGroup,
      }
      this.serverGroupService.save(data).subscribe(res => {
        console.log(res);
        if (res) {
          if (!this.id) {
            if (res.data == "-2") {
              this.addForm.get('code').setErrors({'unique': true})
            } else {
              this.toastService.openSuccessToast(this.translateService.instant('catalog-management.server-group.add.success'));
              if (!this.continueAdd) {
                this.cancel();
              } else {
                this.addForm.reset();
              }
            }
          } else {
            if (res.data != "1") {
              this.toastService.openErrorToast(this.translateService.instant('catalog-management.server-group.delete.error', {
                code: this.addForm.get('code').value,
                srCode: res.data
              }), null);
            }  else {
              this.toastService.openSuccessToast(this.translateService.instant('catalog-management.server-group.update.success'));
              this.cancel();
            }
          }
        }
      });
    }
  }

  loadData(id) {
    this.serverGroupService.detail(id).subscribe(res => {
      this.data = res.data;
      this.code = res.data.code;
      console.log(this.data);
      this.addForm.patchValue(res.data);
    })
  }
  checkDataForm(): boolean {
    console.log(this.addForm.value);
    console.log(this.data);
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
