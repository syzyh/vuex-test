<template>
    <button v-text="world" @click="buttonClick"></button>
</template>

<script>
export default {
  data () {
    return {
      world: '按钮'
    }
  },
  methods: {
    buttonClick () {
      alert('组件点击')
    }
  }
}
</script>
