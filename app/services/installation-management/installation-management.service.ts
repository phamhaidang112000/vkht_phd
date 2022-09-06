import { Injectable } from '@angular/core';
import {_HttpClient} from "@delon/theme";
import {CommonRouter, InstallationRouter} from "../../utils";
import {environment} from "@env/environment";
import {HttpParams} from "@angular/common/http";
import {LoadingService} from "@delon/abc";

@Injectable({
  providedIn: 'root'
})
export class InstallationManagementService {
  private data: any;
  getData() {
    return this.data;
  }
  setData(data) {
    this.data = data;
  }
  clearData() {
    this.data = undefined;
  }

  constructor(
    private http: _HttpClient,
    private loading: LoadingService
  ) {
  }

  search(data: any, page: any) {
    return this.http.post(environment.BASE_API_URI.BASE_SERVICE_API + InstallationRouter.searchData + '?_allow_anonymous=true', data, page);
  }
  getDetail(id: any) {
    return this.http.get(environment.BASE_API_URI.BASE_SERVICE_API + InstallationRouter.getDetail + `/${id}`+'?_allow_anonymous=true');
  }
  update(data: any) {
    return this.http.put( environment.BASE_API_URI.BASE_SERVICE_API + InstallationRouter.update + `/${data.id}` +'?_allow_anonymous=true', data);
  }
  reSyncData(id: any) {
    return this.http.get(environment.BASE_API_URI.BASE_SERVICE_API + InstallationRouter.syncData + `/${id}` +'?_allow_anonymous=true');
  }
  syncSR() {
    return this.http.get(environment.BASE_API_URI.BASE_SERVICE_API + InstallationRouter.syncSR +'?_allow_anonymous=true');
  }
  importExcel(id: any) {
    return this.http.post(environment.BASE_API_URI.BASE_SERVICE_API + CommonRouter.importExcel +'?_allow_anonymous=true', id, {
      responseType: 'blob',
      observe: 'response',
    });
  }
}
