<template>
  <div>
    <i class="fa fa-code" @click="showModal">
    </i>
    <b-modal ref="myModalRef" title="Inline Style Editor">
      <div class="d-block text-left">
        <div>
          <label>width :</label>
          <input type="text" class="edit_input" v-model="activeElement.width"/>
        </div>
        <div>
          <label>border-width :</label>
          <input type="text" class="edit_input" v-model="activeElement.borderWidth"/>
        </div>
        <div>
          <label>border-color :</label>
          <input type="text" class="edit_input" v-model="activeElement.borderColor"/>
        </div>
      </div>
      <div slot="modal-footer" class="w-100">
        <div style="float:left">
          <button class="btn btn-success btn-sm">Reset To Default</button>
        </div>
        <div style="float:right">
          <button class="btn btn-primary btn-sm" @click="save">Save</button>
          <button class="btn btn-danger btn-sm" @click="hideModal">Cancel</button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
window.$ = require('jquery')
export default {
  data () {
    return {
    }
  },
  computed: {
    activeElement () {
      return this.$store.state.activeElement
    }
  },
  methods: {
    showModal () {
      this.$refs.myModalRef.show()
      this.activeElement.z = 20;
      document.querySelector('.guides+div').style.display="none";
    },
    save () {
      this.$refs.myModalRef.hide()
      this.activeElement.z = 1;
      document.querySelector('.guides+div').style.display="block";
    },
    hideModal () {
      this.$refs.myModalRef.hide()
      this.activeElement.z = 1;
      document.querySelector('.guides+div').style.display="block";
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