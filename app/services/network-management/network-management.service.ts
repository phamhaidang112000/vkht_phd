import { Injectable } from '@angular/core';
import {environment} from '@env/environment';
import { NetworkRouter} from '../../utils';
import {_HttpClient} from '@delon/theme';

@Injectable({
  providedIn: 'root'
})
export class NetworkManagementService {

  constructor(
    private http: _HttpClient,
  ) {
  }

  search(form: any, page: any) {
    return this.http.post(environment.BASE_API_URI.BASE_SERVICE_API + NetworkRouter.searchData + '?_allow_anonymous=true', form, page);
  }

  save(data: any) {
    if (data.id) {
      return this.http.put(environment.BASE_API_URI.BASE_SERVICE_API + NetworkRouter.updateNetwork + `/${data.id}` + '?_allow_anonymous=true' , data);

    } else {
      return this.http.post(environment.BASE_API_URI.BASE_SERVICE_API + NetworkRouter.saveData + '?_allow_anonymous=true', data);
    }
  }

  detail(id) {
    return this.http.get(environment.BASE_API_URI.BASE_SERVICE_API + NetworkRouter.getDetail + `/${id}` + '?_allow_anonymous=true');
  }

  delete(id) {
    return this.http.delete(environment.BASE_API_URI.BASE_SERVICE_API + NetworkRouter.removeNetwork + `/${id}` + '?_allow_anonymous=true');
  }

  getAllNetworkByName(name) {
    return this.http.get(
      environment.BASE_API_URI.BASE_SERVICE_API +
      NetworkRouter.searchNetworkByName  + '?name=' + name + '&_allow_anonymous=true');
  }
}
