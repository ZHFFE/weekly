<template>
    <div id="app">
        <div class="header">
            <div class="logo"><a href="/">周刊</a></div>
            <div class="ceiling-main">
                <a href="/">首页</a> |
                <router-link to="add">添加新推荐</router-link>
            </div>
        </div>
        <div class="body">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'app'
    }
</script>
