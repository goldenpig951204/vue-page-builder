<template>
  <div class="menu-bar">
    <ul class="widget-list" @mousedown="updateSrollTop" v-if="toolbarIndex==1">
      <li class="menu-item" @click="blockModal()">
        <i style="font-size: 19px;" class="material-icons">aspect_ratio</i>
        <span class="menu-caption">Instablock</span>
      </li>
      <li class="menu-item" @click="(e) => {addWidget(e, item)}" v-for="item in widgets" :key="item.name" v-if="item.title!=='Popup'">
        <icon :svg="item.icon" :title="item.title" />
        <span class="menu-caption">{{item.title}}</span>
      </li>
      <li class="menu-item" @click="" style="float: right;margin-right:30px">
        <i class="material-icons">settings</i>
        <span class="menu-caption">Settings</span>
        <ul class="sub-menu-item">
          <li @click="$store.state.toolbarIndex = 12"><i class="fas fa-code"></i>HTML/CSS</li>
          <li @click="$store.state.toolbarIndex = 13"><i class="fab fa-js-square" style="font-size: 13px"></i>Javascript</li>
        </ul>
      </li>
    </ul>
    <!-- start button toolbar -->
    <div v-else-if="toolbarIndex==2">
      <div style="padding:10px; cursor: pointer">
        <i class="fas fa-chevron-left" @click="$store.state.toolbarIndex = 1"></i>
        <span style="margin-left:15px;">Button Style</span>
      </div>
      <div class="btn-toolbar1">
        <div class="toolbar-item"><input type="text" class="form-control" style="height:26px" placeholder="Button text" v-model="activeElement.text"></div>
        <div class="toolbar-item">
          <select style="width:88%" v-model="activeElement.fontFamily">
            <option v-for="item in $store.state.fontFamily">{{item}}</option>
          </select>
          <input type="color" v-model="activeElement.color"/>
        </div>
        <div class="row toolbar-item">
          <div class="col-md-8">
            <select v-model="activeElement.fontWeight">
              <option>normal</option>
              <option>bold</option>
            </select>
          </div>
          <div class="col-md-4">
            <select v-model="activeElement.fontSize">
              <option v-for="item in 15">{{(item-1)*2+15}}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="btn-toolbar2">
        <div class="toolbar-item">
          <input type="color" v-model="activeElement.bgColor"/><span class="btn-label">Button color</span>
        </div>
        <div class="toolbar-item"><input type="color" v-model="activeElement.hoverColor"/><span class="btn-label">Hover color</span></div>
        <div class="toolbar-item"><input type="color" v-model="activeElement.borderColor"/><span class="btn-label">Border color</span></div>
      </div>
      <div class="btn-toolbar2" style="position: relative;">
        <div style="position: absolute;top:-100px;width:100%">
          <span>Border radius</span>          
          <slider v-model="activeElement.borderRadius" :min=0 :max=50></slider>
        </div>
      </div>
    </div>
    <!-- end button toolbar -->
    <!--start form toolbar -->
      <!-- start form btn -->
    <div v-if="toolbarIndex==3">
      <div style="padding:10px; cursor: pointer">
        <i class="fas fa-chevron-left" @click="$store.state.toolbarIndex = 1"></i>
        <span style="margin-left:15px;">Form Settings</span>
      </div>
      <ul class="widget-list">
        <li class="menu-item" @click="$store.state.toolbarIndex = 4">
          <i class="fas fa-tv"></i>
          <span class="menu-caption">Button Style</span>
        </li>
        <li class="menu-item" @click="$store.state.toolbarIndex = 5">
          <i class="fas fa-pen-nib"></i>
          <span class="menu-caption">Form Style</span>
        </li>
        <li class="menu-item" @click="$store.state.toolbarIndex = 6">
          <i class="fas fa-external-link-alt"></i>
          <span class="menu-caption">Submission</span>
        </li>
      </ul>
    </div>
    <div v-if="toolbarIndex==4">
      <div style="padding:10px; cursor: pointer">
        <i class="fas fa-chevron-left" @click="$store.state.toolbarIndex = 3"></i>
        <span style="margin-left:15px;">Form button style</span>
      </div>
      <div class="btn-toolbar1">
        <div class="toolbar-item"><input type="text" placeholder="Button text" class="form-control" style="height:26px" v-model="activeElement.text"></div>
        <div class="toolbar-item">
          <select style="width:88%" v-model="activeElement.btnFontFamily">
            <option v-for="item in $store.state.fontFamily">{{item}}</option>
          </select>
          <input type="color" v-model="activeElement.btnColor"/>
        </div>
        <div class="row toolbar-item">
          <div class="col-md-8">
            <select v-model="activeElement.btnFontWeight">
              <option>normal</option>
              <option>bold</option>
            </select>
          </div>
          <div class="col-md-4">
            <select v-model="activeElement.btnFontSize">
              <option v-for="item in 15">{{(item-1)*2+15}}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="btn-toolbar2">
        <div class="toolbar-item"><input type="color" v-model="activeElement.btnBgColor"/><span class="btn-label">Button color</span></div>
        <div class="toolbar-item"><input type="color" v-model="activeElement.btnHoverColor"/><span class="btn-label">Hover color</span></div>
        <div class="toolbar-item"><input type="color" v-model="activeElement.btnBorderColor"/><span class="btn-label">Border color</span></div>
      </div>
      <div class="btn-toolbar2" style="position: relative;">
        <div style="position: absolute;top:-100px;width:100%">
          <span>Border radius</span>          
          <slider v-model="activeElement.btnBorderRadius" :min=0 :max=50></slider>
        </div>
      </div>
    </div>
      <!-- end form btn -->
      <!-- start form style -->
    <div v-if="toolbarIndex==5">
      <div style="padding:10px; cursor: pointer">
        <i class="fas fa-chevron-left" @click="$store.state.toolbarIndex = 3"></i>
        <span style="margin-left:15px;">Form Style</span>
      </div>
      <div style="padding:0px 20px">
        <input type="color" v-model="activeElement.inputColor"/><span class="btn-label">Input color</span>
        <input type="color" v-model="activeElement.fieldColor"/><span class="btn-label">Field color</span>
        <input type="color" v-model="activeElement.labelColor"/><span class="btn-label">Label color</span>
        <input type="color" v-model="activeElement.borderColor"/><span class="btn-label">Border color</span>
      </div>
    </div>
      <!-- end form style -->
      <!-- start submission style -->
    <div v-if="toolbarIndex==6">
      <div style="padding:10px; cursor: pointer">
        <i class="fas fa-chevron-left" @click="$store.state.toolbarIndex = 3"></i>
        <span style="margin-left:15px;">Form Submissions</span>
      </div>
      <div style="padding:0 50px"><input type="text" placeholder="URL" v-model="activeElement.submission" class="form-control" style="height:30px;width:250px;"/></div>
    </div>
      <!-- end submission style -->
    <!-- end form toolbar -->
    <!-- start square toolbar -->
    <div v-if="toolbarIndex==7">
      <div style="padding:10px; cursor: pointer">
        <i class="fas fa-chevron-left" @click="$store.state.toolbarIndex = 1"></i>
        <span style="margin-left:15px;">Box Style</span>
      </div>
      <div class="row" style="padding:0px 20px">
        <div class="col-sm-2">
          <div style="margin-bottom: 12px;">
            <i class="far fa-image" @click="addPic"></i>
            <input type="file" style="display:none"/>
            <span class="btn-label">Background Image</span>
          </div>
          <div style="margin-bottom: 12px;">
            <input type="color" v-model="activeElement.bgColor">
            <span class="btn-label">Background Color</span>
          </div>
          <div style="margin-bottom: 12px;">
            <input type="color" v-model="activeElement.borderColor">
            <span class="btn-label">Border</span>
            <input type="number" class="border-size" v-model="activeElement.borderWidth" min="1"><span style="position: absolute;left:160px">px</span>
          </div>
          <div style="margin-bottom: 12px;">
            <switches theme="bootstrap" color="primary" style="top:4px"></switches>
            <span class="btn-label">Consistent corners</span>
          </div>
        </div>
        <div class="col-sm-2">
          <label>Corner radius</label>
          <slider :min="0" :max="100" v-model="activeElement.borderTopLeftRadius" style="display:inline-block; width:80%"></slider><i class="material-icons" style="transform: rotate(270deg)">rounded_corner</i>
          <slider :min="0" :max="100" v-model="activeElement.borderTopRightRadius" style="display:inline-block; width:80%"></slider><i class="material-icons" style="transform: rotate(0deg)">
            rounded_corner
          </i>
          <slider :min="0" :max="100" v-model="activeElement.borderBottomLeftRadius" style="display:inline-block; width:80%"></slider><i class="material-icons" style="transform: rotate(180deg)">rounded_corner</i>
          <slider :min="0" :max="100" v-model="activeElement.borderBottomRightRadius" style="display:inline-block; width:80%"></slider><i class="material-icons" style="transform: rotate(90deg)">rounded_corner</i>
        </div>
        <div class="col-sm-2">
          <label>Opacity</label>
          <slider :min="0" :max="1" v-model="activeElement.opacity" style="display:inline-block;width:80%"></slider>
        </div>        
      </div>
    </div>
    <!-- end square toolbar -->
    <!-- start circle toolbar -->
    <div v-if="toolbarIndex==8">
      <div style="padding:10px; cursor: pointer">
        <i class="fas fa-chevron-left" @click="$store.state.toolbarIndex = 1"></i>
        <span style="margin-left:15px;">Circle Style</span>
      </div>
      <div class="row" style="padding:0px 20px">
        <div class="col-sm-2">
          <div style="margin-bottom: 12px;">
            <i class="fa fa-image" @click="addPic"></i>
            <span class="btn-label">Background Image</span>
          </div>
          <div style="margin-bottom: 12px;">
            <input type="color" v-model="activeElement.bgColor">
            <span class="btn-label">Background Color</span>
          </div>
          <div style="margin-bottom: 12px;">
            <input type="color" v-model="activeElement.borderColor">
            <span class="btn-label">Border</span>
            <input type="number" class="border-size" v-model="activeElement.borderWidth" min="1"><span style="position: absolute;left:160px">px</span>
          </div>
        </div>
        <div class='col-md-2'>
          <label>Opacity</label>
          <slider v-model="activeElement.opacity" :min="0" :max="1" style="display: inline-block;width:80%"></slider>
        </div>
      </div>
    </div>
    <!-- end circle toolbar -->
    <!-- start social toolbar -->
    <div v-if="toolbarIndex==9">
      <div style="padding:10px; cursor: pointer">
        <i class="fas fa-chevron-left" @click="$store.state.toolbarIndex = 1"></i>
        <span style="margin-left:15px;">Social Style</span>
      </div>
      <div class="row" style="padding:0px 20px">
        <div class="col-md-2">
          <label>Position</label>
          <div>
            <div class='btn-group'>
              <button class="btn btn-primary btn-sm" @click="activeElement.isHorizontal=1">HORIZONTAL</button>
              <button class="btn btn-success btn-sm" @click="activeElement.isHorizontal=0">VERTICAL</button>
            </div>
          </div>
        </div>
        <div class="col-md-2">
          <label>Style</label>
          <div>
            <div class="btn-group">
              <button class="btn btn-primary btn-sm" @click="activeElement.socialType=0">Icon1</button>
              <button class="btn btn-danger btn-sm" @click="activeElement.socialType=1">Icon2</button>
              <button class="btn btn-success btn-sm" @click="activeElement.socialType=2">Icon3</button>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div style="margin-bottom: 10px;">
            <span style="width: 175px;display: inline-block;">
              <i class="fab fa-facebook-f" style="font-size: 18px; color:blue;margin-right:10px; width:20px"></i>
              <switches theme="bootstrap" color="primary" v-model="activeElement.socialDatas[3].isShow" style="top:2px"></switches>
              <label>Facebook</label>
            </span>
            <span style="width: 175px; display: inline-block;">
              <i class="fab fa-twitter" style="font-size: 18px; color:blue;margin-right:10px; width:20px"></i>
              <switches theme="bootstrap" color="primary" v-model="activeElement.socialDatas[1].isShow" style="top:2px"></switches>
              <label>Twitter</label>
            </span>
          </div>
          <div>
            <span style="width:175px; display: inline-block;">
              <i class="fab fa-google-plus-g" style="font-size: 18px; color:red;margin-right:10px; width:20px"></i>
              <switches theme="bootstrap" color="primary" v-model="activeElement.socialDatas[0].isShow" style="top:2px"></switches>
              <label>Google+</label>
            </span>
            <span style="width: 175px; display:inline-block">
              <i class="fab fa-linkedin-in" style="font-size: 18px; color:blue;margin-right:10px; width:20px"></i>
              <switches theme="bootstrap" color="primary" v-model="activeElement.socialDatas[2].isShow" style="top:2px"></switches>
              <label>Linkedin</label>
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- end social toolbar -->
    <!-- start timer toolbar -->
    <div v-if="toolbarIndex==10">
      <div style="padding:10px; cursor: pointer">
        <i class="fas fa-chevron-left" @click="$store.state.toolbarIndex = 1"></i>
        <span style="margin-left:15px;">Timer Style</span>
      </div>
      <div class="row" style="padding:0px 20px;">
        <div class="col-sm-2">
          <div style="margin-bottom: 12px;">
            <input type="color" v-model="activeElement.numberColor"/><span class="btn-label">Number color</span>
          </div>
          <div style="margin-bottom: 12px;">
            <input type="color" v-model="activeElement.timerColor"/><span class="btn-label">Timer color</span>
          </div>
          <div style="margin-bottom: 12px;">
            <input type="color" v-model="activeElement.labelColor"/><span class="btn-label">Label color</span>
          </div>
        </div>
        <div class="col-sm-2">
          <div style="margin-bottom: 12px;">
            <div class="row">
              <div class="col-md-6">
                <label>Hour</label>
                <select v-model="activeElement.hour" @change="updateTimer">
                  <option :value="hour" v-for="hour in activeElement.setHour">{{hour}}</option>
                </select>
              </div>
              <div class="col-md-6">
                <label>Minute</label>
                <select v-model="activeElement.minute" @change="updateTimer">
                  <option :value="minute" v-for="minute in activeElement.setMinute">{{minute}}</option>
                </select>
              </div>
            </div>
          </div>
          <input type="date" v-model="activeElement.date" @change="updateTimer"/>
        </div>
        <div class="col-sm-2">
          <label>Time zone</label>
          <select v-model="activeElement.zone" @change="updateTimer">
            <option :value="zone" v-for="zone in activeElement.timeZone">UTC {{zone}}</option>
          </select>
          <switches theme="bootstrap" color="primary" v-model="activeElement.labelShow" style="top:4px"></switches>
        </div>
      </div>
    </div>
    <!-- end timer toolbar -->
    <!-- start section toolbar -->
    <div v-if="toolbarIndex==11">
      <div style="padding:10px; cursor: pointer">
        <i class="fas fa-chevron-left" @click="$store.state.toolbarIndex = 1"></i>
        <span style="margin-left:15px;">Block Style</span>
      </div>
      <div class="row" style="padding:0px 20px">
        <div class="col-sm-2">
          <div style="margin-bottom: 12px;">
            <i class="fa fa-image" @click="addPic"></i>
            <span class="btn-label">Background Image</span>
          </div>
          <div style="margin-bottom: 12px;">
            <input type="color" v-model="activeElement.bgColor">
            <span class="btn-label">Background Color</span>
          </div>
          <div style="margin-bottom: 12px;">
            <input type="color" v-model="activeElement.borderColor">
            <span class="btn-label">Border</span>
            <input type="number" class="border-size" v-model="activeElement.borderWidth" min="1"><span style="position: absolute;left:160px">px</span>
          </div>
        </div>
      </div>
    </div>
    <!-- end section toolbar -->
    <!-- start html/css toolbar-->
    <div v-if="toolbarIndex==12">
      <div style="padding:10px; cursor: pointer">
        <i class="fas fa-chevron-left" @click="$store.state.toolbarIndex = 1"></i>
        <span style="margin-left:15px;">HTML/CSS</span>
      </div>
      <div style="padding:0px 20px">
        <div class="btn-group">
          <button class="btn btn-sm btn-primary" @click="arrange = 0">head</button>
          <button class="btn btn-sm btn-primary" @click="arrange = 1">body</button>
        </div>
        <div class="editor-container" v-if="arrange">
          <codemirror v-model="$store.state.styles[1].style" :options="styleOption"></codemirror>
        </div>
        <div class="editor-container" v-else>
          <codemirror v-model="$store.state.styles[0].style" :options="styleOption"></codemirror>
        </div>
      </div>
    </div>
    <!-- end html/css toolbar -->
    <!-- start javascript toolbar -->
    <div v-if="toolbarIndex==13">
      <div style="padding:10px; cursor: pointer">
        <i class="fas fa-chevron-left" @click="$store.state.toolbarIndex = 1"></i>
        <span style="margin-left:15px;">Javascript</span>
      </div>
      <div style="padding:0px 20px">
        <div class="btn-group">
          <button class="btn btn-sm btn-primary" @click="arrange = 0">head</button>
          <button class="btn btn-sm btn-primary" @click="arrange = 1">body</button>
        </div>
        <div class="editor-container" v-if="arrange">
          <codemirror v-model="$store.state.scripts[1].script" :options="scriptOption"></codemirror>
        </div>
        <div class="editor-container" v-else>
          <codemirror v-model="$store.state.scripts[0].script" :options="scriptOption"></codemirror>
        </div>
      </div>
    </div>
    <!-- end javascript toolbar -->
    <details>
      <summary><icon name="layers" />Added Component</summary>
      <ul class="layer-list">
        <li :class="{'layer-active': layer === activeElement}" v-for="layer in layers" :key="layer.uuid" @click="(e) => {activeLayer(e, layer)}">{{getWidgetTitle(layer.type)}}</li>
      </ul>
    </details>
    <blockModal ref="blockmodal"/>
  </div>
</template>

<script>
import widget from '../plugins/widget'
import { move } from '../mixins'
import slider from './slider.vue'
import { cumulativeOffset, checkInView } from '../utils/offset'
import Switches from 'vue-switches'
import BlockModal from './blockmodal.vue'
// require component
import { codemirror } from 'vue-codemirror'

// require styles
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
// import CodeMirror from './codemirror.vue'
export default {
  mixins: [move],
  props: ['zoom'],
  data () {
    return {
      // code editor data
      arrange: 0,
      scriptOption: {
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        mode: 'text/javascript',
        lineWrapping: true,
        theme: 'monokai'
      },
      styleOption: {
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        mode: 'text/css',
        lineWrapping: true,
        theme: 'monokai'
      }
    }
  },
  computed: {
    widgets () {
      return widget.getWidgets()
    },
    layers () {
      return this.$store.state.widgets
    },
    activeElement () {
      return this.$store.state.activeElement
    },
    toolbarIndex () {
      return this.$store.state.toolbarIndex
    }
  },
  methods: {
    // Insta Block Modal
    blockModal () {
      this.$refs.blockmodal.showModal(0)
    },
    // Add component
    addWidget (e, item) {
      this.$store.dispatch('addWidget', item)
    },
    // To ensure that the added component appears in the viewable area, use the canvas to scroll up the distance as the component's initial top value.
    updateSrollTop () {
      var top = document.getElementById('viewport').scrollTop / this.zoom * 100
      this.$store.commit('updateSrollTop', top)
    },
    activeLayer (e, item) {
      this.$store.commit('select', {
        uuid: item.uuid
      })
      let viewport = document.querySelector('#viewport')
      let target = viewport.querySelector(`[data-uuid='${item.uuid}']`)
      if (target && !checkInView(target)) {
        viewport.scrollTop = (cumulativeOffset(target).top - 50) * this.zoom / 100
      }
    },
    getWidgetTitle (type) {
      return this.widgets[type].title || ''
    },
    addPic () {
      this.$store.$emit('upload', (payload) => {
        this.$store.commit('addBackPic', payload)
      })
    },
    updateTimer () {
      let timerDay, timerHour, timerMinute, timerSecond
      let setFullTime = this.activeElement.date + 'T' + this.activeElement.hour + ':' + this.activeElement.minute + this.activeElement.zone
      setFullTime = new Date(setFullTime).getTime()
      let currentFullTime = new Date().getTime()
      this.activeElement.end = setFullTime
      let remainFullTime = setFullTime - currentFullTime
      timerDay = Math.floor(remainFullTime / (1000 * 60 * 60 * 24))
      timerHour = Math.floor((remainFullTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      timerMinute = Math.floor((remainFullTime % (1000 * 60 * 60)) / (1000 * 60))
      timerSecond = Math.floor((remainFullTime % (1000 * 60)) / 1000)
      if (remainFullTime < 0) {
        timerDay = 0
        timerHour = 0
        timerMinute = 0
        timerSecond = 0
      }
      timerDay < 10 ? this.activeElement.timerDay = '0' + timerDay : this.activeElement.timerDay = timerDay
      timerHour < 10 ? this.activeElement.timerHour = '0' + timerHour : this.activeElement.timerHour = timerHour
      timerMinute < 10 ? this.activeElement.timerMinute = '0' + timerMinute : this.activeElement.timerMinute = timerMinute
      timerSecond < 10 ? this.activeElement.timerSecond = '0' + timerSecond : this.activeElement.timerSecond = timerSecond
    }
  },
  components: {slider, Switches,BlockModal,codemirror}
}
</script>

<style lang="scss">
@import '../_variables.scss';
.menu-bar {
  ul {
    list-style: none;
    margin: 0;
  }
  details {
    padding: 10px;
  }
  summary {
    padding: 5px 0;
    border-bottom: 1px solid #f5f5f5;
    .svg-icon {
      margin-right: 5px;
    }
  }
}
.widget-list {
  padding: 0;
}
.menu-item {
  text-align: center;
  cursor: pointer;
  padding: 15px 0 8px;
  transition: all 0.2s;
  position: relative;
  display:inline-block;
  margin-left: 30px;
  &:hover {
    transform: scale(1.2);
  }
  .svg-icon {
    font-size: 24px;
  }
  .menu-caption {
    display: block;
    font-size: 12px;
  }
}
.layer-list {
  padding: 10px;
  li {
    text-align: left;
    cursor: pointer;
    white-space: nowrap;
    line-height: 24px;
    padding-left: 5px;
    &:hover {
      background: #f5f5f5;
    }
    &::before {
      content: '› ';
    }
    &.layer-active {
      color: $light-color;
      background: $primary-color;
    }
  }
}
.btn-toolbar1{
  width:300px;
  display:inline-block;
  padding:0px 20px;
}
.toolbar-item{
  margin-bottom:10px;
}
.btn-toolbar2{
  width:200px;
  display:inline-block;
  padding:0px 20px;
}
.btn-label{
    margin:0px 15px 0px 5px;
    vertical-align:middle;
  }
.thumbnail{
  width: 130px;
  height: 100px;
  position:absolute;
  top:-90px;
  border-radius:5px;
  border:1px solid #ccc;
  display:flex;
  text-align:center;
}
.border-size{display:inline-block;width:60px;
  border-top:none;border-left:none;border-right:none;
  outline:none;border-color:#ccc;padding-right:25px}
.border-size:focus{
  border-color: #1e88e5
}
.fa-image{
  font-size: 22px;
  margin-left: 2px;
  vertical-align: middle;
}
.fa-image:hover{color:red;}
.sub-menu-item{
    position: absolute;
    z-index: 1;
    background: white;
    box-shadow: 0px 0px 1px 1px;
    width: 90px;
    right: -20px;
    padding: 0px;
    display:none
}
.menu-item:hover{z-index:1}
.menu-item:hover .sub-menu-item{display:block}
.sub-menu-item li{font-size:10px; text-align:left; padding:5px}
.sub-menu-item li:hover{background:black; color:white}
.sub-menu-item i{margin-right:10px;}
</style>
