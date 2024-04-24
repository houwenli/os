/**
 * 地图事件相关内容
 */

function centerChangedHandle () {
  const { lat, lng } = this.map.getCenter();
  this.$emit("mapCenterChange", lat, lng);
}

function dragstartHandle () {
  this.pauseMoveProgress();
}

function zoomChangedHandle () {
  this.pauseMoveProgress();
  this.$emit('setZoomSize', this.map.getZoom())
}

function polygonClickHandle (event) {
  this.dialogPieCharts.dialogVisible = true;
  const { geometry } = event;

  this.$nextTick(() => {
    this.initPieChars(geometry);
  });
}

export const bindEventListener = (instance) => {
  //监听地图平移
  instance.map.on("center_changed", () => centerChangedHandle.call(instance));

  // 地图拖拽
  instance.map.on('dragstart', () => dragstartHandle.call(instance))

  // 地图缩放时触发
  instance.map.on("zoom_changed", () => zoomChangedHandle.call(instance));

  instance.polygon.on("click", event => polygonClickHandle.call(instance, event));

  // 监听地图是否加载完成
  // this.map.on("tilesloaded", function () {
  //   console.log("地图瓦片已加载完成");
  // });

}

export const removeEventListener = (instance) => {
  if (instance.map) {
    instance.map.off("center_changed", centerChangedHandle);
    instance.map.off('dragstart', dragstartHandle)
    // 地图缩放时触发
    instance.map.off("zoom_changed", zoomChangedHandle);
    instance.polygon.off("click", polygonClickHandle);

    instance.polygon = null
    instance.label = null
    // 销毁实例对象
    instance.map.destroy()
    instance.map = null
  }
}
