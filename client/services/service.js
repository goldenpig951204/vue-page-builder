import axios from 'axios'
export default {
	download (data) {
		return axios.post('http://localhost:8081/download', data,{responseType: 'blob'}).then(function(res){
			var a = document.createElement('a');
              var url = window.URL.createObjectURL(res.data);
              a.href = url;
              a.download = 'pagebuilder.zip';
              a.click();
              window.URL.revokeObjectURL(url);
		});
	},
	saveBlock (data) {
		return axios.post('http://localhost:8081/saveblock', data).then(function(res){})
	},
	getBlock () {
		return axios.get('http://localhost:8081/getblock')
	},
	actionBlock (data) {
		return axios.post('http://localhost:8081/actionblock', data)
	}
}