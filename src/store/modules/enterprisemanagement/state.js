const state = {
    /**
     * 车主类型
     */
    driverTypeFilters: [
        {
            id: 3,
            value: '网约车车主'
        },
        {
            id: 2,
            value: '出租车车主'
        },
    ],
    /**
     * 推荐人身份
     */
    refereeStatusFilters: [
        {
            value: '普通车主',
            id: 1
        },
        {
            value: '共享合伙人',
            id: 2
        },
        {
            value: '高级合伙人',
            id: 3
        },
        {
            value: '出租车合伙人',
            id: 4
        }
    ],
    // 包车计价页面的服务车型
    rideTypeFilters:[{id:10,name:"快车"},{id:20,name:"专车"},{id:30,name:"豪华车"},{id:40,name:"商务车"}],
    // 包车计价新增页面的企业名称下拉选项
    companyNameFilters:[],



}

export default state;
