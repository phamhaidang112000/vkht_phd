import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {InstallationManagementService} from "../../../services/installation-management/installation-management.service";
import {ActivatedRoute, Router} from "@angular/router";
import {InputTextComponent} from "../../components/inputs/input-text/input-text.component";
import {NgxSpinnerService} from "ngx-spinner";
import {AppParamsService} from "../../../services/app-params/app-params.service";
import {APP_PARAMS_TYPE, SCROLL_TABLE} from "../../../utils";
import {ServiceManagementService} from "../../../services/service-management/service-management.service";
import {FileManagerService} from "../../../services/file-manager/file-manager.service";
import {ToastService} from "@shared";

@Component({
  selector: 'app-detail-installation',
  templateUrl: './detail-installation.component.html',
  styleUrls: ['./detail-installation.component.less']
})
export class DetailInstallationComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('codeRef', {static: false}) codeRef: InputTextComponent;
  isBreadcrumb: any;
  breadcrumbs: any[] = [];
  formSave: FormGroup;
  data: any;
  services: any[] = [];
  serviceModels: any[] = [];
  lstStatus: any[] = [];
  lstConnect: any[] = [];
  listFileInventory: any[] = [];
  listFilePlaybook: any[] = [];
  total = 0;
  listHistorySetting: any[] = [];
  listAllHistory: any[] = [];
  objStatus: any;
  objConnect: any;
  inventoryDefault = false;
  playbookDefault = false;
  isViewConfirmCancel: any;
  lstOption = [{name: this.translateService.instant('catalog-management.resource-setting.run.uninstall.playbook.and.query.setting'), value: 2}, {
    name: this.translateService.instant('catalog-management.resource-setting.run.query.setting'), value: 1
  }];
  isSubmit = false;
  inventoryFileDTOEmpty = false;
  playbookFileDTOEmpty = false;
  optionSettingEmpty = false;

  SCROLL_TABLE = SCROLL_TABLE;
  option: any;
  request: any = {
    page: 0,
    name: null,
    currentPage: 0,
    size: 10,
    sort: 'code'
  };
  hideQuerySetting:any = true;
  newQuerySetting: any;
  isCommand : any;

  constructor(
    private translateService: TranslateService,
    injector: Injector,
    private formBuilder: FormBuilder,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private installationManagementService: InstallationManagementService,
    private appParamService: AppParamsService,
    private fileManagerService: FileManagerService,
    private toastService: ToastService,
    private activatedRouter: ActivatedRoute
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.appParamService.getAppParamsByType(APP_PARAMS_TYPE.SETTING_STATUS).subscribe(res => {
      this.lstStatus = res.data;
    });
    this.appParamService.getAppParamsByType(APP_PARAMS_TYPE.CONNECT_STATUS).subscribe(res => {
      this.lstConnect = res.data;
    });

    this.setBreadcrumb();
  }

  ngAfterViewChecked(): void {
  }

  ngAfterViewInit(): void {
    const id = this.activatedRouter.snapshot.params.id;
    if (id) {
      this.loadData(id);
    }
  }

  buildForm() {
    this.formSave = this.formBuilder.group({
      id: [null],
      code: [null],
      name: [null],
      serviceId: [null],
      serviceName: [null],
      serviceModelName: [null],
      serviceModelId: [null],
      unitRequest: [null],
      emailRequest: [null],
      connectServer: [null],
      requestDate: [null],
      isOptionSetting: [null],
      statusSetting: [null],
      isFilePlaybook: [null],
      isFileInventory: [null],
      listHistorySetting: [null],
      inventoryFileDTO: [null],
      playbookFileDTO: [null],
      listFilePlaybook: [null],
      querySetting: [null, Validators.maxLength(1000)],
      isCommand:[null]
    })
  }

  loadData(id) {
    this.installationManagementService.getDetail(id).subscribe(res => {
      this.data = res.data;
      this.setValueForm(this.data);
    })
  }

  setValueForm(data) {
    this.listHistorySetting = [];
    this.formSave.patchValue(data);
    // this.listHistorySetting = data.listHistorySetting;
    if (!data.isFilePlaybook && data.playbookFileDTO) {
      this.listFilePlaybook.push(data.playbookFileDTO);
    }
    if (!data.isFileInventory && data.inventoryFileDTO) {
      this.listFileInventory.push(data.inventoryFileDTO);
    }
    this.option = data.isOptionSetting;
    this.listAllHistory = data.listHistorySetting;
    if (this.listAllHistory.length > 0) {
      for (let i = this.request.page === 0 ? 0 : this.request.page; i < this.listAllHistory.length; i++) {
        if (i - this.request.page > this.request.size - 1) break;
        this.listHistorySetting.push(this.listAllHistory[i]);
      }
    }
    if(data.isCommand === 1){
      this.hideQuerySetting = false;
    }else{
      this.hideQuerySetting = true;
    }
    this.setFieldValue('isCommand', this.formSave.get('isCommand').value === 1 ? true : false);
    this.setFieldValue('isFileInventory', this.formSave.get('isFileInventory').value === 1 ? true : false);
    this.isCommand = data.isCommand;
    this.total = this.listAllHistory.length;
    this.codeRef.focus();
  }

  getConnectName(value) {
    const obj = this.lstConnect.find(x => x.value === value);
    return obj ? obj.name : '';
  }

  downFile(idx: number, fileName: any) {
    this.fileManagerService.downloadFileById(idx, fileName);
  }

  openConfirmCancel() {
    if (this.checkDataForm()) {
      this.isViewConfirmCancel = true;
    } else {
      this.router.navigate(['/installation/list']);
    }
  }

  cancel() {
    this.router.navigate(['/installation/list']);
  }

  onCancelConfirm() {
    this.isViewConfirmCancel = false;
  }

  setFieldValue(item, value) {
    this.formSave.get(item).patchValue(value);
  }

  getFieldValue(item) {
    return this.formSave.get(item).value;
  }

  setBreadcrumb() {
    this.breadcrumbs = [
      {
        name: this.translateService.instant('breadcrumb.resource-setting'),
        route: '/installation/list',
      },
      {
        name: this.translateService.instant('breadcrumb.resource-setting.update'),
        route: ''
      }
    ];
    this.isBreadcrumb = true;
  }

  submitForm() {
    this.isSubmit = true;
    if (!this.validFormSave()) {
      if (this.formSave.get('inventoryFileDTO').value && this.formSave.get('inventoryFileDTO').value.length) this.formSave.get('inventoryFileDTO').setValue(this.formSave.get('inventoryFileDTO').value[0]);
      if (this.formSave.get('playbookFileDTO').value && this.formSave.get('playbookFileDTO').value.length) this.formSave.get('playbookFileDTO').setValue(this.formSave.get('playbookFileDTO').value[0]);

      // if ( (this.listFileInventory.length === 0 || this.listFilePlaybook.length === 0) &&
      //   ( this.formSave.value.isFileInventory != 1 || this.formSave.value.isFilePlaybook != 1 )
      // ) {
      //   this.isSubmit=false;
      //   return;
      // }
      this.formSave.value.isFileInventory === false || this.formSave.value.isFileInventory === 0  ? this.formSave.value.isFileInventory = 0 : this.formSave.value.isFileInventory = 1;
      this.formSave.value.isFilePlaybook === false  || this.formSave.value.isFilePlaybook === 0 ? this.formSave.value.isFilePlaybook = 0 : this.formSave.value.isFilePlaybook = 1;

      if(this.formSave.value.isFileInventory === 0 &&  this.listFileInventory.length === 0 ){
        this.isSubmit=false;
        return;
      }
      if(this.formSave.value.isFilePlaybook === 0 &&  this.listFilePlaybook.length === 0 ){
        this.isSubmit=false;
        return;
      }
      this.setFieldValue('isCommand', this.formSave.get('isCommand').value === true ? 1 : 0)
      this.setFieldValue('isFileInventory', this.formSave.get('isFileInventory').value === true ? 1 : 0)
      // this.setFieldValue('querySetting', this.formSave.get('querySetting').value)
      this.spinner.show()
      this.installationManagementService.update(this.formSave.value).subscribe(res => {
        if (res) {
          this.router.navigate(['/installation/list']);
          this.spinner.hide();
        }
      },error => {
        this.spinner.hide();
      })
    }
  }

  eventDeleteFileFromModal(event: any, idx: number) {
    console.log(event);
    if (idx === 1) {
      this.listFileInventory = [];
    }
    if (idx === 2) {
      this.listFilePlaybook = [];
    }
  }

  fetchFile(event: any, number: number) {
    if (number === 1) {
      this.listFileInventory = event;
    }
    if (number === 2) {
      this.listFilePlaybook = event;
    }
  }

  initSearchService() {
  }

  validFormSave(): boolean {
    let valid = false;
    if ((this.getFieldValue('isFileInventory') === false || this.getFieldValue('isFileInventory') === 0 )
        && typeof(this.getFieldValue('inventoryFileDTO')) === 'object' && this.listFileInventory.length === 0) {
      this.inventoryFileDTOEmpty = true;
      valid = true;
    }
    if ((this.getFieldValue('isFilePlaybook') === false || this.getFieldValue('isFilePlaybook') === 0 )
        && typeof(this.getFieldValue('playbookFileDTO')) === 'object' && this.listFilePlaybook.length === 0) {
      this.playbookFileDTOEmpty = true;
      valid = true;
    }
    if (!this.getFieldValue('isOptionSetting')) {
      this.optionSettingEmpty = true;
      valid = true;
    }
    if(this.hideQuerySetting && !this.getFieldValue('querySetting')){
      valid = true;
      this.formSave.get('querySetting').setValidators([Validators.required, Validators.maxLength(1000)]);
      this.formSave.get('querySetting').markAsTouched();
      this.formSave.get('querySetting').markAsDirty();
      this.formSave.get('querySetting').updateValueAndValidity();
    }
    return valid;
  }

  changeCheckbox(event: any, index: any) {
    if (index === 1){
      if(event === true){
        this.inventoryFileDTOEmpty = false;
        this.listFileInventory  = [];
      }
      this.setFieldValue('isFileInventory', event);
    }
    else if (index === 2){
      if(event === true){
        this.playbookFileDTOEmpty = false;
        this.listFilePlaybook  = [];
      }
      this.setFieldValue('isFilePlaybook', event);
    }
  }

  changeServer() {
    this.setFieldValue('connectServer', this.objConnect.value);
  }

  changeStatus() {
    this.setFieldValue('statusSetting', this.objConnect.value);
  }

  changeOption(event) {
    this.optionSettingEmpty = false;
    this.setFieldValue('isOptionSetting', event);
  }

  changeCurrentPage(currentPage: number) {
    this.request.page = currentPage;
    this.listHistorySetting = [];
    for (let i = currentPage === 0 ? 0 : currentPage * this.request.size; i < this.listAllHistory.length; i++) {
      if (i - (currentPage === 0 ? 0 : currentPage * this.request.size) > this.request.size - 1) break;
      if (this.listAllHistory[i])
        this.listHistorySetting.push(this.listAllHistory[i]);
    }
  }

  changeItemPerPage(itemPerPage: number) {
    this.request.size = itemPerPage;
    if (itemPerPage > this.listAllHistory.length) {
      this.listHistorySetting.push(...this.listAllHistory);
    } else {
      for (let i = this.request.page === 0 ? 0 : this.request.page * this.request.size; i < this.listAllHistory.length; i++) {
        if (i - (this.request.page === 0 ? 0 : this.request.page * this.request.size) > this.request.size - 1) break;
        if (this.listAllHistory[i])
          this.listHistorySetting.push(this.listAllHistory[i]);
      }
    }
  }

  checkDataForm(): boolean {
    if (this.getFieldValue('isOptionSetting') !== this.data.isOptionSetting
      || this.getFieldValue('isFilePlaybook') !== this.data.isFilePlaybook
      || this.getFieldValue('isFileInventory') !== this.data.isFileInventory
      || this.getFieldValue('serviceModelId') !== this.data.serviceModelId
      || this.getFieldValue('inventoryFileDTO') !== this.data.inventoryFileDTO
      || this.getFieldValue('playbookFileDTO') !== this.data.playbookFileDTO) {
      return true;
    }
    return false;
  }

  onChangeCheckbox(event){
    console.log(event)
    this.hideQuerySetting = event;
    // if(!this.hideQuerySetting){
    //   this.formSave.get('querySetting').clearValidators();
    //   this.formSave.get('querySetting').updateValueAndValidity();
    //   this.formSave.get('querySetting').patchValue(null);
    // }
  }
}
