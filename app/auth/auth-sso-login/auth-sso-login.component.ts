import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from "@delon/auth";
import { CommonService } from "../../services/common/common.service";
import { AuthenticationService } from "../../services/authentication/authentication.service";
import { ROLE_LIST } from "../../utils";
import { MenuService } from "@delon/theme";

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
      console.log("hihi");
      const token = 'eyJhbGciOiJIUzUxMiJ9.ZXlKNmFYQWlPaUpFUlVZaUxDSmhiR2NpT2lKa2FYSWlMQ0psYm1NaU9pSkJNVEk0UTBKRExVaFRNalUySW4wLi5OS2NrbTlMMnBZQzJ1am9UeUR1TDBnLkpOVjAxNTZnWGVsQWlxX01oeXpEUlhRS2VLY0h0OU0xWXA4QVF5cjZkVmNpQlJSRXk3azNJUUJqX3ZITnlyRWxQVmZFTWc3T09RdXJRNWhLa3pYdnN4c0dRYzYtSThqc3ExMDZudmJDRXJ4R1NGTzBkbTNMOHlydkF5bzdRTl9TUVo4cmhIbFlxZk1HeExMaW1DdXhfaTNqVk5fdFQ5c1F3elh5OFNjdVk2cURLTmtLWVY1MTlMNDJaY2gyNjF0Q0RzcEd2c3VNNEdCaHdNdVY3U2pfMHd3SnVtUkdaNmZRQWZuQ3NycWQ5UkhndzRIdXRoSjlIdGp4R1ZYdWtDeXlkSnR4Rl9DRjg3REtRLU9aeUNxQkR4dC1RcUNxY0JMdEd2LWRyZkwtTXBTWE1zRVFwZE54X2EzRmVBdUtyNnZXdWpEdDVCWHpzT2RGYm5DNGVZNHhIMERaemlCa2JtU21NRWEzSVJKQmE4TVVjbGVHejNvN3N0Qm13QnpKU0hWS2xURWotSzZfLUVFTWIzVU5UdWIxcy14OHhwWTYzLVlBRVgwUVNpYS1sV2RXYXZfajBPZzFHUnpnMmtzWmJ6Q2wzV09fd0lWZFd0NS1SejhsSlQ5VHROb3VhRFZyQklKTEVoTDZBUVZkdU5GZVRIQmZTQ2R3N1BELWhwd1pFWkxiOHp2NWNuLTBXaG5vbWJRSGd1OXhlYWVDNUQzaHphLXN2dlJtQ1U2UExiT1ZDanN1cUU0SHRZT2hqZ3R0d2o5RXp1TXVSTmRGbDZxLURKeDVyQmhSMW43RFROX3BFaFBOUXdGbVd4WFpFLXMuRURPX1BfbHdkNEhNeUZhTzUzZzNMQQ%3D%3D.fOe6IUYf7Fx3aAEelSCmTSCNv8qgvyb-VtBxb239FeaZsHFHW3wTRj73auQT3napZI0EhI32rjUoBXShBZYzQA';
      if (token) {
        this.authenticationService.login(token).subscribe(res => {
          // if (params['ticket']) {
          //   this.authenticationService.login(params['ticket']).subscribe(res => {
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
              localStorage.setItem('role', JSON.stringify({ roleList: response.data }));
              localStorage.setItem('employeeCode', user.employeeCode); // *********** EDIT CODE ************
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
    const catalogManager = {
      name: 'Quản lý cấu hình',
      code: 'menu.catalog-management',
      iconClass: 'sidebar-menu-icon icon__catalog',
      urlRewrite: '',
      subChild: [],
    }
    catalogManager.subChild.push({
      name: 'Quản lý STORAGE',
      code: 'menu.storage-management',
      iconClass: 'sidebar-menu-icon icon__catalog',
      urlRewrite: 'catalog-management/storage',
      subChild: [],
    })
    catalogManager.subChild.push({
      name: 'Quản lý Server Group',
      code: 'menu.server-group-management',
      iconClass: 'sidebar-menu-icon icon__catalog',
      urlRewrite: 'catalog-management/server-group',
      subChild: [],
    })
    catalogManager.subChild.push({
      name: 'Quản lý Server Service',
      code: 'menu.server-service-management',
      iconClass: 'sidebar-menu-icon icon__catalog',
      urlRewrite: 'catalog-management/server-service',
      subChild: [],
    })

    catalogManager.subChild.push({
      name: 'Quản lý dịch vụ',
      code: 'menu.service-management',
      iconClass: 'sidebar-menu-icon icon__catalog',
      urlRewrite: 'catalog-management/service',
      subChild: [],
    })
    catalogManager.subChild.push({
      name: 'Quản lý dịch vụ',
      code: 'menu.inventory-management',
      iconClass: 'sidebar-menu-icon icon__catalog',
      urlRewrite: 'catalog-management/inventory-playbook',
      subChild: [],
    })
    catalogManager.subChild.push({
      name: 'Quản lý flavor',
      code: 'menu.flavor-management',
      iconClass: 'sidebar-menu-icon icon__catalog',
      urlRewrite: 'catalog-management/flavor',
      subChild: [],
    })
    catalogManager.subChild.push({
      name: 'Quản lý network',
      code: 'menu.network-management',
      iconClass: 'sidebar-menu-icon icon__catalog',
      urlRewrite: 'catalog-management/network',
      subChild: [],
    })
    catalogManager.subChild.push({
      name: 'Quản lý Os',
      code: 'menu.Os-management',
      iconClass: 'sidebar-menu-icon icon__catalog',
      urlRewrite: 'catalog-management/os',
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

    const serverManager = {
      name: 'Quản lý cấp phát server',
      code: 'menu.server-management',
      iconClass: 'sidebar-menu-icon icon__catalog',
      urlRewrite: '',
      subChild: []
    }

    serverManager.subChild.push({
      name: 'Quản lý VM',
      code: 'menu.vm-management',
      iconClass: 'sidebar-menu-icon icon__catalog',
      urlRewrite: 'catalog-management/server',
      subChild: [],
    })

    serverManager.subChild.push({
      name: 'Quản lý SR',
      code: 'menu.sr-management',
      iconClass: 'sidebar-menu-icon icon__catalog',
      urlRewrite: 'catalog-management/sr',
      subChild: [],
    })

    serverManager.subChild.push({
      name: 'Quản lý SETTING',
      code: 'menu.setting-management',
      iconClass: 'sidebar-menu-icon icon__catalog',
      urlRewrite: 'catalog-management/setting/detail/1',
      subChild: [],
    })

    lstMenu2.push(serverManager);

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
