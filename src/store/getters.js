const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  sidebarRouters: state => state.permission.sidebarRouters,
  isHavePerssion: state => state.user.isHavePerssion,
  passengerId: state => state.subStore.passengerId,
  driverId: state => state.subStore.driverId,
  passengerPhone: state => state.subStore.passengerPhone,
  fromDriverId: state => state.subStore.fromDriverId,
  systemConfigProject: state => state.subStore.systemConfigProject,
  systemList:state=>state.systemList.systemList
}
export default getters
