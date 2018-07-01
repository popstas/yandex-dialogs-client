<template>
  <el-button class="dialog-button" round v-html="text" @click="onClick"></el-button>
</template>

<style lang="scss">
.dialog-button {
  margin: 3px !important;
  padding: 3px 6px !important;
  font-size: 10px;
}
</style>

<script>
import { AUTHOR_NAME, ADD_MESSAGE, ALICE_REQUEST, RUN_TEST, SET_WEBHOOK_URL } from '~/store';
export default {
  props: ['title', 'value', 'url', 'payload', 'hide'],

  computed: {
    // показывается человеку
    text() {
      return this.title || this.value;
    },

    // отправляется боту
    sendText() {
      return this.value || this.title;
    }
  },

  methods: {
    onClick() {
      // open url
      if (this.url) {
        window.open(this.url, '_blank');
        return;
      }

      // run tests
      if (this.payload) {
        const payload = JSON.parse(this.payload);
        if (payload.scenarios_test) {
          this.$store.dispatch(RUN_TEST, payload.scenarios_test);
        }
        return;
      }

      // add send message
      this.$store.commit(ADD_MESSAGE, {
        text: this.sendText,
        author: AUTHOR_NAME
      });

      // use webhook
      const matches = this.sendText.match(/^use (.*)$/);
      if (matches) {
        this.$store.dispatch(SET_WEBHOOK_URL, matches[1]);
        return;
      }

      // send to alice
      this.$store.dispatch(ALICE_REQUEST, {
        command: this.sendText,
        type: 'ButtonPressed',
        payload: this.payload,
        url: this.url,
        hide: this.hide
      });
    }
  }
};
</script>
