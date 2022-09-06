import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DA_SERVICE_TOKEN, ITokenService} from "@delon/auth";
import {CommonService} from "../../services/common/common.service";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {ROLE_LIST} from "../../utils";
import {MenuService} from "@delon/theme";

@Component({
  selector: 'auth-sso-login',
  templateUrl: './auth-sso-login.component.html',
  styles: []
})

export class AuthSsoLoginComponent implements OnInit {
  error: string;
  listUrlAllow: string[] = [];

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public commonService: CommonService,
    public authenticationService: AuthenticationService,
    private menuSrv: MenuService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {

    const user: any = {};
    this.tokenService.set(null);
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['ticket']) {
        this.authenticationService.login(params['ticket']).subscribe(res => {
          user.access_token = res.data;
          const payloadToken: any = this.parseJwt(res.data);
          user.userId = payloadToken.userId;
          user.employeeCode = payloadToken.staffCode;
          user.tokenExpiresIn = payloadToken.exp;
          user.fullName = payloadToken.fullName;
          user.email = payloadToken.email;
          user.redirect = params['redirect'];
          this.tokenService.set({
            token: user.access_token,
            name: user.fullName,
          });
        
          localStorage.setItem('_userInfo', JSON.stringify(res.data));
          this.commonService.onChangeLoginName(user.fullName);
      
          this.authenticationService.getPermission(user.employeeCode).subscribe(response => {
            if (response && response.data == null) {
              this.commonService.logoutAction();
              // TODO Set toast mess khong co quyen truy cap He thong
            } else {
              localStorage.setItem('role', JSON.stringify({roleList: response.data}));
              localStorage.setItem('employeeCode', user.employeeCode);
              this.loadMenu();
              this.redirectAddress();
            }
          })
        })
      }
    });
  }

  ngOnInit() {
  }

  public redirectToLogin() {
    this.commonService.logoutAction();
  }

  private redirectAddress() {
    this.router.navigate(['/dashboard']);
  }

  parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };

  loadMenu() {
    this.menuSrv.clear();

    // init menu
    const lstMenu2 = [];
    const dashboardManager = {
      name: 'Dashboad',
      code: 'menu.dashboad-management',
      iconClass: 'sidebar-menu-icon icon__catalog',
      urlRewrite: '/dashboard',
      // subChild: [],
    }
    lstMenu2.push(dashboardManager);
    const catalogManager = {
      name: 'Quản lý cấu hình',
      code: 'menu.catalog-management',
      iconClass: 'sidebar-menu-icon icon__vector',
      urlRewrite: '',
      subChild: [],
    }

    catalogManager.subChild.push({
      name: 'Quản lý dịch vụ',
      code: 'menu.service-management',
      iconClass: 'sidebar-menu-icon icon__vector',
      urlRewrite: 'catalog-management/service',
      subChild: [],
    })
    catalogManager.subChild.push({
      name: 'Quản lý dịch vụ',
      code: 'menu.inventory-management',
      iconClass: 'sidebar-menu-icon icon__vector',
      urlRewrite: 'catalog-management/inventory-playbook',
      subChild: [],
    })

    lstMenu2.push(catalogManager);
    // }

    const installationManager = {
      name: 'Quản lý cài đặt tài nguyên',
      code: 'menu.installation-management',
      iconClass: 'sidebar-menu-icon icon__admin',
      urlRewrite: 'installation/list',
      subChild: []
    }

    lstMenu2.push(installationManager);

    const rootMenu = [
      {
        text: 'Trang chủ',
        i18n: 'menu.main',
        group: true,
        hideInBreadcrumb: true,
        children: this.initMenu(lstMenu2, ''),
      },
    ];
    this.menuSrv.add(rootMenu);
  }

  initMenu(navigation: any[], link: string):
    any[] {
    const length: number = navigation.length;
    const menu: any[] = [];
    let menuItem: any = {};

    for (let i = 0; i < length; i += 1) {
      menuItem = {
        text: navigation[i].name,
        i18n: navigation[i].code,
        icon: navigation[i].iconClass,
      };
      menuItem.link = link;
      if (
        navigation[i].urlRewrite !== null &&
        navigation[i].urlRewrite !== undefined &&
        navigation[i].urlRewrite !== ''
      ) {
        menuItem.link = link + '/' + navigation[i].urlRewrite;
      }
      if (
        navigation[i].subChild !== null &&
        navigation[i].subChild !== undefined &&
        navigation[i].subChild.length > 0
      ) {
        menuItem.children = this.initMenu(navigation[i].subChild, menuItem.link);
      }
      if (menuItem.link !== '') {
        this.listUrlAllow.push(menuItem.link);
      }
      menu.push(menuItem);
    }
    return menu;
  }
}
