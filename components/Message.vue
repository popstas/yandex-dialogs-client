<template>
  <el-card :class="{ 'message': true, 'message_my': isMy }">
    <div slot="header" class="clearfix">
      {{ message.author }} <span class="message__date">{{ message.date }}</span>
      <el-button v-if="isMy" title="resend" class="message__resend" icon="el-icon-refresh" @click="resend"></el-button>
    </div>

    <div class="message__text" v-html="text"></div>

    <div class="bottom clearfix">
      <el-button class="message__button" round v-html="button.title"
        v-for="button in message.buttons" :key="button.title" @click="onButton(button)"></el-button>
    </div>
  </el-card>
</template>

<style lang="scss">
.message {
  margin-top: calc(1rem + 8px);
  margin-bottom: 15px;
  text-align: left;
  float: left;
  transition: none;

  &:hover {
    margin-top: 0;
    .el-card__header {
      display: block;
    }
  }
  .el-card__header {
    display: none;
    padding: 2px 5px;
    border: none;
    background: #eee;
    color: #999;
  }
  .el-card__body {
    padding: 5px;
  }

  &_my {
    float: right;
  }

  &__date {
    margin-left: 10px;
    font-size: 0.8rem;
  }

  &__resend{
    margin-left: 10px;
    background: none;
    border: none;
    padding: 0;
  }

  &__button{
    margin: 3px !important;
    padding: 3px 6px !important;
    font-size: 10px;
  }
}
</style>

<script>
import { AUTHOR_NAME, ADD_MESSAGE, ALICE_REQUEST } from '~/store';

export default {
  props: ['message'],

  computed: {
    isMy() {
      return this.message.author == AUTHOR_NAME;
    },

    text() {
      return this.message.text.split('\n').join('<br>');
    }
  },

  methods: {
    onButton(button){
      if(button.url){
        window.open(button.url, '_blank');
        return;
      }

      this.$store.commit(ADD_MESSAGE, {
        text: button.title,
        author: AUTHOR_NAME
      });
      this.$store.dispatch(ALICE_REQUEST, {
        command: button.title,
        type: 'ButtonPressed',
        payload: button.payload,
        url: button.url,
        hide: button.hide
      });
    },

    resend(){
      this.$store.commit(ADD_MESSAGE, {
        text: this.message.text,
        author: AUTHOR_NAME
      });
      this.$store.dispatch(ALICE_REQUEST, this.message.text);
    }
  }
};
</script>
