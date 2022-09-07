import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { FlavorRouter } from 'src/app/utils';

@Injectable({
  providedIn: 'root'
})
export class FlavorService {

  constructor(
    private http: _HttpClient,
  ) {
  }

  search(form: any, page: any) {
    return this.http.post(environment.BASE_API_URI.BASE_SERVICE_API + FlavorRouter.searchData + '?_allow_anonymous=true', form, page);
  }

  save(data: any) {
    if (data.id) {
      return this.http.put(environment.BASE_API_URI.BASE_SERVICE_API + FlavorRouter.updateFlavor + `/${data.id}` + '?_allow_anonymous=true' , data);

    } else {
      return this.http.post(environment.BASE_API_URI.BASE_SERVICE_API + FlavorRouter.saveData + '?_allow_anonymous=true', data);
    }
  }

  detail(id) {
    return this.http.get(environment.BASE_API_URI.BASE_SERVICE_API + FlavorRouter.getDetail + `/${id}` + '?_allow_anonymous=true');
  }

  delete(id) {
    return this.http.delete(environment.BASE_API_URI.BASE_SERVICE_API + FlavorRouter.removeFlavor + `/${id}` + '?_allow_anonymous=true');
  }

  getAllFlavorByName(name) {
    return this.http.get(
      environment.BASE_API_URI.BASE_SERVICE_API +
      FlavorRouter.searchFlavorByName  + '?name=' + name + '&_allow_anonymous=true');
  }
}
