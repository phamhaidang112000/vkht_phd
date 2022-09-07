import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { OsRouter } from 'src/app/utils';

@Injectable({
  providedIn: 'root'
})
export class OsManagementService {

  constructor(
    private http: _HttpClient,
  ) {
  }

  search(form: any, page: any) {
    return this.http.post(environment.BASE_API_URI.BASE_SERVICE_API + OsRouter.searchData + '?_allow_anonymous=true', form, page);
  }

  save(data: any) {
    if (data.id) {
      return this.http.put(environment.BASE_API_URI.BASE_SERVICE_API + OsRouter.updateOs + `/${data.id}` + '?_allow_anonymous=true' , data);

    } else {
      return this.http.post(environment.BASE_API_URI.BASE_SERVICE_API + OsRouter.saveData + '?_allow_anonymous=true', data);
    }
  }

  detail(id) {
    return this.http.get(environment.BASE_API_URI.BASE_SERVICE_API + OsRouter.getDetail + `/${id}` + '?_allow_anonymous=true');
  }

  delete(id) {
    return this.http.delete(environment.BASE_API_URI.BASE_SERVICE_API + OsRouter.removeOs + `/${id}` + '?_allow_anonymous=true');
  }

  getAllOsByName(name) {
    return this.http.get(
      environment.BASE_API_URI.BASE_SERVICE_API +
      OsRouter.searchOsByName  + '?name=' + name + '&_allow_anonymous=true');
  }
}
