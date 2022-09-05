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
      color: val.color
    }">
      <div v-if="!$store.state.isEdit" v-html="val.text"></div>
      <div v-else style="height:100%" :class="{disableEvent: val.eventState}">
        <div v-html="val.text" v-if="val.eventState"  :class="{disableEvent: val.eventState}">
        </div>
        <div v-else contenteditable="true"  style="width:100%;height:100%;padding:5px; background-color:black; color:white;font-size: 15px;outline:none;" @mousedown.stop="$store.commit('select',{uuid:val.uuid})">
          <p class="custom_code" style="margin:0;min-height: 20px;">{{val.text}}</p>
        </div>
      </div>
      <editbar :parentID="val.uuid" @update_tt="updateText($event)" v-if="$store.state.isEdit"/>
          <span class="removebar"></span>
    </div>
</template>

<script>
const WIDGET_NAME = 'braid-html'
import Editbar from './editbar.vue'
export default {
  name: WIDGET_NAME,
  icon: "fas fa-code",
  title: 'Html',
  setting: {
    type: WIDGET_NAME,
    isContainer: false,
    isUpload: false,
    hasGuide: true,
    isChild: true,
    dragable: true,
    resizable: true,
    name: '',
    width: 400,
    height: 250,
    left: 10,
    top: 0,
    z: 1,
    color: '#000000',
    text: '',
    belong: 'section-0',
    animationName: '',
    eventState: 1,
    desktopStyle: {
      left: 10,
      top: 0,
      width: 400,
      height: 50
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
    updateText (e) {
      let text = "";
      document.getElementById(e.id).querySelectorAll('.custom_code').forEach(function(i){
        text += i.innerText;
      })
      this.$store.commit('updateData', {
        uuid: e.id,
        key: 'text',
        value: text
      })
    }
  },
  components: {Editbar}
}
</script>

<style>
.lz-container {
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
}
.layer-component{
  font-size: 20px;

}
</style>
