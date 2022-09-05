<template>
  <div :class="[playState ? 'anm-' + val.animationName : '']"
    :style="{position: 'absolute',
    width: val.width / width * 100 + '%',
    height: val.height / h * 100+'%',
    left: val.left / width * 100 + '%',
    top: val.top / h * 100 + '%',
    zIndex: val.z,}"
  >
    <iframe :class="{disableEvent: val.eventState}"
    width="100%" height="100%" :src="val.autoplay ? (val.progress ? val.src+'\?autoplay=1\&controls=1' : val.src+'\?autoplay=1\&controls=0') : (val.progress ? val.src+'\?autoplay=0\&controls=1' : val.src+'\?autoplay=0\&controls=0')" frameborder="0" allowfullscreen>
    </iframe>
    <editbar :parentID="val.uuid" @crop="doCrop($event)" v-if="$store.state.isEdit"></editbar>
    <span class="removebar"></span>
  </div>
</template>

<script>
import Editbar from './editbar.vue'
const WIDGET_NAME = 'braid-video'

export default {
  name: WIDGET_NAME,
  icon: 'fab fa-youtube',
  title: 'Video',
  setting: {
    type: WIDGET_NAME,
    isContainer: false,
    isUpload: false,
    hasGuide: true,
    isChild: true,
    dragable: true,
    resizable: true,
    name: '',
    width: 300,
    height: 160,
    left: 10,
    top: 0,
    z: 1,
    src: "https://www.youtube.com/embed/MiRTyKehd5g",
    autoplay: 0,
    progress: 1,
    belong: 'section-0',
    animationName: '',
    eventState: 1,
    desktopStyle: {
      left: 10,
      top: 0,
      width: 300,
      height: 160
    },
    mobileStyle: {
      left: 10,
      top: 0,
      width: 360,
      height: 200,
    },
  },
  props: ['h', 'w', 'val', 'playState'],
  computed: {
    width() {
      let _this = this
      if(this.$store.state.viewMode === 0) {
        return 400
      } else {
        if (this.val.belong.split('-')[0] === 'section') {
          return screen.width
        } else {
          let parent = _this.$store.state.widgets.filter(i => i.name === _this.val.belong)
          return parent[0].width
        }
      }
    }
  },
  methods: {
  },
  components:{Editbar}
}
</script>

<style>
.lz-container {
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
}
</style>
