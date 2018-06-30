<template>
  <div class="dialog">
    <div class="messages dialog__messages" v-if="messages" ref="messages">
      <el-row>
        <el-row class="messages__message" v-for="message in messages" :key="message.id">
          <Message :message="message"></Message>
        </el-row>
      </el-row>
    </div>

    <SearchInput @submit="onSubmit"></SearchInput>
  </div>
</template>

<style lang="scss">
.dialog {
  width: 100%;
  text-align: center;

  &__messages {
    overflow-y: auto;
    padding: 0 1rem;
    height: calc(100vh - 172px);

    &:hover {
      padding-right: 0.5rem;
      &::-webkit-scrollbar {
        width: 1rem;
      }
    }

    &::-webkit-scrollbar {
      width: 0.5rem;
    }
    &::-webkit-scrollbar-track {
      background-color: #eee;
    }
    &::-webkit-scrollbar-thumb {
      background-color: darkgrey;
      outline: 1px solid slategrey;
    }
  }
}
</style>

<script>
import SearchInput from '~/components/SearchInput';
import Message from '~/components/Message';
import {
  ALICE_REQUEST,
  SET_USER_ID,
  SET_WEBHOOK_URL,
  SET_WEBHOOK_URLS,
  ADD_MESSAGE,
  AUTHOR_NAME,
  SESSION_START
} from '~/store';

export default {
  components: {
    SearchInput,
    Message
  },

  computed: {
    messages() {
      return this.$store.state.messages;
    }
  },

  methods: {
    onSubmit(val) {
      this.$store.commit(ADD_MESSAGE, {
        text: val,
        author: AUTHOR_NAME
      });
      let matches = val.match(/^use (.*)$/);
      if (matches) {
        this.$store.dispatch(SET_WEBHOOK_URL, matches[1]);
      } else {
        this.$store.dispatch(ALICE_REQUEST, val);
      }
    },

    getUserId() {
      let userId = localStorage.getItem('userId');
      if (!userId) {
        userId = this.$store.getters.generateRandomGuid();
        localStorage.setItem('userId', userId);
      }
      return userId;
    },

    getWebhookURLs(){
      try{
        return JSON.parse(localStorage.getItem('webhookURLs'));
      } catch(err){
        return [];
      }
    }
  },

  mounted() {
    this.$store.commit(SET_USER_ID, this.getUserId());
    this.$store.dispatch(SESSION_START);
    this.$store.commit(SET_WEBHOOK_URLS, this.getWebhookURLs());
    this.$store.dispatch(SET_WEBHOOK_URL, localStorage.getItem('webhookURL'));
  },

  // scroll to messages bottom on messages updated
  updated: function() {
    this.$nextTick(function() {
      if (this.$refs.messages) {
        this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
      }
    });
  }
};
</script>
