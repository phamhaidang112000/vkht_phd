import {Inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {DA_SERVICE_TOKEN, ITokenService} from '@delon/auth';
import {TranslateService} from '@ngx-translate/core';
import {AuthenticationService} from "../services/authentication/authentication.service";
import {environment} from "@env/environment";

@Injectable({providedIn: 'root'})
export class CanActiveService implements CanActivate {
  URL = environment.BASE_API_URI.SSO_ADDRESS + '/login?service=';
  serviceUrl = environment.BASE_API_URI.CLIENT_ADDRESS + '/auth-sso/login';
  constructor(
    private router: Router,
    private translateService: TranslateService,
    private authenticationService: AuthenticationService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    
    const token = this.tokenService.get().token;
    const role = route.data.role;
    // if (this.authenticationService.hasPermission(role)) {
    if (token) {

      if(role){
        if (this.authenticationService.hasPermission(role)) {
          return true;
        }else{
          this.router.navigate(['exception/403']);
          return false
        }
      }else{
        return true;
      }

    } else {
      window.location.href = this.URL + encodeURIComponent(this.serviceUrl) + '&appCode=' + encodeURIComponent(environment.appCode);
      // this.router.navigate(['exception/403']);
      // return false
    }
  }


}
