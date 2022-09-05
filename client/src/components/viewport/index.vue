<template>
  <div class="holder" id="viewport">
    <div class="screen"
      :style="{
        position: 'absolute',
        backgroundColor: backgroundColor,
        height: height + 'px',
        width: '100%',
        transform: 'scale(' + zoom / 100 + ')',
      }">
      <div v-if="!$store.state.isEdit && !$store.state.viewMode" class="mobile-device">
        <img src="./iphone-preview.svg" style="width:472px"/>
      </div>
      <!-- section Component -->
      <div :class="!$store.state.isEdit && !$store.state.viewMode ? 'mobilePreview':''">
        <Container @drop="onDrop" style="height:100%; z-index: 0" drag-handle-selector=".column-drag-handle" lock-axis="y" orientation="vertical">
          <Draggable v-for="(val, index) in widgetStore" :key="val.uuid" :style="{height:val.height + 'px', zIndex: 0}" :class="activeElement.uuid==val.uuid ? 'isActive' : ''">
            <component
              :is="val.type"
              :data-title="val.type"
              class="layer-component draggable-item"
              :class="{'layer': $store.state.isEdit,'g-active': (id === val.uuid && $store.state.isEdit)}"
              :val="val"
              :h="height"
              :key="index"
              :w="width"
              :data-type="val.type"
              :data-uuid="val.uuid"
              :playState="playState">
              <component
                v-if="val.isContainer"
                :is="child.type"
                :data-title="child.type"
                class="layer-child"
                :class="{'layer': $store.state.isEdit,'g-active': (id === child.uuid && $store.state.isEdit)}"
                v-for="child in getChilds(val.name)"
                :key="child.uuid"
                :val="child"
                :h="val.height"
                :w="width"
                :data-type="child.type"
                :data-uuid="child.uuid"
                :playState="playState">
              </component>
            </component>
          </Draggable>
        </Container>
        <!-- popup Component -->
        <component
              :is="val.type"
              :data-title="val.type" style="z-index: 1"
              class="layer-component draggable-item"
              :class="{'layer': $store.state.isEdit,'g-active': (id === val.uuid && $store.state.isEdit),'mobilePopup': !$store.state.isEdit && !$store.state.viewMode }"
              :val="val"
              v-for="(val, index) in popupStore"
              :h="height"
              :key="index"
              :w="width"
              :data-type="val.type"
              :data-uuid="val.uuid"
              :playState="playState">
              <component
                v-if="val.isContainer"
                :is="child.type"
                :data-title="child.type"
                class="layer-child"
                :class="{'layer': $store.state.isEdit,'g-active': (id === child.uuid && $store.state.isEdit)}"
                v-for="child in getChilds(val.name)"
                :key="child.uuid"
                :val="child"
                :h="val.height"
                :w="val.width"
                :data-type="child.type"
                :data-uuid="child.uuid"
                :playState="playState">
              </component>
        </component>
        <!-- Reference line -->
        <ref v-if="$store.state.isEdit"></ref>
        <!-- size controller -->
        <control v-if="$store.state.isEdit" :w="700"></control>
        <resize-observer @notify="handleResize"/>
        <modal ref="sectionModal"/>
      </div>
    </div>
  </div>
</template>

<script>
import ref from './ref-lines.vue'
import control from './size-control.vue'
import { move } from '../../mixins'
import {Container, Draggable} from 'vue-smooth-dnd'
import Modal from './modal.vue'
export default {
  name: 'viewport',
  components: {
    ref: ref, // reference line
    control: control, // Size control
    Container: Container,
    Draggable: Draggable,
    Modal: Modal
  },

  mixins: [move],

  props: ['zoom'],

  data () {
    return {
      width: 0
    }
  },
  created () {
    this.handleResize()
  },
  mounted () {
    // Use the event proxy to monitor the selected operation of the component
    document
      .getElementById('viewport')
      .addEventListener('mousedown', this.handleSelection, false)
    let _this = this
    this.$store.$on('showModal', function(res){
      _this.showModal(res.type)
    })
  },
  methods: {
    handleSelection (e) {
      if (this.$store.state.isEdit) {
        var target = e.target
        var type = target.getAttribute('data-type')

        if (type) {
          var uuid = target.getAttribute('data-uuid')

          // Set the selected element
          this.$store.commit('select', {
            uuid: uuid || -1
          })

          // Binding mobile events: Only components that are subordinate to page, except the background image, can move
          target = this.$store.state.activeElement
          if (target.dragable) {
            this.initmovement(e) // mixins
          }
        } else {
          // Uncheck element
          this.$store.commit('select', {
            uuid: -1
          })
        }
      }
    },
    handleResize () {
      // this.width = screen.width - 10
      // this.$store.state.page.width = screen.width - 10
      let width = document.body.clientWidth;
      this.width = width
      this.$store.state.page.width = width
      if(Math.abs(this.$store.state.viewMode) === 1) {
        this.$store.state.widgets.forEach((i, j) => {
          if (i.belong === 'page' && i.index === 'section') {
            i.width = screen.width + 10
          }
        })
      }
    },
    // Get subcomponents
    getChilds (name) {
      let child = this.$store.state.widgets.filter(
        item => item.belong === name
      )
      return child
    },
    onDrop (drapResult) {
      var { removedIndex, addedIndex, payload } = drapResult
      if (removedIndex === null && addedIndex === null) return

      const result = this.widgetStore
      var itemToAdd = payload

      if (removedIndex !== null) {
        itemToAdd = result.splice(removedIndex, 1)[0]
      }

      if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd)
      }
      let array = this.$store.state.widgets.filter(widget => { return widget.type !== 'braid-section' })
      let top = 0
      for (let i = 0; i < result.length; i++) {
        result[i].top = top
        top += result[i].height
      }
      let array1 = array.concat(result)
      console.log(array1)
      this.$store.commit('updateContainer', array1)
    },
    showModal (type) {
      this.$refs.sectionModal.showModal(type)
    }
  },
  computed: {
    // Added component
    widgetStore () {
      return this.$store.state.widgets.filter(item => item.belong === 'page' && item.index === 'section')
    },
    popupStore () {
      return this.$store.state.widgets.filter(item => item.belong === 'page' && item.index === 'popup')
    },
    // Canvas height
    height () {
      return this.$store.state.page.height
    },
    // Page background color
    backgroundColor () {
      return this.$store.state.page.backgroundColor
    },

    // Selected item id
    id () {
      // var type = this.$store.state.type
      // var index = this.$store.state.index
      // index = index >= 0 ? index : ''
      // return type + index
      return this.$store.state.uuid
    },

    // Animation playback status
    playState () {
      return this.$store.state.playState
    },
    // activeElement
    activeElement () {
      return this.$store.state.activeElement
    }
  }
}
</script>

<style>
.editContainer{
  height: calc(100% - 188px)
}
.notEditContainer{
  height: calc(100% + 40px)
}
.holder {
  display: block;
  height: 93vh;
  font-size: 15px;
  border: 1px solid #f5f5f5;
  border-width: 0 1px;
  background-position: 0 0, 13px 13px;
  background-size: 26px 26px;
}
::-webkit-scrollbar {
    width: 8px; 
    height: 8px;
}
::-webkit-scrollbar-track {
    background: #f1f1f1; 
}
::-webkit-scrollbar-thumb {
    background: #aaa; 
}
::-webkit-scrollbar-thumb:hover {
    background: #ccc; 
}
.screen {
  display: block;
  transform-origin: center top;
  position: relative;
}
.isActive{
  border: 1px solid #2196f3 !important
}
.layer-component:active{
  opacity: 1 !important
}
.mobile-device{
  position: absolute; 
  left: 0; 
  top: 14px; 
  text-align: center; 
  width: 100%
}
.mobilePreview{
  width: 409px;
  margin: 130px auto 0px;
  height: 724px;
  overflow-y: scroll;
}
.mobilePopup{
  height: 724px !important;
  margin:130px auto;
}
</style>
