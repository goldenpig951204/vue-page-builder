<template>
  <div @mousedown.stop="">
    <b-modal ref="myModalRef" class="blockModal" size="lg" id="myModalRef" title="Please name your block">
      <div class="d-block text-left" style="height: 550px; overflow-y: auto">
        <div class="row" style="margin:0; height: 100%">
          <div class="col-md-3 sideblock">
            <div class="btn-group-vertical" style="width:100%">
              <button type="button" class="btn btn-light btn-block" @click="type = 1">BLOCKS</button>
              <button type="button" class="btn btn-light btn-block" @click="type = 0">POPUPS</button>
            </div>
          </div>
          <div class="col-md-9 contentblock">
            <div v-if="type">
              <div v-for="(block, index) in sectionBlocks" style="width:33%;display: inline-block;padding:10px" @click="blockAction(index)" v-if="block.type==='section'">
                <div class="block_container" :class="{ activeBlock: activeID == index}">
                  <img :src="block.image" style="width:100%;height:100px"/>
                  <p class="title text-center" style="border:1px solid #cccccc">{{block.name}}</p>
                </div>
              </div>
            </div>
            <div v-else>
              <div v-for="(block, index) in sectionBlocks" style="width:33%;display: inline-block;padding:10px" @click="blockAction(index)" v-if="block.type=='popup'">
                <div class="block_container" :class="{ activeBlock: activeID == index}">
                  <img :src="block.image" style="width:100%;height:100px"/>
                  <p class="title text-center" style="border:1px solid #cccccc">{{block.name}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="modal-footer" class="w-100">
        <div v-if="renameState">
          <input type="text" ref="rename" class="form-control blockname_input" v-model="rename" placeholder="Please change selected block name"/>
          <div style="float:right">
            <button class="btn btn-sm btn-primary" @click="renameBlock(activeID)">Save</button>
            <button class="btn btn-sm btn-danger" @click="renameState = 0">Cancel</button>
          </div>
        </div>
        <div v-else>
          <div style="float:right" v-if="activeID == -1">
            <button class="btn btn-danger btn-sm" @click="hideModal">Close</button>
          </div>
          <div style="float:right" v-else>
            <div class="btn-group">
              <button class="btn btn-sm btn-primary" @click="insertBlock(activeID)">Insert</button>
              <button class="btn btn-sm btn-success" @click="renameState = 1">Rename</button>
              <button class="btn btn-sm btn-warning" @click="deleteBlock(activeID)">Delete</button>
              <button class="btn btn-sm btn-danger" @click="activeID = -1">Back</button>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Service from '../../services/service.js'
import html2canvas from 'html2canvas'
const generate = require('nanoid/generate')
export default {
  data () {
    return {
      sectionBlocks: [],
      renameState: 0,
      activeID: -1,
      activeBlock: -1,
      rename: '',
      type: 1
    }
  },
  computed: {
    activeElement () {
      return this.$store.state.activeElement
    }
  },
  mounted () {
    let _this = this
    this.$store.$on('insertBlock', function(id){
      _this.showModal(id)
    })
  },
  methods: {
    showModal (i) {
      let _this = this
      this.activeBlock = i
      Service.getBlock().then(function(res){
        _this.sectionBlocks = res.data
        _this.$refs.myModalRef.show()
        _this.activeElement.z = 20;  
      })
    },
    blockAction (i) {
      this.activeID = i
    },
    /**************************** insert block *****************************/
    insertBlock (i) {
      let _this = this
      let data = {actionType: 'insert', id: _this.sectionBlocks[i].id}
      Service.actionBlock(data).then(res => {
        let widget = JSON.parse(_this.sectionBlocks[i].value)
        let payload = {state: _this.activeBlock, widget: widget, type: _this.sectionBlocks[i].type}
        _this.$store.commit('insertBlock', payload)
        _this.activeID = -1
      })
    },
    /**************************** rename block *****************************/
    renameBlock (i) {
      let _this = this
      let name = this.rename
      if (name === '') {
        this.$refs.rename.focus()
      } else {
        let data = {actionType: 'rename', id: _this.sectionBlocks[i].id , name: name}
        Service.actionBlock(data).then(res => {
          _this.sectionBlocks = res.data
          _this.renameState = 0
          _this.activeID = 0
        })
      }
    },
    /**************************** delete block *****************************/
    deleteBlock (i) {
      let _this = this
      let data = {actionType: 'delete',id: _this.sectionBlocks[i].id}
      Service.actionBlock(data).then(res => {
        _this.sectionBlocks = res.data
        _this.activeID = -1
      })
    },
    /****************************** hide modal ****************************/
    hideModal () {
      this.$refs.myModalRef.hide()
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
  .block_container:hover{box-shadow: 0 0 1px 3px #575757}
  .activeBlock{box-shadow: 0 0 1px 5px #f44444;}
  .blockname_input{width: 320px;display: inline-block;height:32px;}
  .blockModal.modal-body{
    padding:0 !important;
  }
  .blockModal .modal-dialog{margin-top:100px;}
  .sideblock{
    padding: 0;
    border-right: 1px solid #e9ecef;
  }
  .contentblock{
    padding:20px;
  }
  .sideblock button{
    border:1px solid #e9ecef;
    border-radius: 0
  }
  .modal-footer, .modal-header{padding:0.5rem;}
</style>