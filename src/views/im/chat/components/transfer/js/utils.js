/**
 * 由于后台返回的id和腾讯需要的id不一样，需要循环处理数据  话说，规则呢？就饭吃了？
 * @param {*} self  = this
 * @returns 
 */
export const fifterUserList = async (self) => {
    let submitList = [];
    let isOrg = false;
    let deptIds = [];
    let orgList = '';
    let t = self.$baseMethod.deepClone(self.t_selectList)
    console.log('transfer-selected-data-fifter-before', t)
    self.t_selectList.map(item => {
        if(item.userID !== undefined){
            if((item.userID+'').includes('wsstore_')){
                submitList.push(item)
            }else{
                submitList.push({
                    userID: `wsstore_${item.userID}`
                })
            }
        }else if(item.isLeaf !== undefined){ // 按组织架构部门id
            // item.userID = `wsstore_${item.id}`
            deptIds.push(item.id)
            isOrg = true;
        }else if(item.positionName !== undefined){ // 按组织架构部门成员
            submitList.push({
                userID: `wsstore_${item.id}`
            })
        }else if(item.userFriendList !== undefined){ // 按好友
            submitList.push({
                userID: `wsstore_${item.id}`
            })
        }else{
            submitList.push(item)
        }
    })
    if(isOrg){
        orgList = await selectSearchOrgUser(self, deptIds)
    }
    return [...submitList, ...orgList]
}

/**
 * 查询部门成员
 * @param {*} self 
 * @param {*} deptIds 部门ids []
 * @returns 
 */
export const selectSearchOrgUser = async (self, deptIds) => {
    const moduleName = '/chat'
    const op = 'selectSearchOrgUser';
    let data = {
        data: {
            deptIds
        },
        op,
    };
    let URL = self.$getModuleUrl(moduleName, op);
    let res = await self.$axios(URL, data)
    if (res.code == 1) {
        let result = JSON.parse(res.data);
        let userList = [];
        result.map(item => {
            item.empList.map(itemA => {
                userList.push({
                    userID: `wsstore_${itemA.userId}`
                })
            })
        })
        return userList;
    }
}