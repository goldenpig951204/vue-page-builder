<template>
	<div class="edit-bar form" v-if="activeElement.uuid==parentID">
		<div class="primary-bar" v-if="tab==1">
			<button type="button" class="menu-btn" @mousedown.stop.prevent="deleteElement()"><i class="fa fa-trash"></i></button>
			<button type="button" class="menu-btn" @mousedown.stop.prevent="copyElement()"><i class="fa fa-clone"></i></button>
			<button type="button" class="menu-btn" @mousedown.stop.prevent="arrangeElement()"><i class="fa fa-layer-group"></i></button>
			<button type="button" class="menu-btn" @mousedown.stop="codeElement()"><modal :activeElement="activeElement"/></button>
			<button type="button" class="menu-btn" @mousedown.stop="editElement()">Edit</button>
		</div>
		<div class="secondary-bar" v-if="tab==2">
			<button type="button" class="menu-btn" @mousedown.stop="upLayer()" :class="{'disable':(activeElement.z==20)}"><i class="fa fa-arrow-up"></i></button>
			<button type="button" class="menu-btn" @mousedown.stop="donwLayer()" :class="{'disable':(activeElement.z==0)}"><i class="fa fa-arrow-down"></i></button>
			<button type="button" class="menu-btn" @mousedown.stop="doneElement()">Done</button>
		</div>
		<div class="third-bar" v-if="tab==3">
			<button type="button" class="menu-btn" @mousedown.stop="addElement()" style="width: 105px;"><i class="fa fa-plus"></i>ADD FIELD
				<ul class="dropdown" v-if="isAdd">
					<li @mousedown.stop="addItem(1)"><i class="fa fa-font"></i>Text</li>
					<li @mousedown.stop="addItem(2)"><i class="fas fa-comment-alt"></i>Textarea</li>
					<li @mousedown.stop="addItem(3)"><i class="fas fa-caret-square-down"></i>Dropdown</li>
					<li @mousedown.stop="addItem(4)"><i class="far fa-dot-circle"></i>Radio button</li>
					<li @mousedown.stop="addItem(5)"><i class="fas fa-check-square"></i>Checkbox</li>
					<li @mousedown.stop="addItem(6)"><i class="fas fa-eye-slash"></i>Hidden</li>
					<li @mousedown.stop="addItem(7)"><i class="fas fa-lock"></i>Password</li>
				</ul>
			</button>
			<button type="button" class="menu-btn" @mousedown.stop="doneElement()">DONE</button>
		</div>
		<div class="fourth-bar" v-if="tab==4">
			<button type="button" class="menu-btn" @mousedown.stop="editElement()">BACK
				<div @mousedown.stop="">
					<div class="add-area" v-if="addItem_state==1" >
						<div class="form-group">
							<label>Field label</label>
							<input type="text" class="form-control" v-model="label_text" style="height: 30px !important;"/>
						</div>
						<div class="form-group">
							<label>Field Name</label>
							<input type="text" class="form-control" v-model="name_field" style="height: 30px !important"/>
						</div>
						<div class="form-group">
							<label><input type="checkbox" v-model="required"/>Required field</label>
						</div>
					</div>
					<div class="add-area" v-else-if="addItem_state==2">
						<div class="form-group">
							<label>Textarea field label</label>
							<input type="text" class="form-control" v-model="label_text" style="height: 30px !important;"/>
						</div>
						<div class="form-group">
							<label>Field Name</label>
							<input type="text" class="form-control" v-model="name_field" style="height: 30px !important"/>
						</div>
						<div class="from-group">
							<label><input type="checkbox" v-model="required"/>Required field</label>
						</div>
					</div>
					<div class="add-area" v-else-if="addItem_state==3">
						<div class="form-group">
							<label>Field label</label>
							<input type="text" class="form-control" v-model="label_text" style="height: 30px !important;"/>
						</div>
						<div class="form-group">
							<label>Field Name</label>
							<input type="text" class="form-control" v-model="name_field" style="height: 30px !important"/>
						</div>
						<div class="form-group">
							<label><input type="checkbox" v-model="required"/>Required field</label>
							<label><input type="checkbox" v-model="hide_label"/>Hide label</label>
						</div>
						<div class="form-group" style="margin:0px;">
							<div class="added-option option" v-for="(item, i) in added_options"><p contenteditable="true">{{item}}</p><i class="fa fa-times" @click="removeOption(i)"></i></div>
							<div class="added-option text-center" @click="addOption()"><i class="fa fa-plus"></i>ADD OPION</div>
						</div>
					</div>
					<div class="add-area" v-else-if="addItem_state==4">
						<div class="form-group">
							<label>Field label</label>
							<input type="text" class="form-control" v-model="label_text" style="height: 30px !important;"/>
						</div>
						<div class="form-group">
							<label>Field Name</label>
							<input type="text" class="form-control" v-model="name_field" style="height: 30px !important"/>
						</div>
						<div class="form-group">
							<label><input type="checkbox" v-model="required"/>Required field</label>
							<label><input type="checkbox" v-model="hide_label"/>Hide label</label>
						</div>
						<div class="form-group" style="margin:0px;">
							<div class="added-option" v-for="(item, i) in added_options"><p contenteditable="true">{{item}}</p><i class="fa fa-times" @click="removeOption(i)"></i></div>
							<div class="added-option text-center" @click="addOption()"><i class="fa fa-plus"></i>ADD OPION</div>
						</div>
					</div>
					<div class="add-area" v-else-if="addItem_state==5">
						<div class="form-group">
							<label>Field label</label>
							<input type="text" class="form-control" v-model="label_text" style="height: 30px !important;"/>
						</div>
						<div class="form-group">
							<label>Field Name</label>
							<input type="text" class="form-control" v-model="name_field" style="height: 30px !important"/>
						</div>
						<div class="form-group">
							<label><input type="checkbox" v-model="required"/>Required field</label>
							<label><input type="checkbox" v-model="hide_label"/>Hide label</label>
						</div>
						<div class="form-group" style="margin:0px;">
							<div class="added-option" v-for="(item, i) in added_options"><p contenteditable="true">{{item}}</p><i class="fa fa-times" @click="removeOption(i)"></i></div>
							<div class="added-option text-center" @click="addOption()"><i class="fa fa-plus"></i>ADD OPION</div>
						</div>
					</div>
					<div class="add-area" v-else-if="addItem_state==6">
						<div class="form-group">
							<label>Hidden field name</label>
							<input type="text" class="form-control" v-model="hide_field_name" style="height:30px;"/>
						</div>
						<div class="form-group">
							<label>Field Name</label>
							<input type="text" class="form-control" v-model="name_field" style="height: 30px !important"/>
						</div>
						<div class="form-group">
							<label>Hidden label value</label>
							<textarea rows="5" v-model="hide_field_value"></textarea>
						</div>
					</div>
					<div class="add-area" v-else-if="addItem_state==7">
						<div class="form-group">
							<label>Password field label</label>
							<input type="text" class="form-control" v-model="label_text" style="height:30px"/>
						</div>
						<div class="form-group">
							<label>Field Name</label>
							<input type="text" class="form-control" v-model="name_field" style="height: 30px"/>
						</div>
						<div class="form-group">
							<label><input type="checkbox" v-model="required"/>Required field</label>
						</div>
					</div>
				</div>
			</button>
			<button type="button" class="menu-btn" @mousedown.stop="saveElement()">SAVE</button>
		</div>
	</div>
</template>
<script>
import Modal from './modal.vue'
export default{
	data(){
		return {
			tab: 1,
			isAdd: 0,
			addItem_state: 0,
			label_text: "",
			required: 1,
			hide_label: 0,
			hide_field_name: '',
			hide_field_value: '',
			added_options:['option 1','option 2'],
			reeditID : -1,
			options: [],
			name_field: '',
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
		copyElement(e){
			this.$store.commit('copy')
		},
		// when click arrange button
		arrangeElement(e){
			this.tab = 2;
		},
		// when click code button
		codeElement(){
		},
		// when click edit button
		editElement(){
			this.tab = 3;
			this.activeElement.eventState = 0;
			this.$store.state.toolbarIndex = 3;
		},
		addElement(){
			this.isAdd = 1;
		},
		addItem(i){
			this.isAdd = 0;
			this.tab = 4;
			this.addItem_state = i;
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
			this.activeElement.eventState = 1;
			this.$store.state.toolbarIndex = 1;
		},
		// when click font-color button
		textLink(e){
						
		},
		addOption(){
			this.added_options.push('new option');
		},
		removeOption(i){
			this.added_options.splice(i,1);
		},
		// local state init
		stateInit(){
			this.addItem_state = 0;
			this.label_text = "";
			this.required = 1;
			this.hide_label = 0;
			this.hide_field_name = '';
			this.hide_field_value = '';
			this.added_options = ['option 1','option 2'];
			this.options = [];
		},
		// reedit fields
		reeditElement(item, i){
			let options = []
			this.isAdd = 0;
			this.tab = 4
			this.reeditID = i
			if (item.type === 'text') {
				this.addItem_state = 1
				this.label_text = item.label
				this.name_field = item.name
				this.required = item.required
			} else if (item.type === 'textarea') {
				this.addItem_state = 2
				this.label_text = item.label
				this.name_field = item.name
				this.required = item.required
			} else if (item.type === 'select') {
				options = []
				this.addItem_state = 3
				this.label_text = item.label
				this.name_field = item.name
				this.required = item.required
				this.hide_label = item.hide_label
				this.added_options = item.options
			} else if (item.type === 'radio') {
				options = []
				this.addItem_state = 4
				this.label_text = item.label
				this.name_field = item.name
				this.required = item.required
				this.hide_label = item.hide_label
				item.options.forEach(i => {
					options.push(i.value)
				})
				this.added_options = options
			} else if (item.type === 'checkbox') {
				options = []
				this.addItem_state = 4
				this.label_text = item.label
				this.name_field = item.name
				this.required = item.required
				this.hide_label = item.hide_label
				item.options.forEach(i => {
					options.push(i.value)
				})
				this.added_options = options
			} else if (item.type === 'hidden') {
				this.additem_state = 5
				this.hide_field_name = item.label
				this.name_field = item.name
				this.hide_field_value = item.value
			} else {
				this.additem_state = 6
				this.label_text = item.label
				this.name_field = item.name
				this.required = item.required
			}
		},
		// add fields
		saveElement(){
			let add_json = {};
			this.tab = 1;
			if (this.reeditID == -1){ 
				if(this.addItem_state == 1){
					add_json = {'type': 'text','label': this.label_text, 'hide_label': 0,'name': this.name_field,'required': this.required}
					this.$store.state.activeElement.formElm.push(add_json);
					this.stateInit();
				}else if(this.addItem_state == 2){
					add_json = {'type': 'textarea', 'label': this.label_text, 'hide_label': 0, 'name': this.name_field,'required': this.required}
					this.$store.state.activeElement.formElm.push(add_json);
					this.stateInit();
				}else if(this.addItem_state == 3){ // when add select
					let options = this.options;
					document.querySelectorAll('.added-option p').forEach(function(i){
						options.push(i.innerText);
					})
					add_json = {'type': 'select', 'label': this.label_text,'hide_label': 0, 'name': this.name_field, 'required':this.required,'options': this.options}
					this.$store.state.activeElement.formElm.push(add_json);
					this.stateInit();				

				}else if(this.addItem_state == 4){ // when add radio 
					let options = this.options;
					let name_field = this.name_field;
					let required = this.required;
					document.querySelectorAll('.added-option p').forEach(function(i){
						options.push({'name': name_field,'value':i.innerText, 'required': required});
					})
					add_json = {'type':'radio','label': this.label_text,'hide_label':this.hide_label,'options': options}

					this.$store.state.activeElement.formElm.push(add_json);
					this.stateInit();
				}else if(this.addItem_state == 5){ // when add checkbox
					let options = this.options;
					let name_field = this.name_field;
					let required = this.required;
					document.querySelectorAll('.added-option p').forEach(function(i){
						options.push({'name': name_field,'value':i.innerText, 'required': required});
					})
					add_json = {'type':'checkbox','label': this.label_text,'hide_label':this.hide_label,'options': options}

					this.$store.state.activeElement.formElm.push(add_json);
					this.stateInit();
				}else if(this.addItem_state == 6){ // when add hidden
					add_json = {'type': 'hidden','label': this.hide_field_name, 'name': this.name_field, 'value':this.hide_field_value}
					this.$store.state.activeElement.formElm.push(add_json);
					this.stateInit();
				}else if(this.addItem_state == 7){
					add_json = {'type': 'password','label': this.label_text, 'hide_label': 0,'name': this.name_field,'required': this.required}
					this.$store.state.activeElement.formElm.push(add_json);
					this.stateInit();
				}
			} else {
				if(this.addItem_state == 1 || this.additem_state == 2 || this.addItem_state == 7) {
					this.$store.state.activeElement.formElm[this.reeditID].label = this.label_text
					this.$store.state.activeElement.formElm[this.reeditID].name = this.name_field
					this.$store.state.activeElement.formElm[this.reeditID].required = this.required
				}
				else if (this.addItem_state == 3 || this.addItem_state == 4 || this.addItem_state == 5){
					this.$store.state.activeElement.formElm[this.reeditID].name = this.label_text
					this.$store.state.activeElement.formElm[this.reeditID].label = this.name_field
					this.$store.state.activeElement.formElm[this.reeditID].required = this.required
					this.$store.state.activeElement.formElm[this.reeditID].hide_label = this.hide_label
					let options = this.options;
					
					if (this.addItem_state == 4 || this.addItem_state == 5) {
						let _this = this
						document.querySelectorAll('.added-option p').forEach(function(i){
							options.push({'name': _this.name_field,'value':i.innerText, 'required': _this.required});
						})
					} else {
						document.querySelectorAll('.added-option p').forEach(function(i){
							options.push(i.innerText);
						})	
					}
					this.$store.state.activeElement.formElm[this.reeditID].options = options
					options = []
				} else if (this.addItem_state =6){
					this.$store.state.activeElement.formElm[this.reeditID].name = this.name_field
					this.$store.state.activeElement.formElm[this.reeditID].label = this.hide_field_name
					this.$store.state.activeElement.formElm[this.reeditID].value = this.hide_field_value
				}
				this.stateInit()
				this.reeditID = -1
			}
		}
	},
	components: {Modal}
}
</script>
<style>
	.edit-bar.form{
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
	.edit-bar.form .menu-btn{
		background-color: #00000000;
    	border: none;
    	width:44px;
    	color: #ccc;
    	padding: 8px;
	}
	.edit-bar .menu-btn:hover,.edit-bar .menu-btn:focus{
		color: #ffffff;
	}
	.disable{
		color: #777777 !important;
	}
	.editbar.form .primary_bar{width:290px !important;}
	.form .third-bar{width:160px;}
	.form .dropdown{
	    position: absolute;
	    width: 150px;
	    color: black;
	    top: 50px;
	    left:30px;
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
		text-align: left;
		list-style: none;
		border-bottom:1px solid #ddd;
	}
	.dropdown li i{margin-right:10px;}
	.dropdown li:hover{
		background-color:#000000;
		color:#ffffff;
	}
	.form .add-area{
		position:absolute;
		text-align: left;
		width:300px;
		z-index:100;
		background-color:white;
		box-shadow: 0px 0px 5px 0px #101010;
		top: 50px;
		left: 0px;
		padding:10px;
		color:#333333;
	}
	.add-area:hover{
		color:#333333;
	}
	.add-area label{margin-right:20px;}
	.add-area input[type="checkbox"]{
		margin-right:10px;
		vertical-align: middle;
	}
	.added-option{
		padding:10px 5px 10px 20px;
		border-top:1px solid #ccc;
		margin:0px;
	}
	.added-option p{
		width:85%;
		display:inline-block;
		margin:0px;}
	.added-option i.fa-times{
		float:right;
		margin-top:3px;
		display: none;
		cursor: pointer;
	}
	.added-option:hover i.fa-times{
		display:block;
	}
</style>
</template>