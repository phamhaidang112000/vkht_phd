import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {NavigationEnd, NavigationError, RouteConfigLoadStart, Router} from '@angular/router';
import {BreakpointObserver, MediaMatcher} from '@angular/cdk/layout';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {NzMessageService} from 'ng-zorro-antd';
import {updateHostClass} from '@delon/util';
import {MenuService, ScrollService, SettingsService} from '@delon/theme';
import {ReuseTabService} from '@delon/abc';

import {BrandService} from './pro.service';

import {NavigationService, UserRightService, UserService} from '../../services';

import {DA_SERVICE_TOKEN, ITokenService} from '@delon/auth';
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {ROLE_LIST} from "../../utils";

@Component({
  selector: 'layout-pro',
  templateUrl: './pro.component.html',
})
export class LayoutProComponent implements OnInit, AfterViewInit, OnDestroy {
  get isMobile() {
    return this.pro.isMobile;
  }

  get getLayoutStyle() {
    const {isMobile, fixSiderbar, collapsed, menu, width, widthInCollapsed} = this.pro;
    if (fixSiderbar && menu !== 'top' && !isMobile) {
      return {
        paddingLeft: (collapsed ? widthInCollapsed : width) + 'px',
      };
    }
    return null;
  }

  get getContentStyle() {
    const {fixedHeader, headerHeight} = this.pro;
    return {
      margin: '24px 24px 0',
      'padding-top': (fixedHeader ? headerHeight : 0) + 'px',
    };
  }

  private get body(): HTMLElement {
    return this.doc.body;
  }

  constructor(
    bm: BreakpointObserver,
    mediaMatcher: MediaMatcher,
    private router: Router,
    msg: NzMessageService,
    scroll: ScrollService,
    reuseTabSrv: ReuseTabService,
    private resolver: ComponentFactoryResolver,
    private el: ElementRef,
    private renderer: Renderer2,
    public pro: BrandService,
    private menuSrv: MenuService,
    private navigationService: NavigationService,
    private userService: UserService,
    private userRightService: UserRightService,
    private settings: SettingsService,
    @Inject(DOCUMENT) private doc: any, // private cdr: ChangeDetectorRef
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private authenticateService: AuthenticationService,
  ) {
    // scroll to top in change page
    router.events.pipe(takeUntil(this.unsubscribe$)).subscribe(evt => {
      if (!this.isFetching && evt instanceof RouteConfigLoadStart) {
        this.isFetching = true;
        scroll.scrollToTop();
      }
      if (evt instanceof NavigationError) {
        this.isFetching = false;
        msg.error(`Can't load ${evt.url} routing`, {nzDuration: 1000 * 3});
        return;
      }
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      this.isFetching = false;
      // If have already cached router, should be don't need scroll to top
      if (!reuseTabSrv.exists(evt.url)) {
        scroll.scrollToTop();
      }
    });

    // media
    const query = {
      'screen-xs': '(max-width: 575px)',
      'screen-sm': '(min-width: 576px) and (max-width: 767px)',
      'screen-md': '(min-width: 768px) and (max-width: 991px)',
      'screen-lg': '(min-width: 992px) and (max-width: 1199px)',
      'screen-xl': '(min-width: 1200px)',
    };
    bm.observe([
      '(min-width: 1200px)',
      '(min-width: 992px) and (max-width: 1199px)',
      '(min-width: 768px) and (max-width: 991px)',
      '(min-width: 576px) and (max-width: 767px)',
      '(max-width: 575px)',
    ]).subscribe(() => {
      this.queryCls = Object.keys(query).find(key => mediaMatcher.matchMedia(query[key]).matches);
      this.setClass();
    });
  }

  private unsubscribe$ = new Subject<void>();
  private queryCls: string;
  @ViewChild('settingHost', {read: ViewContainerRef, static: false}) private settingHost: ViewContainerRef;

  isFetching = false;

  listUrlAllow: string[] = [];

  private setClass() {
    const {body, renderer, queryCls, pro} = this;
    updateHostClass(body, renderer, {
      ['color-weak']: pro.layout.colorWeak,
      [`layout-fixed`]: pro.layout.fixed,
      [`aside-collapsed`]: pro.collapsed,
      ['alain-pro']: true,
      [queryCls]: true,
      [`alain-pro__content-${pro.layout.contentWidth}`]: true,
      [`alain-pro__fixed`]: pro.layout.fixedHeader,
      [`alain-pro__wide`]: pro.isFixed,
      [`alain-pro__dark`]: pro.theme === 'dark',
      [`alain-pro__light`]: pro.theme === 'light',
    });
  }

  ngAfterViewInit(): void {

  }

  ngOnInit() {
    const {pro, unsubscribe$} = this;
    pro.notify.pipe(takeUntil(unsubscribe$)).subscribe(() => {
      this.setClass();
    });
    this.loadMenu();
  }

  ngOnDestroy() {
    const {unsubscribe$, body, pro} = this;
    unsubscribe$.next();
    unsubscribe$.complete();
    body.classList.remove(
      `alain-pro__content-${pro.layout.contentWidth}`,
      `alain-pro__fixed`,
      `alain-pro__wide`,
      `alain-pro__dark`,
      `alain-pro__light`,
    );
  }

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

    // catalogManager.subChild.push({
    //   name: 'Quản lý Storage',
    //   code: 'menu.storage-management',
    //   iconClass: 'sidebar-menu-icon icon__catalog',
    //   urlRewrite: 'catalog-management/storage',
    //   subChild: [],
    // })

    // catalogManager.subChild.push({
    //   name: 'Quản lý Server Group',
    //   code: 'menu.server-group-management',
    //   iconClass: 'sidebar-menu-icon icon__catalog',
    //   urlRewrite: 'catalog-management/server-group',
    //   subChild: [],
    // })

    // catalogManager.subChild.push({
    //   name: 'Quản lý Server Service',
    //   code: 'menu.server-service-management',
    //   iconClass: 'sidebar-menu-icon icon__catalog',
    //   urlRewrite: 'catalog-management/server-service',
    //   subChild: [],
    // })

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
      name: 'Thông tin Openstack',
      code: 'menu.setting-management',
      iconClass: 'sidebar-menu-icon icon__catalog',
      urlRewrite: 'catalog-management/setting/detail/1',
      subChild: [],
    })
    // catalogManager.subChild.push({
    //   name: 'Quản lý flavor',
    //   code: 'menu.flavor-management',
    //   iconClass: 'sidebar-menu-icon icon__catalog',
    //   urlRewrite: 'catalog-management/flavor',
    //   subChild: [],
    // })
    // catalogManager.subChild.push({
    //   name: 'Quản lý network',
    //   code: 'menu.network-management',
    //   iconClass: 'sidebar-menu-icon icon__catalog',
    //   urlRewrite: 'catalog-management/network',
    //   subChild: [],
    // })
    // catalogManager.subChild.push({
    //   name: 'Quản lý Os',
    //   code: 'menu.os-management',
    //   iconClass: 'sidebar-menu-icon icon__catalog',
    //   urlRewrite: 'catalog-management/os',
    //   subChild: [],
    // })

    lstMenu2.push(catalogManager);

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
