import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '@shared';
import { BehaviorSubject } from 'rxjs';
import { InputTextComponent } from 'src/app/routes/components/inputs/input-text/input-text.component';
import { OsManagementService } from 'src/app/services/os-management/os-management.service';
import { SCROLL_TABLE, REGEX } from 'src/app/utils';

@Component({
  selector: 'app-detail-os',
  templateUrl: './detail-os.component.html',
  styleUrls: ['./detail-os.component.less']
})
export class DetailOsComponent implements OnInit, AfterViewInit {
  @ViewChild('nameRef', {static: false}) nameRef: InputTextComponent;

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
  };

  constructor(private translateService: TranslateService,
              private formBuilder: FormBuilder,
              private osService: OsManagementService,
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
    }
  }

  buildForm() {
    this.addForm = this.formBuilder.group({
      id: null,
      name: new FormControl(null, Validators.maxLength(500)),
      image: new FormControl(null, Validators.maxLength(500)),
    });
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
      {
        name: this.translateService.instant(!this.isEdit ? 'breadcrumb.os-management.add' : 'breadcrumb.os-management.edit'),
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
      if (this.getValueField('name') || this.getValueField('image')) {
        this.isViewConfirmCancel = true;
      } else this.cancel();
    }
  }

  cancel() {
    this.router.navigate(["/catalog-management/os"]);
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
        image: fData.image
      }
      this.osService.save(data).subscribe(res => {
        console.log(res);
        if (res) {
          if (!this.id) {
            // if (res.data == "-2") {
            //   this.addForm.get('code').setErrors({'unique': true})
            // } else {
              this.toastService.openSuccessToast(this.translateService.instant('catalog-management.os.add.success'));
              if (!this.continueAdd) {
                this.cancel();
              } else {
                this.addForm.reset();
                this.listExcelFile = [];
              // }
            }
          } else {
            if (res.data != "1") {
              this.toastService.openErrorToast(this.translateService.instant('catalog-management.os.delete.error', {
                code: this.addForm.get('code').value,
                srCode: res.data
              }), null);
            }  else {
              this.toastService.openSuccessToast(this.translateService.instant('catalog-management.os.update.success'));
              this.cancel();
            }
          }
        }
      });
    }
  }

  loadData(id) {
    this.osService.detail(id).subscribe(res => {
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
    if (this.getValueField('name') != this.data.name) {
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