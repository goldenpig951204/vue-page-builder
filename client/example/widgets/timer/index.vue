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
      color: val.color
    }">
    <div :class="{disableEvent: val.eventState}" style="height:100%;position: relative;">
      <div style="padding:0px 10px;" v-if="val.labelShow">
        <div class="mark_text" :style="{color:val.labelColor}">Days</div>
        <div class="mark_colon"></div>
        <div class="mark_text" :style="{color:val.labelColor}">Hours</div>
        <div class="mark_colon"></div>
        <div class="mark_text" :style="{color:val.labelColor}">Minutes</div>
        <div class="mark_colon"></div>
        <div class="mark_text" :style="{color:val.labelColor}">Seconds</div>
      </div>
      <div style="height:calc(100% - 40px)"  class="timer_content">
        <div class="mark" :style="{color:val.numberColor,backgroundColor: val.timerColor}"><span class="mx-auto">{{val.timerDay}}</span></div>
        <div class="colon" :style="{color:val.timerColor}"><span>:</span></div>
        <div class="mark" :style="{color:val.numberColor,backgroundColor: val.timerColor}"><span class="mx-auto">{{val.timerHour}}</span></div>
        <div class="colon" :style="{color:val.timerColor}"><span>:</span></div>
        <div class="mark" :style="{color:val.numberColor,backgroundColor: val.timerColor}"><span class="mx-auto">{{val.timerMinute}}</span></div>
        <div class="colon" :style="{color:val.timerColor}"><span>:</span></div>
        <div class="mark" :style="{color:val.numberColor,backgroundColor: val.timerColor}"><span class="mx-auto">{{val.timerSecond}}</span></div>
      </div>
       <resize-observer @notify="handleResize"/> 
    </div>
    <Editbar :parentID="val.uuid" v-if="$store.state.isEdit"></Editbar>
    <span class="removebar"></span>
  </div>
</template>

<script>

const WIDGET_NAME = 'braid-timer'
import Editbar from './editbar.vue'
export default {
  name: WIDGET_NAME,
  icon: "far fa-clock",
  title: 'Timer',
  setting: {
    type: WIDGET_NAME,
    isContainer: false,
    isUpload: false,
    hasGuide: true,
    isChild: true,
    dragable: true,
    resizable: true,
    name: '',
    width: 370,
    height: 112,
    left: 10,
    top: 0,
    z: 1,
    belong: 'section-0',
    bgColor: 'transparent',
    backPic: '',
    backPicUrl: '',
    labelColor: '#555555',
    labelShow: 1,
    timerColor: '#37465a',
    numberColor: '#ffffff',
    setMinute: [
      '00','10','20','30','40','50'
    ],
    setHour: [
      '00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'
    ],
    timeZone: [
      '-11:00', '-10:00', '-09:00', '-08:00', '-07:00', '-06:00', '-05:00', '-04:00', '-03:00', '-02:00', '-01:00', '', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00'
    ],
    end: '',
    date: '',
    hour: '00',
    minute: '00',
    zone: '',
    timerDay : '00',
    timerHour: '00',
    timerMonth: '00',
    timerMinute: '00',
    timerSecond: '00',
    color: '#ffffff',
    animationName: '',
    eventState: 1,
    desktopStyle: {
      left: 10,
      top: 0,
      width: 370,
      height:112
    },
    mobileStyle: {
      left: 10,
      top: 0,
      width: 370,
      height: 112,
    },
  },
  props: ['h', 'w', 'val', 'playState'],
  mounted () {
    setInterval(()=>{
      if(!this.$store.state.isEdit){
        this.timerCount(this.val.end);
      }
    },1000);
  },
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
      var elementHeight = document.getElementById(this.val.uuid).children[0].offsetHeight;
      this.$store.commit('updateData', {
        uuid: this.val.uuid,
        key: 'height',
        value: elementHeight
      })
    },
    timerCount (end) {
      let now = new Date().getTime();
      let remain = 0;
      if (end > now) {
        remain = end - now;
        let day = Math.floor(remain / (1000 * 60 * 60 * 24))
        let hour = Math.floor(remain % (1000 * 60 * 60 *24) / (1000 * 60 * 60));
        let minute = Math.floor(remain % (1000 * 60 *60) / (1000 * 60))
        let second = Math.floor(remain % (1000 * 60) / (1000))
        this.val.timerDay = day < 10 ? '0' + day : day;
        this.val.timerHour = hour < 10 ? '0' + hour : hour;
        this.val.timerMinute = minute < 10 ? '0' + minute : minute;
        this.val.timerSecond = second < 10 ? '0' + second : second;
      } else {
        this.val.timerDay = '00';
        this.val.timerHour = '00';
        this.val.timerMinute = '00';
        this.val.timerSecond = '00';
      }
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
.mark{
  display:inline-block !important;
  width:18.8% !important;
  height:100% !important;
  text-align:center !important;
  font-weight: bold !important;
  border-radius: 5px;
}
.colon{
  display:inline-block !important;
  width:6% !important;
  height:100% !important;
  text-align:center !important;
  font-size:60px !important;
  vertical-align:super !important;
  font-weight: bold !important;
}
.mark > span {
  height:100% !important;
  width:60px !important;
  font-size: 2.8rem !important;
  display:flex !important;
  align-items:center !important;
}
.mark_text{
  width:18.8% !important;
  display:inline-block !important;
  font-size: 0.8rem !important;
  text-align:center !important;
  font-weight: bolder;
}
.mark_colon{
  width:5.9% !important;
  display:inline-block !important;
}
</style>
