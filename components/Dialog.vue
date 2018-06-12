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
    height: calc(100vh - 130px);

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
import {
  ALICE_REQUEST,
  SET_USER_ID,
  SET_SESSION_ID,
  SET_WEBHOOK_URL
} from "~/store";

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
      let matches = val.match(/^use (.*)$/);
      if (matches) {
        this.$store.dispatch(SET_WEBHOOK_URL, matches[1]);
      } else {
        this.$store.dispatch(ALICE_REQUEST, val);
      }
    },

    generateRandomGuid() {
      var S4 = function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      };
      return (
        S4() +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        S4() +
        S4()
      );
    },

    getUserId() {
      let userId = localStorage.getItem("userId");
      if (!userId) {
        userId = this.generateRandomGuid();
        localStorage.setItem("userId", userId);
      }
      return userId;
    },

    getSessionId() {
      let sessionId = sessionStorage.getItem("sessionId");
      if (!sessionId) {
        sessionId = this.generateRandomGuid();
        sessionStorage.setItem("sessionId", sessionId);
      }
      return sessionId;
    }
  },

  mounted() {
    this.$store.commit(SET_USER_ID, this.getUserId());
    this.$store.commit(SET_SESSION_ID, this.getSessionId());
    this.$store.dispatch(SET_WEBHOOK_URL, localStorage.getItem("webhookURL"));
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
