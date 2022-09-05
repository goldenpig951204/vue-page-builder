<template>
  <input type="file" accept="image/png, image/jpeg, image/gif"
    ref="file"
    :multiple="multiple ? 'multiple' : false"
    id="uploader"
    style="display: none"
    @change="handleUpload($event)">
</template>

<script>
import axios from 'axios'
export default {
  props: {
    upload: Function,
    uploadOption: Object
  },
  data () {
    return {
      multiple: false, // Whether to allow multiple uploads
      uploader: null, // input file
      cb: null // Callback
    }
  },

  computed: {
    // Picture initial position ordinate
    top () {
      return this.$store.state.top
    }
  },

  mounted () {
    this.uploader = document.getElementById('uploader')

    /**
     * Register an upload picture custom event on the global communication intermediary
     * All places where you need to upload an image can be called
     *
     * Call method:
     * this.$store.$emit('upload', function (payload) {/.../})
     * @param payload { Array } An image containing all image objects after the image is uploaded and downloaded.
     * @param multiple { Boolean } Whether to upload multiple, the default is false
     */
    this.$store.$on('upload', (cb, multiple) => {
      this.multiple = !!multiple
      this.cb = cb
      setTimeout(() => {
        this.uploader.click()
      }, 0)
    })
  },

  methods: {
    // Handle add image operation, trigger event: change
    handleUpload (e) {
      var files = this.uploader.files
      if (!files || files.length === 0) return

      files = Array.prototype.slice.call(this.uploader.files)

      let uploadFn = this.upload || this.defaultUpload

      uploadFn(files).then(res => {
        // Perform callback after image download queue is completed
        new Promise(resolve => {
          this.handleLoadQueue(resolve, res.files)()
        }).then(payload => {
          this.cb(payload)
        })
      })
    },

    defaultUpload (files) {
      if (this.uploadOption.url) {
        var data = new FormData()
        files.forEach(file => data.append('files', file))
        return fetch(this.uploadOption.url, {
          method: 'POST',
          body: data
        })
      } else {
        alert('Please configure the image upload api address')
      }
    },

    /**
     * Processing download queue
     * The image is downloaded in order and the next one is downloaded to ensure that the image array is sorted in the order in which they were uploaded.
     */
    handleLoadQueue (resolve, files) {
      var i = 0
      var len = files.length
      var payload = []
      var data = new FormData()
      data.append('files', files[0])
      console.log(data)
      var download = () => {
        // After accessing the backend, files should be changed to callback parameters.
        axios.post('http://localhost:8081/upload', data, {headers: {'Content-Type': 'multipart/form-data'}}).then((res) => {
          var url = window.URL.createObjectURL(files[i])
          new Promise(resolve => {
            this.getImageWidth(url, resolve)
          }).then(size => {
            payload.push({
              width: size.w,
              height: size.h,
              top: this.top,
              url: res.data.backUrl, // Image preview address
              src: 'images/' + files[i].name, // Picture actual address
              realUrl: res.data.realUrl
            })

            // After all the pictures are downloaded, skip to the next step, otherwise continue downloading
            if (++i === len) {
              resolve(payload)
            } else {
              download()
            }
          })
        })
      }
      console.log(data)
      return download
    },

    /**
     * Get the width and height of the image using new Image preloading
     * This is an asynchronous operation and must be a promise
     *
     * @param url { URL | base64 } image url
     * @param res { Promise resolve }
     *
     * @return { Object } An object containing the width and height of the image
     */
    getImageWidth (url, res) {
      var img = new Image()
      img.src = url
      img.onload = function () {
        res({
          w: Math.round(img.width),
          h: Math.round(img.height)
        })
      }
    }
  }
}
</script>
