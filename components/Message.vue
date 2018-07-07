<template>
  <el-card :class="{ 'message': true, 'message_my': isMy, ['message_' + message.class]: message.class }">
    <div slot="header" class="clearfix">
      {{ message.author }} <span class="message__date">{{ message.date }}</span>
      <el-button v-if="isMy" title="resend" class="message__resend" icon="el-icon-refresh" @click="resend"></el-button>
    </div>

    <div class="message__text" v-html="text"></div>

    <div class="message__buttons">
      <MessageButton class="message__button" v-for="button in message.buttons" :key="button.title"
        :title="button.title" :value="button.value" :url="button.url" :payload="button.payload"></MessageButton>
    </div>
  </el-card>
</template>

<style lang="scss">
.message {
  margin-top: calc(1rem + 8px);
  margin-bottom: 15px;
  box-shadow: none !important;
  text-align: left;
  float: left;
  transition: none;

  &:hover {
    margin-top: 0;
    .el-card__header {
      display: block;
      background: none;
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
    padding: 5px 10px;
  }

  &_my {
    float: right;
    background: #FFE478;
    border-radius: 20px 20px 0 20px;
  }
  &_answer {
    background: #F0F2F5;
    border-radius: 0 20px 20px 20px;
  }
  &_info {
    border-left: 3px solid #17a2b8;
  }
  &_success {
    border-left: 3px solid #28a745;
  }
  &_warning {
    border-left: 3px solid #ffc107;
  }
  &_error {
    border-left: 3px solid #dc3545;
  }

  &__date {
    margin-left: 10px;
    font-size: 0.8rem;
  }

  &__resend {
    margin-left: 10px;
    background: none;
    border: none;
    padding: 0;
  }

  &__buttons {
    margin-top: 3px;
    margin-left: -3px;
  }
}
</style>

<script>
import { AUTHOR_NAME, ADD_MESSAGE, ALICE_REQUEST } from '~/store';
import MessageButton from '~/components/MessageButton';

export default {
  components: { MessageButton },
  props: ['message'],

  computed: {
    isMy() {
      return this.message.author == AUTHOR_NAME;
    },

    text() {
      return this.message.text ? this.message.text.split('\n').join('<br>') : '';
    }
  },

  methods: {
    resend() {
      this.$store.commit(ADD_MESSAGE, {
        text: this.message.text,
        author: AUTHOR_NAME
      });
      this.$store.dispatch(ALICE_REQUEST, this.message.text);
    }
  }
};
</script>
