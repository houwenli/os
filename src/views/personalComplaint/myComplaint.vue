<template>
    <div>
        <!-- 列表/详情切换 -->
        <component :is="complaintContent" @details="details" :id="id" @close="complaintContent = 'list'" :disabled="disabled"></component>
    </div>
</template>

<script>
import list from './list.vue';
import complaintForm from './toComplaint.vue';
export default {
    data() {
        return {
            complaintContent: 'list',
            id: '',
            disabled: true
        };
    },
    components: {
        list,
        complaintForm
    },
    methods: {
        details(id) {
            this.id = id;
            this.complaintContent = 'complaintForm';
        }
    }
};
</script>
