import {Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {AppParamsRouter, ServerGroupRouter} from '../../utils';
import {_HttpClient} from '@delon/theme';

@Injectable({
  providedIn: 'root'
})
export class ServerGroupService {

  constructor(    private http: _HttpClient,) { }
  search(form: any, page: any) {
    return this.http.post(environment.BASE_API_URI.BASE_SERVICE_API + ServerGroupRouter.search + '?_allow_anonymous=true', form, page);
  }

  save(data: any) {
    if (data.id) {
      return this.http.put(environment.BASE_API_URI.BASE_SERVICE_API + ServerGroupRouter.update + `/${data.id}` + '?_allow_anonymous=true' , data);

    } else {
      return this.http.post(environment.BASE_API_URI.BASE_SERVICE_API + ServerGroupRouter.saveData + '?_allow_anonymous=true', data);
    }
  }

  detail(id) {
    return this.http.get(environment.BASE_API_URI.BASE_SERVICE_API + ServerGroupRouter.getDetail + `/${id}` + '?_allow_anonymous=true');
  }

  delete(id) {
    return this.http.delete(environment.BASE_API_URI.BASE_SERVICE_API + ServerGroupRouter.delete + `/${id}` + '?_allow_anonymous=true');
  }

  getAllSvGroupByName(name) {
    return this.http.get(
      environment.BASE_API_URI.BASE_SERVICE_API +
      ServerGroupRouter.searchSvGroupByName  + '?name=' + name + '&_allow_anonymous=true');
  }
}
