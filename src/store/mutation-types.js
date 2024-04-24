//使用常量替代 mutation 事件类型,可以对整个 app 包含的 mutation 一目了然,有利于多人合作项目
/**
 *  增：ADD_
 *  删：DEL_
 *  改：UPDATE_
 *  查：SELECT_
 *  事件: EVENT_
 */

export const SELECT_MEUN_LIST = 'SELECT_MEUN_LIST'    //获取权限菜单

export const SELECT_USER_IFNO = 'SELECT_USER_IFNO' // 获取登录用户信息
export const SELECT_PROVINCE_CITY_LIST = 'SELECT_PROVINCE_CITY_LIST' // 获取省市
export const SELECT_PROVINCE_CITY_AREA_LIST = 'SELECT_PROVINCE_CITY_AREA_LIST' // 获取省市区
export const CENTER_TYPE = 'CENTER_TYPE' // 机构类型

export const SELECT_CHANNEL_CATEGORY = 'SELECT_CHANNEL_CATEGORY'    // 获取渠道类别

// 机构管理-organization
export const SELECT_SERVICE_PARTNER = 'SELECT_SERVICE_PARTNER'    // 获取机构管理-服务站管理-上级服务站列表

export const SELECT_CITYCODE_MAP = 'SELECT_CITYCODE_MAP'
export const SELECT_DATAVSHOWBTN = 'SELECT_DATAVSHOWBTN'