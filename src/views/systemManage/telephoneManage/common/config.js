export const searchList = [
    {
        name: '按组织架构',
        value: 1
    },
    {
        name: '按部门类型',
        value: 2
    }
];
export const areaDeptChildList = [
    {
        name: '省区',
        id: Math.random(),
        hasChildren: true,
        type: 'areaDept',
        orgType: 10
    },
    {
        name: '分公司',
        id: Math.random(),
        hasChildren: true,
        type: 'areaDept',
        orgType: 20
    },
    {
        name: '服务中心',
        id: Math.random(),
        hasChildren: true,
        type: 'areaDept',
        orgType: 30
    },
    {
        name: '服务站',
        id: Math.random(),
        hasChildren: true,
        type: 'areaDept',
        orgType: 40
    }
];
// 0：全部，1：仅可见自己；2:所属部门和下级部门3:指定部门/人
export const permissOptions = [
    {
        label: '全部',
        value: 0
    },
    {
        label: '只可见本部门',
        value: 1
    },
    {
        label: '只可见所在部门及下级部门',
        value: 2
    },
    {
        label: '所在一级部门全部下属部门',
        value: 3
    },
    {
        label: '只能看到指定部门',
        value: 4
    }
];
