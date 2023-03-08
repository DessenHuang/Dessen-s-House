<template>
  <!-- 信息修改弹出层组件 -->
  <view class="modify" :animation="showAnimationData">
    <view class="modify-header">
      <view class="cancel" @tap="windowOff(false)">取消</view>
      <view class="title">{{showTitle}}</view>
      <view class="confirm" @tap="windowOff(true)">确定</view>
    </view>
    <view class="modify-main">
      <textarea class="content" v-model="newMsg" :placeholder="`输入需要修改的${showTitle}`"></textarea>
    </view>
  </view>
</template>

<script>
  export default {
    name: "modify",
    props: ['showTitle', 'msg', 'showAnimationData'],
    data() {
      return {
        // 弹出层编辑框内容
        newMsg: ''
      };
    },
    // 侦听器解决newMsg无响应式问题
    watch: {
      // 侦听父组件传过来的msg值变化后，再给子组件的newMsg赋值
      msg(newVal) {
        this.newMsg = newVal
      }
    },
    methods: {  
      // 取消与确定
      windowOff(e) {
        // 点击了取消
        if (!e) return this.$emit('windowOff')

        // 点击了确定
        // 判断所修改属性值是否为邮箱
        if (this.showTitle === '邮箱') {
          // 邮箱格式正则表达式
          let reg = /^[a-zA-Z0-9]+([-_.][A-Za-zd]+)*@([a-zA-Z0-9]+[-.])+[A-Za-zd]{2,5}$/
          // 验证所修改的邮箱是否符合邮箱格式
          if (!reg.test(this.newMsg)) {
            return uni.showToast({
              title: '邮箱格式错误',
              icon: 'none',
              duration: 1500
            })
          }
        }
        
        // 向父组件发送事件与传值       
        this.$emit('windowOff', {type: this.showTitle, msg: this.newMsg})
      }
    }
  }
</script>

<style lang="scss">
  .modify {
    z-index: 100;
    position: fixed;
    bottom: -100%;
    width: 100%;
    height: 100%;
    background-color: #fff;

    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24rpx;
      height: 88rpx;
      box-shadow: 0px 0.5px 0px 0px rgba(0, 0, 0, 0.1);

      .cancel {
        font-size: 32rpx;
        color: #272832;
        font-weight: 400;
      }

      .title {
        font-size: 40rpx;
        color: #272832;
        font-weight: 400;
      }

      .confirm {
        font-size: 32rpx;
        color: #4AAAFF;
        font-weight: 400;
      }
    }

    &-main {
      margin-top: 24rpx;

      .content,
      .pwd {
        width: 90%;
        height: 386rpx;
        background: #F3F4F6;
        font-size: 32rpx;
        color: #272832;
        font-weight: 400;
        border-radius: 20rpx;
        margin: auto;
        padding: 20rpx;
      }
    }
  }
</style>
