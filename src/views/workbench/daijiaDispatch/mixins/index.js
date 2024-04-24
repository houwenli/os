export const mixins = {
    computed: {
        orgType() {
            return this.$baseMethod.getStore('roleOption')?.orgType ?? 0
        },
        oaPower() {
            return (moduleName) => {
                return this.getModulePower(this.moduleName ?? moduleName)
            }
        }
    },
}