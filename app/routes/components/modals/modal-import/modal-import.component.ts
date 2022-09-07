import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, Validators} from "@angular/forms";
import {APP_PARAMS_TYPE} from "../../../../utils";
import {AppParamsService} from "../../../../services/app-params/app-params.service";
import {ServiceManagementService} from "../../../../services/service-management/service-management.service";
import {BehaviorSubject, Observable} from "rxjs";
import {debounceTime} from "rxjs/operators";
import {InstallationManagementService} from "../../../../services/installation-management/installation-management.service";

@Component({
  selector: 'app-modal-import',
  templateUrl: './modal-import.component.html',
  styleUrls: ['./modal-import.component.less']
})
export class ModalImportComponent implements OnInit {

  @Input() isVisible: boolean;
  @Input() title: string;
  @Input() description: string;
  @Input() content: string;
  @Input() text: string;
  @Input() textButtonCancel: string;
  @Input() hiddenBtnCancel = false;
  @Input() hiddenContent = false;
  @Output() clickCancel = new EventEmitter();
  @Output() callBack = new EventEmitter();
  @Output() clickConfirm = new EventEmitter();
  @Output() clickDownloadTemplate = new EventEmitter();
  @Output() selectService = new EventEmitter();
  @Input() isDelete: any = false;
  @Input() isConfirm: any = false;
  @Input() listFiles: any[] = [];
  @Input() services: any[] = [];
  @Input() serviceModels: any[] = [];
  @Input() selectServiceModel: any[] = [];
  @Input() serviceControl: AbstractControl;
  @Input() serviceModelControl: AbstractControl;
  searchService$ = new BehaviorSubject('');

  searchForm: any;
  isSubmit: any;

  constructor(
    private formBuilder: FormBuilder,
    private appParamService: AppParamsService,
    private serviceMgmtService: ServiceManagementService,
    private installationManagementService: InstallationManagementService,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.initSearchService();
    this.appParamService.getAppParamsByType(APP_PARAMS_TYPE.SERVICE_STATUS).subscribe(res => {
      this.serviceModels = res.data;
    });
    this.searchForm.get('fileImport').hasError(null);
  }

  buildForm() {
    this.searchForm = this.formBuilder.group({
      serviceId: [null, Validators.required],
      serviceModel: [null, Validators.required],
      fileImport: [null, Validators.required]
    });
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

  openModal() {

  }

  handleCancelModal() {
    this.clickCancel.emit();
    this.searchForm.reset();
    this.listFiles = [];
    this.isSubmit = false;
  }

  handleDelete() {
    this.callBack.emit();
  }

  handleConfirm() {

    this.isSubmit = true;
    for (const i in this.searchForm.controls) {
      this.searchForm.controls[i].markAsDirty();
      this.searchForm.controls[i].updateValueAndValidity();
    }
    const file = this.searchForm.get('fileImport').value;
    if(this.searchForm.invalid){
      return;
    }
    const data = {
      userId : localStorage.getItem('employeeCode'),
      fileId: file[0].id,
      serviceId: this.searchForm.get('serviceId').value,
      serviceModel: this.searchForm.get('serviceModel').value
    }
    this.installationManagementService.importExcel(data).subscribe(res => {
      if(res){
        this.handleCancelModal();
        this.callBack.emit();
      }
    }, error => {
    }, () =>{
    });

  }

  eventDeleteFileFromModal($event){
    this.listFiles = [];
  }

  fetchFile(event: any) {
      this.listFiles = event;
  }

  selectChangeService(event) {
    console.log(event);
    // this.selectedService = event;
    if (event) {
      let ids = event.serviceModel.split(',');
      this.selectServiceModel = this.serviceModels.filter(x => ids.indexOf('' + x.value) > -1);
      this.searchForm.get('serviceModel').patchValue(null);
    } else {
      this.searchForm.get('serviceModel').patchValue(null);
    }
  }

}
