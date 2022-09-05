const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const multer = require('multer')
var async = require('async');
const app = express()
var fs = require('fs');
var path = require('path')
var archiver = require('archiver');
var uniqid = require('uniqid');
const publicPath = path.join(__dirname + '/public');
app.use(express.static(publicPath));
var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'PageBuilder'
})
app.use(morgan('combined'))
app.use(bodyParser.json({limit: '50mb'}))
app.use(cors())
console.log('server is running on 8081 port!')
app.listen(process.env.PORT || 8081)
// download request
/*****************************************************************************************************************************/
app.post('/download',(req,res)=>{
	var custom1css = req.body.custom.styles[0].style.toString()
	var custom2css = req.body.custom.styles[1].style.toString()
	var custom1js = req.body.custom.scripts[0].script.toString()
	var custom2js = req.body.custom.scripts[1].script.toString()
	console.log(custom1css)

	console.log(custom2css)
	console.log(custom2js)
	fs.writeFile(__dirname + '/public/page/editpage/assets/style/custom1.css', custom1css, (err, data) => {})
	fs.writeFile(__dirname + '/public/page/editpage/assets/style/custom2.css', custom2css, (err, data) => {})
	fs.writeFile(__dirname + '/public/page/editpage/assets/script/custom1.js', custom1js, (err, data) => {})
	fs.writeFile(__dirname + '/public/page/editpage/assets/script/custom2.js', custom2js, (err, data) => {})
	fs.writeFile(__dirname + '/public/page/editpage/index.html', req.body.html , (err,data) => {})
    fs.writeFile(__dirname + '/public/page/editpage/assets/script/app.js', req.body.javascript , (err,data) => {})
    fs.writeFile(__dirname + '/public/page/editpage/assets/style/style.css', req.body.css , (err,data) => {
    	var archive =archiver('zip', {
	    	store: true,
	    	zlib: {level: 9} // Sets thie compression level.
	    })
	    var output = fs.createWriteStream(__dirname + '/PageBuilder.zip')
	    output.on('close', () => {
	    	console.log(archive.pointer() + 'total bytes')
	    	res.download(__dirname + '/PageBuilder.zip', 'PageBuilder.zip', err => {
	    		// upload directory empty
	    		fs.readdir(__dirname + '/public/page/upload', (err, files) => {
	    			if (err) throw err;
	    			for (const file of files) {
	    				fs.unlink(path.join(__dirname + '/public/page/upload',file), err => {
	    					if (err) throw err;
	    				})
	    			}
	    		})
	    	})
	    })
	    archive.pipe(output);
	    archive.directory(__dirname + '/public/page/editpage','/');
	    archive.finalize();
    })
})

// image upload request
/**********************************************************************************************************************/
var u_id = '';
const upload = multer({
	storage: multer.diskStorage({
		destination:function(req,file,callback){callback(null,'./public/page/upload')},
		filename: function(req,file,callback){callback(null, uniqid() + '-' + file.originalname)}			
	})
})

app.post('/upload', upload.any(), function(req, res, next) {
	var files = req.files[0].path.split('upload\\')[1];
	var realUrl = '../../../upload/' + files;
	function base64_encode(){
		var bitmap = fs.readFileSync(__dirname + '/public/page/upload/' + files)
		return new Buffer(bitmap).toString('base64')	
	}
	var backUrl = 'data:image/jpeg;base64,' + base64_encode()
	var data = {realUrl: realUrl, backUrl: backUrl}
	res.send(data)
})

// save block or popup
/*************************************************************************************************************/
app.post('/saveblock', function(req, res){
	let image = []
	req.body.data.data.forEach(x => {
		if (x.realUrl) {
			let src = x.realUrl.split('/')
			image.push(src[src.length - 1])
		}
	})
	for (let i = 0; i < image.length; i ++) {
		// Saving image into section block library
		if(image[i] !== ''){
			fs.copyFile(__dirname + '/public/page/upload/' + image[i], __dirname + '/public/image/' + image[i],(err) => {
				console.log(err)
			})
		}
	}
	let base64Data = req.body.image.replace(/^data:image\/png;base64,/,'')
	let blockImage = '/blockimage/' +req.body.blockname + '-' + uniqid() + '.png'
	req.body.data.data.forEach((e, index) => {
		if (e.type === 'braid-headline' || e.type === 'braid-html') {
			req.body.data.data[index].text = req.body.data.data[index].text.split('"').join('\\"')
		} else if (e.type === 'braid-paragraph') {
			req.body.data.data[index].text.values.forEach((i, index1) => {
				req.body.data.data[index].text.values[index1] = req.body.data.data[index].text.values[index1].split('"').join('\\"')
			})
		}
	})

	fs.writeFile(__dirname + '/public' + blockImage, base64Data, 'base64', err => {
		connection.query('INSERT INTO BlockLib (name, type, image, value) VALUES (\'' + req.body.blockname + '\', \'' + req.body.data.type + '\', \'' + 'http://localhost:8081' + blockImage + '\', \'' + JSON.stringify(req.body.data.data)+ '\')')
	})
})

// get section information from database
/*****************************************************************************************************************/
app.get('/getblock', function(req, res){
	connection.query('SELECT * FROM BlockLib', function(err, rows, fields){
		res.send(rows)
	})
})

// action about section block
/******************************************************************************************************************/
app.post('/actionblock', function(req, res){
	if(req.body.actionType === 'insert') {
    /************************* insert action **********************/
    	connection.query('SELECT * FROM BlockLib WHERE id = ' + req.body.id, function(err, rows, fields){
    		let value = JSON.parse(rows[0].value)
    		let image = []
    		value.forEach(i => {
    			if (i.realUrl) {
    				let src = i.realUrl.split('/')
					image.push(src[src.length - 1])
    			}
    		})
	    	for (let i = 0; i < image.length; i ++) {
					// Saving image from section block library to page
					if(image[i] !== ''){
						fs.copyFile(__dirname + '/public/image/' + image[i], __dirname + '/public/page/upload/' + image[i],(err) => {
							console.log(err)
						})
					}
				}
				res.send('saved')
    	})
    /************************* insert action **********************/
	} else if(req.body.actionType === 'rename') {
	/************************* rename action **********************/
		let sql = 'UPDATE BlockLib SET name = \'' + req.body.name + '\' WHERE id = ' + req.body.id
		connection.query(sql, function(err, result){
			 sql = 'SELECT * FROM BlockLib'
			 connection.query(sql, function(err, result, fields){
			 	 res.send(result)
			 })
		})
	/************************* rename action **********************/
	} else {
	/************************* delete action **********************/
		connection.query('SELECT * FROM BlockLib WHERE id = ' + req.body.id, function(err, result, fields){
			// blockimage removing
			let img = result[0].image.split('/')
			fs.unlink(path.join(__dirname + '/public/blockimage/', img[img.length - 1]), err => {
				if (err) throw err;
			})
			// image removing
			let widget = JSON.parse(result[0].value)
			let image = []
			widget.forEach(i => {
				if(i.realUrl){
					let src = i.realUrl.split('/')
					image.push(src[src.length - 1])
				}
			})
			for (let i = 0; i < image.length; i ++) {
				// Saving image from section block library to page
				if(image[i] !== ''){
					fs.unlink(path.join(__dirname + '/public/image',image[i]), err=>{
		  				if(err) throw err;
		  			})
				}
			}
			connection.query('DELETE FROM BlockLib WHERE id = ' + req.body.id, function(err,result){
				connection.query('SELECT * FROM BlockLib', function(err, rows, fields){
					res.send(rows)			
				})
			})
		})
	/************************* delete action **********************/  
	}
})
/******************************************************************************************************************/