<style scoped lang="less">
  @import "../assets/css/home.less";
  .week-list{
    font-size: 20px;
  }
  .week-list li{
    float: left;
    margin: 10px;
  }
</style>

<template>
  <ul class="week-list">
    <li v-for="item in values">
      <router-link :to="{path: 'week', query: {week: item.week, year: item.year}}">第{{item.pk | week}}期</router-link>
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
  filters: {
    week: function (value) {
      value = parseInt(value) + 1;
      return value
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