## 业务说明

> 角色分为 **总部角色** 和 **分支机构角色**

#### 总部角色

当选择角色层级为 总部， 会存在如下数据源

- 功能授权（即菜单）
- 机构授权
- 城市授权

当角色层级为  **大区** 和 **大区** 会存在如下数据源

- 功能授权（即菜单）


#### 分支机构角色

功能授权分为  一级机构，二级机构，实体店， 都有如下数据源

-  Web端OA系统功能权限
-  万顺福App功能权限

切换机构类型， 需要重新调用接口查询对应的数据源


#### 首页-总部权限申请和分支机构权限申请
这里对应的业务逻辑和上面的差不多， 是上面新建的一种