<template>
  <div class="container-wrap">
    <el-container>
      <!-- https://github.com/Mango/slideout#user-content-slideoutoptions -->
      <no-ssr>
        <Slideout
          :toggleSelectors="['.menu-toggle']"
          panel="#panel"
          menu="#menu"
          side="left"
          :padding="280"
        >
          <div id="panel">
            <el-header height="42px">
              <button class="menu-toggle">☰</button>
              <el-button
                class="clear-messages"
                @click="clearMessages"
                title="очистить историю"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </el-header>
            <el-main>
              <nuxt/>
            </el-main>
          </div>
        </Slideout>
      </no-ssr>
    </el-container>
    <nav id="menu">
      <Sidebar></Sidebar>
    </nav>
  </div>
</template>

<style lang="scss">
$container-width: 480px;

html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 14px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.container-wrap {
  margin: 0 auto;
  max-width: $container_width;
  background: #fff;
  position: relative;
}

.el-main {
  padding: 5px;
  display: flex;
  align-items: flex-end;
}

.el-header {
  padding: 0 5px;

  .menu-toggle {
    background: none;
    border: none;
    line-height: 42px;
    outline: none;
    cursor: pointer;
  }

  .clear-messages {
    // float:right;
    line-height: 42px;
    border: none;
    background: none !important;
  }
}
.slideout-menu {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 280px;
  height: 100vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  z-index: 0;
  display: none;

  &-left {
    left: 0;
  }
  &-right {
    right: 0;
  }

  .slideout-open & {
    display: block;
  }
}

.slideout-panel {
  position: relative;
  z-index: 1;
  // will-change: transform; - it breaks position: fixed
  min-height: 100vh;
  background: #fff;
  @media (min-width: $container_width) {
    min-width: $container_width;
  }

  .slideout-open & {
    overflow: hidden;
  }
}
</style>

<script>
import Sidebar from "~/components/Sidebar";
import { SET_MESSAGES } from "~/store";

export default {
  components: { Sidebar },
  head() {
    return {
      title: this.title
    };
  },

  computed: {
    title() {
      return (
        (this.$store.state.webhookURL
          ? this.$store.state.webhookURL + " - "
          : "") +
        "yandex-dialogs-client " +
        this.$store.state.version
      );
    }
  },

  methods: {
    clearMessages() {
      this.$store.commit(SET_MESSAGES, []);
    }
  }
};
</script>
