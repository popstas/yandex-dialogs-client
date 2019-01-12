<!-- speechEngine: browser, yandex -->
<template>
  <div class="search-input">
    <button
      :class="{'speech-toggle':true, 'search-input__speech-toggle':true, active: isSpeechRunning}"
      @click="speechToggle"
      slot="suffix"
    >
      <icon
        v-if="recognition"
        name="microphone"
        class="el-icon-speech el-input__icon"
        :style="{ transform: 'scale(' + volumeScale +')' }"
      ></icon>
    </button>

    <el-input
      ref="input"
      v-model="q"
      clearable
      autofocus
      @keydown.native.ctrl.c="q = ''"
      @keydown.native.ctrl.l.prevent="clearMessages"
      @keydown.native.enter="submit"
      @keydown.native.up="$emit('up')"
      @keyup.native.down="$emit('down')"
    ></el-input>
  </div>
</template>

<style lang="scss">
.search-input {
  text-align: center;

  &__speech-toggle {
    cursor: pointer;
    text-align: center;
    display: inline-block;
    margin: 0 auto;
    border: none;
    background: none;
    padding: 20px;
    color: #dcdfe6;
    outline: none;

    .el-input__icon {
      transition-duration: 0.1s;
    }

    &:hover {
      color: #666;
    }
    &.active {
      color: #409eff;
    }
  }
}
</style>

<script>
import "vue-awesome/icons/microphone";
import { SET_MESSAGES } from "~/store";
// import webspeechkit from '~/assets/webspeechkit';
// import webspeechkitSettings from '~/assets/webspeechkit-settings';
// import SpeechRecognition from '~/assets/speechrecognition';
// import Speech from '~/components/Speech';
export default {
  // components: { Speech },
  props: {
    value: {
      default: ""
    }
  },

  data() {
    return {
      lang: "ru-RU",
      q: this.value,
      recognition: false,
      isSpeechRunning: false,
      isSpeechWillStart: false,
      runtimeTranscription: "",
      transcription: [],
      volume: 0,
      audioContext: false,
      lastInput: ""
    };
  },

  computed: {
    volumeScale() {
      let vol = this.volume;
      if (this.volume < 0.01) {
        vol = 0;
      }
      return Math.min(1.5, 1 + vol * 10);
    },

    speechEngine() {
      return this.$store.state.speechEngine;
    },

    yandexAPIKey() {
      return this.$store.state.yandexAPIKey;
    },

    messages() {
      return this.$store.state.messages;
    }
  },

  watch: {
    value(val) {
      this.q = val;
    },

    q(val) {
      this.$emit("input", val);
    },

    messages(messages) {
      this.onMessagesChange(messages);
    }
  },

  methods: {
    submit() {
      this.$emit("submit", this.q);
      this.q = "";
    },

    onMessagesChange(messages) {
      if (!this.isSpeechWillStart) {
        return;
      }
      const last = messages[messages.length - 1];
      if (last.author == "Робот") {
        this.isSpeechWillStart = false; // флаг ставит яндекс при распознавании
        this.speechStart();
      }
    },

    speechStart() {
      const engines = {
        browser: this.speechStartBrowser,
        yandex: this.speechStartYandex
      };
      engines[this.speechEngine]();
    },

    speechStartYandex() {
      if (this.isSpeechRunning) {
        return;
      }
      if (!this.recognition) {
        return;
      }
      this.isSpeechRunning = true;

      // volume listener, https://github.com/cwilso/volume-meter/blob/master/volume-meter.js
      navigator.getUserMedia(
        { video: false, audio: true },
        this.onGetUserMedia,
        err => {
          console.log(
            "Ошибка доступа к микрофону, возможно, вы запретили его использование.",
            err
          );
        }
      );

      ya.speechkit.recognize({
        apikey: this.yandexAPIKey,
        utteranceSilence: 60, // длина тишины перед окончанием

        doneCallback: this.onSpeechEndYandex,

        initCallback: function() {
          this.isSpeechRunning = true;
        },

        errorCallback: async err => {
          await this.speechStop();
          console.log("Возникла ошибка при запросе к yandex: " + err);
        }
      });
    },

    async speechStartBrowser() {
      // console.log('speech start');
      if (!this.recognition) {
        return;
      }
      await this.speechStop();
      this.recognition.start();
      this.isSpeechRunning = true;

      // volume listener, https://github.com/cwilso/volume-meter/blob/master/volume-meter.js
      navigator.getUserMedia(
        { video: false, audio: true },
        this.onGetUserMedia,
        err => {
          console.log(
            "Ошибка доступа к микрофону, возможно, вы запретили его использование.",
            err
          );
        }
      );
    },

    async speechStop() {
      const engines = {
        browser: this.speechStopBrowser,
        yandex: this.speechStopYandex
      };
      await engines[this.speechEngine]();
    },

    async speechStopYandex() {
      if (this.audioContext) {
        try {
          await this.audioContext.close();
        } catch (err) {}
      }
      this.volume = 0;
      this.isSpeechRunning = false;
    },

    async speechStopBrowser() {
      if (this.recognition) {
        this.recognition.stop();
      }
      if (this.audioContext) {
        try {
          await this.audioContext.close();
        } catch (err) {}
      }
      this.volume = 0;
      this.isSpeechRunning = false;
    },

    speechToggle() {
      return this.isSpeechRunning ? this.speechStop() : this.speechStart();
    },

    async onSpeechEndYandex(text) {
      if (!this.isSpeechRunning) {
        return;
      }
      if (text === "") {
        return;
      }
      await this.speechStop();
      this.isSpeechWillStart = true; // включить микрофон снова после получения ответа
      this.q = text;
      this.lastInput = this.q;
      this.submit();
    },

    async onSpeechEndBrowser() {
      // console.log('speech end', this.runtimeTranscription);
      await this.speechStop();
      if (!this.runtimeTranscription) {
        return;
      }
      if (this.runtimeTranscription == this.lastInput) {
        return;
      }

      this.transcription.push(this.runtimeTranscription);
      this.q = this.runtimeTranscription;
      this.lastInput = this.q;
      this.submit();
      this.speechStart();
    },

    initSpeechApi() {
      console.log("Init speech API: ", this.speechEngine);
      const engines = {
        browser: this.speechInitBrowser,
        yandex: this.speechInitYandex
      };
      engines[this.speechEngine]();
    },

    speechInitYandex() {
      // TODO: detect recognition available
      this.recognition = true;
    },

    speechInitBrowser() {
      window.SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        return;
      }
      this.recognition = new SpeechRecognition();
      let recognition = this.recognition;
      this.speechStop();
      recognition.lang = this.lang;
      recognition.interimResults = false;

      recognition.addEventListener("result", event => {
        // console.log('speech result', event.results);
        const text = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join("");
        this.runtimeTranscription = text;
      });

      recognition.addEventListener("end", this.onSpeechEndBrowser);
      this.recognition = recognition;
    },

    onGetUserMedia(stream) {
      this.audioContext = new AudioContext();
      let source = this.audioContext.createMediaStreamSource(stream);
      let meter = this.createAudioMeter(this.audioContext);
      source.connect(meter);
    },

    createAudioMeter(audioContext, clipLevel, averaging, clipLag) {
      let processor = audioContext.createScriptProcessor(512);
      processor.onaudioprocess = this.volumeAudioProcess;
      processor.clipping = false;
      processor.lastClip = 0;
      processor.volume = 0;
      processor.clipLevel = clipLevel || 0.98;
      processor.averaging = averaging || 0.95;
      processor.clipLag = clipLag || 750;

      // this will have no effect, since we don't copy the input to the output,
      // but works around a current Chrome bug.
      processor.connect(audioContext.destination);

      processor.checkClipping = function() {
        if (!this.clipping) {
          return false;
        }
        if (this.lastClip + this.clipLag < window.performance.now()) {
          this.clipping = false;
        }
        return this.clipping;
      };

      processor.shutdown = function() {
        this.disconnect();
        this.onaudioprocess = null;
      };

      return processor;
    },

    volumeAudioProcess(event) {
      let processor = event.target;
      let buf = event.inputBuffer.getChannelData(0);
      let bufLength = buf.length;
      let sum = 0;
      let x;

      // Do a root-mean-square on the samples: sum up the squares...
      for (let i = 0; i < bufLength; i++) {
        x = buf[i];
        if (Math.abs(x) >= processor.clipLevel) {
          processor.clipping = true;
          processor.lastClip = window.performance.now();
        }
        sum += x * x;
      }

      // ... then take the square root of the sum.
      let rms = Math.sqrt(sum / bufLength);
      this.volume = rms;
    },

    clearMessages() {
      this.$store.commit(SET_MESSAGES, []);
    }
  },

  mounted() {
    this.initSpeechApi();
  },

  destroyed() {
    this.speechStop();
  }
};
</script>
