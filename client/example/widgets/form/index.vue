<template>
  <form method="POST" :action="val.submission" 
    :id="val.uuid"
    :class="[playState ? 'anm-' + val.animationName : '']"
    :style="{
      padding:'20px',
      position: 'absolute',
      width: val.width / width * 100 + '%',
      height: val.height / h * 100 + '%',
      left: val.left / width * 100 + '%',
      top: val.top / h * 100 + '%',
      zIndex: val.z,
      background: val.bgColor,
      backgroundImage: 'url(' + val.backPic + ')',
    }">
    <div style="position: relative;" :class="{disableEvent: val.eventState}">
      <div class="form-group" v-for="(item,i) in val.formElm">
        <div v-if="item.type=='text'||item.type=='email'||item.type=='password'">
          <label v-if="!item.hide_label" :style="{color:val.labelColor}">{{item.label}}</label>
          <i class="fa fa-trash pull-right" v-if="$store.state.isEdit" @mousedown.stop="removeElement(i)"></i>
          <i class="fa fa-edit pull-right" v-if="$store.state.isEdit" @mousedown.stop="editElement(item, i)"></i>
          <input v-if="item.required" :type="item.type" class="form-control" :class="{disableEvent: $store.state.isEdit}" required :name="item.name" :style="{color:val.inputColor,backgroundColor:val.fieldColor,borderColor:val.borderColor}"/>
          <input v-else :type="item.type" class="form-control" :class="{disableEvent: $store.state.isEdit}" :name="item.name" :style="{color:val.inputColor,backgroundColor:val.fieldColor,borderColor:val.borderColor}"/>
        </div>
        <div v-else-if="item.type=='checkbox'||item.type=='radio'">
          <label v-if="!item.hide_label" :style="{color:val.labelColor}">{{item.label}}</label><i class="fa fa-trash pull-right" v-if="$store.state.isEdit" @mousedown.stop="removeElement(i)"></i>
          <i class="fa fa-edit pull-right" v-if="$store.state.isEdit" @mousedown.stop="editElement(item, i)"></i>
          <br>
          <div v-for="option in item.options">
            <input v-if="option.required" :type="item.type" :class="{disableEvent: $store.state.isEdit}" :name="option.name" :value=  "option.value" required :style="{color:val.inputColor,backgroundColor:val.fieldColor,borderColor:val.borderColor,verticalAlign:'middle',}"/>
            <input v-else :type="item.type" :class="{disableEvent: $store.state.isEdit}" :name="option.name" :value=  "option.value" required style="vertical-align: middle"/>
            <label>{{option.value}}</label><br>
          </div>
          
        </div>
        <div v-else-if="item.type=='textarea'">
          <label v-if="!item.hide_label">{{item.label}}</label>
          <i class="fa fa-trash pull-right" v-if="$store.state.isEdit" @mousedown.stop="removeElement(i)"></i>
          <i class="fa fa-edit pull-right" v-if="$store.state.isEdit" @mousedown.stop="editElement(item, i)"></i>
          <textarea v-if="item.required" :class="{disableEvent: $store.state.isEdit}" :name="item.name" rows="5" required></textarea>
          <textarea v-else :class="{disableEvent: $store.state.isEdit}" :name="item.name" rows="5"></textarea>
        </div>
        <div v-else-if="item.type=='select'">
          <label v-if="!item.hide_label">{{item.label}}</label>
          <i class="fa fa-trash pull-right" v-if="$store.state.isEdit" @mousedown.stop="removeElement(i)"></i>
          <i class="fa fa-edit pull-right" v-if="$store.state.isEdit" @mousedown.stop="editElement(item, i)"></i>
          <select v-if="item.required" class="form-control" :class="{disableEvent: $store.state.isEdit}" :name="item.name" required>
            <option v-for="option in item.options">{{option}}</option>
          </select>
          <select v-else class="form-control" :class="{disableEvent: $store.state.isEdit}" :name="item.name">
            <option v-for="option in item.options">{{option}}</option>
          </select>
        </div>
        <div v-else-if="item.type=='hidden'">
          <label>{{item.label}}</label>
          <i class="fa fa-trash pull-right" v-if="$store.state.isEdit" @mousedown.stop="removeElement(i)"></i>
          <i class="fa fa-edit pull-right" v-if="$store.state.isEdit" @mousedown.stop="editElement(item, i)"></i>
          <input type="hidden" :name="item.name" :class="{disableEvent: $store.state.isEdit}" :value="item.value"/>
        </div>
      </div>
      <div class="form-action">
        <input type="submit" :value="val.text" class="btn btn-block" :class="{disableEvent: $store.state.isEdit}" @mouseover="overHandler($event)" @mouseleave="leaveHandler($event)"
        :style="{
          color:val.btnColor,
          backgroundColor:val.btnBgColor,
          borderColor:val.btnBorderColor,
          borderRadius: val.btnBorderRadius+'px',
          fontFamily: val.btnFontFamily,
          fontSize: val.btnFontSize+'px',
          fontWeight: val.btnFontWeight,
        }">
      </div>
      <resize-observer @notify="handleResize"/>
    </div>
    <editbar :parentID="val.uuid" v-if="$store.state.isEdit" ref="formEditbar"/>
        <span class="removebar"></span>
    </form>
</template>

<script>
const WIDGET_NAME = 'braid-form'
import Editbar from './editbar.vue'
export default {
  name: WIDGET_NAME,
  icon: "fab fa-wpforms",
  title: 'Form',
  setting: {
    type: WIDGET_NAME,
    isContainer: false,
    isUpload: false,
    hasGuide: true,
    isChild: true,
    dragable: true,
    resizable: true,
    name: '',
    width: 350,
    height: 250,
    left: 10,
    top: 0,
    z: 1,
    inputColor: '#444444',
    fieldColor: '#ffffff',
    labelColor: '#444444',
    borderColor: '#ced4da',
    bgColor: 'transparent',
    backPic: '',
    backPicUrl: '',
    color: '#ffffff',
    btnColor: '#ffffff',
    btnBgColor: '#007bff',
    btnHoverColor: '#1565c0',
    btnBorderColor: 'transparent',
    btnBorderRadius: 5,
    btnFontFamily: 'Arial Black',
    btnFontSize: 18,
    btnFontWeight: 'normal',
    submission: '',
    text: 'Submit',
    formElm: [
            {'type': 'text','label': 'Name','hide_label': 0,'name': 'Name','required': 1},
            {'type': 'text', 'label': 'Email', 'hide_label': 0, 'name': 'Email', 'required': 1},
          ],
    belong: 'section-0',
    animationName: '',
    eventState: 1,
    desktopStyle: {
      left: 10,
      top: 0,
      width: 350,
      height: 250
    },
    mobileStyle: {
      left: 10,
      top: 0,
      width: 360,
      height: 250,
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
    handleResize(){
      var elementHeight = document.getElementById(this.val.uuid).children[0].offsetHeight;
      this.$store.commit('updateData', {
        uuid: this.val.uuid,
        key: 'height',
        value: elementHeight+40
      })
    },
    overHandler(e){
      e.target.style.background = this.val.btnHoverColor;
    },
    leaveHandler(e){
      e.target.style.background = this.val.btnBgColor;
    },
    editElement (item, i) {
      this.$refs.formEditbar.reeditElement(item, i)
    },
    removeElement (i) {
      this.$store.state.activeElement.formElm.splice(i,1)
    }
  },
  mounted(){
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
  color:#444 !important;
  font-size: 15px !important;
}
.fa-trash.pull-right,.fa-edit.pull-right{
  float:right;
  margin-right: 5px;
  display:none;
  font-size: 12px;
  margin-top: 10px
}
.fa-trash.pull-right:hover, .fa-edit.pull-right:hover{
  transform: scale(1.2);
}
.form-group > div:hover .fa-trash.pull-right, .form-group > div:hover .fa-edit.pull-right{
  display: block
}
</style>
