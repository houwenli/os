export default {
  data() {
    return {
      tableFlexHeight: null
    }
  },
  mounted() {
    this.setTableFlexHeight()
    window.onresize = () => {
      this.setTableFlexHeight()
    }
  },
  methods: {
    setTableFlexHeight() {
      const tableElem = document.querySelector('.flex-page-table')
      this.tableFlexHeight = tableElem ? tableElem.offsetHeight : 0
    }
  }
}
