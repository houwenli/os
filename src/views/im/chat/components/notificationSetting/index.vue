<template>
    <div>
        <components :is="notificationtType" :conversation="conversation" :notificationList="notificationList" :editInfo="editInfo" @success="handleSuccess"></components>
    </div>
</template>

<script>
import notificationEdit from './notificationEdit';
import notificationList from './notificationList';
export default {
    name: 'notificationSetting',
    props: {
        conversation: {
            type: Object,
            default: () => {},
        },
    },
    components: {
        notificationEdit,
        notificationList,
    },
    data() {
        return {
            notificationtType: '',
            notificationList: [],
            editInfo: {
                id: '',
                content: '',
                type: 'add'
            },
        };
    },
    created() {
        this.getNotificationList();
    },
    methods: {
        getNotificationList() {
            var that = this;
            const reqData = {
                data: {
                    groupId: this.conversation.groupProfile.groupID,
                    pageSize: '999999',
                },
                op: 'findGroupNotificationList',
            };
            let url = '/web/im/select';
            this.$axios(url, reqData)
                .then(result => {
                    if (result.code === 1) {
                        let data = JSON.parse(result.data);
                        if (data && data.length >= 0) {
                            this.notificationtType = 'notificationList';
                            this.notificationList = data
                        } else {
                            this.notificationtType = 'notificationEdit';
                        }
                    }
                })
                .catch(error => {
                    that.loading = false;
                });
        },
        handleChangeType(type, data) {
            this.notificationtType = type;
            this.editInfo = data;
        },
        handleSuccess() {},
    },
};
</script>

<style lang="scss" scoped></style>
