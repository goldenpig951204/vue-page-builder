<template>
  <i :title="title" :class="icon"  @click="handleClick" style="padding:0px 10px;"></i>
</template>
<script>
export default {
  name: 'icon',
  props: {
    svg: String,
    title: String,
    name: String,
    options: Object
  },
  computed: {
    icon () {
      return this.svg || this.name
    }
  },
  methods: {
    handleClick () {
      this.$emit('click')
    }
  }
}
</script>
<style>
.svg-icon svg {
  box-sizing: border-box;
  display: inline-block;
  font-size: inherit;
  font-style: normal;
  height: 1em;
  position: relative;
  vertical-align: middle;
  width: auto;
}
</style>
