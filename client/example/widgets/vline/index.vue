<template>
  <div 
    :id="val.uuid"
    :class="[playState ? 'anm-' + val.animationName : '']"
    :style="{
      position: 'absolute',
      width: val.width / width * 100 + '%',
      height: val.height / h * 100 + '%',
      left: val.left / width * 100 + '%',
      top: val.top / h * 100 + '%',
      zIndex: val.z,
    }">
      <div
       :class="{disableEvent: val.eventState}"
       :style="{
        height: '100%',
        width: '0%',
        borderColor: val.borderColor,
        borderWidth: val.borderWidth+'px',
        borderStyle: 'solid',
        marginLeft: val.width / 2-val.borderWidth +'px',
        position: 'relative',
      }">
        <resize-observer @notify="handleResize"/>
      </div>
      <editbar :parentID="val.uuid" v-if="$store.state.isEdit"></editbar>
      <span class="removebar"></span>
    </div>
</template>

<script>
const WIDGET_NAME = 'braid-Vline'
import Editbar from './editbar.vue'
export default {
  name: WIDGET_NAME,
  icon: "fas fa-arrows-alt-v",
  title: 'Ver.Line',
  setting: {
    type: WIDGET_NAME,
    isContainer: false,
    isUpload: false,
    hasGuide: true,
    isChild: true,
    dragable: true,
    resizable: true,
    name: '',
    width: 20,
    height: 200,
    left: 10,
    top: 0,
    z: 1,
    borderColor: '#000000',
    borderWidth: 1,
    bgColor: '#fffffff',
    belong: 'section-0',
    animationName: '',
    eventState: 1,
    desktopStyle: {
      left: 10,
      top: 0,
      width: 20,
      height: 200
    },
    mobileStyle: {
      left: 10,
      top: 0,
      width: 20,
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
    // whenever change textline, compute height of element
    handleResize(){
      var elementHeight = document.getElementById(this.val.uuid).children[0].offsetWidth;
      this.$store.commit('updateData', {
        uuid: this.val.uuid,
        key: 'width',
        value: elementHeight+40,
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
</style>
