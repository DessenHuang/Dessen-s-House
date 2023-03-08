<template>
  <view class="more">
    <view class="more-main">
      <image class="photo" src="/static/images/chart/photo.png" @tap="sendImg('album')"></image>
      <image class="camera" src="/static/images/chart/camera.png" @tap="sendImg('camera')"></image>
      <image class="location" src="/static/images/chart/location.png" @tap="chooseLocation"></image>
      <image class="video" src="/static/images/chart/video.png"></image>
      <image class="file" src="/static/images/chart/file.png"></image>
    </view>
  </view>
</template>

<script>
  import { pathToBase64, base64ToPath } from 'image-tools'
  export default {
    name: "more",
    data() {
      return {

      };
    },
    methods: {
      // 选择要发送的图片
      sendImg(e) {
        let count = 5
        if (e === 'album') {
          count = 5
        } else {
          count = 1
        }
        uni.chooseImage({
          count: count, //默认5
          sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album'], //从相册选择
          success: res => {
            try{
              res.tempFiles.forEach(async (item) => {
                // 图片名称用时间戳声明
                let fileName = new Date().getTime() + item.name.substring(item.name.lastIndexOf("."))
  
                // 更新图片信息到后台
                this.uploadFile(await pathToBase64(item.path), fileName)
              })
            }catch(e){
              //TODO handle the exception
            }
          }
        })
      },
      
      // 更新图片信息到后台
      uploadFile(path, fileName) {
        uni.uploadFile({
          url: `${this.serverUrl}/files/upload`,
          filePath: path,
          name: 'file',
          fileType: 'image',
          formData: {
            url: 'msgImg',
            name: fileName.substring(0, fileName.lastIndexOf("."))
          },
          success: (uploadFileRes) => {
           let data = {
             msg: fileName,
             type: 1
           }
           // 传参到父组件
           this.$emit('sendImg', data)
          },
      
          fail(e) {
            console.log("this is errormes " + e.message);
          },
        });
      },
      
      // 发送定位
      chooseLocation() {
        uni.chooseLocation({
          success: res => {
            let data = {
              // 位置名称
              name: res.name,
              // 详细地址
              address: res.address,
              // 维度
              latitude: res.latitude,
              // 经度
              longitude: res.longitude,
              // 数据类型
              type: 2
            }
            this.$emit('sendSite', data)
          }
        });
      }
    }
  }
</script>

<style lang="scss">
  .more {
    height: 100%;
    display: flex;
    justify-content: center;
    padding-top: 36rpx;

    .more-main {
      width: 90%;
      height: 60%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;

      image {
        margin: 18rpx;
        width: 72rpx;
        height: 72rpx;
        padding: 24rpx;
        background-color: #fff;
        border-radius: 20rpx;
      }
    }
  }
</style>
