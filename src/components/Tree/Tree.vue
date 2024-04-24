<template>
    <div class="ws-tree-warp" v-loading="loading">
        <el-tree
            ref="tree"
            v-bind="$attrs"
            v-on="$listeners"
            :data="data"
            :props="defaultProps"
            :node-key="nodeKey"
            :draggable="draggable"
            :allow-drop="allowDrop"
            :allow-drag="allowDrag"
            :default-expand-all="expandAll"
            :render-content="renderContent"
            :lazy="lazy"
            :load="loadNode"
            :empty-text="emptyText"
            :expand-on-click-node="true"
            highlight-current
            :default-expanded-keys="defaultExpandedKeys"
            @node-click="handleNodeClick"
            @node-drag-start="handleDragStart"
            @node-drag-enter="handleDragEnter"
            @node-drag-leave="handleDragLeave"
            @node-drag-over="handleDragOver"
            @node-drag-end="handleDragEnd"
            @node-drop="handleDrop"
        ></el-tree>
    </div>
</template>

<script>
import TreeRender from './Tree-render';
export default {
    name: 'ws-tree',
    props: {
        treeData: { type: Array, default: () => [] }, //树形数据
        defaultProps: { type: Object, default: () => {} }, //默认匹配
        draggable: { type: Boolean, default: false }, //是否开启拖拽节点
        nodeKey: { type: String, default: 'id' }, // 树节点唯一标识
        expandAll: { type: Boolean, default: false }, //是否默认展开全部节点
        lazy: { type: Boolean, default: false }, //是否开启懒加载
        genNodeContent: { type: Function }, //传入生成节点内容函数，返回值为vnode
        setNodeExpand: { type: Function }, //传入设置节点是否扩展新增编辑删除功能
        defaultExpandedKeys: { type: Array, default: () => [] },
        emptyText: { type: String, default: () => '暂无数据' }
    },
    watch: {
        treeData: {
            handler(val) {
                const data = this.$baseMethod.deepClone(val);
                this.data = data;
            },
            immediate: true,
            deep: true
        }
    },
    data() {
        return {
            data: [],
            prevCurrentData: null,
            currentNode: null,
            loading:false
        };
    },
    created() {
    },
    methods: {
        loadNode: function (node, resolve) {
            this.$emit('load', node, resolve);
        },
        filter: function (val) {
            this.$refs.tree.filter(val);
        },
        renderContent(h, { node, data }) {
            let _self = this;
            //todo:后期可换成插槽
            let contentVnode = _self.genNodeContent && _self.genNodeContent.call(_self, node, data);
            return h(TreeRender, {
                props: {
                    DATA: data,
                    NODE: node,
                    EXPANDID: data.id,
                    CONTENTVNODE: contentVnode
                },
                on: {
                    nodeAdd: (node, data) => _self.handleAdd(node, data),
                    nodeEdit: (node, data) => _self.handleEdit(node, data),
                    nodeDel: (node, data) => _self.handleDelete(node, data)
                }
            });
        },
        handleAdd(n, d) {
            this.$emit('node-add', n, d);
        },
        handleEdit(n, d) {
            this.$emit('node-edit', n, d);
        },
        handleDelete(n, d) {
            this.$emit('node-delete', n, d);
        },
        handleNodeClick(data, node) {
            //点击将先前节点扩展消失，自己节点扩展出现
            const prevData = this.currentNode;
            if (prevData) {
                prevData._isExpand = false;
            }
            this.currentNode = data;
            let _isExpand = this.setNodeExpand?.call(this, node, data);
            // data._isExpand=_isExpand
            this.$set(data, '_isExpand', _isExpand);
        },

        handleDragStart(node, ev) {
        },
        handleDragEnter(draggingNode, dropNode, ev) {
        },
        handleDragLeave(draggingNode, dropNode, ev) {
        },
        handleDragOver(draggingNode, dropNode, ev) {
        },
        handleDragEnd(draggingNode, dropNode, dropType, ev) {
            if(dropType === 'none') {
                this.$message.warning('只能调整同级别组织架构顺序！');
            } else {
                const arr = this.$refs.tree.store._getAllNodes()
                const selectTree = this.recurrence(arr[0],draggingNode)
                this.changeDepartment(selectTree)
            }
        },
        handleDrop: function () {},
        allowDrop(draggingNode, dropNode, type) {
            if(type === 'inner') {
                return false
            } else {
                if(draggingNode.level != dropNode.level) {
                    return false
                } else if (draggingNode.data.parentId != dropNode.data.parentId) {
                    return false
                } else {
                    return true
                }
            }
        },
        allowDrag(node) {
            return true
        },
        //递归筛选出数据
        recurrence(arr,val) {
            let childNodes = arr.childNodes || []
            for(let i = 0;i < childNodes.length;i++) {
                if(childNodes[i].key == val.key) {
                    return arr
                } else if (childNodes[i].childNodes.length > 0){
                    let arrc = this.recurrence(childNodes[i],val)
                    if(arrc) return arrc
                }
            }
        },
        //组合数据执行接口
        async changeDepartment(val) {
            try {
                let params = {
                    parentId:val.data.id,
                    departmentList:[]
                }
                params.departmentList = val.childNodes.map((item, index)=> {
                    return {
                        id: item.data.id,
                        sort: index + 1
                    }
                })
                this.loading = true
                const res = await this.$axios('/authority/organizational/update',{
                    op:'reorderDept',
                    data:params
                })

                if(res.code != 1) {
                    this.$message.error(res.msg)
                }
                setTimeout(()=> {
                    this.loading = false
                },300)
            } catch(err){
                this.loading = false
                throw err
            }
        }
    }
};
</script>

<style scoped lang="scss">
.ws-tree-warp {
    overflow-y: auto;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    .filter-input {
        margin-bottom: 20pxq;
    }

    /deep/ .el-tree {
        position: relative;
        cursor: default;
        background: #fff;
        min-width: 100%;
        color: #606266;
        display: inline-block;
    }

    /deep/ .el-tree-node > .el-tree-node__children {
        overflow: visible;
    }

    /deep/ .el-tree-node__content {
        height: 36px;
        line-height: 36px;
    }
    /deep/ .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
        background-color: #f5f7fa;
    }
}
</style>
