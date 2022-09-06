import {Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {AppParamsRouter, ServiceRouter} from '../../utils';
import {_HttpClient} from '@delon/theme';

@Injectable({
  providedIn: 'root',
})
export class ServiceManagementService {
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
  ) {
  }

  getAllServiceByName(name) {
    return this.http.get(
      environment.BASE_API_URI.BASE_SERVICE_API +
      ServiceRouter.searchServiceByName  + '?name=' + name + '&_allow_anonymous=true');
  }
  getDataService(form: any, page: any) {
    return this.http.post(environment.BASE_API_URI.BASE_SERVICE_API + ServiceRouter.searchData + '?_allow_anonymous=true', form, page );
  }
  saveService(data: any) {
    return this.http.post(environment.BASE_API_URI.BASE_SERVICE_API + ServiceRouter.saveData + '?_allow_anonymous=true', data);
  }
  getDetail(id) {
    return this.http.get(environment.BASE_API_URI.BASE_SERVICE_API + ServiceRouter.getDetail +`/${id}` + '?_allow_anonymous=true');
  }
  deleteService(id) {
    return this.http.delete(environment.BASE_API_URI.BASE_SERVICE_API + ServiceRouter.removeService + `/${id}`+ '?_allow_anonymous=true');
  }

}
