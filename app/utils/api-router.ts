import { environment } from '@env/environment';

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
  getAppParamsByType: `${environment.API_SERVICE}/app-param`,
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
};

export const ServiceRouter = {
  searchServiceByName: `${environment.API_SERVICE}/utilities/getAllServiceByName`,
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
  getDetail: `${environment.API_SERVICE}/inventory-playbook/findById`,
  getFileName: `${environment.API_SERVICE}/inventory-playbook/getListFolderSetting`,
}
export const ServerRouter = {
  search: `${environment.API_SERVICE}/server/search`,
  delete: `${environment.API_SERVICE}/server/delete`,
  saveData: `${environment.API_SERVICE}/server/create`,
  update: `${environment.API_SERVICE}/server/update`,
  getDetail: `${environment.API_SERVICE}/server/findById`,

}
export const SrRouter = {
  search: `${environment.API_SERVICE}/sr/search`,
  delete: `${environment.API_SERVICE}/sr/delete`,
  saveData: `${environment.API_SERVICE}/sr/create`,
  update: `${environment.API_SERVICE}/sr/update`,
  getDetail: `${environment.API_SERVICE}/sr/findById`,
}
export const StorageRouter = {
  searchStorageByName: `${environment.API_SERVICE}/storage/getAllStorageByName`,
  search: `${environment.API_SERVICE}/storage/search`,
  delete: `${environment.API_SERVICE}/storage/delete`,
  saveData: `${environment.API_SERVICE}/storage/create`,
  update: `${environment.API_SERVICE}/storage/update`,
  getDetail: `${environment.API_SERVICE}/storage/findById`,
}
export const ServerGroupRouter = {
  searchSvGroupByName: `${environment.API_SERVICE}/serverGroup/getAllSvGroupByName`,
  search: `${environment.API_SERVICE}/serverGroup/search`,
  delete: `${environment.API_SERVICE}/serverGroup/delete`,
  saveData: `${environment.API_SERVICE}/serverGroup/create`,
  update: `${environment.API_SERVICE}/serverGroup/update`,
  getDetail: `${environment.API_SERVICE}/serverGroup/findById`,
}
export const ServerServiceRouter = {
  searchSvServiceByName: `${environment.API_SERVICE}/serverService/getAllSvServiceByName`,
  search: `${environment.API_SERVICE}/serverService/search`,
  delete: `${environment.API_SERVICE}/serverService/delete`,
  saveData: `${environment.API_SERVICE}/serverService/create`,
  update: `${environment.API_SERVICE}/serverService/update`,
  getDetail: `${environment.API_SERVICE}/serverService/findById`,
}
export const NetworkRouter = {
  searchNetworkByName: `${environment.API_SERVICE}/network/getAllNetworkByName`,
  searchData: `${environment.API_SERVICE}/network/search`,
  saveData: `${environment.API_SERVICE}/network/create`,
  getDetail: `${environment.API_SERVICE}/network/findById`,
  updateNetwork: `${environment.API_SERVICE}/network/update`,
  removeNetwork: `${environment.API_SERVICE}/network/delete`,
};

export const FlavorRouter = {
  searchFlavorByName: `${environment.API_SERVICE}/flavor/getAllFlavorByName`,
  searchData: `${environment.API_SERVICE}/flavor/search`,
  saveData: `${environment.API_SERVICE}/flavor/create`,
  getDetail: `${environment.API_SERVICE}/flavor/findById`,
  updateFlavor: `${environment.API_SERVICE}/flavor/update`,
  removeFlavor: `${environment.API_SERVICE}/flavor/delete`,
};
export const OsRouter = {
  searchOsByName: `${environment.API_SERVICE}/os/getAllOsByName`,
  searchData: `${environment.API_SERVICE}/os/search`,
  saveData: `${environment.API_SERVICE}/os/create`,
  getDetail: `${environment.API_SERVICE}/os/findById`,
  updateOs: `${environment.API_SERVICE}/os/update`,
  removeOs: `${environment.API_SERVICE}/os/delete`,
};

export const SettingRouter = {
  update: `${environment.API_SERVICE}/setting/update`,
  getDetail: `${environment.API_SERVICE}/setting/findById`,

}
export const DashboardRouter = {
  getData: `${environment.API_SERVICE}/dashboard/get-data`,
  unitChart: `${environment.API_SERVICE}/dashboard/unit-chart`,
  rateChart: `${environment.API_SERVICE}/dashboard/rate-chart`,
}
export const RequestSettingRouter = {
  getAllUnit: `${environment.API_SERVICE}/request_setting/getAllUnit`,
}




