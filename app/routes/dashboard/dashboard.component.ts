import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  Injector,
  NgZone,
  OnDestroy,
  OnInit, ViewChild, ElementRef
} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {NzI18nService} from 'ng-zorro-antd/i18n';
import {ALAIN_I18N_TOKEN} from '@delon/theme';
import {I18NService} from '@core';
import * as enDateLocale from 'date-fns/locale/en';
import {DashboardService, UserService} from 'src/app/services';
import {FormBuilder, FormGroup, FormControl} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import Chart from 'chart.js';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  isTokenValidate = false;
  delayed = true;
  interval$: any;
  isBreadcrumb:any;
  breadcrumbs: any[] = [];
  formSearch: FormGroup;
  lstUnit: any[] = [];
  lstLabelUnit: any[] = [];
  lsLabelDV: any[] = [];
  lsLabelDV2: any[] = [];
  lsDataChart1 : any[] = [];
  lsDataChart2 : any[] = [];
  lsSetValue : any[] = [];
  chartUnit: any;
  chartService: any;
  chartRate: any;
  maxSizeUnit=0;
  isNullService=0;
  isNullRate=0;
  @ViewChild('chart', {static: false}) private draggableElement: ElementRef;

  constructor(
    private zone: NgZone,
    private i18n: NzI18nService,
    private userService: UserService,
    public msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private dashboashService: DashboardService,
    private translateService: TranslateService,
    injector: Injector,
    private formBuilder: FormBuilder,
    @Inject(ALAIN_I18N_TOKEN) private i18nService: I18NService,
  ) {
    this.i18n.setDateLocale(enDateLocale);
  }
  ngOnInit() {
    this.setBreadcrumb();
    this.buildForm();
    this.dashboashService.getAllUnit().subscribe( res => {
      if(res.code == 'OK') {        
        this.lstUnit = res.data        
      }
    })
    this.search();
  }

  // Kiểm tra token, nếu token hết hạn sẽ trả về 401 => DefaultInterceptor sẽ bắt và đẩy ra màn login
  checkTokenValidate() {
    this.userService.getLoginInfo().subscribe((res: any) => {
      if (res) {
        this.isTokenValidate = true;
      }
    });
  }
  ngAfterViewInit() {
  }
  ngOnDestroy() {
    if (this.interval$) {
      clearInterval(this.interval$);
    }
  }
  buildForm() {
    this.formSearch = this.formBuilder.group({
      fromDate: new FormControl(null),
      toDate: new FormControl(null),
      unit: new FormControl(null),
    })
  }
  setBreadcrumb() {
    this.breadcrumbs = [
      {
        name: this.translateService.instant('breadcrumb.dashboard'),
        route: '',
      }
    ];
    this.isBreadcrumb = true;
  }

  search() {
    if( (this.formSearch.value.fromDate != null && this.formSearch.value.toDate == null) ||
        (this.formSearch.value.fromDate == null && this.formSearch.value.toDate != null)
    ){
      return;
    }
    this.onSearchChartUnit();
    this.onSearchChartService();
    this.onSearchChartRate();
  }

  resetForm(){
    this.lsLabelDV =[];
    this.lsDataChart1 =[];
    this.lsLabelDV2 =[];
    this.lsDataChart2 =[];
  }

  nzOnSearch() {
    this.search();
  }
  selectChangeService() {    
    this.resetForm();
    this.search();
  }

  selectChangeDate(event){    
    this.formSearch.get('fromDate').patchValue(event[0]);
    this.formSearch.get('toDate').patchValue(event[1]);
    this.resetForm();
    this.search();
  }

  onSearchChartRate(){
     this.dashboashService.getRateChart(this.formSearch.value).subscribe( res => {
      if(res.data == null){
        const tempData = {
          labels: NaN,
          datasets: NaN
        }
        this.viewChartRate(tempData);
        this.isNullRate = 0;
        return false;
      }
      this.isNullRate = 1;
      const obj = {
        labels: ["Thành công","Thất bại","Chưa cài đặt"],
        datasets: [{
          label: 'Thống kê yêu cầu dịch vụ theo trạng thái',
          data : res.data,
          backgroundColor: [
            '#2175E7',
            '#F8455B',
            '#FDAD00',
          ],
        }]
      }
      this.viewChartRate(obj);
    })
  }

  onSearchChartService(){
    this.dashboashService.getData(this.formSearch.value).subscribe( res => {
      this.resetForm();
      const data = res.data;
      if(data == null){
        const tempData = {
          labels: NaN,
          datasets: NaN
        }
        this.viewChartService(tempData);
        this.isNullService = 0;
        return false;
      }
      this.isNullService = 1;
      this.lsLabelDV2.push(data[0].name);
      for(let i =0;i<data[0].lsObjData.length;i++){
        const temp ={
          label: data[0].lsObjData[i].dv,
          data: data[0].lsObjData[i].lsQuantity,
          backgroundColor: i == 0 ? "#2175E7": i == 1 ? '#F8455B' : "#FDAD00",
          // pointStyle: 'cross',
        }
        this.lsDataChart2.push(temp);
      }
      const tempData = {
        labels: this.lsLabelDV2[0],
        datasets: this.lsDataChart2,      
        // pointStyle: 'cross',
      }
      this.viewChartService(tempData);
    })
  }

  onSearchChartUnit(){
    if( (this.formSearch.value.fromDate != null && this.formSearch.value.toDate == null) ||
        (this.formSearch.value.fromDate == null && this.formSearch.value.toDate != null)
    ){
      return;
    }
   
    this.dashboashService.getUnitChartData(this.formSearch.value).subscribe( res => {
      this.resetForm();      
      if(res.data == null){
        this.maxSizeUnit=0;
        const tempData = {
          labels: NaN,
          datasets: NaN
        }
        this.viewChartUnit(tempData);
        return false;
      }

      const data = res.data.lsDTO;
      this.maxSizeUnit = res.data.maxSize;
      this.lsLabelDV.push(data[0].name);
      for(let i =0;i<data[0].lsObjData.length;i++){
        const temp ={
          label: data[0].lsObjData[i].dv,
          data: data[0].lsObjData[i].lsQuantity,
          backgroundColor: this.getRandomColor()
        }
        this.lsDataChart1.push(temp);
      }
      const tempData = {
        labels: this.lsLabelDV[0],
        datasets: this.lsDataChart1,        
      }
      this.viewChartUnit(tempData);
    })
  }

  viewChartUnit(data) {
    if(!this.chartUnit){
      this.chartUnit = new Chart("chart_DV", {
        type: 'bar',
        data: data,
        options: {
          legend : { 
            labels: {
              fontColor: '#000000',
              fontSize:16
            },
            display : true, 
            align:"end",   
          },   
          tooltips: {
            // hide square in tooltips
            displayColors: false
          },
          responsive: true,
          aspectRatio:3,
          maintainAspectRatio: true,
          scales: {
            xAxes: [{
              stacked: true,
              barPercentage: 0.5,
             
            }],
            yAxes: [{
              stacked: true,
              ticks:{
                precision: 0,
                min:0,
                max: this.maxSizeUnit + 1
              }
            }]
          }
        }
      });
    }else{
      this.chartUnit.data = data;
      this.chartUnit.options.scales.yAxes[0].ticks.max = this.maxSizeUnit+1;
      this.chartUnit.update();
    }
  }

  viewChartService(data) {
    if(!this.chartService){
    this.chartService = new Chart("chart_DVu", {
      type: 'bar',
      data: data,
      options: {
        legend : { 
          labels: {
            fontColor: '#000000',
            fontSize:16
          },
          display : true, 
          align:"end",
          // labels: {
          //   usePointStyle: true,
          //   pointStyle: 'cross',
          // }        
        },   
        tooltips: {
          displayColors: false
        },
        responsive: true,
        scales: {
          xAxes: [{
            stacked: true,
          }],
          yAxes: [{
            stacked: true,
            ticks: {
              precision: 0
            }
          }],
         
        }
      }
    });
  }else{
      this.chartService.data = data;
      this.chartService.update();
    }
  }

  viewChartRate(data){
    if(!this.chartRate){
    this.chartRate = new Chart("chart_TyLe", {
      type: 'doughnut',
      data: data,
      options: {
        legend : { 
          labels: {
            fontColor: '#000000',
            fontSize:16
          },
          color: "#000000", 
          display : true, 
          position:"right"
        },   
        tooltips: {
          displayColors: false
        },
        responsive: true,
        maintainAspectRatio: true,
      }
    });
    }else{
      this.chartRate.data = data;
      this.chartRate.update();
    }
  }

  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }

}
