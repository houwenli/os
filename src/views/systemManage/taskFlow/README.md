### 新增一个审核流步骤

1. 修改 `config.js` 里面 ，在里面 的groups 增加对应的类型
2. 在 对应的 审核烈性 增加枚举 `main/src/views/home/auditFlow/allApprovalRecord/data.js`  ， 先找大类，再从大类的数组中加入对应的子类， id值找后端 要