export default {
    props: {
        levelDeptData: {
            type: Object,
            default: () => {}
        }
    },
    watch: {
        levelDeptData: {
            handler(val) {
                
                val && this.tranToTreeData(val);
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        tranToTreeData(val) {
            let childList = [...val.childList].map(i => {
                return {
                    leaf: i.childFlag == 0, 
                    ...i
                };
            });
            let treeData = [{ ...val,childList }];
            this.treeData = treeData;
            this.defaultExpandKeys=[val.id]
        }
    }
};
