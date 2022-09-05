<template>
  <header class="header">
    <div class="navbar container grid-xl">
      <section class="logo navbar-section" style="">
        <icon :name="'fas fa-anchor'"/>
      </section>
      <section class="navbar-section">
        <a class="btn btn-link" @mousedown.stop="changeViewMode(1)"><icon :name="'fa fa-desktop'"/></a>
        <a class="btn btn-link" @mousedown.stop="changeViewMode(0)"><icon :name="'fa fa-mobile'"/></a>
        <a class="btn btn-link" @mousedown.stop="undo" v-if="$store.state.isEdit"><icon :name="'fas fa-undo'"/></a>
        <a class="btn btn-link" @mousedown.stop="redo" v-if="$store.state.isEdit"><icon :name="'fas fa-redo'"/></a>
        <a class="btn btn-link" @mousedown.stop="preview" v-if="$store.state.isEdit"><icon :name="'far fa-eye'"/>PREVIEW</a>
        <a class="btn btn-link" @mousedown.stop="preview" v-else><icon :name="'fa fa-edit'"/>BUILD</a>
        <a class="btn btn-link" @mousedown.stop="downloadExport" v-if="$store.state.isEdit"><icon :name="'fas fa-download'"/>EXPORT</a>
        <a class="btn btn-link" @mousedown.stop="save" v-if="$store.state.isEdit"><icon :name="'fa fa-save'"/>SAVE</a>
      </section>
    </div>
  </header>
</template>

<script>
import Service from '../../services/service.js'
export default {
  data () {
    return {
      loadState: -1
    }
  },
  updated () {
    this.addLink()
  },
  methods: {
    undo () {
      this.$store.state.activeElement = this.$store.state.page
      let keys = Object.keys(sessionStorage)
      let i = keys.length
      let widgets = []
      if ((this.loadState === -1) && (i !== 0)) {
        widgets = sessionStorage.getItem(keys[i - 1])
        this.loadState = i - 1
        this.$store.replaceState(JSON.parse(widgets))
      } else {
        if ((this.loadState > 1) && (this.loadState < i)) {
          widgets = sessionStorage.getItem(keys[this.loadState - 1])
          if(widgets){
            this.loadState -= 1
            this.$store.replaceState(JSON.parse(widgets))
          }
        }
      }
    },
    // redo
    redo () {
      this.$store.state.activeElement = this.$store.state.page
      let keys = Object.keys(sessionStorage)
      let i = keys.length
      let widgets = []
      if (this.loadState > -1 && this.loadState < i - 1) {
        widgets = sessionStorage.getItem(keys[this.loadState + 1])
        if(widgets){
          this.loadState += 1
          this.$store.replaceState(JSON.parse(widgets))
        }
      }
    },
    // save
    save () {
      this.$store.dispatch('save')
    },

    // duplicate
    copyWidget () {
      this.$store.commit('copy')
    },

    // delete
    dele () {
      this.$store.commit('delete')
    },
    preview () {
      if (this.$store.state.isEdit) {
        this.save()
        let route = this.$router.resolve({path: '/preview'});
        window.open(route.href, '_blank');
      } else {
        this.$router.push('builder')
        location.reload()
      }
    },
    downloadExport () {
      this.$store.dispatch('unselect').then((i,x) => {
        let _this = this
        setTimeout(delay, 200)
        function delay() {
          let Dom = document.documentElement.innerHTML
          let customStyle = _this.$store.state.styles
          let customScript = _this.$store.state.scripts
          /************ style file ***********/
          let style = Dom.split("<style type=\"text/css\">")
          style.splice(0,1)
          style = style.join(" ")
          style = style.split("</style>")
          let bodyHtml = style[style.length-1]
          style.splice(style.length-1, 1)
          style = style.join(" ")
          style = style.split("pointer-events: none").join(" ").split("height: calc(100% - 188px);").join("height: calc(100% - 61px);").split("outline: 1px solid #ddd !important;").join(" ")
          style +=".navbar{height:55px}"
          /************* style file ***********/
          /************* html file ************/
          let headHtml = "<!DOCTYPE html><html><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1.0\"><link rel=\"stylesheet\" href=\"https://use.fontawesome.com/releases/v5.3.1/css/all.css\" integrity=\"sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU\" crossorigin=\"anonymous\"><title>PAGE</title>"
          let externalFile = ""
          externalFile += "<link href=\"https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css\" type=\"text/css\" rel=\"stylesheet\"/>"
          externalFile += "<link href=\"./assets/style/style.css\" type=\"text/css\" rel=\"stylesheet\"/>"
          externalFile += "<link href=\"./assets/style/custom1.css\" type=\"text/css\" rel=\"stylesheet\"/>"
          externalFile += "<script src=\"https://code.jquery.com/jquery-3.3.1.min.js\" integrity=\"sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=\" crossorigin=\"anonymous\"><\/script>"
          externalFile += "<script src=\"https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js\"><\/script>"
          externalFile += "<script src=\"./assets/script/custom1.js\" type=\"text/javascript\"><\/script>"
          headHtml = headHtml + externalFile + "</head>"
          let html = headHtml + bodyHtml
          let header = html.split("<div class=\"menu-bar toolbar\">")[0] + "<div class=\"menu-bar toolbar\">"
          header = header.split("<div hidden=\"\" id=\"svgspriteit\">")[0] + "<div id=\"app\">" + header.split("<div id=\"app\">")[2]
          let content = "<div class=\"body grid-xl editContainer\">" + html.split("<div class=\"body grid-xl editContainer\">")[1]
          html = header + content
          html = html.split("<section class=\"navbar-section\">")[0] + "</div></header><div class=\"menu-bar toolbar\">" + html.split("<div class=\"menu-bar toolbar\">")[1]
          html = html.split("contenteditable=\"true\"").join("contenteditable=\"false\"").split(" <i class=\"fa fa-trash pull-right\"></i> <i class=\"fa fa-edit pull-right\"></i> ").join("").split("<script type=\"text/javascript\" src=\"/app.js\"><\/script>").join("<script type=\"text/javascript\" src=\"./assets/script/app.js\"><\/script><link href=\"./assets/style/custom2.css\" type=\"text/css\" rel=\"stylesheet\"/><script src=\"./assets/script/custom2.js\" type=\"text/javascript\"><\/script>")
          if (!_this.$store.state.viewMode) {
            html = html.split("<div class=\"\">").join("<div class=\"mobile-device\"><img src=\"./assets/image/iphone-preview.svg\" style=\"width: 472px;\"/></div><div class=\"mobilePreview\">")
          }
          /************* html file ************/
          /********** javascript file *********/ 
          let state = JSON.stringify(_this.$store.state)
          let javascript = `$(document).ready(function(){
            var state = ` + state + `
            var timers = state.widgets.filter(i => {
              return i.type === 'braid-timer'
            })
            setInterval(Countdown, 1000)
            function Countdown(){
              for (i = 0; i < timers.length; i++) {
                var timer = timers[i]
                var now = new Date().getTime();
                var remain = 0;
                var end = timer.end;
                if(end > now) {
                  remain = end - now;
                  var day = Math.floor(remain / (1000 * 60 * 60 * 24))
                  var hour = Math.floor(remain % (1000 * 60 * 60 *24) / (1000 * 60 * 60));
                  var minute = Math.floor(remain % (1000 * 60 *60) / (1000 * 60))
                  var second = Math.floor(remain % (1000 * 60) / (1000))
                  var dp_day = day < 10 ? '0' + day : day;
                  var dp_hour = hour < 10 ? '0' + hour : hour;
                  var dp_minute = minute < 10 ? '0' + minute : minute;
                  var dp_second = second < 10 ? '0' + second : second;
                  $("#"+timer.uuid+" .timer_content .mark").eq(0).children("span").text(dp_day)
                  $("#"+timer.uuid+" .timer_content .mark").eq(1).children("span").text(dp_hour)
                  $("#"+timer.uuid+" .timer_content .mark").eq(2).children("span").text(dp_minute)
                  $("#"+timer.uuid+" .timer_content .mark").eq(3).children("span").text(dp_second)
                }
              }
            }
            $('button').click(function(){
              var btnId = $(this).attr('id')
              var btnObj = state.widgets.filter(i => i.uuid === btnId)
              var popUp = state.widgets.filter(i => i.buttonID === btnId)
              console.log(state.widgets)
              console.log(popUp)
              if (btnObj.length) {
               if (btnObj[0].link_url !== ''){
                if (btnObj[0].new_tab) {
                  window.open(btnObj[0].link_url,'_blank')
                } else {
                  window.open(btnObj[0].link_url, '_self')
                }
               } else if (popUp.length) {
                var popId = popUp[0].uuid
                $('#'+popId).slideDown(400)
               }
              }
            })
            $('.popup .popup_header').click(function(){
              $(this).parents('.popup').hide(400)
            })
            $('.popup .popup_content button').click(function(){
              var btnId = $(this).attr('id')
              var closeBtn[0] = state.filter(i => i.uuid === btnId)
              var modalID = closeBtn[0].modalID
              if (modalID) {
                $('#'+modalID).slideDown(400)
              }  
            })
          })`
          /********** javascript file *********/
          let data = {html: html, javascript: javascript, css: style, custom: {scripts: customScript,styles: customStyle}}      
          Service.download(data)
        }
      })
    },
    addLink () {
      if (!this.$store.state.isEdit){
        if (document.getElementById('Hscript') === null) {
          let Hscript = document.createElement('script')
          let Bscript = document.createElement('script')
          let Hstyle = document.createElement('style')
          let Bstyle = document.createElement('style')
          Hscript.setAttribute('id', 'Hscript')
          Bscript.setAttribute('id', 'Bscript')
          Hstyle.setAttribute('id', 'Hstyle')
          Bstyle.setAttribute('id', 'Bstyle')
          Hscript.innerText = this.$store.state.scripts[0].script
          Bscript.innerText = this.$store.state.scripts[1].script
          Hstyle.innerText = this.$store.state.styles[0].style
          Bstyle.innerText = this.$store.state.styles[1].style
          document.head.appendChild(Hstyle)
          document.head.appendChild(Hscript)
          document.body.appendChild(Bstyle)
          document.body.appendChild(Bscript)
        } else {
          document.getElementById('Hscript').innerText = this.$store.state.scripts[0].script
          document.getElementById('Bscript').innerText = this.$store.state.scripts[1].script
          document.getElementById('Hstyle').innerText = this.$store.state.styles[0].style
          document.getElementById('Bstyle').innerText = this.$store.state.styles[1].style
        }
      }
    },
    changeViewMode (index) {
      if (this.$store.state.viewMode === -1) {
        if (index) {
          this.$store.state.widgets.forEach((i,j) => {
            i.desktopStyle.width = i.width
            i.desktopStyle.left = i.left
          })
        } else {
          this.$store.state.widgets.forEach((i, j) => {
            i.width = i.mobileStyle.width
            i.left = i.mobileStyle.left
          })
        }
      } else if (this.$store.state.viewMode === 1) {
        if (index) {
          return
        } else {
          this.$store.state.widgets.forEach((i, j) => {
            i.desktopStyle.width = i.width
            i.desktopStyle.left = i.left
            i.width = i.mobileStyle.width
            i.left = i.mobileStyle.left
            if (i.index === 'popup') {
              i.left = 0
            }
          })
        }
      } else if (this.$store.state.viewMode === 0){
        if (index) {
          this.$store.state.widgets.forEach((i, j) => {
            i.mobileStyle.width = i.width
            i.mobileStyle.left = i.left
            i.width = i.desktopStyle.width
            i.left = i.desktopStyle.left
          })
        } else {
          return
        }
      }
      this.$store.state.viewMode = index
    }
  },
  computed: {
    show () {
      return this.$store.state.type !== 'page'
    }
  }
}
</script>

<style lang="scss">
@import '../_variables.scss';
.header {
  background-color: #24292e;
  padding: 0;
}
.navbar {
  .svg-icon {
    svg {
      vertical-align: middle;
    }
  }
  .btn.btn-link {
    color: $gray-color;
    margin-right: 15px;
  }
  .btn.btn-link:hover {
    color: $light-color;
    vertical-align:top;
  }
  .logo {
    color:white;
    font-size: 20px;
    .svg-icon {
      width: 30px;
      text-align: center;
      background-color: $light-color;
      border-radius: 50%;
    }
  }
}
</style>
