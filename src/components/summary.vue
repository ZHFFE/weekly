<style scoped lang="less">
  @import "../assets/css/home.less";
</style>

<template>
  <ul>
    <li v-for="item in values">
      <router-link :to="{path: 'week', query: {week: item.week, year: item.year}}">第{{item.pk}}期</router-link>
    </li>
  </ul>
</template>
<script>
  export default {
    beforeMount(){
      this.getWeeks()
    },
    data(){
      return {
        values: []
      }
    },
    methods: {
      getWeeks(){
        this.$http.get('/weeks', {
          params: {}
        }).then((res) => {
          this.values = res.body.data;
        })
      }
    }
  }
</script>