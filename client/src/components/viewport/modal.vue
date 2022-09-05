<template>
  <div @mousedown.stop="">
    <b-modal ref="myModalRef" id="myModalRef" title="Please name your block">
      <div class="d-block text-left">
        <input type="text" ref="myText" class="form-control" placeholder="Block name" v-model="blockName" required/>
      </div>
      <div slot="modal-footer" class="w-100">
        <div style="float:right">
          <button class="btn btn-primary btn-sm" @click="save">Save</button>
          <button class="btn btn-danger btn-sm" @click="hideModal">Cancel</button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Service from '../../../services/service.js'
import html2canvas from 'html2canvas'
export default {
  data () {
    return {
      blockName: '',
      isModal: 0,
      type: 'section',
    }
  },
  computed: {
    activeElement () {
      return this.$store.state.activeElement
    }
  },
  methods: {
    showModal (type) {
      this.type = type
      this.$refs.myModalRef.show()
      this.activeElement.z = 20;
      document.querySelector('.guides+div').style.display="none";
    },
    save () {
      // saving html to png
        if (this.blockName === '') {
          this.$refs.myText.focus()
        } else {
          let node = document.getElementById(this.$store.state.activeElement.uuid)
          let screenShot = ''
          let _this = this
          _this.$refs.myModalRef.hide()
          document.querySelector('.guides+div').style.display="block";
          _this.activeElement.z = 0;
          html2canvas(node).then(function(canvas){
            screenShot = canvas.toDataURL("image/png");
            let data = [] 
            data.push(_this.$store.state.widgets.filter(section => {
              return section.name === _this.activeElement.name
            })[0])
            let childCom = _this.$store.state.widgets.filter(section => {
              return section.belong === _this.activeElement.name
            })
            data ={type: _this.type, data: data.concat(childCom)} 

            let payload = {blockname: _this.blockName, image: screenShot, data: data}
            Service.saveBlock(payload)
          })
        }      
    },
    hideModal () {
      this.$refs.myModalRef.hide()
      document.querySelector('.guides+div').style.display="block";
      this.activeElement.z = 0;
    }
  }
}
</script>
<style>
  .modal{color:#333333;}
  .modal:hover{color:#333333;}
  .edit_input{width:200px !important;display:inline-block !important;border-top-style: none !important;border-left-style: none !important;border-right-style: none!important;}
  .edit_input:focus{box-shadow: 0 0 0!important; border-color:blue !important;}
</style>