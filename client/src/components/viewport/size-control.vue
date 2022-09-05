<template>
	<div v-show="elm">
		<!-- left -->
	  <div class="verti"
	  	@mousedown="handlemousedown($event, 'left', 'left', 'width')"
	    :style="{
	      height: elm.height + 'px',
	      top: (elm.top + cdt) + 'px',
	      left: (elm.left + popupChild + viewModeLeft) + 'px'
	    }">
	    <div class="square" v-if="elm.type != 'braid-Vline' && elm.type != 'braid-social' && elm.type != 'braid-section'"></div>
	  </div>

		<!-- right -->
	  <div class="verti"
		  @mousedown="handlemousedown($event, 'right', 'width')"
	    :style="{
	      height: elm.height + 'px',
	      top: (elm.top + cdt) + 'px',
	      left: (elm.left + elm.width + 5 + popupChild + viewModeLeft) + 'px'
	    }">
	    <div class="square" v-if="elm.type != 'braid-Vline' && elm.type != 'braid-social' && elm.type != 'braid-section'"></div>
	  </div>

		<!-- top -->
	  <div class="horiz"
		  @mousedown="handlemousedown($event, 'up', 'top', 'height')"
	    :style="{
	      width: elm.width + 'px',
	      top: (elm.top + cdt) + 'px',
	      left: (elm.left + popupChild + viewModeLeft) + 'px'
	    }">
	    <div class="square" v-if="elm.type != 'braid-headline' && elm.type != 'braid-paragraph' && elm.type != 'braid-Hline' && elm.type != 'braid-social' && elm.type != 'braid-section'"></div>
	  </div>

		<!-- bottom -->
	  <div class="horiz"
		  @mousedown="handlemousedown($event, 'down', 'height')"
	    :style="{
	      width: elm.width + 'px',
	      top: (elm.top + cdt + elm.height) + 'px',
	      left: (elm.left + popupChild + viewModeLeft) + 'px'
	    }">
	    <div class="square" v-if="elm.type != 'braid-headline' && elm.type != 'braid-paragraph' && elm.type != 'braid-Hline' && elm.type != 'braid-social' && elm.type !='braid-section'" :style="{cursor:'ns-resize'}"></div>
	  </div>

    <!-- top-left -->
    <div class="verti-horiz"
      @mousedown="handlemousedown($event, 'top-left', 'left', 'top')"
      :style="{
        top: (elm.top + cdt) + 'px',
        left: (elm.left + popupChild + viewModeLeft) + 'px'
      }">
      <div class="square" v-if="elm.type == 'braid-image'" :style="{cursor:'se-resize'}"></div>
    </div>

    <div class="verti-horiz"
      @mousedown="handlemousedown($event, 'top-right', 'left', 'top')"
      :style="{
        top: (elm.top + cdt) + 'px',
        left: (elm.left + elm.width + 5 + popupChild + viewModeLeft) + 'px'
      }">
      <div class="square" v-if="elm.type == 'braid-image'" :style="{cursor:'ne-resize'}"></div>
    </div>

    <div class="verti-horiz"
      @mousedown="handlemousedown($event, 'bottom-left', 'left','top')"
      :style="{
        top: (elm.top + cdt + elm.height) + 'px',
        left: (elm.left + popupChild + viewModeLeft) + 'px'
      }">
      <div class="square" v-if="elm.type == 'braid-image'" :style="{cursor:'ne-resize'}"></div>
    </div>

    <div class="verti-horiz"
      @mousedown="handlemousedown($event, 'bottom-right', 'left', 'top')"
      :style="{
        top: (elm.top + cdt + elm.height) + 'px',
        left: (elm.left + elm.width + 5 + popupChild + viewModeLeft) + 'px'
      }">
      <div class="square" v-if="elm.type == 'braid-image'" :style="{cursor:'se-resize'}"></div>
    </div>
    <!-- section-bottom -->
    <div class="horiz"
      @mousedown="handlemousedown($event, 'down', 'height')"
      :style="{
        width: ($store.state.page.width + 5) + 'px',
        top: (elm.top + elm.height) + 'px',
        height: '2px',
        left: (elm.left) + 'px',
        cursor:'ns-resize'
      }">
      <button class="insert-block btn btn-sm btn-primary" v-if="elm.type =='braid-section'" @click.stop="insertBlock()">INSERT BLOCK</button>
    </div>
	</div>
</template>

<script>
export default {
  data () {
    return {
      type: '' // Adjustment direction left | right | up | down
    }
  },

  computed: {
    elm () {
      var target = this.$store.state.activeElement
      if (!target.resizable) return ''
      return target
    },
    cdt () {
      let element = this.$store.state.widgets.filter(widget => {
        return widget.name === this.$store.state.activeElement.belong
      })
      if (element.length) {
        return element[0].top
      } else {
        return 0
      }
    },
    popupChild () {
      var target = this.$store.state.activeElement
      if(target.belong) {
        if (target.belong.split("-")[0] === 'popup') {
          if (this.$store.state.viewMode !== 0){
            let parent = this.$store.state.widgets.filter(i => i.name === target.belong)
            return parent[0].left
          } else {
            return 0
          }
        } else {
          return 0
        }
      }
    },
    viewModeLeft () {
      if (this.$store.state.viewMode === 0) {
        return (this.$store.state.page.width - 400 - 10)/2
      } else {
        return 0
      }
    }
  },

  methods: {
    handlemousedown (e, type, originX, originY) {
      e.stopPropagation()
      this.type = type
      this.$store.commit('initmove', {
        startX: e.pageX,
        startY: e.pageY,
        originX: this.elm[originX],
        originY: this.elm[originY],
        left: this.elm['left'],
        right: this.elm['left'] + this.elm['width'],
        top: this.elm['top'],
        bottom: this.elm['top'] + this.elm['height'],
        clientY: e.clientY
      })
      document.addEventListener('mousemove', this.handlemousemove, true)
      document.addEventListener('mouseup', this.handlemouseup, true)
    },

    handlemousemove (e) {
      e.stopPropagation()
      e.preventDefault()
      this.$store.commit('resize', {
        x: e.pageX,
        y: e.pageY,
        type: this.type
      })
    },

    handlemouseup (e) {
      document.removeEventListener('mousemove', this.handlemousemove, true)
      document.removeEventListener('mouseup', this.handlemouseup, true)
      this.$store.commit('stopmove', {
        x: e.pageX,
        y: e.pageY,
        flag: 1
      })
    },
    insertBlock () {
      this.$store.$emit('insertBlock', this.elm.name)
    }
  }
}
</script>

<style scoped>
.verti,
.horiz,
.verti-horiz {
  position: absolute;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.verti {
  width: 0;
  cursor: ew-resize;
}
.horiz {
  height: 0;
  cursor: ns-resize;
}
.verti-horiz {
  height: 0;
  width: 0;
}
.square {
  width: 10px;
  height: 10px;
  border: 1px solid #2196f3;
  background-color: #fff;
  flex-shrink: 0;
}
.insert-block {
  flex-shrink: 0;
  font-size: 12px;
}
</style>
