<template>
	<div class="edit-bar image" v-if="activeElement.uuid==parentID || tab==3">
		<div class="primary_bar" v-if="tab==1">
			<button class="menu-btn" @mousedown.stop="deleteElement()"><i class="fa fa-trash"></i></button>
			<button class="menu-btn" @mousedown.stop="copyElement()"><i class="fa fa-clone"></i></button>
			<button class="menu-btn" @mousedown.stop="arrangeElement()"><i class="fa fa-layer-group"></i></button>
			<button class="menu-btn" @mousedown.stop="imageLink()"><i class="fas fa-link"></i></button>
			<button class="menu-btn" @mousedown.stop="imageCrop()"><i class="fas fa-crop-alt"></i></button>
			<button class="menu-btn" @mousedown.stop="codeElement()"><modal :activeElement="activeElement"/></button>
			<button class="menu-btn" @mousedown.stop="changeImage()" style="width:125px;">CHANGE IMAGE</button>
		</div>
		<div class="secondary_bar" v-if="tab==2">
			<button class="menu-btn" @mousedown.stop="upLayer()" :class="{'disable':(activeElement.z==20)}"><i class="fa fa-arrow-up"></i></button>
			<button class="menu-btn" @mousedown.stop="downLayer()" :class="{'disable':(activeElement.z==0)}"><i class="fa fa-arrow-down"></i></button>
			<button class="menu-btn" @mousedown.stop="doneElement()">Done</button>
		</div>
		<div class="third_bar" v-if="tab==3">
			<button class="menu-btn" @mousedown.stop="doneCrop">DONE</button>
		</div>
		<div class="fourth_bar" v-if="tab==4" @mousedown.stop="">
			<input type="text" placeholder="http://" v-model="activeElement.link_href" style="width:200px;display: inline-block; margin-right:10px;"/>
			<switches v-model="activeElement.new_tab" theme="bootstrap" color="primary" style="vertical-align: middle"></switches>
			<span>New Tab</span>
			<button class="menu-btn" @mousedown.stop="doneLink()">DONE</button>
		</div>
	</div>
</template>
<script>
import Switches from 'vue-switches'
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
		// when click done button
		doneElement(){
			this.tab = 1;
		},
		// when click code button
		codeElement(){
		},
		// z-index up
		upLayer(){
			if(this.activeElement.z<20){
				this.$store.state.activeElement.z++;
			}
		},
		// z-index down
		downLayer(){
			if(this.activeElement.z>1){
				this.$store.state.activeElement.z--;
			}
		},
		// when click image link
		imageLink(){
			this.tab=4;
		},
		doneLink(){
			this.tab=1;
			this.$store.state.activeElement.isHref=1;
			console.log(this.$store.state.activeElement)
		},
		imageCrop(){
			this.tab = 3;
			this.$emit('crop',1);
		},
		doneCrop(){
			this.tab = 1;
			this.$emit('crop',0);
		},
		// Replace picture
	    changeImage () {
	      if (this.$store.state.activeElement.isUpload) {
	        this.$store.$emit('upload', payload => {
	          this.$store.commit('replaceImage', payload)
	        })
	      }
	    },
	},
	components:{Switches,Modal}
}
</script>
<style>
	.edit-bar.image{
		position: absolute;
		display:block;
		background-color: #000;
		color:white;
		padding:5px 0px;
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
    	padding: 8px 0px;
	}
	.edit-bar .menu-btn:hover,.edit-bar .menu-btn:focus{
		color: #ffffff;
	}
	.disable{
		color: #777777 !important;
	}
	.image .primary_bar{width:410px;}
	.image .secondary_bar{width:150px;}
	.image .third_bar{width:60px;}
	.image .fourth_bar{width:400px;}
	.image .dropdown{
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