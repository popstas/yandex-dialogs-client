<template>
  <div class="dialog">
    <div class="messages dialog__messages" v-if="messages" ref="messages">
      <el-row>
        <el-row class="messages__message" v-for="message in messages" :key="message.id">
          <Message :message="message"></Message>
        </el-row>
      </el-row>
      <div class="dialog__tests" v-if="tests.length > 0 && $store.state.settings.isBottomTests">
        <MessageButton
          :class="{
            message__button: true,
            'message-button_success': dialog.success === true,
            'message-button_error': dialog.success === false
          }"
          v-for="dialog in tests"
          :key="dialog.name"
          :title="dialog.name"
          :payload="JSON.stringify({ scenarios_test: [dialog] })"
        ></MessageButton>
        <MessageButton
          class="message__button"
          title="все тесты"
          :payload="JSON.stringify({ scenarios_test: tests })"
        ></MessageButton>
      </div>
    </div>

    <SearchInput
      v-model="q"
      @submit="onSubmit"
      @up="previousMessage"
      @down="nextMessage"
      ref="searchInput"
    ></SearchInput>
  </div>
</template>

<style lang="scss">
.dialog {
  width: 100%;
  text-align: center;

  &__messages {
    overflow-y: scroll;
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
import SearchInput from "~/components/SearchInput";
import Message from "~/components/Message";
import MessageButton from "~/components/MessageButton";
import {
  ALICE_REQUEST,
  SET_USER_ID,
  SET_WEBHOOK_URL,
  SET_WEBHOOK_URLS,
  ADD_MESSAGE,
  AUTHOR_NAME,
  SESSION_START,
  SET_MESSAGES
} from "~/store";

export default {
  components: {
    SearchInput,
    Message,
    MessageButton
  },

  data() {
    return {
      currentMessage: -1,
      q: ""
    };
  },

  computed: {
    messages() {
      return this.$store.state.messages;
    },

    tests() {
      return this.$store.state.tests;
    }
  },

  watch: {
    messages() {
      this.$refs.searchInput.$refs.input.focus();
    }
  },

  methods: {
    onSubmit(val) {
      this.currentMessage = -1;
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

    previousMessage() {
      this.currentMessage++;
      let msg = this.getMyMessage(this.currentMessage);

      // last message
      if (!msg) {
        this.currentMessage--;
        msg = this.getMyMessage(this.currentMessage);
      }

      this.q = msg.text;
    },

    nextMessage() {
      if (this.currentMessage == -1) return;

      this.currentMessage--;

      // empty message
      if (this.currentMessage == -1) {
        this.q = "";
        return;
      }

      const msg = this.getMyMessage(this.currentMessage);
      this.q = msg.text;
    },

    // num - position from last, 0 - last, 1 - previous
    getMyMessage(num) {
      const msgs = this.messages.filter(
        message => message.author == AUTHOR_NAME
      );
      const ind = msgs.length - 1 - num;
      return msgs[ind] || false;
    },

    getUserId() {
      let userId = localStorage.getItem("userId");
      if (!userId) {
        userId = this.$store.getters.randomGuid;
        localStorage.setItem("userId", userId);
      }
      return userId;
    },

    getWebhookURLs() {
      try {
        return JSON.parse(localStorage.getItem("webhookURLs"));
      } catch (err) {
        return [];
      }
    }
  },

  mounted() {
    this.$store.commit(SET_USER_ID, this.getUserId());
    this.$store.dispatch(SESSION_START);
    this.$store.commit(SET_WEBHOOK_URLS, this.getWebhookURLs());

    // set webhook
    if (this.$route.query.use) {
      this.$store.dispatch(SET_WEBHOOK_URL, this.$route.query.use);
    } else {
      this.$store.dispatch(SET_WEBHOOK_URL, localStorage.getItem("webhookURL"));
    }

    // send message
    if (this.$route.query.msg) {
      setTimeout(() => {
        this.$store.commit(ADD_MESSAGE, {
          text: this.$route.query.msg,
          author: AUTHOR_NAME
        });
        this.$store.dispatch(ALICE_REQUEST, this.$route.query.msg);
      }, 1500);
    }
  },

  created() {
    // при открытии страницы остается не больше 20 последних сообщений, чтобы тесты не тормозили
    if (this.messages.length > this.$store.state.settings.messageStoreLimit) {
      this.$store.commit(
        SET_MESSAGES,
        this.messages.slice(
          this.messages.length - this.$store.state.settings.messageStoreLimit
        )
      );
    }
  },

  // scroll to messages bottom on messages updated
  updated() {
    this.$nextTick(function() {
      if (this.$refs.messages) {
        this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
      }
    });
  }
};
</script>
