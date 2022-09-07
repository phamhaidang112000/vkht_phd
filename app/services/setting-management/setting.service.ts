import {Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {AppParamsRouter, SettingRouter} from '../../utils';
import {_HttpClient} from '@delon/theme';


@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(    private http: _HttpClient,) { }


  save(data: any) {
    if (data.id) {
      return this.http.put(environment.BASE_API_URI.BASE_SERVICE_API + SettingRouter.update + `/${data.id}` + '?_allow_anonymous=true' , data);

    } 
  }

  detail(id) {
    return this.http.get(environment.BASE_API_URI.BASE_SERVICE_API + SettingRouter.getDetail + `/${id}` + '?_allow_anonymous=true');
  }
}
