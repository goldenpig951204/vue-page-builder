const generate = require('nanoid/generate')

export default {
  // Check component and uncheck
  select (state, payload) {
    state.uuid = payload.uuid
    if (payload.uuid === -1) {
      state.activeElement = state.page
      state.type = 'page'
    } else {
      let widget = state.widgets.find(w => w.uuid === state.uuid)
      state.activeElement = widget
      state.type = widget.type
    }
  },

  // Set the initial value of the mousemove operation
  initmove (state, payload) {
    state.startX = payload.startX
    state.startY = payload.startY
    state.originX = payload.originX
    state.originY = payload.originY
    state.top = payload.top
    state.bottom = payload.bottom
    state.left = payload.left
    state.right = payload.right
    state.moving = true
  },

  // End of component movement
  stopmove (state, payload) {
    state.moving = false
    let target = state.activeElement
    // if activeElement is child component
    if (target.belong !== 'page') {
      if (payload.flag === 1) return
      let target = state.activeElement
      let dx = payload.x - state.startX
      let dy = payload.y - state.startY
      let left = state.originX + Math.floor(dx * 100 / state.zoom)
      let top = state.originY + Math.floor(dy * 100 / state.zoom)
      let sections = state.widgets.filter(widget => widget.type === 'braid-section')
      let container = state.widgets.filter(widget => widget.name === target.belong)
      let popup = state.widgets.filter(popup => popup.name === target.belong && popup.name.split('-')[0] === 'popup')
      if(target.belong !== undefined){
        if (target.belong.split('-')[0] === 'section') {
        /************* if activeElement is child of section ***************/
          if (state.viewMode === 0) {
            target.left = (left <=10 ? 10 : (((left + target.width) < (400 -10)) ? left : (400 - target.width - 10)))
          } else {
            target.left = (left <=10 ? 10 : (((left + target.width) < (state.page.width -20)) ? left : (state.page.width - target.width - 20)))
          }
          for (let i = 0; i < sections.length; i++) {
            let parentTop = container.length === 0 ? 0 : container[0].top
            if (sections[i].top < (parentTop + top) && (parentTop + top) < (sections[i].top + sections[i].height)) {
              if (parentTop - sections[i].top === 0) continue
              top = top + parentTop - sections[i].top
              target.belong = sections[i].name
              target.top = top
            }
          }
        } else {
        /*************** if activeElement is child of popup ***************/
          target.left = (left <= 10 ? 10 : ((left + target.width) < (popup[0].width -10) ? left : (popup[0].width - target.width - 10)))
          target.top = (top <= 25 ? 25 : ((top + target.height) < (popup[0].height - 10) ? top : (popup[0].height - target.height - 10)))
        }
      }
    }
    sessionStorage.setItem('store-' + Date.now(), JSON.stringify(state))
  },

  // Moving component
  move (state, payload) {
    let target = state.activeElement
    let dx = payload.x - state.startX
    let dy = payload.y - state.startY
    let left = state.originX + Math.floor(dx * 100 / state.zoom)
    let top = state.originY + Math.floor(dy * 100 / state.zoom)
    if (target.belong === 'page') {
      target.top = top > 0 ? top : 0
    } else {
      if(target.belong !== undefined){
        if (target.belong.split('-')[0] === 'section') {
          /*********** if parent is section **************/
          target.top = top
          if (state.viewMode === 0) {
          target.left = (left <=10 ? 10 : ((left + target.width) < 400 - 10) ? left : (400 - target.width - 10)) 
          } else {
            target.left = (left <=10 ? 10 : ((left + target.width) < state.page.width - 20) ? left : (state.page.width - target.width - 20))
          }
          state.activeElement = ((left + target.width) >= (state.page.width -20) ? state.page : target)
        } else {
          /*********** if parent is popup ***************/
          let popup = state.widgets.filter(i => i.name === target.belong)
          if (state.viewMode === 0) {
          target.left = (left <=10 ? 10 : ((left + target.width) < 400 - 20) ? left : (400 - target.width - 10)) 
          } else {
            target.left = (left <= 10 ? 10 : (((left + target.width) < (popup[0].width - 10)) ? left : (popup[0].width - target.width -10)))
          }
          target.top = (top <= 25 ? 25 : (((top + target.height) < (popup[0].height - 10)) ? top : (popup[0].height - target.height -10)))
        }
      }
    }
  },

  // Adjust component size
  resize (state, payload) {
    let dx = payload.x - state.startX
    let dy = payload.y - state.startY
    let value
    if (payload.type === 'right') {
      value = state.originX + Math.floor(dx * 100 / state.zoom)
      if (state.activeElement.type === 'braid-timer') {
        state.activeElement.width = value >= 370 ? value : 370
      } else if (state.activeElement.type === 'braid-popup') {
        if (state.viewMode !== 0) {
          state.activeElement.width = value <= 800 ? value : 800
          state.activeElement.left = (state.page.width - state.activeElement.width) / 2
        } else {
          state.activeElement.width = value <= 400 ? value : 400
          state.activeElement.left = (400 - state.activeElement.width) / 2
        }
      } else {
        state.activeElement.width = value > 10 ? value : 10
      }
      return
    }

    if (payload.type === 'down') {
      value = state.originX + Math.floor(dy * 100 / state.zoom)
      if (state.activeElement.type === 'braid-timer') {
        state.activeElement.height = value >= 112 ? value : 112
      } else if (state.activeElement.type === 'braid-popup') {
        state.activeElement.height = value <= 600 ? value : 600
        let sections = state.widgets.filter(i => { return i.index === 'section'})
        let height = 0
        sections.forEach(i => {
          height += i.height
        })
        state.activeElement.top = (height - state.activeElement.height) / 2
      }else {
        state.activeElement.height = value > 10 ? value : 10
      }
      if (state.activeElement.belong === 'page' && state.activeElement.index === 'section') {
        let top = 0
        for (let i = 0; i < state.widgets.length; i++) {
          if (state.widgets[i].belong === 'page') {
            state.widgets[i].top = top
            }
        }
      }
      return
    }

    if (payload.type === 'left') {
      let left = state.originX + Math.floor(dx * 100 / state.zoom)
      let width = state.originY - Math.floor(dx * 100 / state.zoom)
      state.activeElement.left = left > 0 ? left : 0
      if (state.activeElement.type === 'braid-timer') {
        state.activeElement.width = width >= 379 ? width : 370
      } else if (state.activeElement.type === 'braid-popup') {
        if (state.viewMode !== 0) {
          state.activeElement.width = width <= 800 ? width : 800
          state.activeElement.left = (state.page.width - state.activeElement.width) / 2
          state.activeElement.right = state.activeElement.left + state.activeElement.width
        } else {
          state.activeElement.width = width <= 380 ? width : 380
          state.activeElement.left = (400 - state.activeElement.width) / 2
          state.activeElement.right = state.activeElement.left + state.activeElement.width
        }
      } else {
        state.activeElement.width = width > 10 ? width : 10
      }
      return
    }

    if (payload.type === 'up') {
      let top = state.originX + Math.floor(dy * 100 / state.zoom)
      let height = state.originY - Math.floor(dy * 100 / state.zoom)
      state.activeElement.top = top > 0 ? top : 0
      state.activeElement.height = height >= 112 ? height : 112
      if (state.activeElement.type === 'braid-timer') {
        state.activeElement.height = height >= 112 ? height : 112
      } else {
        state.activeElement.height = height > 10 ? height : 10
      }
      return
    }

    if (payload.type === 'top-left') {
      let top = payload.y - state.startY + state.top
      let height = state.bottom - top
      let width = state.activeElement.width / state.activeElement.height * height
      let left = state.activeElement.left + (state.activeElement.width - width)
      state.activeElement.top = top > 0 ? top : 0
      state.activeElement.left = left
      state.activeElement.width = width > 10 ? width : 10
      state.activeElement.height = height > 10 ? height : 10
      return
    }

    if (payload.type === 'top-right') {
      let top = payload.y - state.startY + state.top
      let left = state.left
      let height = state.bottom - top
      let width = state.activeElement.width / state.activeElement.height * height
      state.activeElement.top = top > 0 ? top : 0
      state.activeElement.left = left
      state.activeElement.width = width > 10 ? width : 10
      state.activeElement.height = height > 10 ? height : 10
      return
    }

    if (payload.type === 'bottom-left') {
      let top = state.top
      let height = payload.y - state.startY + state.bottom - state.top
      let width = state.activeElement.width / state.activeElement.height * height
      let left = state.activeElement.left + (state.activeElement.width - width)
      state.activeElement.top = top > 0 ? top : 0
      state.activeElement.left = left
      state.activeElement.width = width > 10 ? width : 10
      state.activeElement.height = height > 10 ? height : 10
      return
    }

    if (payload.type === 'bottom-right') {
      let top = state.top
      let height = payload.y - state.startY + state.bottom - state.top
      let width = state.activeElement.width / state.activeElement.height * height
      let left = state.left
      state.activeElement.top = top > 0 ? top : 0
      state.activeElement.left = left
      state.activeElement.width = width > 10 ? width : 10
      state.activeElement.height = height > 10 ? height : 10
      return
    }
  },

  // Copy component
  copy (state, payload) {
    if (state.type !== 'page') {
      let copy = Object.assign({}, state.activeElement, {top: state.top, uuid: generate('1234567890abcdef', 10)})
      // addition
      let top = 0
      copy.top = top
      // Since the name of the container must be unique, the copy container needs to be processed.
      if (state.activeElement.isContainer) {
        state.widgets.forEach(widget => {
          if (widget.isContainer && widget.index === 'section') {
            top += widget.height
          }
        })
        copy.top = top
        let name = state.activeElement.name
        if (name) {
          // Set the name of the container copy
          let copyName = name.split('-')[0] + '-' + (parseInt(state.counter) + 1)
          copy.name = copyName
          // Copy images and text inside the container
          for (let i = 0, len = state.widgets.length; i < len; i++) {
            if (state.widgets[i].belong === name) {
              state.widgets.push(
                Object.assign({}, state.widgets[i], { belong: copyName, uuid: generate('1234567890adcdef', 10) })
              )
            }
          }
          state.counter += 1
        }
      }
      state.widgets.push(copy)
      sessionStorage.setItem('store-' + Date.now(), JSON.stringify(state))
    }
  },

  // Update component initial top value
  updateSrollTop (state, top) {
    state.top = top
  },

  // Page zoom
  zoom (state, val) {
    state.zoom = val
  },

  // Initialize the selected object
  initActive (state) {
    state.activeElement = state.page
  },

  // Delete selected component
  delete (state) {
    let type = state.type
    if (type === 'page') return

    // If the container is deleted, the internal components must be deleted together.
    let uuid = state.activeElement.uuid
    for (let i = 0; i < state.widgets.length; i++) {
      if (state.widgets[i].uuid === uuid) {
        if (state.activeElement.isContainer) {
          // if activeElement is container
          for (let j = 0; j < state.widgets.length; j++) {
            if (state.widgets[j].belong === state.activeElement.name) {
              state.widgets.splice(j, 1)
            }
          }
          state.widgets.splice(i, 1)
        } else {
          state.widgets.splice(i, 1)
        }
      }
    }
    // Delete component
    // Reset activeElement
    state.activeElement = state.page
    // state.type = 'page'
    state.uuid = -1
    sessionStorage.setItem('store-' + Date.now(), JSON.stringify(state))
  },

  // Add component
  addWidget (state, { data: data = null, item }) {
    let section = {type: 'braid-section', isContainer: true, isUpload: false, hasGuide: true, isChild: true, dragable: false, resizable: true, name: 'section-0', width: 1500, height: 600, left: 0, top: 0, bgColor: '#c363b7', backPic: '', backPicUrl: '', realUrl: '',index: 'section', borderColor: '', borderWidth: 0, borderStyle: 'solid', belong: 'page', eventState: 0, mobileStyle: {width: 400,height:600, top: 0, left: 0},desktopStyle: {width:1500, height: 600, top: 0, left: 0}}
    let def = { top: state.top, uuid: generate('1234567890abcdef', 10) }
    section = Object.assign(section, { uuid: generate('1234567890abcdef', 10) + '0' })
    let sections = state.widgets.filter(widget => { return widget.index === 'section' })
    let setting = JSON.parse(JSON.stringify(item.setting))
    let popups = state.widgets.filter(popup => popup.index === 'popup')
    let popup = state.widgets.filter(popup => popup.index === 'popup' && popup.isOpen === 1)
    if (data) {
      setting.backPic = data[0].url
      setting.realUrl = data[0].realUrl
    }
    if (setting.belong !== 'page') {
    /************* if child element **************/
      setting.width = (state.viewMode !== 0) ? setting.desktopStyle.width : setting.mobileStyle.width
      if (sections.length) {
        /********** if current section is not empty *************/
        if (state.isSection) {
          /************ if parent element is section ************/
          setting.belong = sections[0].name
          state.widgets.push(Object.assign(setting, def))
        } else {
          /************ if parent element is popup **************/
          if (state.activeElement.index === 'popup') {
            setting.belong = state.activeElement.name
            state.widgets.push(Object.assign(setting, def))
          } else {
            setting.belong = popup[0].name
            state.widgets.push(Object.assign(setting, def))
          }
        }
      } else {
        /************* if parent element is empty ***************/
        if (state.viewMode === 0) {
          section.width = 400
        } else {
          section.width = screen.width + 10
        }
        state.widgets.push(section)
        state.widgets.push(Object.assign(setting, def))
      }
    } else if (setting.index === 'section') {
    /************** if section element **************/
      let top = 0
      if (sections.length) {
        state.counter += 1
        sections.forEach(i => {
          top += i.height
        })
        let name = 'section-' + (parseInt(state.counter) + 1)
        def.top = top
        setting.name = name
      }
      if (state.viewMode === 0) {
          setting.width = 400
        } else {
          setting.width = screen.width + 10
        }
      state.widgets.push(Object.assign(setting, def))
    } else if (setting.index === 'popup') {
    /*************** if popup element ***************/
      let top = (state.page.height - setting.height)/2
      let left = 0
      if (state.viewMode !== 0) {
        left = (screen.width - setting.width)/2
      } else {
        setting.width = 400
      }
      if (popups.length) {
        state.counter += 1
      } 
      let name = "popup-" + (parseInt(state.counter) + 1)
      def.top = top
      def.left = left
      setting.name = name
      state.widgets.push(Object.assign(setting, def))
    }
    sessionStorage.setItem('store-' + Date.now(), JSON.stringify(state))
  },

  // Replace picture
  replaceImage (state, payload) {
    state.activeElement.width = payload[0].width
    state.activeElement.backPic = payload[0].url
  },

  // Add container background image
  addContainerBackPic (state, payload) {
    state.activeElement.backPic = payload[0].url
    state.activeElement.backPicUrl = payload[0].src
    state.activeElement.width = payload[0].width
    state.activeElement.height = payload[0].height
  },

  // Add background image
  addBackPic (state, payload) {
    state.activeElement.backPic = payload[0].url
    state.activeElement.backPicUrl = payload[0].src
    state.activeElement.realUrl = payload[0].realUrl
  },

  // Add animation
  addAnimation (state) {
    state.animation.push({
      name: '',
      duration: 3,
      delay: 0,
      iteration: 1,
      timing: 'linear',
      direction: 'normal',
      fill: 'none',
      keyframes: [
        {
          stop: 0,
          css: ''
        }
      ]
    })
  },

  // Add a keyframe to the animation
  addkeyframe (state, name) {
    state.animation.map(val => {
      if (val.name === name) {
        val.keyframes.push({
          stop: 0,
          css: ''
        })
      }
    })
  },

  // Animation playback and stop
  setAnimation (state, status) {
    state.playState = status
  },

  // update data
  updateData (state, {uuid, key, value}) {
    let widget = state.widgets.find(w => w.uuid === uuid)
    widget[key] = value
  },
  // update container
  updateContainer (state, data) {
    state.widgets = data
  },
  // insert blokc
  insertBlock (state, data) {
    let _state = state
    let name = ''
    let top = 0
    let widgets
    state.counter++
    if (data.type === 'section') {
      /******************** if block is section ********************/
        name = 'section-' + state.counter
        if (data.state === 0) {
          let originSections = _state.widgets.filter(i => i.belong === 'page' && i.index === 'section')
          if (originSections.length === 0){
            top = 0
          } else {
            top = originSections[originSections.length -1].top + originSections[originSections.length - 1].height        
          }
          data.widget.forEach(i => {
            i.uuid = generate('1234567890abcdef', 10)
            if (i.belong === 'page') {
              i.name = name
              i.top = top
            } else {
              i.belong = name 
            }
            _state.widgets.push(i)
          })
        } else {
          let top = 0
          data.widget.forEach(i => {
            i.uuid = generate('1234567890abcdef', 10)
            if (i.belong === 'page') {
              _state.counter += 1
              i.name = name
            } else {
              i.belong = name 
            }
          })
          let sections = state.widgets.filter(i => i.belong === 'page' && i.index === 'section')
          let childs = state.widgets.filter(i => i.belong !== 'page' && i.belong !== data.state)
          let newSection = data.widget.filter(i => i.belong === 'page')
          let newChilds = data.widget.filter(i => i.belong !== 'page')
          sections.forEach((i, index) => {
            if (i.name === data.state) {
              sections[index] = newSection[0]
            }
            sections[index].top = top
            top += sections[index].height
          })
          widgets = sections.concat(childs.concat(newChilds))
          _state.widgets = widgets
        } 
    } else if (data.type === 'popup' && state.activeElement.type === 'braid-button') {
      /********************* if block is pop up ********************/
      name = 'popup-' + state.counter
      data.widget.forEach(i => {
        i.uuid = generate('1234567890abcdef', 10)
        if (i.belong === 'page') {
          i.name = name
          i.isOpen = 0
          i.buttonID = state.activeElement.uuid
        } else {
          i.belong = name
        }
        _state.widgets.push(i)
      })
    }
  }
}
