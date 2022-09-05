<template>
	<div class="edit-bar html" v-if="activeElement.uuid==parentID">
		<div class="primary-bar" v-if="tab==1">
			<button class="menu-btn" @mousedown.stop="deleteElement()"><i class="fa fa-trash"></i></button>
			<button class="menu-btn" @mousedown.stop="copyElement()"><i class="fa fa-clone"></i></button>
			<button class="menu-btn" @mousedown.stop="arrangeElement()"><i class="fa fa-layer-group"></i></button>
			<button class="menu-btn" @mousedown.stop="editElement()">Edit</button>
		</div>
		<div class="secondary_bar" v-if="tab==2">
			<button class="menu-btn" @mousedown.stop="downLayer()" :class="{'disable':(activeElement.z==20)}"><i class="fa fa-arrow-up"></i></button>
			<button class="menu-btn" @mousedown.stop="upLayer()" :class="{'disable':(activeElement.z==0)}"><i class="fa fa-arrow-down"></i></button>
			<button class="menu-btn" @mousedown.stop="doneElement()">Done</button>
		</div>
		<div class="third_bar" v-if="tab==3">
			<button class="menu-btn" style="width:50px" @mousedown.stop="saveElement()">Done</button>
		</div>
	</div>
</template>
<script>
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
		// when click edit button
		editElement(e){
			this.tab = 3;
			this.$store.state.activeElement.eventState = 0;
		},
		// z-index up
		upLayer(e){
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
		// when finish setting
		doneElement(){
			this.tab = 1;
		},
		saveElement() {
			this.tab = 1;
			this.$store.state.activeElement.eventState = 1;
			this.$emit('update_tt',{id:this.activeElement.uuid});
		}
	}
}
</script>
<style>
	.edit-bar.html{
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
		color: white;
	}
	.disable{
		color: #777777 !important;
	}
	.html .primary_bar{width:290px;}
	.html .third_bar{width:50px;}
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