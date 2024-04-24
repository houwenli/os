export const nodeConfig = {
    start: {
        backgroundColor: "#7284AA",
        color: "#ffffff",
        fontSize: "15px",
        borderColor: "#dbd8d8",
        iconClass: "",
    },
    end: {
        backgroundColor: "#fff",
        color: "#000",
        fontSize: "15px",
        borderColor: "#dbd8d8",
        iconClass: "",
    },
    sp: {
        backgroundColor: "#DD8304",
        color: "#ffffff",
        fontSize: "15px",
        borderColor: "#FCAD22",
        iconClass: require("../../assets/images/icon_check.png"),
    },
    cs: {
        backgroundColor: "#3CA66F ",
        color: "#ffffff",
        fontSize: "15px",
        borderColor: "#3CB4B2",
        iconClass: require("../../assets/images/icon_send.png"),
    },
};

/**
 * 审批流节点枚举
 */
export const nodeType = {
  1: "审批人指定成员",
  2: "审批人指定账号组",
  3: "审批人发起人自选1人",
  4: "审批人发起人自选多人",
  5: "抄送人指定成员",
  6: "抄送人发起人自选",
  7: "抄送人指定成员+自选",
  8: "直属上级",
  9: "法人公司",
  12: "直属机构"
}