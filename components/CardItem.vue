<template>
  <div class="card-item" @click="onClick">
    <div v-bind:style="cardItemIconStyle"></div>
    <div :title="title" class="card-item-text" v-html="text"></div>
  </div>
</template>

<style lang="scss">
.card-item {
  display: flex;
  padding: 10px;
  color: #666;
  &:hover {
    color: #999;
  }
}
.card-item-text {
  padding: inherit;
  color: inherit;
}
</style>

<script>
import {
  AUTHOR_NAME,
  ADD_MESSAGE,
  ALICE_REQUEST,
  RUN_TEST,
  SET_WEBHOOK_URL
} from "~/store";
export default {
  props: ["title", "image", "url", "payload", "hide"],

  computed: {
    // показывается человеку
    text() {
      return this.title || this.value;
    },

    // отправляется боту
    sendText() {
      return this.value || this.title;
    },

    cardItemIconStyle() {
      return {
        'background-image': 'url(https://avatars.mds.yandex.net/get-dialogs-skill-card/' + this.image + '/menu-list-x1',
        width: '60px',
        height: '60px',
        overflow: 'hidden',
        position: 'relative',
        'background-size': 'cover',
        'background-repeat': 'no-repeat',
        'background-position': '0 0'
      }
    }
  },

  methods: {
    onClick() {
      // open url
      if (this.url) {
        window.open(this.url, "_blank");
        return;
      }

      // add send message
      this.$store.commit(ADD_MESSAGE, {
        text: this.sendText,
        author: AUTHOR_NAME
      });

      // send to alice
      this.$store.dispatch(ALICE_REQUEST, {
        command: this.sendText,
        type: "ButtonPressed",
        payload: this.payload,
        url: this.url,
        hide: this.hide
      });
    }
  }
};
</script>
