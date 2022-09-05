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
      backgroundColor: val.bgColor,
      backgroundImage: 'url(' + val.backPic + ')',
      color: val.color,
      lineHeight: val.lineHeight,
      textAlign: val.textAlign,
      fontWeight: val.fontWeight,
      fontStyle: val.fontStyle,
      fontFamily: val.fontFamily,
      textDecoration: val.textDecoration,
      fontSize: val.fontSize,
      margin:0,
    }">
    <div style="position: relative; outline: none" :class="{disableEvent: val.eventState}" :contenteditable="$store.state.isEdit ? 'true' : 'false'" @mousedown.stop="$store.commit('select',{uuid:val.uuid})" id="head_text">
      <p class="headline_text" v-html="val.text">
      </p>
      <resize-observer @notify="handleResize"/>
    </div>
    <editbar :parentID="val.uuid" :val="val" @update_tt="updateText($event)" v-if="$store.state.isEdit"></editbar>
        <span class="removebar"></span>
  </div>
</template>

<script>
import Editbar from './editbar.vue'
const WIDGET_NAME = 'braid-headline'
export default {
  name: WIDGET_NAME,
  icon: 'fa fa-font',
  title: 'Headline',
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
    height: 50,
    left: 10,
    top: 0,
    z: 1,
    bgColor: '#00000000',
    backPic: '',
    backPicUrl: '',
    color: '#000000',
    fontSize: '30px',
    lineHeight: 1.0,
    textAlign: 'justify',
    text: 'Your headline',
    fontWeight: 400,
    fontStyle: 'normal',
    fontFamily: '',
    textDecoration: 'none',
    belong: 'section-0',
    animationName: '',
    eventState: 1,
    desktopStyle: {
      left: 10,
      top: 0,
      width: 400,
      height:50
    },
    mobileStyle: {
      left: 10,
      top: 0,
      width: 360,
      height: 50,
    },
  },
  props: ['h', 'w', 'val', 'playState'],
  computed:{
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
  mounted(){
  },
  methods: {
    // update text
    updateText (e) {
      let text = "";
      document.getElementById(this.val.uuid).querySelectorAll('.headline_text').forEach(function(i){
        text+=i.innerHTML;
      })
      this.$store.commit('updateData', {
        uuid: e.id,
        key: 'text',
        value: text
      });
    },
    // whenever change textline, compute height of element
    handleResize(){
      var elementHeight = document.getElementById(this.val.uuid).children[0].offsetHeight;
      this.$store.commit('updateData', {
        uuid: this.val.uuid,
        key: 'height',
        value: elementHeight+20
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
  padding:10px;
}
.headline_text{margin:0px;}
</style>
