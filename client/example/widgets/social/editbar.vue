<template>
	<div class="edit-bar social" v-if="activeElement.uuid==parentID">
		<div class="primary-bar" v-if="tab==1">
			<button @mousedown.stop="deleteElement()"><i class="fa fa-trash"></i></button>
			<button @mousedown.stop="copyElement()"><i class="fa fa-clone"></i></button>
			<button @mousedown.stop="arrangeElement()"><i class="fa fa-layer-group"></i></button>
			<button @mousedown.stop="editElement()" style="width:50px;">EDIT</button>
		</div>
		<div class="secondary-bar" v-if="tab==2">
			<button @mousedown.stop="downLayer()" :class="{'disable':(activeElement.z==20)}"><i class="fa fa-arrow-up"></i></button>
			<button @mousedown.stop="upLayer()" :class="{'disable':(activeElement.z==0)}"><i class="fa fa-arrow-down"></i></button>
			<button @mousedown.stop="doneElement()">DONE</button>
		</div>
		<div class="third-bar" v-if="tab==3">
			<button @mousedown.stop="doneElement()" style="width:52px">DONE</button>
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
			this.$store.state.toolbarIndex = 9;
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

	}
}
</script>
<style>
	.edit-bar{
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
		opacity:1 !important;
	}
	.edit-bar button{
		background-color: #00000000;
    	border: none;
    	width:40px;
    	color: #ccc;
    	padding: 8px;
	}
	.edit-bar button:hover,.edit-bar button:focus{
		color: #ffffff;
	}
	.disable{
		color: #777777 !important;
	}
	.social .primary-bar{width:195px;}
	.social .secondary-bar{width:150px;}
</style>
</template>