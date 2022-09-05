var widgets
const install = (Vue, config = {}) => {
  if (install.installed) return
  widgets = Object.assign({}, config.widgets)
  Object.keys(widgets).forEach(key => {
    Vue.component(key, widgets[key])
  })
}

export default {
  install,
  getWidgets () {
    return widgets
  }
}
