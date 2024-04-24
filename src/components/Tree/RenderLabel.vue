<script>
export default {
    name: "RenderLabel",
    functional: true,
    props: {
        NODE: Object,
        DATA: Object,
        RENDER: Object,
    },
    render: (h, ctx) => {
        //todo:拿到不设置内容时默认插槽,后期加入结构线
        //拿到作用域插槽直接调用生成虚拟节点
        const labelSlot = ctx.scopedSlots["node-label"];
        const nodes = labelSlot({ node: ctx.props.Node, data: ctx.props.DATA });
        return ctx.props.RENDER ? ctx.props.RENDER : nodes;
    },
};
</script>