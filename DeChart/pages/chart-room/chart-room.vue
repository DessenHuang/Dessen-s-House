<template>
  <view class="container">
    <view class="top-bar">
      <view class="top-bar-left">
        <image class="back" src="/static/images/public/left.png" @tap="toBack"></image>
      </view>
      <view class="top-bar-center">{{chartName}}</view>
      <view class="top-bar-right">
        <image class="more" src="/static/images/public/more.png" @tap="toMore"></image>
      </view>
    </view>

    <scroll-view class="chart" scroll-y="true" scroll-with-animation="true" :scroll-into-view="scrollToView">
      <view class="chart-main" :style="{paddingBottom: inputHeight}">
        <view class="msg-item msg-item-left" v-for="(item, index) in msgList" :key="index"
          :class="{'msg-item-right': item.fromId === uid}" :id="`msg${index}`">
          <view class="time">
            <uni-dateformat :date="item.time" :threshold="[60000, 3600000]" format='yyyy/MM/dd hh:mm:ss'>
            </uni-dateformat>
          </view>
          <view class="msg-box">
            <image class="icon" :src="item.iconPath" @tap="iconToDetail(item.fromId)"></image>
            <view class="content">
              <!-- 文字信息 -->
              <view class="content-text" v-if="item.types === 0">{{item.message}}</view>
              <!-- 图片信息 -->
              <image class="content-img" mode="widthFix" :src="item.message" @tap="previewImg(item.message)"
                v-else-if="item.types === 1"></image>
              <!-- 位置信息 -->
              <view class="content-map" @tap="openLocation(item.message)" v-else="item.types === 2">
                <view class="map-name">{{item.message.name}}</view>
                <view class="map-address">{{item.message.address}}</view>
                <image class="map" src="/static/images/chart/map.png" mode="aspectFill"></image>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <submit @inputs="inputs" @height="height" @sendImg="sendImg" @sendSite="sendSite"></submit>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 用户id
        uid: '',
        // 当前好友id
        fid: '',
        // 当前群id
        gid: '',
        // 当前聊天框昵称
        chartName: '',
        // 消息列表
        msgList: [],
        // 消息图片列表
        imglist: [],
        // 定位当前最后一条消息
        scrollToView: '',
        // 当前输入框组件高度
        inputHeight: '88px',
        // 动画变量
        animationData: {},
      };
    },
    onLoad() {
      // 无登陆数据跳转到登陆页
      uni.$toLogin()
      
      // 获取id
      this.getId()

      // 聊天列表数据挂载到msgList节点上
      this.getMsgLsit()

      // socket接收聊天消息
      this.receiveSocket()
      
      // socket接收群聊天消息
      this.receiveGroupSocket()
    },

    onShow() {
      // 获取id
      this.getId()
    },

    watch: {
      // 解决刚进入聊天界面时，界面不滚动问题
      msgList() {
        this.goBottom()
      }
    },

    methods: {
      // 获取id
      getId() {
        // 获取url路径的参数
        let curPage = getCurrentPages()

        // 挂载好友id
        this.fid = curPage[curPage.length - 1].options.fid ? curPage[curPage.length - 1].options.fid : ''

        // 挂载群id
        this.gid = curPage[curPage.length - 1].options.gid ? curPage[curPage.length - 1].options.gid : ''

        // 挂载当前用户id
        this.uid = uni.getStorageSync('user').id

        // 挂载聊天框昵称
        this.chartName = curPage[curPage.length - 1].options.name
      },

      // 返回函数
      toBack() {
        if (this.fid) {
          // 该消息标记为已读
          this.updateTip(this.fid)
        } else {
          // 群消息标记为已读
          this.updateGroupTip()
        }
        
        // 页面返回跳转
        uni.navigateTo({
          url: '/pages/index/index'
        })
      },

      // 点击右侧更多,跳转到用户详情页或群聊详情
      toMore() {
        if (this.fid) {
          // 跳转到用户详情
          uni.navigateTo({
            url: `/pages/user-home/user-home?id=${this.fid}`
          })
        } else {
          // 跳转到群详情
          uni.navigateTo({
            url: `/pages/group-home/group-home?gid=${this.gid}`
          })
        }
      },

      // 点击头像跳转到详情页
      iconToDetail(id) {
        uni.navigateTo({
          url: `/pages/user-home/user-home?id=${id == this.uid ? id : this.fid}`
        })
      },

      // 获取列表数据
      getMsgLsit() {
        if (this.fid) {
          // 获取一对一聊天记录
          this.getMsg()
        } else {
          // 获取群聊记录
          this.getGroupMsg()
        }

        // 滚动到底部
        this.goBottom()
      },

      // 获取一对一聊天数据
      getMsg() {
        uni.request({
          url: `${this.serverUrl}/chart/msg`,
          data: {
            uid: this.uid,
            fid: this.fid
          },
          method: 'POST',
          success: res => {
            if (res.data.status !== 200) console.log('获取聊天记录失败')
            let {
              result
            } = res.data
            result.forEach(item => {
              // 完善头像链接
              item.iconPath = `${this.serverUrl}/user/${item.iconPath}`

              if (item.types === 1) {
                // 完善图片链接
                item.message = `${this.serverUrl}/msgImg/${item.message}`
                // 插入图片列表
                this.imglist.push(item.message)
              }

              // 插入消息列表
              this.msgList.push(item)
            })
          }
        })
      },

      // 获取群聊天数据
      getGroupMsg() {
        uni.request({
          url: `${this.serverUrl}/chart/getgroupmsg`,
          data: {
            gid: this.gid
          },
          method: 'POST',
          success: res => {
            let {
              result
            } = res.data
            result.forEach(item => {
              // 完善头像链接
              item.iconPath = `${this.serverUrl}/user/${item.iconPath}`

              if (item.types === 1) {
                // 完善图片链接
                item.message = `${this.serverUrl}/msgImg/${item.message}`
                // 插入图片列表
                this.imglist.push(item.message)
              }

              // 插入消息列表
              this.msgList.push(item)
            })
          }
        })
      },

      // 预览图片
      previewImg(currentImg) {
        uni.previewImage({
          urls: this.imglist,
          current: currentImg,
          longPressActions: {
            itemList: ['发送给朋友', '保存图片', '收藏'],
            fail: function(err) {
              console.log(err.errMsg);
            }
          }
        });
      },

      // 查看位置
      openLocation(e) {
        uni.openLocation({
          name: e.name,
          address: e.address,
          latitude: e.latitude,
          longitude: e.longitude,
          fail: function(e) {
            console.log(e);
          }
        });
      },

      // 接收图片并发送
      sendImg(e) {
        this.inputs(e)
      },

      // 接收位置消息并发送
      sendSite(e) {
        this.inputs(e)
      },

      // socket发送聊天数据到后台
      sendSocket(e) {
        if (this.fid) {
          // 好友聊天
          this.socket.emit('msg', e, this.fid)
        } else {
          // 群聊
          this.socket.emit('groupMsg', e, this.gid)
        }
      },

      // socket一对一聊天数据接收
      receiveSocket() {
        this.socket.on('msg', msg => {
          // 更新聊天列表
          this.msgList.push(msg)
          // 滚动到底部
          this.goBottom()
        })
      },

      // socket群聊天数据接收
      receiveGroupSocket() {
        this.socket.on('groupMsg', msg => {
          // 更新聊天列表
          this.msgList.push(msg)
          // 滚动到底部
          this.goBottom()
        })
      },

      // 未读消息标记为已读
      updateTip(fromId) {
        uni.request({
          url: `${this.serverUrl}/index/updateunreadmsg`,
          data: {
            uid: this.uid,
            fid: fromId,
            state: 1
          },
          method: 'POST',
          success: res => {}
        })
      },

      // 更新群的未读消息数提示
      updateGroupTip() {
        uni.request({
          url: `${this.serverUrl}/index/updategrouptip`,
          data: {
            uid: this.uid,
            gid: this.gid,
            tip: 0
          },
          method: 'POST',
          success: res => {}
        })
      },

      // 发送消息
      inputs(e) {
        if (this.fid) {
          // 一对一消息发送
          this.sendMsg(e)
        } else {
          // 群消息发送
          this.sendGroupMsg(e)
        }
      },

      // 一对一消息发送
      sendMsg(e) {
        uni.request({
          url: `${this.serverUrl}/chart/insertmsg`,
          data: {
            uid: this.uid,
            fid: this.fid,
            msg: e.type === 2 ? {
              name: e.name,
              address: e.address,
              latitude: e.latitude,
              longitude: e.longitude,
            } : e.msg,
            type: e.type
          },
          method: 'POST',
          success: res => {
            if (res.data.status !== 200) return console.log('发送消息失败！')
            let {
              result
            } = res.data

            // 生成消息数据  
            let msgData = {
              fromId: this.uid,
              iconPath: `${this.serverUrl}/user/${uni.getStorageSync('user').iconPath}`,
              id: result._id,
              message: result.types === 1 ? `${this.serverUrl}/msgImg/${result.message}` : result.message,
              time: result.time,
              types: result.types
            }

            // 插入到消息列表
            this.msgList.push(msgData)

            // 图片插入到图片列表
            if (e.type === 1) this.imglist.push(msgData.message)

            // 通过socket发送聊天数据到后台
            this.sendSocket(msgData)

            // 更新最后通讯时间
            this.updateLastTime()

            // 滚动到底部
            this.goBottom()
          }
        })
      },

      // 群消息发送
      sendGroupMsg(e) {
        uni.request({
          url: `${this.serverUrl}/chart/insertgroupmsg`,
          data: {
            uid: this.uid,
            gid: this.gid,
            msg: e.type === 2 ? {
              name: e.name,
              address: e.address,
              latitude: e.latitude,
              longitude: e.longitude,
            } : e.msg,
            type: e.type
          },
          method: 'POST',
          success: res => {
            if (res.data.status !== 200) return console.log('发送消息失败！')
            let {
              result
            } = res.data

            // 生成消息数据  
            let msgData = {
              fromId: this.uid,
              iconPath: `${this.serverUrl}/user/${uni.getStorageSync('user').iconPath}`,
              id: result._id,
              message: result.types === 1 ? `${this.serverUrl}/msgImg/${result.message}` : result.message,
              time: result.time,
              types: result.types
            }

            // 插入到消息列表
            this.msgList.push(msgData)

            // 图片插入到图片列表
            if (e.type === 1) this.imglist.push(msgData.message)

            // 通过socket发送聊天数据到后台
            this.sendSocket(msgData)

            // 更新最后通讯时间
            this.updateGroupLastTime()

            // 滚动到底部
            this.goBottom()
          }
        })
      },

      // 更新最后通讯时间
      updateLastTime() {
        uni.request({
          url: `${this.serverUrl}/index/updatelasttime`,
          data: {
            uid: this.uid,
            fid: this.fid,
            type: ''
          },
          method: 'POST',
        })
      },

      // 更新群最后通讯时间
      updateGroupLastTime() {
        uni.request({
          url: `${this.serverUrl}/index/updatelasttime`,
          data: {
            gid: this.gid,
            type: 'group'
          },
          method: 'POST',
        })
      },

      // 更新图片信息到后台
      uploadFile(e) {
        uni.uploadFile({
          url: `${this.serverUrl}/files/upload`,
          filePath: e.path,
          name: 'file',
          fileType: 'image',
          formData: {
            url: 'msgImg',
            name: e.msg.substring(0, e.msg.lastIndexOf("."))
          },
          success: (uploadFileRes) => {
            // 接收返回的文件名称,并完善图片链接
            let imgUrl = `${this.serverUrl}/msgImg/${e.msg}`
            // 图片插入到图片列表
            this.imglist.push(imgUrl)
          },

          fail(e) {
            console.log("this is errormes " + e.message);
          },
        });
      },

      //获取当前高度
      height(e) {
        this.inputHeight = e + 'px'
        this.goBottom()
      },

      // 滚动到底部
      goBottom() {
        this.scrollToView = ''
        this.$nextTick(() => {
          this.scrollToView = 'msg' + String(this.msgList.length - 1)
        })
      },
    }
  }
</script>

<style lang="scss">
  // 引入top-bar公共样式
  @import url("@/commons/css/top-bar.scss");

  .top-bar {
    background-color: #F4F4F4;

    .top-bar-left {
      .back {
        width: 48rpx;
        height: 48rpx;
      }
    }

    .top-bar-right {
      .more {
        width: 48rpx;
        height: 48rpx;
      }
    }
  }

  .chart {
    height: 100vh;
    background-color: #F4F4F4;

    .chart-main {
      padding-top: 20rpx;
      padding-right: 20rpx;
      padding-left: 20rpx;

      .loading {
        text-align: center;

        &-img {
          width: 60rpx;
          height: 60rpx;
        }
      }

      .msg-item {
        padding: 20rpx 0;

        .time {
          padding: 20rpx 0;
          text-align: center;
          font-size: 24rpx;
          color: rgba(39, 40, 50, 0.30);
          font-weight: 400;
        }

        .msg-box {
          display: flex;
          flex-wrap: wrap;

          .icon {
            width: 80rpx;
            height: 80rpx;
            border-radius: 20rpx;
            margin-right: 20rpx;
          }

          .content-text,
          .content-map {
            max-width: 480rpx;
            padding: 20rpx;
            font-size: 32rpx;
            color: #272832;
            font-weight: 400;
            background-color: #fff;
            border-radius: 0 20rpx 20rpx 20rpx;
          }

          .content-map {
            width: 480rpx;
            padding: 0;
            border-radius: 20rpx 0 20rpx 20rpx;

            .map-name {
              padding-left: 20rpx;
              padding-top: 20rpx;
              font-size: 32rpx;
              font-weight: 400;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .map-address {
              padding: 10rpx 20rpx;
              font-size: 20rpx;
              color: rgba(39, 40, 50, 0.60);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .map {
              display: block;
              width: 100%;
              height: 300rpx;
            }
          }

          .content-img {
            display: block;
            max-width: 284rpx;
            border-radius: 20rpx;
          }
        }
      }

      .msg-item-right {
        .msg-box {
          flex-direction: row-reverse;

          .icon {
            margin-right: 0;
            margin-left: 20rpx;
          }

          .content-text {
            background-color: #FFE431;
            border-radius: 20rpx 0 20rpx 20rpx;
          }
        }
      }
    }
  }
</style>
