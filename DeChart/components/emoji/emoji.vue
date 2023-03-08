<template>
  <scroll-view class="emoji" scroll-y="true">
    <view class="emoji-line" v-for="(line, index) in emojis" :key="index">
      <view class="emoji-line-item" v-for="(item, i) in line" :key="i" @tap="btn(item)">
        {{item}}
      </view>
    </view>
  </scroll-view>
</template>

<script>
  export default {
    name: "emoji",
    data() {
      return {
        emojis: [
          ['😀', '😃', '😄',  '😁',  '😆', '😅', '🤣', '😂'], ['🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',], ['😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪'], ['😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨'], ['😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥'], ['😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕'], ['🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯'], ['🤠', '🥳',  '😎', '🤓', '🧐', '😕', '😟', '🙁'],['😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨']
          ]
      };
    },
    methods: {
      // 点击表情事件
      btn (item) {
        this.$emit('sendEmoji', item)
      }
    }
  }
</script>

<style lang="scss">
.emoji {
  height: 100%;
  padding: 20rpx;
  box-sizing: border-box;
  &-line {
    display: flex;
    margin-bottom: 20rpx;
    &-item {
      width: 12.5%;
      font-size: 48rpx;
    }
  }
}
</style>
