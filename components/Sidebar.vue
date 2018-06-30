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
      <a class="app-link" :href="$store.state.homepage" target="_blank">
        <icon name="brands/github"></icon>
        {{ $store.state.name }} {{ $store.state.version }}
      </a>
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
}
</style>

<script>
import 'vue-awesome/icons/brands/github';
import SET_IS_PROXY from '~/store';

export default {
  components: {},

  computed: {
    isProxyAvailable(){
      return !process.env.isProxy;
    },

    isProxy: {
      get() {
        return this.$store.state.isProxy;
      },
      set(val) {
        this.$store.commit('SET_IS_PROXY', val);
      }
    }
  }
};
</script>
