<template>
	<div class="edit-bar hline" v-if="activeElement.uuid==parentID">
		<div class="primary-bar" v-if="tab==1">
			<button class="menu-btn" @mousedown.stop="deleteElement()"><i class="fa fa-trash"></i></button>
			<button class="menu-btn" @mousedown.stop="copyElement()"><i class="fa fa-clone"></i></button>
			<button class="menu-btn" @mousedown.stop="arrangeElement()"><i class="fa fa-layer-group"></i></button>
			<button class="menu-btn" @mousedown.stop="codeElement()"><modal :activeElement="activeElement"/></button>
			<button class="menu-btn" @mousedown.stop="editElement()" style="width:60px;">EDIT</button>
		</div>
		<div class="secondary-bar" v-if="tab==2">
			<button class="menu-btn" @mousedown.stop="downLayer()" :class="{'disable':(activeElement.z==20)}"><i class="fa fa-arrow-up"></i></button>
			<button class="menu-btn" @mousedown.stop="upLayer()" :class="{'disable':(activeElement.z==0)}"><i class="fa fa-arrow-down"></i></button>
			<button class="menu-btn" @mousedown.stop="doneElement()">DONE</button>
		</div>
		<div class="third-bar" v-if="tab==3" @mousedown.stop="">
			<input type="color" v-model="activeElement.borderColor"/><span>Border</span>
			<input type="number" v-model="activeElement.borderWidth" min="1" style="width:60px;display: inline-block;padding-right:20px"/><span style="position: absolute;top:12px;left:130px;color:#444">px</span>
			<button class="menu-btn" @mousedown.stop="doneElement()">SAVE</button>
		</div>
	</div>
</template>
<script>
import Modal from './modal.vue'
export default{
	data(){
		return {
			tab: 1,
		}
	},
	props : {
		parentID : String,
	},
	computed : {
		activeElement () {
      		return this.$store.state.activeElement
    	}
	},
	methods : {
		// when click delete button
		deleteElement(e){
			this.$store.commit('delete')
		},
		// when click copy button
		copyElement(e){
			this.$store.commit('copy')
		},
		// when click arrange button
		arrangeElement(e){
			this.tab = 2;
		},
		// when click code button
		codeElement(e){
		},
		// when click edit button
		editElement(e){
			this.tab = 3;
		},
		// z-index up
		upLayer(e){
			if(this.activeElement.z<20){
				this.$store.state.activeElement.z++;
			}
		},
		// z-index down
		downLayer(e){
			if(this.activeElement.z>1){
				this.$store.state.activeElement.z--;
			}
		},
		// when finish setting
		doneElement(e){
			this.tab = 1;
		},
	},
	components: {Modal}
}
</script>
<style>
	.edit-bar.hline{
		position: absolute;
		display:inline-block;
		background-color: #000;
		color:white;
		padding:5px 10px;
		top:-50px;
		font-size:15px;
		left:0;
		line-height: 1.5;
		text-align: center;
	}
	.edit-bar .menu-btn{
		background-color: #00000000;
    	border: none;
    	width:40px;
    	color: #ccc;
    	padding: 8px;
	}
	.edit-bar .menu-btn:hover,.edit-bar .menu-btn:focus{
		color: #ffffff;
	}
	.disable{
		color: #777777 !important;
	}
	.hline .primary-bar{width:240px;}
	.hline .third-bar{width:200px;}
	.dropdown{
	    position: absolute;
	    width: 100px;
	    color: black;
	    top: 50px;
	    margin-left: -30px;
	    background: white;
	    z-index: 100;
	    box-shadow: 0px 0px 5px 0px #101010;
	    max-height: 400px;
	    overflow-y: auto;
	    padding:0px;
	}
	.dropdown li{
		padding:10px;
		display:block;
		text-align: center;
		list-style: none;
		border-bottom:1px solid #ddd;
	}
	.dropdown li:hover{
		background-color:#000000;
		color:#ffffff;
	}
</style>
</template>