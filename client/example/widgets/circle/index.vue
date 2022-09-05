<template>
  <div 
    :class="[playState ? 'anm-' + val.animationName : '']"
    :style="{
      position: 'absolute',
      width: val.width / width * 100 + '%',
      height: val.height / h * 100 + '%',
      left: val.left / width * 100 + '%',
      top: val.top / h * 100 + '%',
      zIndex: val.z,
      backgroundColor: val.bgColor,
      backgroundImage: 'url(' + val.backPic + ')',
      color: val.color,
      borderRadius: '50%',
      borderColor: val.borderColor,
      borderWidth: val.borderWidth+'px',
      borderStyle: val.borderStyle,
      opacity: val.opacity,
    }">
      <editbar :parentID="val.uuid" v-if="$store.state.isEdit"></editbar>
          <span class="removebar"></span>
    </div>
</template>

<script>
const WIDGET_NAME = 'braid-circle'
import Editbar from './editbar.vue'
export default {
  name: WIDGET_NAME,
  icon: "fas fa-circle",
  title: 'Circle',
  setting: {
    type: WIDGET_NAME,
    isContainer: false,
    isUpload: false,
    hasGuide: true,
    isChild: true,
    dragable: true,
    resizable: true,
    name: '',
    width: 200,
    height: 200,
    left: 10,
    top: 0,
    z: 1,
    bgColor: '#cccccc',
    backPic: '',
    backPicUrl: '',
    borderColor: '#444444',
    borderWidth: 1,
    borderStyle: 'solid',
    opacity: 1,
    color: '#ffffff',
    belong: 'section-0',
    animationName: '',
    eventState: 1,
    desktopStyle: {
      left: 10,
      top: 0,
      width: 200,
      height: 200
    },
    mobileStyle: {
      left: 10,
      top: 0,
      width: 360,
      height: 360,
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
    updateText (e, uuid) {
      let text = e.target.innerHTML
      this.$store.commit('updateData', {
        uuid: uuid,
        key: 'text',
        value: text
      })
    }
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
.layer-component{
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
</style>
