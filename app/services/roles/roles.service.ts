import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { RolesRouter } from '../../utils';

@Injectable({
  providedIn: 'root',
})
export class RolesService {

  constructor(
    private http: _HttpClient,
  ) {
  }

  getAllRoles() {
    return this.http.get(
      environment.BASE_API_URI.BASE_SERVICE_API +
      RolesRouter.getAllRoles,
    );
  }

}
