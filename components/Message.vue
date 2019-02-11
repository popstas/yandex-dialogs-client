<template>
  <el-card :class="{ 'message': true, 'message_my': isMy, ['message_' + message.class]: message.class }">
    <div slot="header" class="clearfix">
      {{ message.author }} <span class="message__date">{{ message.date }}</span>
      <el-button v-if="isMy" title="resend" class="message__resend" icon="el-icon-refresh" @click="resend"></el-button>
    </div>

    <div class="message__text-wrap">
      <div class="message__text">
        <span v-html="text"></span>
        <div class="card-items-list" v-if="message.card && message.card.items && message.card.items.length>0">
          <span v-if="message.card.header" class="card-items-header" v-html="message.card.header.text"></span>
          <CardItem v-for="item in message.card.items" :key="item.image_id"
                    :image="item.image_id" :title="item.title" :payload="item.button.payload">
          </CardItem>
        </div>
      </div>
    </div>

    <div class="message__buttons">
      <MessageButton class="message__button" v-for="button in message.buttons" :key="button.title"
        :title="button.title" :value="button.value" :url="button.url" :payload="button.payload"></MessageButton>
    </div>
  </el-card>
</template>

<style lang="scss">
.card-items-list {
  background: white;
}
.card-items-header {
  font-weight: bold;
  padding: 5px;
}
.message {
  margin-top: 15px;
  margin-bottom: 15px;
  box-shadow: none !important;
  border: none;
  border-radius: 0;
  text-align: left;
  float: left;
  transition: none;
  overflow: visible;

  &:hover {
    .el-card__header {
      opacity: 1;
    }
  }
  .el-card__header {
    opacity: 0;
    padding: 2px 10px;
    border: none;

    .el-button:hover {
      background: none;
      color: #999;
    }
  }
  .el-card__body {
    padding: 0;
  }

  &__text {
    padding: 5px 10px;
    border-radius: 20px;
    display: inline-block;

    &-wrap {
      border-left: 3px solid #fff;
      margin-left: -3px;
    }
  }

  &_my {
    float: right;
    .message__text {
      float: right;
      background: #ffe478;
      border-bottom-right-radius: 0;
    }
  }
  &_answer {
    .message__text {
      background: #f0f2f5;
      border-top-left-radius: 0;
    }
  }
  &_info .message__text-wrap {
    border-left-color: #17a3b856;
  }
  &_success .message__text-wrap {
    border-left-color: #28a745;
  }
  &_warning .message__text-wrap {
    border-left-color: #ffc107;
  }
  &_error .message__text-wrap {
    border-left-color: #dc3545;
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
    margin-left: 6px;
  }
}
</style>

<script>
import { AUTHOR_NAME, ADD_MESSAGE, ALICE_REQUEST } from '~/store';
import MessageButton from '~/components/MessageButton';
import CardItem from '~/components/CardItem';

export default {
  components: { MessageButton,CardItem },
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
