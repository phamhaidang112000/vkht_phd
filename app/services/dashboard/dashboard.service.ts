import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {environment} from "@env/environment";
import { DashboardRouter} from "../../utils";
import { RequestSettingRouter} from "../../utils";

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  constructor(
    private http: _HttpClient,
  ) {

  }
  getData(data: any) {
    return this.http.post(environment.BASE_API_URI.BASE_SERVICE_API + DashboardRouter.getData + '?_allow_anonymous=true', data);
  }

  getRateChart(data: any) {
    return this.http.post(environment.BASE_API_URI.BASE_SERVICE_API + DashboardRouter.rateChart + '?_allow_anonymous=true', data);
  }

  getUnitChartData(data: any) {
    return this.http.post(environment.BASE_API_URI.BASE_SERVICE_API + DashboardRouter.unitChart + '?_allow_anonymous=true', data);
  }

  getAllUnit() {
    return this.http.get(environment.BASE_API_URI.BASE_SERVICE_API + RequestSettingRouter.getAllUnit + '?_allow_anonymous=true');
  }
}
