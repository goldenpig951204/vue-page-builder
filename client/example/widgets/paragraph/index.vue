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
      textDecoration: val.textDecoration,
      fontSize: val.fontSize,
      fontFamily: val.fontFamily,
      margin:0,
    }">
      <div style="position: relative;" :class="{disableEvent: val.eventState}" @mousedown.stop="$store.commit('select',{uuid:val.uuid})">
        <div :contenteditable="$store.state.isEdit ? 'true' : 'false'" style="outline: none">
          <p class="content-edit text-value" v-html="value" v-if="val.text.type==1" v-for="value in val.text.values">
          </p>
          <ol class="content-edit" v-if="val.text.type==2">
            <li class="text-value" v-html="value" v-for="value in val.text.values">
            </li>
          </ol>
          <ul class="content-edit" v-if="val.text.type==3">
            <li class="text-value" v-html="value" v-for="value in val.text.values">
            </li>
          </ul>
        </div>
        <resize-observer @notify="handleResize"/>
      </div> 
      <editbar :parentID="val.uuid" @update_tt="updateText($event)" v-if="$store.state.isEdit"></editbar>
  </div>
</template>

<script>
import Editbar from './editbar.vue'
const WIDGET_NAME = 'braid-paragraph'
export default {
  name: WIDGET_NAME,
  icon: 'fas fa-align-center',
  title: 'Paragraph',
  setting: {
    type: WIDGET_NAME,
    isContainer: false,
    isUpload: false,
    hasGuide: true, 
    isChild: true, // element whether parent or child
    dragable: true, // dragable state of element
    resizable: true, // resizable state of element
    name: '',
    width: 400, // width of element
    height: 120, // height of element
    left: 10, // left property of element
    top: 0, // top property of element
    z: 1, // z-index property
    bgColor: '#00000000',
    backPicUrl: '', 
    color: '#000000', // text color
    fontSize: '18px', // text size
    lineHeight: 1.0, // text line-height
    textAlign: 'justify', // text align
    fontFamily: '',
    text: {
      type: 1,
      values:['This is a paragraph. <a href="#">Click</a> here to add / edit your own text. This should be used to tell a story and let your users know a little more about your product or service. How can you benefit them?']
    }
      , // initial text value
    fontWeight: 400, // text weight
    fontStyle: 'normal', // text style
    textDecoration: 'none', // text underline
    link_url: '', // url to link tag
    new_tab: 1, // when link url, set openning new window
    belong: 'section-0',
    animationName: '',
    eventState: 1,
    desktopStyle: {
      left: 10,
      top: 0,
      width: 400,
      height: 120
    },
    mobileStyle: {
      left: 10,
      top: 0,
      width: 360,
      height: 120,
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
      let type = this.val.text.type;
      let text = [];
      let origin_len = this.val.text.values.length;
      document.getElementById(this.val.uuid).querySelectorAll('.text-value').forEach(function(i){
        text.push(i.innerHTML);
      })
      let new_len = text.length;
      for(let i=0; i<Math.abs(new_len-origin_len)+5;i++){
        document.execCommand('undo');
      }
      this.$store.commit('updateData', {
        uuid: e.id,
        key: 'text',
        value: {"type":type,"values":text}
      });
    },
    handleResize(){
      var elementHeight = document.getElementById(this.val.uuid).children[0].offsetHeight;
      this.$store.commit('updateData', {
        uuid: this.val.uuid,
        key: 'height',
        value: elementHeight+40
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
.text-value{
  margin:10px 0px;
}
</style>
