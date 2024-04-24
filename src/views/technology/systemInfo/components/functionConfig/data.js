/**
 * 递归查询菜单
 */
export const findMenu = (list, target) => {
  for (let i = 0; i < list.length; i++) {
    let item = list[i]

    if (item.resourcesUrl === target) {
      return item
    }

    if (item.children && item.children.length) {
      let r1 = findMenu(item.children, target)

      if (r1) return r1
    }
  }
}

/**
 * 根据指定节点返回当前节点所有的父节点
 * @param {Number} curKey
 * @param {Array<any>} data
 * @returns {Array<{id: number, name: string, isSelf: boolean}>}
 */
export const getPathByKey = (curKey, data) => {
  let result = []

  if (data.length === 0) return []

  let fn = (path, data) => {
    for (let item of data) {
      path.push(item)

      if (item.id === curKey) {
        result = path.map(p => {
          return {
            id: p.id,
            name: p.name,
            isSelf: p.id === curKey
          }
        })

        return
      }

      const children = Array.isArray(item.children) ? item.children : []

      fn(path, children)

      path.pop()
    }
  }

  // 触发
  fn([], data)

  return result
}

/**
 * 获取组织机构类型- 菜单里面动态配置出来的
 * @param {} menuList
 * @returns
 */
export const getOrgTypeList = menuList => {
  let res = findMenu(menuList, '/webSystem')
  if (res) {
    // 解析出里面的菜单项
    let children = res.children || []

    // 过滤掉 【op基础配置】
    let orgList = children.filter(item => item.resourcesUrl !== '/systemDetail/webSystem/org&-1')

    orgList = orgList.map(item => {
      const orgType = item.resourcesUrl.split('&')[1]

      return {
        name: item.resourcesName,
        resourcesName: item.resourcesName,
        resourcesUrl: item.resourcesUrl,
        id: item.id,
        orgType: parseInt(orgType)
      }
    })

    return orgList
  }
}
