<template>
	<div class="edit-bar paragraph" v-if="activeElement.uuid==parentID">
		<div class="primary_bar" v-if="tab == 1">
			<button class="menu-btn" @mousedown.stop="deleteElement()"><i class="fa fa-trash"></i></button>
			<button class="menu-btn" @mousedown.stop="copyElement()"><i class="fa fa-clone"></i></button>
			<button class="menu-btn" @mousedown.stop="arrangeElement()"><i class="fa fa-layer-group"></i></button>
			<button class="menu-btn" @mousedown.stop="codeElement()"><modal/></button>
			<button class="menu-btn" @mousedown.stop="editElement()">EDIT</button>
		</div>
		<div class="secondary_bar" v-if="tab == 2">
			<button class="menu-btn" @mousedown.stop="upLayer()" :class="{'disable':(activeElement.z==20)}">
				<i class="fa fa-arrow-up"></i>
			</button>
			<button class="menu-btn" @mousedown.stop="downLayer()" :class="{'disable':(activeElement.z==0)}">
				<i class="fa fa-arrow-down"></i>
			</button>
			<button class="menu-btn" @mousedown.stop="doneElement()">DONE</button>
		</div>
		<div class="third_bar" v-if="tab == 3">
			<input type="color" id="color_picker" value="#ffffff" @mousedown.stop="" @change="fontColor($event)"/>
			<button class="menu-btn" @mousedown.stop="fontSize()">{{parseInt(activeElement.fontSize)}}
				<i class="fa fa-caret-down"></i>
				<ul class="dropdown" v-if="sub_tab == 1">
					<li v-for="(x , i) in 10" @mousedown.stop="setFontSize(i,2*(x-1)+12)">{{2*(x-1)+12}}</li>
				</ul>
			</button>
			<button class="menu-btn" @mousedown.stop="textHeight()">
				<i class="fa fa-text-height"></i><i class="fa fa-caret-down"></i>
				<ul class="dropdown" v-if="sub_tab == 2">
					<li v-for="(x , i) in 6" @mousedown.stop="setTextHeight(i,1+(x-1)*0.2)">{{1+(x-1)*0.2}}</li>
				</ul>
			</button>
			<button class="menu-btn" @mousedown.stop="textFont()">
				<i :class="'fa fa-font'"></i><i class="fa fa-caret-down"></i>
				<ul class="dropdown" style="width:150px;" v-if="sub_tab == 3">
					<li v-for="(item, i) in $store.state.fontFamily" @mousedown.stop="setFontFamily(item)">{{item}}</li>
				</ul>
			</button>
			<button class="menu-btn" @mousedown.stop="textAlign()">
				<i :class="'fas fa-align-'+activeElement.textAlign"></i><i class="fa fa-caret-down"></i>
				<ul class="dropdown" v-if="sub_tab == 4">
					<li @mousedown.stop="setTextAlign('left')"><i class="fas fa-align-left"></i></li>
					<li @mousedown.stop="setTextAlign('center')"><i class="fas fa-align-center"></i></li>
					<li @mousedown.stop="setTextAlign('right')"><i class="fas fa-align-right"></i></li>
					<li @mousedown.stop="setTextAlign('justify')"><i class="fas fa-align-justify"></i></li>
				</ul>
			</button>
			<button class="menu-btn" @mousedown.stop="textBold()"><i class="fas fa-bold"></i></button>
			<button class="menu-btn" @mousedown.stop="textItalic()"><i class="fas fa-italic"></i></button>
			<button class="menu-btn" @mousedown.stop="textUnderline()"><i class="fas fa-underline"></i></button>
			<button class="menu-btn" @mousedown.stop="textLink()"><i class="fas fa-link"></i></button>
			<button class="menu-btn" @mousedown.stop="textStyle(2)"><i class="fas fa-list-ol"></i></button>
			<button class="menu-btn" @mousedown.stop="textStyle(3)"><i class="fas fa-list-ul"></i></button>
			<button class="menu-btn" @mousedown.stop="updateText()">DONE</button>
		</div>
		<div class="fourth_bar" v-if="tab==4" @mousedown.stop="">
			<input type="text" placeholder="http://" v-model="link_url" />
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
			sub_tab: 0,
			link_url: "",
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
		// when click code button
		codeElement(){
		},
		// when click edit button
		editElement(){
			this.tab = 3;
			this.$store.state.activeElement.eventState = 0;
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
		// when finish setting
		doneElement(){
			this.tab = 1;
			this.$store.state.activeElement.eventState = 1;
		},
		// when click font-color button
		fontColor(e){
			if(window.getSelection().toString() == '') {
				this.$store.state.activeElement.color = e.target.value
			} else {
				document.execCommand('ForeColor', false, e.target.value)
			}
			this.$emit('update_tt',{id:this.activeElement.uuid});
		},
		// when click font-size button
		fontSize(){
			this.sub_tab = 1
		},
		// when set font-size value
		setFontSize(a,value){
			this.$store.state.activeElement.fontSize = value+"px";
			this.sub_tab = 0;
		},
		// when click line-height button
		textHeight(){
			this.sub_tab = 2
		},
		// when click font-family button
		textFont(){
			this.sub_tab = 3
		},
		// when set font-family value
		setFontFamily(value){
			this.$store.state.activeElement.fontFamily = value
			this.sub_tab = 0
		},
		// when set line-height value
		setTextHeight(a,value){
			this.$store.state.activeElement.lineHeight = value;
			this.sub_tab = 0
		},
		// when click text-align button
		textAlign(){
			this.sub_tab = 4
		},
		// when set text-align value
		setTextAlign(value){
			this.$store.state.activeElement.textAlign = value;
			this.sub_tab = 0;
		},
		// when click text-bold button
		textBold(){
			if(this.activeElement.fontWeight != 'bold' ){
				if (window.getSelection().toString() == '') {
					this.$store.state.activeElement.fontWeight = 'bold';
				} else {
					document.execCommand('bold')
				}
			}else{
				this.$store.state.activeElement.fontWeight = 'normal';
			}
			this.$emit('update_tt',{id:this.activeElement.uuid});
		},
		// when click text-italic button
		textItalic(){
			if(this.activeElement.fontStyle != 'italic'){
				if (window.getSelection().toString() == '') {
					this.$store.state.activeElement.fontStyle = 'italic';
				} else {
					document.execCommand('italic')
				}
			}else{
				this.$store.state.activeElement.fontStyle = 'normal';
			}
			this.$emit('update_tt',{id:this.activeElement.uuid});
		},
		// when click text-decoration button
		textUnderline(){
			if(this.activeElement.textDecoration != 'underline'){
				if(window.getSelection.toString() == ''){
					this.$store.state.activeElement.textDecoration = 'underline';
				} else {
					document.execCommand('underline')
				}
			}else{
				this.$store.state.activeElement.textDecoration = 'none';
			}
			this.$emit('update_tt',{id:this.activeElement.uuid});
		},
		// when click text-link button
		textLink(e){
			this.tab = 4;
			let part = window.getSelection().getRangeAt(0);
			let text = window.getSelection().toString();
			part.deleteContents();
			let span = document.createElement("span");
			span.setAttribute("id","change");
			span.appendChild(document.createTextNode(text));
			part.insertNode(span);
		},
		// add link into paragraph
		doneLink(){
			this.tab = 1;
			this.$store.state.activeElement.eventState = 1;
			let src = this.link_url;
			let element = document.getElementById("change");
			let new_element = document.createElement("A");
			new_element.href = this.link_url;
			new_element.innerText = element.innerText;
			element.parentNode.replaceChild(new_element, element);
			this.$emit('update_tt',{id:this.activeElement.uuid});
		},
		textStyle(i){
			if(i==2){
				this.activeElement.text.type!=2 ? this.$store.state.activeElement.text.type = 2 : this.$store.state.activeElement.text.type = 1;
			}else if(i==3){
				this.activeElement.text.type!=3 ? this.$store.state.activeElement.text.type = 3 : this.$store.state.activeElement.text.type = 1;
			}
		},
		updateText(){
			this.$emit('update_tt',{id:this.activeElement.uuid});
			this.tab = 1;
			this.sub_tab = 0
			this.$store.state.activeElement.eventState = 1;
		}
	},
	components:{Switches,Modal}
}
</script>
<style>
	.edit-bar{
		position: absolute;
		display:inline-block;
		background-color: #000;
		color:white;
		padding:5px 0px;
		top:-60px;
		font-size:15px;
		left:-10px;
		line-height: 1.5;
		text-align: center;
	}
	.edit-bar.paragraph .menu-btn{
		background-color: #00000000;
    	border: none;
    	width:44px;
    	color: #ccc;
    	padding: 8px 0px;
	}
	.edit-bar .menu-btn:hover,.edit-bar .menu-btn:focus{
		color: #ffffff;
	}
	.disable{
		color: #777777 !important;
	}
	.paragraph .primary_bar{width:260px;}
	.paragraph .third_bar{width:600px;}
	.paragraph .fourth_bar{width:380px;}
	.paragraph .dropdown{
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
	.paragraph .dropdown li{
		padding:10px;
		display:block;
		text-align: center;
		list-style: none;
		border-bottom:1px solid #ddd;
	}
	.paragraph .dropdown li:hover{
		background-color:#000000;
		color:#ffffff;
	}
	.paragraph .dropdown li i{float: none}
</style>
</template>