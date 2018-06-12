<template>
  <el-card :class="{ 'message': true, 'message_my': isMy }">
    <div slot="header" class="clearfix">
      {{ message.author }} <span class="message__date">{{ message.date }}</span>
    </div>
    {{ message.text }}
  </el-card>
</template>

<style lang="scss">
.message{
  margin-top: calc(1rem + 8px);
  margin-bottom: 15px;
  text-align: left;
  float: left;
  transition: none;

  &:hover{
    margin-top: 0;
    .el-card__header{
      display: block;
    }
  }
  .el-card__header{
    display: none;
    padding: 2px 5px;
    border: none;
    background: #eee;
    color: #999;
  }
  .el-card__body{
    padding: 5px;
  }

  &_my{
    float: right;
  }

  &__date{
    font-size: 0.8rem;
  }
}
</style>

<script>
import {AUTHOR_NAME} from '~/store';

export default {
  props: ["message"],

  computed: {
    isMy(){
      return this.message.author == AUTHOR_NAME;
    }
  }
}
</script>
