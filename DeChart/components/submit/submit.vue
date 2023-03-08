<template>
  <view class="submit">
    <view class="submit-top">
      <view class="emoji-box">
        <image class="emoji" src="/static/images/chart/emoji.png" @tap="bottomShow(true)"></image>
      </view>
      <textarea class="content" auto-height="true"  @input="inputs" v-model="msg"></textarea>
      <view class="more-box">
        <image class="more" src="/static/images/chart/add.png" @tap="bottomShow(false)"></image>
      </view>
    </view>
    
    <view class="submit-bottom" v-if="isEmojisShow">
      <emoji @sendEmoji="sendEmoji"></emoji>
    </view>
    <view class="submit-bottom" v-if="isMoreShow">
      <more @sendImg="sendImg" @sendSite="sendSite"></more>
    </view>
  </view>
</template>

<script>
  export default {
    name: "submit",
    data() {
      return {
        // 当前输入的消息
        msg: '',
        // 更多弹窗弹出判断值
        isMoreShow: false,
        // 表情弹出框判断值
        isEmojisShow: false
      };
    },
    methods: {
      // 获取当前窗口高度
      getHIght() {
        const query = uni.createSelectorQuery().in(this);
        query.select('.submit').boundingClientRect(data => {
          this.$emit('height', data.height)
        }).exec();
      },
      
      // 表情框弹出与关闭
      bottomShow (flag) {
        if (flag) {
          // flag为true显示表情库
          this.isEmojisShow = !this.isEmojisShow
          this.isMoreShow = false
        } else {
          // 反之显示更多弹窗
          this.isMoreShow = !this.isMoreShow
          this.isEmojisShow = false
        }
                      
        // 获取当前组件高度
        this.$nextTick(() => {
          this.getHIght()
        })
      },
      
     // 发送消息
     inputs (e) {
       // 获取当前输入框的值
       let msg = e.detail.value
       // 用户按下回车键且值不为空时向组件外发送msg的值
       if (msg.indexOf('\n') !== -1 && msg.length > 0) {
         let sendData = {
           msg:  this.msg.replace('\n', ''),
           type: 0
         }
         this.$emit('inputs',sendData)
         // 发送后清空输入框内容
         this.msg = ''
       }
     },
     // 点击表情显示到输入框
     sendEmoji (e) {
       this.msg = this.msg + e
     },
     
     // 接收组件传过来的图片并发送到父组件
     sendImg (e) {
       this.$emit('sendImg', e)
     },
     
     // 接收组件传过来的定位信息并发送到父组件
     sendSite (e) {
       this.$emit('sendSite', e)
     }
    }
  }
</script>

<style lang="scss">
  .submit {
    z-index: 100;
    width: 100%;
    position: fixed;
    bottom: 0;
     background: rgb(236, 237, 238);
    box-shadow: inset 0px 0.5px 0px 0px rgba(0, 0, 0, 0.1);
    padding-bottom: 60rpx;
    
    &-top {
      display: flex;
      justify-content: space-around;
      align-items: center;
    
      .emoji-box {
        .emoji {
          width: 56rpx;
          height: 56rpx;
        }
      }
    
      .content {
        width: 100%;
        max-height: 160rpx;
        font-size: 28rpx;
        background: #FFFFFF;
        border-radius: 5px;
        padding: 20rpx 10rpx;
        margin: 20rpx 0;
      }
    
      .more-box {
        .more {
          width: 64rpx;
          height: 64rpx;
        }
      }
    }
    
    &-bottom {
      width: 100%;
      height: 460rpx;
      background: rgb(236, 237, 238);
      box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, .1);
    }
  }
 
</style>
