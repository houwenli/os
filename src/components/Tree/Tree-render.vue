<template>
    <div class="tree-expand">
        <renderLabel :NODE="NODE" :DATA="DATA" :RENDER="CONTENTVNODE">
            <template v-slot:node-label>
                <!-- <span class="tree-label" v-show="DATA.isEdit">
                    <el-input
                        v-show="DATA.isEdit"
                        v-model="DATA.label"
                        :ref="'treeInput' + DATA.id"
                         class="edit"
                        size="mini"
                        @blur.stop="nodeEditPass(NODE,DATA)"
                    >
                    </el-input>
                </span> -->
                <!-- 默认使用label -->
                <span v-show="!DATA.isEdit" :class="NODE.level ? 'node-content node-content-level' + NODE.level : ' '">
                    {{ DATA.name }}
                </span>
            </template>
        </renderLabel>
        <span class="tree-btn" v-show="DATA._isExpand">
            <i @click.stop="nodeAdd(NODE, DATA)" class="add-btn" v-show="!DATA.banAdd">
                <img src="@/assets/images/icon_add.png" alt="" />
            </i>
            <i @click.stop="nodeDel(NODE, DATA)" v-show="!DATA.banDelete">
                <img src="@/assets/images/icon_reduce.png" alt="" />
            </i>
        </span>
    </div>
</template>

<script>
import RenderLabel from './RenderLabel.vue';
export default {
    name: 'treeExpand',
    props: ['NODE', 'DATA', 'CONTENTVNODE'],
    components: { RenderLabel },
    methods: {
        nodeAdd(n, d) {
            this.$emit('nodeAdd', n, d);
        },
        //todo:编辑与想法有更改，后期可以删掉input框
        // nodeEdit(n, d) {
        //     //需要控制是否可编辑
        //     this.$nextTick(() => {
        //         // this.$refs["treeInput" + d.id].$refs.input.focus();
        //         // this.$set(this.DATA, "isEdit", true);
        //     });
        //     this.$emit("nodeEdit", n, d);
        // },
        nodeDel(n, d) {
            this.$emit('nodeDel', n, d);
        },
        // nodeEditPass(n,d) {
        //     //编辑完成需要调用接口
        //     this.$emit("nodeEdit", n, d);
        // },
        nodeEditFocus() {
            //阻止点击节点的事件冒泡
        }
    }
};
</script>

<style scoped lang="scss">
.tree-expand {
    height: inherit;
    width: 100%;
    display: flex;
    justify-content: space-between;
    .tree-btn {
        margin-left: 20px;
        padding-right: 20px;
        padding-top: 3px;
    }

    .node-content {
        font-size: 12px;
    }
    .node-content-level1 {
        font-size: 16px;
    }
    .node-content-level2 {
        font-size: 14px;
    }
    .add-btn {
        margin-right: 12px;

        img {
            width: 16px;
            height: 16px;
        }
    }
}
</style>
