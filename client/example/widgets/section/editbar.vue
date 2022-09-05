<template>
	<div class="editbar section">
		<div class="btn-group" v-if="activeElement.uuid==parentID || state">
			<button class="btn btn-primary column-drag-handle" @mousedown="Mousedown" @mouseup="Mouseup">
				<i class="material-icons" style="font-size: 16px;vertical-align: middle;">open_with</i>
			</button>
			<button class="btn btn-primary" @mousedown.stop="$store.state.toolbarIndex = 11">
				<i class="material-icons" style="font-size: 20px;vertical-align: middle;">panorama</i>
			</button>
			<button class="btn btn-primary" @mousedown.stop="actionHandle()">
				<i class="material-icons" style="font-size: 20px;vertical-align: middle;">more_horiz</i>
			</button>
			<ul class="dropdown" v-if="isAction">
				<li @mousedown.stop="showModal()"><i class="fa fa-save" style="font-size: 20px;vertical-align: middle;"></i>Save to Block</li>
				<li @mousedown.stop="copy()"><i class="fa fa-copy"></i>Duplicate Block</li>
				<li @mousedown.stop="$store.commit('delete')"><i class="fa fa-trash"></i>Delete Block</li>
			</ul>
		</div>
		<button class="btn btn-primary add-section" @mousedown.stop="$store.commit('copy')" v-if="activeElement.uuid==parentID"><i class="fa fa-plus"></i></button>
	</div>
</template>
<script>
	export default{
		data () {
			return {
				state: 0,
				isAction: 0,
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
		methods: {
			Mousedown () {
				this.state = 1;
			},
			Mouseup () {
				this.state = 0;
			},
			actionHandle () {
				if (this.isAction) {
					this.isAction = 0
				} else {
					this.isAction = 1
				}
			},
			showModal () {
				this.$store.$emit('showModal',{type: 'section'})
				this.isAction = 0
			},
			copy () {
				this.$store.commit('copy')
				this.isAction = 0
			},
			delete () {
				this.$store.commit('delete')
				this.isAction = 0
			}
		},
	}
</script>
<style>
	.btn-group{
		margin:8px 0 0 0;
	}
	.add-section{
		position: absolute;
		bottom: 0;
		right: 0;
		border-radius: 50%;
	}
	.section .dropdown{
	    position: absolute;
	    width: 160px !important;
	    color: black;
	    top: 45px !important;
	   	left: 80px;
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
		text-align: left;
		list-style: none;
		border-bottom:1px solid #ddd;
	}
	.dropdown li:hover{
		background-color:#000000;
		color:#ffffff;
	}
	.dropdown li i{
		float: left;
		vertical-align: bottom;
		font-size: 15px;
		margin:4px 5px;
	}
</style>