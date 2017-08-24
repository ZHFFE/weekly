<template>
  <Menu mode="horizontal" :theme="theme3" :active-name="activeIndex">
    <router-link to="/summary">
      <Menu-item name="1">
        <Icon type="ios-home"></Icon>
        首页
      </Menu-item>
    </router-link>
    </Menu-group>
  </Menu>
</template>
<script>
  export default {
    mounted (){
      this.activeIndex = this.$route.name;

    },
    data () {
      return {
        theme3: 'light',
        activeIndex: 1
      }
    }
  }
</script>
