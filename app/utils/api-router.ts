import {environment} from '@env/environment';

export const MenuRouter = {
  getMenu: 'v1/menu/tree',
};

export const AuthenticationRouter = {
  getToken: `${environment.API_SERVICE}/authen/login`,
  getLoginInfo: `${environment.API_SERVICE}/user/getUserInfo`,
  refreshToken: `${environment.API_SERVICE}/user/refreshToken`,
  forgotPassword: `${environment.API_SERVICE}/authen/forgotpassword`,
  registerUser: `${environment.API_SERVICE}/authen/register`,
  changePassword: `${environment.API_SERVICE}/authen/change-password`,
};

export const navigationRouter = {
  getNavigationOwner: `api/v${environment.API_VERSION}/bsd/navigations/owner`,
};

export const trackingRouter = {
  listTracking: `api/v${environment.API_VERSION}/bsd/logs`,
};

export const AppParamsRouter = {
  getAppParamsByType:`${environment.API_SERVICE}/app-param`,
};

export const RolesRouter = {
  getAllRoles: `${environment.API_SERVICE}/role/getAll`,
};

export const CommonRouter = {
  downloadFileById: `${environment.API_SERVICE}/file/`,
  getColumnConfig: `${environment.API_SERVICE}/common/column/getConfig`,
  saveColumnConfig: `${environment.API_SERVICE}/common/column/saveConfig`,
  uploadMultiple: `${environment.API_SERVICE}/file/upload`,
  importExcel: `${environment.API_SERVICE}/file/importExcel`,
  downloadFileByPath: `${environment.API_SERVICE}/file/downloadByPath`
};

export const ServiceRouter = {
  searchServiceByName : `${environment.API_SERVICE}/utilities/getAllServiceByName`,
  searchData: `${environment.API_SERVICE}/utilities/search`,
  saveData: `${environment.API_SERVICE}/utilities/create`,
  getDetail: `${environment.API_SERVICE}/utilities/findById`,
  updateService: `${environment.API_SERVICE}/utilities/update`,
  removeService: `${environment.API_SERVICE}/utilities/delete`,
};

export const InstallationRouter = {
  searchData: `${environment.API_SERVICE}/request_setting/searchRequestSetting`,
  getDetail: `${environment.API_SERVICE}/request_setting/findById`,
  update: `${environment.API_SERVICE}/request_setting/update`,
  syncData: `${environment.API_SERVICE}/request_setting/reSetupService`,
  syncSR: `${environment.API_SERVICE}/request_setting/srSynchronized`,
}
export const InventoryPlaybookRouter = {
  search: `${environment.API_SERVICE}/inventory-playbook/search`,
  delete: `${environment.API_SERVICE}/inventory-playbook/delete`,
  saveData: `${environment.API_SERVICE}/inventory-playbook/create`,
  update: `${environment.API_SERVICE}/inventory-playbook/update`,
  getDetail:  `${environment.API_SERVICE}/inventory-playbook/findById`,
  getFileName:  `${environment.API_SERVICE}/inventory-playbook/getListFolderSetting`,

}
export const DashboardRouter = {
  getData: `${environment.API_SERVICE}/dashboard/get-data`,
  unitChart: `${environment.API_SERVICE}/dashboard/unit-chart`,
  rateChart: `${environment.API_SERVICE}/dashboard/rate-chart`,
}
export const RequestSettingRouter = {
  getAllUnit: `${environment.API_SERVICE}/request_setting/getAllUnit`,
}




