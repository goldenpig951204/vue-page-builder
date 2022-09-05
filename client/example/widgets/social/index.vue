<template>
  <div 
  :id="val.uuid"
  class="tiles display-type horizontal" :class="[playState ? 'anm-' + val.animationName : '']"
  :style="{
    position: 'absolute',
    width: val.width / width * 100 + '%',
    height: val.height / h * 100 + '%',
    left: val.left / width * 100 + '%',
    top: val.top / h * 100 + '%',
    zIndex: val.z,
  }">
    <div :class="{disableEvent: val.eventState}" style="position: relative;display:inline-block">
      <div class="item active" :class="{'horizontal':val.isHorizontal,'vertical': !val.isHorizontal}" v-if="item.isShow" v-for="item in val.socialDatas">
        <a :href="item.href" target="_blank">
          <img :src="item.img[val.socialType].url" :width="item.img[val.socialType].width" :alt="item.alt">
        </a>
      </div>     
      <resize-observer @notify="handleResize"/>
    </div>
    <editbar :parentID="val.uuid" v-if="$store.state.isEdit"></editbar>
    <span class="removebar"></span>
  </div>
</template>

<script>
const WIDGET_NAME = 'braid-social'
import Editbar from './editbar.vue'
export default {
  name: WIDGET_NAME,
  icon: "far fa-hand-point-right",
  title: 'Social',
  setting: {
    type: WIDGET_NAME,
    isContainer: false,
    isUpload: false,
    hasGuide: true,
    isChild: true,
    dragable: true,
    resizable: true,
    name: '',
    width: 270,
    height: 60,
    left: 10,
    top: 0,
    z: 1,
    belong: 'section-0',
    socialType: 0,
    isHorizontal: 1,
    socialDatas: [
      {
        alt: 'Google share button', isShow: 1, href: 'https://plus.google.com/share', img: [
          {url: 'https://storage.googleapis.com/instapage-app-assets/img/ui_assets/mr-w-share-google@2.png', width: 57},
          {url: 'https://storage.googleapis.com/instapage-app-assets/img/ui_assets/mr-w-share-google-flat@2.png', width: 82},
          {url: 'https://storage.googleapis.com/instapage-app-assets/img/ui_assets/mr-w-share-google-button@2.png', width: 57}
        ]
      },
      {
        alt: 'Twitter share button', isShow: 1 , href: 'https://twitter.com', img: [
          {url: 'https://storage.googleapis.com/instapage-app-assets/img/ui_assets/mr-w-share-twitter@2.png', width: 58},
          {url: 'https://storage.googleapis.com/instapage-app-assets/img/ui_assets/mr-w-share-twitter-button@2.png', width:58},
          {url: 'https://storage.googleapis.com/instapage-app-assets/img/ui_assets/mr-w-share-twitter-button@2.png', width:58}
        ]
      },
      {
        alt: 'LinkedIn share button', isShow: 1, href: 'https://www.linkedin.com/cws/share', img: [
          {url: 'https://storage.googleapis.com/instapage-app-assets/img/ui_assets/mr-w-share-linkedin@2.png', width: 60},
          {url: 'https://storage.googleapis.com/instapage-app-assets/img/ui_assets/mr-w-share-linkedin-button@2.png', width: 60},
          {url: 'https://storage.googleapis.com/instapage-app-assets/img/ui_assets/mr-w-share-linkedin-button@2.png', width: 60}
        ]
      },
      {
        alt: 'Facebook like button', isShow: 1, href: 'https://www.facebook.com', img:[
          {url: 'https://storage.googleapis.com/instapage-app-assets/img/ui_assets/mr-w-share-facebook@2.png', width: 49},
          {url: 'https://storage.googleapis.com/instapage-app-assets/img/ui_assets/mr-w-share-facebook-flat@2.png', width: 78},
          {url: 'https://storage.googleapis.com/instapage-app-assets/img/ui_assets/mr-w-share-facebook-button-new@2.png', width:49}
        ]
      }
    ],
    animationName: '',
    eventState: 1,
    desktopStyle: {
      left: 10,
      top: 0,
      width: 270,
      height: 60
    },
    mobileStyle: {
      left: 10,
      top: 0,
      width: 270,
      height: 60,
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
    },
    // whenever change textline, compute height of element
    handleResize(){
      let elementHeight = document.getElementById(this.val.uuid).children[0].offsetHeight;
      let elementWidth = 0;
      if(this.val.isHorizontal){
        document.getElementById(this.val.uuid).querySelectorAll('.item').forEach(function(i){
          elementWidth += i.offsetWidth+10;
        });
      }else{
        elementWidth = document.getElementById(this.val.uuid).querySelectorAll('.item')[0].offsetWidth;
      }
      this.$store.commit('updateData', {
        uuid: this.val.uuid,
        key: 'height',
        value: elementHeight
      });
      this.$store.commit('updateData', {
        uuid: this.val.uuid,
        key: 'width',
        value: elementWidth
      });
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
.item:hover{box-shadow: 0 1px 0 rgba(0,0,0,0.1);}
.horizontal{display:inline-block !important;margin-right: 10px;}
.vertical{display:block !important;margin-bottom:10px;}
</style>
