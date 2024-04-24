/**
 * Vue-awesome-swiper
 * @author Surmon.me
 */

let Swiper = require('./swiper')
let SwiperComponent = require('./src/swiper.vue')
let SlideComponent = require('./src/slide.vue')
SwiperComponent = SwiperComponent.default || SwiperComponent
SlideComponent = SlideComponent.default || SlideComponent
if (typeof window !== 'undefined') {
	window.Swiper = Swiper
}

let swiper = {
  swiperSlide: SlideComponent,
  swiper: SwiperComponent,
  swiperPlugins: Swiper.prototype.plugins,
  install: function(Vue) {
    Vue.component(SwiperComponent.name, SwiperComponent)
    Vue.component(SlideComponent.name, SlideComponent)
  }
}

module.exports = swiper
