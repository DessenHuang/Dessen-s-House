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
          ['๐', '๐', '๐',  '๐',  '๐', '๐', '๐คฃ', '๐'], ['๐', '๐', '๐', '๐', '๐', '๐ฅฐ', '๐', '๐คฉ',], ['๐', '๐', '๐', '๐', '๐', '๐', '๐', '๐คช'], ['๐', '๐ค', '๐ค', '๐คญ', '๐คซ', '๐ค', '๐ค', '๐คจ'], ['๐', '๐', '๐ถ', '๐', '๐', '๐', '๐ฌ', '๐คฅ'], ['๐', '๐', '๐ช', '๐คค', '๐ด', '๐ท', '๐ค', '๐ค'], ['๐คข', '๐คฎ', '๐คง', '๐ฅต', '๐ฅถ', '๐ฅด', '๐ต', '๐คฏ'], ['๐ค ', '๐ฅณ',  '๐', '๐ค', '๐ง', '๐', '๐', '๐'],['๐ฎ', '๐ฏ', '๐ฒ', '๐ณ', '๐ฅบ', '๐ฆ', '๐ง', '๐จ']
          ]
      };
    },
    methods: {
      // ็นๅป่กจๆไบไปถ
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
