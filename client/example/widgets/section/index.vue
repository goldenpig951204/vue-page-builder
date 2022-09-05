<template>
	<div class="list-group-item" 
  :id="val.uuid"
	:class="[playState ? 'anm-' + val.animationName : '']"
    :style="{
      position: 'relative',
      height: '100%',
      width: val.width + 'px',
      backgroundColor: val.bgColor+'ff',
      backgroundImage: 'url(' + val.backPic + ')',
      borderColor: val.borderColor,
      backgroundPosition: '50% 50%',
      borderWidth: val.borderWidth + 'px',
      borderStyle: val.borderStyle,
      margin: 'auto'
    }">
    	<slot></slot>
    	<editbar :parentID="val.uuid"></editbar>
	</div>
</template>
<script>
const WIDGET_NAME = 'braid-section'
import Editbar from './editbar.vue'
export default {
  name: WIDGET_NAME,
  icon: 'far fa-object-group',
  title: 'Section',
  setting: {
    type: WIDGET_NAME,
    isContainer: true,
    isUpload: false,
    hasGuide: true,
    isChild: true,
    dragable: false,
    resizable: true,
    index: 'section',
    name: 'section-0',
    width: 1500,
    height: 600,
    left: 0,
    top: 0,
    bgColor: '#c363b7',
    backPic: '',
    backPicUrl: '',
    realUrl: '',
    borderColor: '',
    borderWidth: 0,
    borderStyle: 'solid',
    belong: 'page',
    eventState:0,
    desktopStyle: {
      left: 0,
      top: 0,
      width: 1500,
      height: 500
    },
    mobileStyle: {
      left: 0,
      top: 0,
      width: 400,
      height: 500,
    },
  },
  props: ['h', 'w', 'val', 'playState'],
  methods: {
  },
  components: {
  	Editbar
  }
}
</script>
<style>
	.layer-component{
		background-repeat: no-repeat;
		background-size: cover;
		border-position: center;
	}
  .list-group-item:hover, .list-group-item:focus{
    z-index: unset !important;
  }
</style>