<template>
  <div class="sidebar">
    <el-row>
      <el-switch
      v-model="isProxy"
      active-text="Использовать прокси"
      title="Доступно только на установках с серверной частью,
      локальные навыки на localhost надо тестить без прокси,
      а удаленные, которые не разрешают CORS - через прокси"
      :disabled="isProxyAvailable"></el-switch>
    </el-row>

    <el-row>
      <el-switch active-text="Показывать тесты внизу" v-if="$store.state.tests.length > 0" v-model="isBottomTests"></el-switch>
    </el-row>

    <el-row>
      <a class="app-link" :href="$store.state.homepage" target="_blank">
        <icon name="brands/github"></icon>
        {{ $store.state.name }} {{ $store.state.version }}
      </a>
    </el-row>

    <el-row v-if="webhookURLs">
      <div>Последние URL навыков:</div>
      <ul class="webhooks-buttons">
        <li v-for="webhookURL in webhookURLs" :key="webhookURL">
          <MessageButton
            :title="webhookURL" :value="'use ' + webhookURL"></MessageButton>
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
  }
}
</style>

<script>
import 'vue-awesome/icons/brands/github';
import { SET_IS_PROXY, SET_IS_BOTTOM_TESTS } from '~/store';
import MessageButton from '~/components/MessageButton';

export default {
  components: { MessageButton },

  computed: {
    isProxyAvailable() {
      return !process.env.isProxy;
    },

    isProxy: {
      get() {
        return this.$store.state.isProxy;
      },
      set(val) {
        this.$store.commit('SET_IS_PROXY', val);
      }
    },

    isBottomTests: {
      get() {
        return this.$store.state.isBottomTests;
      },
      set(val) {
        this.$store.commit('SET_IS_BOTTOM_TESTS', val);
      }
    },

    webhookURLs() {
      return this.$store.state.webhookURLs;
    }
  }
};
</script>
