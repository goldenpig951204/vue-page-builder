var move = {
  methods: {
    initmovement (e) {
      var target = this.$store.state.activeElement

      // Set the initial state of the mobile state
      this.$store.commit('initmove', {
        startX: e.pageX,
        startY: e.pageY,
        originX: target.left,
        originY: target.top
      })

      // Binding mouse movement events
      document.addEventListener('mousemove', this.handlemousemove, true)
      //
      document.addEventListener('mouseover', this.handlemouseover, true)
      // Cancel mouse movement event
      document.addEventListener('mouseup', this.handlemouseup, true)
    },

    handlemousemove (e) {
      e.stopPropagation()
      e.preventDefault()
      this.$store.commit('move', {
        x: e.pageX,
        y: e.pageY
      })
    },

    handlemouseup (e) {
      document.removeEventListener('mousemove', this.handlemousemove, true)
      document.removeEventListener('mouseup', this.handlemouseup, true)
      this.$store.commit('stopmove', {
        x: e.pageX,
        y: e.pageY,
        flag: 0
      })
    }
  }
}

export { move }
