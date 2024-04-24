import store from "../store/index";
import { initGlobalState } from "qiankun";
// 子应用页面刷新时默认props
let subSystemInfo = Object.assign({}, store.state.subStore.systemConfigProject)
// 定义全局下发的数据
export const initialState = {
  // 当前登录用户
  userInfo: {},
  isHavePerssion: store.getters.isHavePerssion,
  passengerId: store.getters.passengerId,
  systemConfigProject: subSystemInfo
};

// 初始化全局下发的数据
export const qiankunActions = initGlobalState(initialState);
// 检测全局下发数据的改变
qiankunActions.onGlobalStateChange((state) => {
  // 修改全局下发的数据
  for (const key in state) {
    if (Object.prototype.hasOwnProperty.call(state, key)) {
      const item = state[key];
      initialState[key] = item;
      if (key === "userInfo") {
        store.commit("user/UPDATE_USER_INFO", item);
        continue;
      }
      if (key === "isHavePerssion") {
        store.commit("user/UPATE_HAVE_PERSSION", item);
        continue;
      }
      if (key === "passengerId") {
        store.commit("subStore/UPATE_PASSENGER_ID", item);
        continue;
      }
      if (key === "driverId") {
        store.commit("subStore/UPATE_DRIVER_ID", item);
        continue;
      }
      if (key === "passengerPhone") {
        store.commit("subStore/UPATE_Phone", item);
        continue;
      }
      if (key === "fromDriverId") {
        store.commit("subStore/UPATE_From_DriverId", item);
        continue;
      }
      if (key === "systemConfigProject") {
        store.commit("subStore/UPDATE_SYSTEM_CONFIG_PROJECT", item);
        continue;
      }
    }
  }
});
