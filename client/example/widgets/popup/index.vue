<template>
	<div class="popup"
	:id="val.uuid"
    :class="[playState ? 'anm-' + val.animationName : '',val.isOpen ? 'show': 'hide']"
    :style="{
      width: width + 'px',
      height: height + 'px',
      left: left + 'px',
      zIndex: 1,
      backgroundColor: '#0d1a2baa',
      transition: 'opacity .3s ease',
    }">
		<div class="popup_content" @click="selectPopup()"
		:style="{
			width: val.width/width * 100 + '%',
			height: val.height/height * 100 + '%',
			left: val.left/width * 100 + '%',
      top: val.top/height * 100 + '%',
			backgroundColor: 'white',
			maxWidth: maxWidth + 'px',
		}">
			<div class="popup_header text-right" style="padding: 5px 10px">
				<i class="fa fa-save" v-if="val.uuid === $store.state.activeElement.uuid" @mousedown.stop="saveInstaModal"></i>
        <i class="fa fa-tv" v-if="val.uuid === $store.state.activeElement.uuid" @mousedown.stop="makeCloseBtn"></i>
        <i class="fa fa-trash" v-if="val.uuid === $store.state.activeElement.uuid" @mousedown.stop="$store.commit('delete')"></i>
				<i class="fa fa-times" @click.stop="popupClose()"></i>
			</div>
			<slot></slot>
		</div>
	</div>
</template>
<script>
import buttonComp from '../button/index.vue'
const WIDGET_NAME = 'braid-popup'
export default {
  name: WIDGET_NAME,
  icon: 'fas fa-align-center',
  title: 'Popup',
  setting: {
    type: WIDGET_NAME,
    isContainer: true,
    isUpload: false,
    hasGuide: true, 
    isChild: true, // element whether parent or child
    dragable: true, // dragable state of element
    resizable: true, // resizable state of element
    index: 'popup',
    name: 'popup',
    width: 700, // width of element
    height: 500, // height of element
    left: 0, // left property of element
    top: 0, // top property of element
    belong: 'page',
    eventState: 1,
    isOpen: 1,
    buttonID: '',
    desktopStyle: {
      left: 0,
      top: 0,
      width: 700,
      height: 500
    },
    mobileStyle: {
      left: 0,
      top: 0,
      width: 400,
      height: 400,
    },
  },
  data () {
  	return {
  		popupState : 1,
  	}
  },
  props: ['h', 'w', 'val', 'playState'],
  computed : {
    height () {
      let height = 0
      let sections = this.$store.state.widgets.filter(i => { return i.belong === 'page' && i.index === 'section'})
      sections.forEach(i => {
        height += i.height
      })
      if (height < this.$store.state.page.height) {
      	height = this.$store.state.page.height
      }
      return height
    },
    width () {
      if(this.$store.state.viewMode === 0) {
        return 400
      } else {
        return screen.width
      }
    },
    left () {
      if(this.$store.state.viewMode === 0) {
        return (this.$store.state.page.width - 410) / 2
      } else {
        return 0
      }
    },
    maxWidth () {
      return (this.$store.state.viewMode === 0 ? 400 : 800)
    }
  },
  methods: {
  	popupClose () {
  		this.val.isOpen = 0
  		let id = this.val.buttonID
  		let btn = this.$store.state.widgets.filter(i => {return i.uuid === id})
  		this.$store.commit('select',btn[0])
  		this.$store.state.isSection = 1
  	},
  	selectPopup () {
  		this.$store.commit('select', this.val)
  	},
    makeCloseBtn () {
      buttonComp.setting.modalID = this.val.uuid
      buttonComp.setting.left = this.val.width - buttonComp.setting.width - 20
      buttonComp.setting.top = (this.val.top + this.val.height - buttonComp.setting.height - 20)
      buttonComp.setting.isModalbtn = 1
      this.$store.dispatch('addWidget', buttonComp)
    },
  	saveInstaModal () {
  		this.$store.$emit('showModal',{type: 'popup'})
  	}
  }
}
</script>
<style>
	.popup{
		position: absolute;
    top: 0;
	}
	.popup_content{
		position: absolute;
		text-align: left;
	}
	.show{
		display: block;
		transition: opacity .3s ease;
	}
	.hide{
		display: none;
		transition: opacity .3s ease;
	}
	.popup_content i.fa.fa-save,
  .popup_content i.fa.fa-trash,
  .popup_content i.fa.fa-tv{
    margin-right: 10px
  }
	.popup_content i.fa.fa-save:hover,
  .popup_content i.fa.fa-times:hover,
  .popup_content i.fa.fa-trash:hover,
  .popup_content i.fa.fa-tv:hover{
		transform: scale(1.2);
		color:red;
	}
</style>