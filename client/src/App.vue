<template>
  <div class="app">
    <navbar></navbar>
    <toolbar class="toolbar" :zoom="zoom" v-if="$store.state.isEdit"></toolbar>
    <div class="body grid-xl" :class="{editContainer: $store.state.isEdit, notEditContainer: !$store.state.isEdit}">
      <div class="columns col-gapless">
        <div class="viewport column">
          <viewport :zoom="zoom"></viewport>
        </div>
      </div>
    </div>
    <uploader :upload="upload" :uploadOption="uploadOption"></uploader>
    <toast></toast>
  </div>
</template>

<script>
import Vue from 'vue'
import store from './store'
import widget from './plugins/widget'
import navbar from './components/navbar.vue'
import toolbar from './components/toolbar.vue'
import viewport from './components/viewport/index.vue'
import loadSprite from './utils/load-sprite'

export default {
  name: 'vue-page-designer',
  store,
  components: {
    navbar, // Top navigation bar
    toolbar, // Top toolbar
    viewport // Page canvas
  },
  props: {
    value: Object,
    widgets: Object,
    upload: Function,
    uploadOption: Object
  },
  beforeCreate () {
    // TODO: custom svg path by config
    loadSprite('//unpkg.com/vue-page-designer/dist/icons.svg', 'svgspriteit')
  },
  created () {
    // Register widgets
    Vue.use(widget, {
      widgets: this.widgets
    })
    // Initialize existing data
    if (this.value) {
      store.replaceState(this.value)
    }
    store.$on('save', () => {
      this.$emit('save', store.state)
    })
  },
  mounted () {
    if (this.$route.path === '/' || this.$route.path === '/builder') {
        this.$store.state.isEdit = 1
    } 
    else if(this.$route.path === '/preview') {
      this.$store.state.isEdit = 0
      this.$store.state.widgets.forEach(i => {
        i.eventState = 0
      })
    }
    // Initialize the selected component (use the page as the initial selected component)
    this.$store.commit('initActive')
  },

  methods: {
    dozoom (val) {
      this.$store.commit('zoom', val)
    },
  },
  computed: {
    zoom () {
      return this.$store.state.zoom
    },
  }
}
</script>

<style lang="scss">
.body {
  width: 100%;
  height: 100%;
  flex-direction: row;
  &.container {
    padding: 0;
  }
}
.columns {
  height: 100%;
}
.viewport,
.control-panel {
  height: 100%;
}
.toolbar {
  background: #fff;
  user-select: none;
  box-sizing: content-box;
  border-bottom: 1px solid #ccc5;
  &.column {
    flex: none;
    width: 120px;
  }
}
.viewport {
  position: relative;
  overflow: auto;
}
.control-panel {
  background: #fff;
  user-select: none;
  &.column {
    flex: none;
    width: 400px;
  }
}
.zoom-wrap {
  width: 200px;
  height: 30px;
  position: absolute;
  bottom: 20px;
  right: 20px;
  opacity: 0;
  transition: opacity 0.3s;
}
.viewport:hover .zoom-wrap {
  opacity: 1;
}
.zoom-value {
  position: absolute;
  top: 4px;
  left: -36px;
}
#svgspriteit {
  position: absolute;
  z-index: -1;
  opacity: 0;
}
.disableEvent{
  pointer-events:none;
}
.editContainer{
  height: calc(100% - 188px)
}
.notEditContainer{
  height: calc(100% + 40px)
}
</style>
