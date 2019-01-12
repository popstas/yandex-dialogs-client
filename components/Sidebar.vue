<template>
  <div class="sidebar">
    <el-row>
      <el-switch
        v-model="isProxy"
        active-text="Использовать прокси"
        title="Доступно только на установках с серверной частью,
      локальные навыки на localhost надо тестить без прокси,
      а удаленные, которые не разрешают CORS - через прокси"
        :disabled="isProxyAvailable"
      ></el-switch>
    </el-row>

    <el-row>
      <el-switch
        active-text="Показывать тесты внизу"
        v-if="$store.state.tests.length > 0"
        v-model="isBottomTests"
      ></el-switch>
    </el-row>

    <el-row>
      <el-switch active-text="Показывать JSON в консоли" v-model="isConsoleRequests"></el-switch>
    </el-row>

    <el-row>Макс. кол-во сообщений в чате
      <el-input v-model="messageLimit"></el-input>
    </el-row>

    <el-row>Макс. кол-во сообщений при открытии страницы
      <el-input v-model="messageStoreLimit"></el-input>
    </el-row>

    <el-row>Макс. время ответа
      <el-input v-model="timeout"></el-input>
    </el-row>

    <el-row>
      <a
        class="app-link"
        :href="$store.state.homepage + '/blob/master/CHANGELOG.md'"
        target="_blank"
      >
        <icon name="brands/github"></icon>
        {{ $store.state.name }} {{ $store.state.version }}
      </a>
    </el-row>

    <el-row v-if="webhookURLs">
      <div>Последние URL навыков:</div>
      <ul class="webhooks-buttons">
        <li v-for="webhookURL in webhookURLs" :key="webhookURL">
          <MessageButton :title="webhookURL || 'x'" :value="'use ' + webhookURL"></MessageButton>
          <button :title="`убрать ${webhookURL}`" class="webhooks-buttons__remove" @click="removeWebhookURL(webhookURL)">x</button>
        </li>
      </ul>
    </el-row>
  </div>
</template>

<style lang="scss">
.sidebar {
  padding: 10px;

  .el-row {
    margin-bottom: 10px;
  }

  .app-link {
    display: inline-block;
    text-decoration: none;
    color: #333;
    &:hover {
      color: #666;
    }
  }

  .webhooks-buttons {
    padding: 0;
    margin-left: -3px;

    li {
      list-style: none;
    }

    &__remove {
      border: none;
      background: none;
      color: #999;
      cursor: pointer;
    }
  }
}
</style>

<script>
import "vue-awesome/icons/brands/github";
import {
  SET_IS_BOTTOM_TESTS,
  SET_IS_PROXY,
  SET_IS_CONSOLE_REQUESTS,
  SET_MESSAGE_LIMIT,
  SET_MESSAGE_STORE_LIMIT,
  SET_TIMEOUT
} from "~/store/settings";
import { REMOVE_WEBHOOK_URL } from "~/store";
import MessageButton from "~/components/MessageButton";

export default {
  components: { MessageButton },

  computed: {
    isProxyAvailable() {
      return !process.env.isProxy;
    },

    isProxy: {
      get() {
        return this.$store.state.settings.isProxy;
      },
      set(val) {
        this.$store.commit(`settings/${SET_IS_PROXY}`, val);
      }
    },

    isBottomTests: {
      get() {
        return this.$store.state.settings.isBottomTests;
      },
      set(val) {
        this.$store.commit(`settings/${SET_IS_BOTTOM_TESTS}`, val);
      }
    },

    isConsoleRequests: {
      get() {
        return this.$store.state.settings.isConsoleRequests;
      },
      set(val) {
        this.$store.commit(`settings/${SET_IS_CONSOLE_REQUESTS}`, val);
      }
    },

    messageLimit: {
      get() {
        return this.$store.state.settings.messageLimit;
      },
      set(val) {
        this.$store.commit(`settings/${SET_MESSAGE_LIMIT}`, val);
      }
    },

    messageStoreLimit: {
      get() {
        return this.$store.state.settings.messageStoreLimit;
      },
      set(val) {
        this.$store.commit(`settings/${SET_MESSAGE_STORE_LIMIT}`, val);
      }
    },

    timeout: {
      get() {
        return this.$store.state.settings.timeout;
      },
      set(val) {
        this.$store.commit(`settings/${SET_TIMEOUT}`, val);
      }
    },

    webhookURLs() {
      return this.$store.state.webhookURLs;
    }
  },

  methods: {
    removeWebhookURL(url) {
      this.$store.commit(REMOVE_WEBHOOK_URL, url);
    }
  }
};
</script>
