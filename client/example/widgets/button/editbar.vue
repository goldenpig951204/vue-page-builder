<template>
	<div class="edit-bar button" v-if="activeElement.uuid==parentID">
		<div class="primary-bar" v-if="tab==1">
			<button class="menu-btn" @mousedown.stop="deleteElement()"><i class="fa fa-trash"></i></button>
			<button class="menu-btn" @mousedown.stop="copyElement()"><i class="fa fa-clone"></i></button>
			<button class="menu-btn" @mousedown.stop="arrangeElement()"><i class="fa fa-layer-group"></i></button>
			<button class="menu-btn" @mousedown.stop="tab=4" v-if="!activeElement.isModalbtn"><i class="fa fa-link"></i></button>
			<button class="menu-btn" @mousedown.stop="codeElement()"><modal/></button>
			<button class="menu-btn" @mousedown.stop="editElement()">EDIT</button>
		</div>
		<div class="secondary-bar" v-if="tab==2">
			<button class="menu-btn" @mousedown.stop="downLayer()" :class="{'disable':(activeElement.z==20)}"><i class="fa fa-arrow-up"></i></button>
			<button class="menu-btn" @mousedown.stop="upLayer()" :class="{'disable':(activeElement.z==0)}"><i class="fa fa-arrow-down"></i></button>
			<button class="menu-btn" @mousedown.stop="doneElement()">DONE</button>
		</div>
		<div class="third-bar" v-if="tab==3">
			<button class="menu-btn" @mousedown.stop="doneElement()" style="width:50px">DONE</button>
		</div>
		<div class="fourth-bar" v-if="tab==4">
			<button class="menu-btn" @mousedown.stop="tab=1" style="width: 50px">BACK</button>
			<ul class="dropdown">
				<li @mousedown.stop="btnLink()">Outside URL</li>
				<li @mousedown.stop="popup()">Pop Up</li>
			</ul>
		</div>
		<div class="five-bar" v-if="tab==5" @mousedown.stop="">
			<input type="text" placeholder="http://" v-model="link_url" style="width:200px;display: inline-block; margin-right:10px;"/>
			<switches v-model="activeElement.new_tab" theme="bootstrap" color="primary" style="vertical-align: middle"></switches>
			<span>New Tab</span>
			<button class="menu-btn" @mousedown.stop="doneLink()">DONE</button>
		</div>
	</div>
</template>
<script>
import popup from '../popup/index.vue'
import Modal from './modal.vue'
import Switches from 'vue-switches'
export default{
	data(){
		return {
			tab: 1,
			link_url: '',
			comp: popup
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
	mounted(){
	},
	created(){
	},
	methods : {
		// when click delete button
		deleteElement(){
			this.$store.commit('delete')
		},
		// when click copy button
		copyElement(){
			this.$store.commit('copy')
		},
		// when click arrange button
		arrangeElement(){
			this.tab = 2;
		},
		// when click code button
		codeElement(){
		},
		// when click edit button
		editElement(){
			this.tab = 3;
			this.$store.state.toolbarIndex = 2;
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
			this.$store.state.toolbarIndex = 1;
		},
		popup(){
			let myPopup = this.$store.state.widgets.filter(i => i.buttonID === this.parentID)
			if (!myPopup.length) {
				this.comp.setting.buttonID = this.parentID
				this.comp.setting.isOpen = 1
				this.$store.dispatch('addWidget', this.comp)
				this.$store.state.isSection = 0
			} else {
				myPopup[0].isOpen = 1
				let pop = this.$store.state.widgets.filter(i => {
					return i.buttonID === this.parentID
				})
				this.$store.commit('select',pop[0])
				this.$store.state.isSection = 0
			}
			this.tab = 1;
		},
		// when set button action
		btnLink(e){
			this.tab = 5;		
		},
		doneLink(){
			this.tab = 1;
			this.$store.state.activeElement.link_url = this.link_url;
		}
	},
	components: {Modal,Switches}
}
</script>
<style>
	.edit-bar{
		position: absolute;
		display:inline-block;
		background-color: #000 !important;
		color:white;
		padding:5px 10px;
		top:-50px;
		font-size:15px;
		left:0;
		line-height: 1.5;
		text-align: center;
	}
	.edit-bar .menu-btn{
		background-color: #00000000 !important;
    	border: none;
    	width:44px;
    	color: #ccc;
    	padding: 8px;
	}
	.primary-bar{width:290px;}
	.third-bar{width:50px;}
	.five-bar{width:390px;}
	.edit-bar .menu-btn:hover,.edit-bar .menu-btn:focus{
		color: #ffffff !important;
	}
	.disable{
		color: #777777 !important;
	}
	.button .dropdown{
	    position: absolute;
	    width: 120px;
	    color: black;
	    top: 50px;
	    margin-left: -10px;
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