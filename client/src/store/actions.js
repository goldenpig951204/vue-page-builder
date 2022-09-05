export default {
  addWidget ({ state, commit, store }, item) {
    if (item.setting.isUpload) {
      store.$emit('upload', (payload) => {
        commit('addWidget', { data: payload, item })
        commit('select', {
          uuid: state.widgets[state.widgets.length - 1].uuid
        })
      }, true)
    } else {
      commit('addWidget', { item })
      // set the selected
      commit('select', {
        uuid: state.widgets[state.widgets.length - 1].uuid
      })
    }
  },
  save ({ state, store }) {
    store.$emit('save', state)
  },
  unselect ({state, commit, store}) {
    commit('select', {
      uuid: -1
    })
  }
}
