<template>
  <div class="search-input">
    <button :class="{'speech-toggle':true, 'search-input__speech-toggle':true, active: isSpeechRunning}" @click="speechToggle" slot="suffix">
      <icon v-if="recognition" name="microphone"
        class="el-icon-speech el-input__icon"
        :style="{ transform: 'scale(' + volumeScale +')' }"></icon>
    </button>

    <el-input v-model="q" clearable autofocus @keyup.native.enter="submit">
    </el-input>
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

    .el-input__icon{
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
export default {
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
      runtimeTranscription: "",
      transcription: [],
      volume: 0,
      audioContext: false,
      lastInput: '',
    };
  },

  computed: {
    volumeScale(){
      let vol = this.volume
      if (this.volume < 0.01) vol = 0;
      return Math.min(1.5, 1 + vol * 10);
    }
  },

  watch: {
    value(val) {
      this.q = val;
    },

    q(val) {
      this.$emit("input", val);
    }
  },

  methods: {
    submit() {
      console.log("submit");
      this.$emit("submit", this.q);
      this.q = "";
    },

    async speechStart() {
      console.log("speech start");
      if (!this.recognition) return;
      await this.speechStop();
      this.recognition.start();
      this.isSpeechRunning = true;

      // volume listener, https://github.com/cwilso/volume-meter/blob/master/volume-meter.js
      navigator.getUserMedia({ video: false, audio: true },
        this.onGetUserMedia,
        err => reject(err)
      );
    },

    async speechStop() {
      console.log('this.recognition.stop()');
      if (this.recognition) this.recognition.stop();
      if (this.audioContext){
        try{
          await this.audioContext.close();
        } catch(err){}
      }
      this.volume = 0;
      this.isSpeechRunning = false;
    },

    speechToggle() {
      return this.isSpeechRunning ? this.speechStop() : this.speechStart();
    },

    async onSpeechEnd() {
      console.log("speech end", this.runtimeTranscription);
      await this.speechStop();
      if (!this.runtimeTranscription) return;
      if (this.runtimeTranscription == this.lastInput) return;

      this.transcription.push(this.runtimeTranscription);
      this.q = this.runtimeTranscription;
      this.lastInput = this.q;
      this.submit();
      this.speechStart();
    },

    checkSpeechApi() {
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
        console.log("speech result", event.results);
        const text = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join("");
        this.runtimeTranscription = text;
      });

      recognition.addEventListener("end", this.onSpeechEnd);
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

      processor.checkClipping = function() {
        if (!this.clipping) return false;
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
    }
  },

  mounted() {
    this.checkSpeechApi();
  },

  destroyed() {
    this.speechStop();
  }
};
</script>
