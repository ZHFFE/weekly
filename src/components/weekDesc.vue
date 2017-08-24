<style scoped lang="less">
  @import "../assets/css/home.less";
</style>

<template>
    <div>
        <Card v-for="item in values">
            <p slot="title">
                <a v-bind:href="item.url" target="_blank">{{item.title}}</a>
            </p>
            <p>
                {{item.username}}:{{item.reason}}
            </p>
        </Card>
    </div>
</template>
<script>
  export default {
    beforeMount(){
      this.getWeeks()
    },
    watch: {
      '$route': function (route) {
        var query = route.query;
        this.week = query.week;
        this.year = query.year;
      }
    },
    data(){
      return {
          values: []
      }
    },
      filters: {
          category: function (value) {
              if (!value) return '';
              value = parseInt(value);
              //
              const maps = {
                  1: '前端',
                  2: '后端',
                  3: '数据库',
                  4: '其他'
              };
              return maps[value]
          }
      },
    methods: {
      getWeeks(){
            this.$http.get('/week', {week: this.week, year: this.year}).then((res) => {
            this.values = res.body.data;
                console.log(this.values);
        })
      }
    }
  }
</script>