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
      // backgroundImage: 'url(' + val.backPic + ')',
    }">
    <a :href="val.link_href" v-if="val.isHref">
    <img :class="{disableEvent: val.eventState}"
    :src="val.backPic" style="width: 100%;height:100%;" v-if="!crop_state"/>
    </a>
    <img :class="{disableEvent: val.eventState}"
    :src="val.backPic" style="width: 100%;height:100%;" v-if="val.isHref==0 && !crop_state"/>
    <vue-cropper v-if="crop_state"
          ref='cropper'
          :guides="true"
          :view-mode="3"
          drag-mode="crop"
          :auto-crop-area="0.5"
          :min-container-width="val.width-20"
          :min-container-height="val.height-20"
          :background="true"
          :rotatable="true"
          :src="val.backPic"
          alt="Source Image"
          :img-style="{ 'width': val.width / 7.5 +'%', 'height': val.height / h * 100+'%' }">
    </vue-cropper>
    <editbar :parentID="val.uuid" @crop="doCrop($event)" v-if="$store.state.isEdit"></editbar>
        <span class="removebar"></span>
   </div>
</template>

<script>
import Editbar from './editbar.vue'
import VueCropper from 'vue-cropperjs'
const WIDGET_NAME = 'braid-image'

export default {
  name: WIDGET_NAME,
  icon: 'far fa-image',
  title: 'Image',
  data(){
    return {
      crop_state: 0,
    }
  },
  setting: {
    type: WIDGET_NAME,
    isContainer: false,
    isUpload: true,
    hasGuide: true,
    isChild: true,
    dragable: true,
    resizable: true,
    name: '',
    width: 250,
    height: 200,
    left: 10,
    top: 0,
    z: 1,
    backPic: '',
    backPicUrl: '',
    realUrl: '',
    belong: 'section-0',
    animationName: '',
    eventState: 1,
    isHref: 0,
    link_href: '',
    desktopStyle: {
      left: 10,
      top: 0,
      width: 250,
      height: 200
    },
    mobileStyle: {
      left: 10,
      top: 0,
      width: 360,
      height: 250,
    },
  },
  props: ['h','w', 'val', 'playState'],
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
  methods:{
    doCrop(e){
      if(e == 1){
        this.crop_state = e;
        this.$store.commit('initActive');
      }else{
        this.crop_state = e;
        this.val.backPic = this.$refs.cropper.getCroppedCanvas().toDataURL();
      }
    }
  },
  components:{Editbar,VueCropper}
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
  background-size:contain;
}
</style>
