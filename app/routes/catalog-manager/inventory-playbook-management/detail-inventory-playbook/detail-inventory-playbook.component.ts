import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { APP_PARAMS_TYPE, REGEX, SCROLL_TABLE } from "../../../../utils";
import { AppParamsService } from "../../../../services/app-params/app-params.service";
import { BehaviorSubject, Observable } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { ServiceManagementService } from "../../../../services/service-management/service-management.service";
import { InventoryPlaybookService } from "../../../../services/inventory-playbook/inventory-playbook.service";
import { ToastService } from "@shared";
import { ActivatedRoute, Router } from "@angular/router";
import { InputTextComponent } from "../../../components/inputs/input-text/input-text.component";
import { type } from "os";

@Component({
  selector: 'app-detail-inventory-playbook',
  templateUrl: './detail-inventory-playbook.component.html',
  styleUrls: ['./detail-inventory-playbook.component.less']
})
export class DetailInventoryPlaybookComponent implements OnInit, AfterViewInit {
  @ViewChild('codeRef', { static: false }) codeRef: InputTextComponent;
  @ViewChild('nameRef', { static: false }) nameRef: InputTextComponent;
  @ViewChild('location', { static: false }) locationRef: InputTextComponent;
  breadcrumbs: any = [];
  SCROLL_TABLE = SCROLL_TABLE;
  isBreadcrumb;
  addForm: any;
  serviceModels: any[];
  selectServiceModal: any = [];
  continueAdd: any = false;
  services: any;
  listFileInventory: any = [];
  listFilePlayBook: any = [];
  listFilePlayBookUnis: any = []
  total: any = 0;
  lstDataMapping: any = [];
  lstMappingCurrent: any = [];
  searchService$ = new BehaviorSubject('');
  isSubmit: any = false;
  id: any;
  selectedService: any;
  selectedModel: any;
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

  //************* EDIT START ************************
  lstMappingSettingCurrent: any = [];
  listFileNameInventory: any = [];
  listFileNamePlaybook: any = [];
  listFileNamePlaybookUninstall: any = [];
  lstDataSetupMapping: any = [];
  isMappingSetupNull = false;
  lstFileName: any[] = [];
  //************* EDIT END ************************


  constructor(private translateService: TranslateService,
    private formBuilder: FormBuilder,
    private appParamService: AppParamsService,
    private serviceMgmtService: ServiceManagementService,
    private inventoryPlaybookService: InventoryPlaybookService,
    private toastService: ToastService,
    private router: Router,
    private activatedRouter: ActivatedRoute) {
  }

  ngOnInit() {

    this.buildForm();
    this.appParamService.getAppParamsByType(APP_PARAMS_TYPE.SERVICE_STATUS).subscribe(res => {
      this.serviceModels = res.data;
    });
    console.log(this.router.getCurrentNavigation() ? this.router.getCurrentNavigation().extras.state.request : "1");
    this.id = this.activatedRouter.snapshot.params['id'];
    this.initSearchService();
    this.fetchService("");
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
      service: new FormControl(null),
      serviceModel: new FormControl(null),
      fileInventory: new FormControl(),
      //************* EDIT START ************************
      filePath: new FormControl(null, Validators.maxLength(500)),
      inventoryFileName: new FormControl(null),
      playbookFileName: new FormControl(null),
      playbookUnsName: new FormControl(null),
      //************* EDIT END ************************
    });
  }

  setBreadcrumb() {
    this.breadcrumbs = [
      {
        name: this.translateService.instant('breadcrumb.catalog-management'),
        route: '',
      },
      {
        name: this.translateService.instant('breadcrumb.inventory-playbook-management'),
        route: '/catalog-management/inventory-playbook',
      },
      {
        name: this.translateService.instant(!this.isEdit ? 'breadcrumb.inventory-playbook-management.add' : 'breadcrumb.inventory-playbook-management.edit'),
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
      if (this.getValueField('code') || this.getValueField('name') || this.getValueField('service')
        || this.getValueField('serviceModel')
        || this.getValueField('fileInventory') || this.lstDataMapping.length > 0 || this.listFilePlayBook.length > 0
        || this.listFilePlayBookUnis.length > 0) {
        this.isViewConfirmCancel = true;
      } else this.cancel();
    }
  }

  cancel() {
    this.router.navigate(["/catalog-management/inventory-playbook"]);
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
    let hasErr = false;
    if (this.lstDataMapping.length > 0) {
      this.lstDataMapping.forEach(it => {
        const typePlace = typeof it.placeGNOC;
        // @ts-ignore
        if (!it.variableInventory || (it.variableInventory.control && !it.variableInventory.control.value)) {
          it.variableInventory.control.markAsDirty();
          it.variableInventory.control.updateValueAndValidity();
          it.isRequireVariable = true;
          hasErr = true;
        }


        // @ts-ignore
        if (typePlace == 'object' ? !it.placeGNOC.control.value : !it.placeGNOC) {
          it.placeGNOC.control.markAsDirty();
          it.placeGNOC.control.updateValueAndValidity();
          it.isRequireGnoc = true;
          hasErr = true;
        } else {
          if (typeof it.placeGNOC == 'string') {
            if (!it.placeGNOC.match(REGEX.LIMIT)) {
              hasErr = true;
            }
          }
        }
      })
    } else {
      this.isMappingNull = true;
      return;
    }
    //***************************EDIT START *************************
    if (this.lstDataSetupMapping.length > 0) {
      this.lstDataSetupMapping.forEach(it => {
        console.log(it)
        const typePlace = typeof it.placeGNOC;
        // @ts-ignore
        if (!it.variableSetting || (it.variableSetting.control && !it.variableSetting.control.value)) {
          it.variableSetting.control.markAsDirty();
          it.variableSetting.control.updateValueAndValidity();
          it.isRequireVariable = true;
          hasErr = true;
        }


        // @ts-ignore
        if (typePlace == 'object' ? !it.placeGNOC.control.value : !it.placeGNOC) {
          it.placeGNOC.control.markAsDirty();
          it.placeGNOC.control.updateValueAndValidity();
          it.isRequireGnocMapping = true;
          hasErr = true;
        } else {
          if (typeof it.placeGNOC == 'string') {
            if (!it.placeGNOC.match(REGEX.LIMIT)) {
              hasErr = true;
            }
          }
        }
      })
    } else {
      console.log('null')
      this.isMappingSetupNull = true;
      return;
    }
    //***************************EDIT END *************************


    if (hasErr || this.listFileInventory.length == 0 || this.listFilePlayBook.length == 0 || this.listFilePlayBookUnis.length == 0) {
      return;
    }

    if (this.addForm.valid) {
      let mapping = [];
      this.lstDataMapping.forEach(it => {
        mapping.push({ variableInventory: it.variableInventory.value, placeGNOC: it.placeGNOC.value || it.placeGNOC })
      });
      //*********************** EDIT START *********************
      let setupMapping = [];
      this.lstDataSetupMapping.forEach(it => {
        setupMapping.push({ variableSetting: it.variableSetting.value, placeGNOC: it.placeGNOC.value || it.placeGNOC })
      });
      // ******************** EDIT END ***********************
      let fData = this.addForm.getRawValue();
      let data = {
        id: this.id,
        code: fData.code,
        name: fData.name,
        service: fData.service,
        serviceModel: fData.serviceModel,
        inventoryFileId: this.listFileInventory[0].id,
        playbookFileId: this.listFilePlayBook[0].id,
        playbookUnsFileId: this.listFilePlayBookUnis[0].id,
        listMappingInventory: mapping,
        // **************************EDIT START******************
        filePath: fData.filePath,
        inventoryFileName: fData.inventoryFileName,
        playbookFileName: fData.playbookFileName,
        playbookUnsName: fData.playbookUnsName,
        listMappingSetting: setupMapping
        // ************************** EDIT END***********************
      }
      this.inventoryPlaybookService.save(data).subscribe(res => {
        console.log(res);
        if (res) {
          if (!this.id) {
            if (res.data == "-2") {
              this.addForm.get('code').setErrors({ 'unique': true })
            } else if (res.data == "-3") {
              this.toastService.openErrorToast(this.translateService.instant('catalog-management.inventory.add.error2', {
                key1: this.selectedService.name,
                key2: this.selectedModel.name
              }));
            } else {
              this.toastService.openSuccessToast(this.translateService.instant('catalog-management.inventory.add.success'));
              if (!this.continueAdd) {
                this.cancel();
              } else {
                this.addForm.reset();
                this.listFilePlayBookUnis = [];
                this.listFilePlayBook = [];
                this.lstDataMapping = [];
                // ********** EDIT START ************
                this.isSubmit = false;
                //*********** EDIT END **************
              }
            }
          } else {
            if (res.data == "-3") {
              this.toastService.openErrorToast(this.translateService.instant('catalog-management.inventory.update.error', {
                key1: this.selectedService.name,
                key2: this.selectedModel.name
              }));
            } else if (res.data != "1") {
              this.toastService.openErrorToast(this.translateService.instant('catalog-management.inventory.delete.error', {
                code: this.addForm.get('code').value,
                srCode: res.data
              }), null);
            } else {
              this.toastService.openSuccessToast(this.translateService.instant('catalog-management.inventory.update.success'));
              this.cancel();
            }
          }
        }
      });
    }
  }

  selectChangeService(event) {
    console.log(event);
    this.selectedService = event;
    if (event) {
      let ids = event.serviceModel.split(',');
      this.selectServiceModal = this.serviceModels.filter(x => ids.indexOf('' + x.value) > -1);
      this.addForm.get('serviceModel').patchValue(null);
    } else {
      this.addForm.get('serviceModel').patchValue(null);
    }
  }

  onChangeModel(event) {
    this.selectedModel = event;
  }

  eventDeleteFileFromModal(event: any, number: number) {
    console.log(event);
    if (number == 1) {
      this.listFileInventory.remove(event);
    }
    if (number == 2) {
      this.listFilePlayBook.remove(event);
    }
    if (number == 3) {
      this.listFilePlayBookUnis.remove(event);
    }
  }

  fetchFile(event: any, number: number) {
    console.log(event);
    if (number == 1) {
      this.listFileInventory = event;
    }
    if (number == 2) {
      this.listFilePlayBook = event;
    }
    if (number == 3) {
      this.listFilePlayBookUnis = event;
    }
  }

  onCreateMapping(type) {
    this.lstMappingCurrent = [];
    this.lstDataMapping.push({ variableInventory: "", placeGNOC: "" });
    this.lstDataMapping = [...this.lstDataMapping];
    // this.total = this.lstDataMapping.length;
    // for (let i = this.request.page === 0 ? 0 : this.request.page; i < this.lstDataMapping.length; i++) {
    //   if (i - (this.request.page === 0 ? 0 : this.request.page * this.request.size) > this.request.size - 1) break;
    //   this.lstMappingCurrent.push(this.lstDataMapping[i]);
    // }

    // ************* EDIT START ******************
    this.lstMappingSettingCurrent = [];
    if (type === 'INVENTORY') {
      this.lstDataMapping.push({ variableInventory: "", placeGNOC: "" });
      this.lstDataMapping = [...this.lstDataMapping];
    } else if (type === 'INVENTORY_SETUP') {
      this.lstDataSetupMapping.push({ variableSetting: "", placeGNOC: "" });
      this.lstDataSetupMapping = [...this.lstDataSetupMapping];
    }
    // ************ EDIT END ***********************
  }


  initSearchService() {
    const optionList$: Observable<any> = this.searchService$.asObservable().pipe(debounceTime(500));
    optionList$.subscribe(value => {
      this.fetchService(value);
    });
  }

  fetchService(txtSearch) {
    this.serviceMgmtService.getAllServiceByName(txtSearch).subscribe(rs => {
      this.services = rs.data;
    });
  }

  onDeleteMapping(index, type) {
    this.lstDataMapping.splice(index, 1);
    this.lstDataMapping = [...this.lstDataMapping];
    // this.lstMappingCurrent.splice(index, 1);
    // this.lstDataMapping.splice((this.request.page === 0 ? 0 : this.request.page * this.request.size) + index, 1);
    // console.log(this.lstMappingCurrent);
    // this.lstMappingCurrent = [...this.lstMappingCurrent];
    // if (this.lstMappingCurrent.length === 0 && this.request.page > 0) {
    //   this.changeCurrentPage(this.request.page - 1);
    // }
    // this.total = this.lstDataMapping.length;
    // this.lstDataMapping = [...this.lstDataMapping]

    // ************ EDIT START ****************
    if (type === 'INVENTORY') {
      this.lstDataMapping.splice(index, 1);
      this.lstDataMapping = [...this.lstDataMapping];
    } else if ('INVENTORY_SETUP') {
      this.lstDataSetupMapping.splice(index, 1);
      this.lstDataSetupMapping = [...this.lstDataSetupMapping];
    }
    // *********** EDIT END *******************
  }

  loadData(id) {
    this.lstMappingCurrent = [];
    //*********** EDIT START ***********/
    this.lstMappingSettingCurrent = [];
    //********** EDIT END ************ */
    this.inventoryPlaybookService.detail(id).subscribe(res => {
      this.data = res.data;
      this.code = res.data.code;
      console.log(this.data);
      this.addForm.patchValue(res.data);
      this.lstDataMapping = res.data.listMappingInventory;
      // *********** EDIT START ***************
      this.lstDataSetupMapping = res.data.listMappingSetting;
      // *********** EDIT END *****************
      this.listFileInventory = res.data.inventoryFileDTO ? [res.data.inventoryFileDTO] : [];
      this.listFilePlayBook = res.data.playbookFileDTO ? [res.data.playbookFileDTO] : [];
      this.listFilePlayBookUnis = res.data.playbookUnsDTO ? [res.data.playbookUnsDTO] : [];
      if (this.lstDataMapping) {
        this.lstMappingCurrent = [...this.lstDataMapping];
      }


      // *********** EDIT START ***************
      if (this.lstDataSetupMapping) {
        this.lstMappingSettingCurrent = [...this.lstDataSetupMapping];
      }
      if (res.data.filePath) {
        this.inventoryPlaybookService.getListFolderSetting(res.data.filePath).subscribe(resFilePath => {
          if (resFilePath) {
            this.listFileNameInventory = resFilePath.data;
            this.listFileNamePlaybook = resFilePath.data;
            this.listFileNamePlaybookUninstall = resFilePath.data;
          }
        });
      }
      // ********** EDIT END *****************

      // let service = this.services.filter(it => it.id == res.data.service);
      // this.selectChangeService(service);
    })
  }
  checkDataForm(): boolean {
    console.log(this.addForm.value);
    console.log(this.data);
    if (this.getValueField('name') != this.data.name || this.getValueField('service') != this.data.service
      || this.getValueField('serviceModel') != this.data.serviceModel
      // || this.getValueField('serviceModelLocation') != this.data.serviceModelLocation
      || this.lstDataMapping.length != (this.data.listMappingInventory ? this.data.listMappingInventory.length : 0)
      //******** EDIT START *********** */
      || this.listFileInventory.length == 0 || this.listFilePlayBook.length == 0 || this.listFilePlayBookUnis.length == 0
      //******** EDIT END ************** */
      || this.listFileInventory[0].fileName != (this.data.inventoryFileDTO ? this.data.inventoryFileDTO.fileName : null)
      || this.listFilePlayBook[0].fileName != (this.data.playbookFileDTO ? this.data.playbookFileDTO.fileName : null)
      || this.listFilePlayBookUnis[0].fileName != (this.data.playbookUnsDTO ? this.data.playbookUnsDTO.fileName : null)) {
      return true;
    }
    return false;
  }

  onblurChange(event: any, place: any, type: any) {
    if (type === 2 && place.control.value) {
      place.control.patchValue(place.control.value.toUpperCase());
    }

    if (!event.target.value.match(REGEX.VALIDATE_CODE_NOT_SPACE)) {
      place.control.setErrors({ 'pattern': true });
      return;
    }
    if (!event.target.value) {
      place.control.setErrors({ 'required': true });
      return;
    }
    if (!event.target.value.match(REGEX.LIMIT) && type !== 1) {
      place.control.setErrors({ 'excelPattern': true });
      return;
    }
  }
  // changeCurrentPage(currentPage: number) {
  //   this.request.page = currentPage;
  //   this.lstMappingCurrent = [];
  //   let j = 0;
  //   for (let i = currentPage === 0 ? 0 : currentPage * this.request.size; this.lstDataMapping.length; i++) {
  //     if (i - (currentPage === 0 ? 0 : currentPage * this.request.size) > this.request.size - 1) break;
  //     if (this.lstDataMapping[i]) {
  //       const idx = currentPage === 0 ? 0 : currentPage * this.request.size + j;
  //       this.lstMappingCurrent.push({variableInventory: this.lstDataMapping[idx].variableInventory, placeGNOC: this.lstDataMapping[idx].placeGNOC});
  //       j++;
  //     } else break;
  //   }
  // }
  // changeItemPerPage(itemPerPage: number) {
  //   this.request.size = itemPerPage;
  //   this.lstMappingCurrent = [];
  //   let j = 0;
  //   for (let i = this.request.page === 0 ? 0 : this.request.page * itemPerPage; this.lstDataMapping.length; i++) {
  //     if (i - (this.request.page === 0 ? 0 : this.request.page * itemPerPage) > itemPerPage - 1) break;
  //     if (this.lstDataMapping[i]) {
  //       const idx = this.request.page === 0 ? 0 : this.request.page * this.request.size + j;
  //       this.lstMappingCurrent.push(this.lstDataMapping[idx]);
  //       j++;
  //     } else break;
  //   }
  // }
  // onUpperCase(event) {
  //   console.log(event.target.value.toUpperCase());
  //   this.addForm.get('serviceModelLocation').setValue(event.target.value.toUpperCase());
  // }
  onCancelConfirm() {
    this.isViewConfirmCancel = false;
  }
  getValueField(item) {
    return this.addForm.get(item).value;
  }

  //******** EDIT START ******************* */
  blurFolderImport() {
    const path = this.addForm.get('filePath').value;
    if (path) {
      this.inventoryPlaybookService.getListFolderSetting(path).subscribe(res => {
        if (res.data && res.data.length > 0) {
          this.listFileNameInventory = res.data;
          this.listFileNamePlaybook = res.data;
          this.listFileNamePlaybookUninstall = res.data;
        } else {
          this.addForm.get('filePath').setErrors({ 'empty': true });
          this.listFileNameInventory = [];
          this.listFileNamePlaybook = [];
          this.listFileNamePlaybookUninstall = [];

          //set value form control
          this.addForm.get('inventoryFileName').patchValue(null);
          this.addForm.get('playbookFileName').patchValue(null);
          this.addForm.get('playbookUnsName').patchValue(null);
        }
      });
    }
  }
  //******* EDIT END ***************** */
}
