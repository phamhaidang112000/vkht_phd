import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { AppParamsRouter, InventoryPlaybookRouter, ServiceRouter } from '../../utils';
import { _HttpClient } from '@delon/theme';

@Injectable({
  providedIn: 'root',
})
export class InventoryPlaybookService {


  constructor(
    private http: _HttpClient,
  ) {
  }

  getAllServiceByName(name) {
    return this.http.get(
      environment.BASE_API_URI.BASE_SERVICE_API +
      ServiceRouter.searchServiceByName + '?name=' + name + '&_allow_anonymous=true');
  }

  search(form: any, page: any) {
    return this.http.post(environment.BASE_API_URI.BASE_SERVICE_API + InventoryPlaybookRouter.search + '?_allow_anonymous=true', form, page);
  }

  save(data: any) {
    if (data.id) {
      return this.http.put(environment.BASE_API_URI.BASE_SERVICE_API + InventoryPlaybookRouter.update + `/${data.id}` + '?_allow_anonymous=true', data);

    } else {
      return this.http.post(environment.BASE_API_URI.BASE_SERVICE_API + InventoryPlaybookRouter.saveData + '?_allow_anonymous=true', data);
    }
  }

  detail(id) {
    return this.http.get(environment.BASE_API_URI.BASE_SERVICE_API + InventoryPlaybookRouter.getDetail + `/${id}` + '?_allow_anonymous=true');
  }

  delete(id) {
    return this.http.delete(environment.BASE_API_URI.BASE_SERVICE_API + InventoryPlaybookRouter.delete + `/${id}` + '?_allow_anonymous=true');
  }

  //********* EDIT START ******** */
  getListFolderSetting(path) {
    return this.http.post(environment.BASE_API_URI.BASE_SERVICE_API + InventoryPlaybookRouter.getFileName + '?_allow_anonymous=true', path);
  }
  //********* EDIT END ********** */

}
