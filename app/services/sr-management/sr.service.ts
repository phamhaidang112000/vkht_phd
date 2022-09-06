import {Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {AppParamsRouter, SrRouter} from '../../utils';
import {_HttpClient} from '@delon/theme';

@Injectable({
  providedIn: 'root',
})
export class SrService {


  constructor(
    private http: _HttpClient,
  ) {
  }

  search(form: any, page: any) {
    return this.http.post(environment.BASE_API_URI.BASE_SERVICE_API + SrRouter.search + '?_allow_anonymous=true', form, page);
  }

  save(data: any) {
    if (data.id) {
      return this.http.put(environment.BASE_API_URI.BASE_SERVICE_API + SrRouter.update + `/${data.id}` + '?_allow_anonymous=true' , data);

    } else {
      return this.http.post(environment.BASE_API_URI.BASE_SERVICE_API + SrRouter.saveData + '?_allow_anonymous=true', data);
    }
  }

  detail(id) {
    return this.http.get(environment.BASE_API_URI.BASE_SERVICE_API + SrRouter.getDetail + `/${id}` + '?_allow_anonymous=true');
  }

  delete(id) {
    return this.http.delete(environment.BASE_API_URI.BASE_SERVICE_API + SrRouter.delete + `/${id}` + '?_allow_anonymous=true');
  }

}
