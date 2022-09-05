<template>
  <button
    :id="val.uuid"
    :class="[playState ? 'anm-' + val.animationName : '']"
    :style="{
      position: 'absolute',
      width: val.width / width * 100 + '%',
      height: val.height / h * 100 + '%',
      left: val.left / width * 100 + '%',
      top: val.top / h * 100 + '%',
      zIndex: val.z,
      fontSize: val.fontSize+'px',
      fontFamily: val.fontFamily,
      fontWeight: val.fontWeight,
      backgroundColor: val.bgColor,
      backgroundImage: 'url(' + val.backPic + ')',
      color: val.color,
      borderColor: val.borderColor,
      borderRadius: val.borderRadius+'px',
    }" @mouseover="overHandler($event)" @mouseleave="leaveHandler($event)"
    @mousedown="buttonAction()"
    >
    <span :class="{disableEvent: val.eventState}">{{val.text}}</span>
    <editbar :parentID="val.uuid" v-if="$store.state.isEdit"></editbar>
    </button>
</template>

<script>
import Editbar from './editbar.vue'
const WIDGET_NAME = 'braid-button'

export default {
  name: WIDGET_NAME,
  icon: 'fa fa-tv',
  title: 'Button',
  setting: {
    type: WIDGET_NAME,
    isContainer: false,
    isUpload: false,
    hasGuide: true,
    isChild: true,
    dragable: true,
    resizable: true,
    name: '',
    width: 250,
    height: 60,
    left: 10,
    top: 0,
    z: 1,
    bgColor: '#1e88e5',
    backPic: '',
    backPicUrl: '',
    color: '#ffffff',
    text: 'button',
    fontSize: 20,
    fontFamily: 'Abrill Fatfave',
    fontWeight: 'normal',
    hoverColor: '#1565c0',
    borderColor: '#000000',
    borderRadius: 5,
    belong: 'section-0',
    animationName: '',
    new_tab: 0,
    link_url: '',
    eventState:1,
    isModalbtn: 0,
    modalID: '',
    desktopStyle: {
      left: 0,
      left: 10,
      width:250,
      height: 60
    },
    mobileStyle: {
      left: 10,
      top: 0,
      width: 360,
      height: 60,
    }
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
      let text = e.target.children[0].innerText
      this.$store.commit('updateData', {
        uuid: uuid,
        key: 'text',
        value: text
      })
    },
    overHandler(e){
      
      if((e.target.className == 'layer-component layer g-active' || e.target.className == 'layer-component') && e.target.nodeName == 'BUTTON') {
        e.target.style.background = this.val.hoverColor;  
      }
      
    },
    leaveHandler(e){
      if((e.target.className == 'layer-component layer g-active' || e.target.className == 'layer-component') && e.target.nodeName == 'BUTTON') {
        e.target.style.background = this.val.bgColor;
      }
    },
    buttonAction() {
      if (!this.val.isModalbtn) {
        if (!this.$store.state.isEdit) {
          let _this = this
          let popup = this.$store.state.widgets.filter(i => i.buttonID === this.val.uuid)
          if (this.val.link_url !== '') {
            if (this.new_tab) {
              window.open(this.val.link_url, '_blank')
            } else {
              window.open(this.val.link_url, '_self')
            }
          } else if (popup.length) {
            popup[0].isOpen = 1
            this.$store.state.isSection = 0
          }
        }
      } else {
        let _this = this
        let id = 0
        let popup = this.$store.state.widgets.forEach(i => {
          if (i.uuid === this.val.modalID) {
            if(!this.$store.state.isEdit) {i.isOpen = 0}
            id = i.buttonID
          }
        })
        this.$store.state.isSection = 1
        let btn = this.$store.state.widgets.filter(i => i.uuid === id)
        this.$store.commit('select',btn[0])
      }
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
.layer-component:active{opacity: 0.8}
</style>
