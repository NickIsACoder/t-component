<template>
    <div class="t-upload">
        <div class="t-upload-select" @click="handleClick">
            <input type="file"
                   ref="input"
                   class="t-upload-input"
                   :multiple="multiple"
                   :accept="accept"
                   @change="handleChange">
            <slot name="trigger">
            </slot>
        </div>
        <slot name="tip"></slot>
        <transition name="transition-fade">
            <ul :class="['t-upload-list', 't-upload-list-' + listType]">
               <li class="t-upload-list-item"
                   v-for="(item, index) in currentFileList"
                   :key="index">
                   <img v-if="listType==='picture-card' && item.status !== 'uploading'"
                        :src="item.url">
                   <a class="t-upload-list-item-text">
                       <span v-if="listType !=='picture-card'">{{item.name}}</span>
                       <i v-show="item.status === 'success'"
                          :class="[
                          'iconfont',
                          't-upload-list-remove',
                           {
                           'icon-error': listType==='picture-card',
                           'icon-close': listType === 'text'
                           }
                           ]"
                          @click="remove(item)"></i>
                   </a>
                   <transition name="transition-fade">
                       <t-progress v-if="item.showProgress && item.status === 'uploading'"
                               :percent="item.percentage"
                               :type="listType === 'picture-card' ? 'circle' : 'line'"
                               :status="item.status"
                               :style="{
                               border: listType === 'picture-card' ? '1px solid #e5e5e5' : 'none'
                               }"
                               :strokeWidth="3"></t-progress>
                   </transition>
               </li>
            </ul>
        </transition>
        <div class="t-upload-select-picture"
             v-if="listType === 'picture-card' && !$slots.trigger"
             @click="handleClick">
            <i class="iconfont icon-add"></i>
        </div>
    </div>
</template>
<script>
/* eslint-disable no-bitwise */
import tProgress from '../progress/index';

export default {
  name: 't-upload',
  data() {
    return {
      currentFileList: [], // 当前上传的文件列表
    };
  },
  components: { tProgress },
  props: {
    action: String, // 上传地址
    accept: String, // 接受上传的文件类型
    customRequest: Function, // 自定义自己的上传实现
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    // 是否支持多选ie10+支持，开启后按住Ctrl可选择多个文件
    multiple: {
      type: Boolean,
      default: false,
    },
    name: String, // 发送到后台的文件参数名
    listType: {
      type: String,
      default: 'text',
    },
    maxSize: Number, // 文件大小限制
    limit: Number, // 最多上传文件的个数
    fileList: {
      type: Array,
      default: () => [],
    }, // 上传文件的列表
    onRemove: Function, // 文件移除时的钩子
    beforeUpload: Function, // 上传前的钩子
    onExcess: Function, // 超过上传文件个数的钩子
    success: Function, // 上传成功触发的事件
    error: Function, // 上传失败触发的事件
  },
  methods: {
    handleClick() {
      if (this.disabled) return;
      this.$refs.input.value = null;
      this.$refs.input.click();
    },
    // 获取选中的文件
    handleChange(e) {
      const files = e.target.files;
      if (!files) {
        return;
      }
      // 有限制上传文件的个数的情况，判断文件的个数是否超过限制
      if (this.limit && this.fileList.length + files.length > this.limit) {
        this.onExcess(files, this.fileList);
        return;
      }
      let postFiles = Array.prototype.slice.call(files);
      if (postFiles.length === 0) return;
      // 上传单个文件时，取第一个文件
      if (!this.multiple) {
        postFiles = postFiles.slice(0, 1);
      }
      // 逐个上传
      postFiles.forEach((file) => {
        this.uploadFile(file);
      });
    },
    // 上传文件
    uploadFile(file) {
      // 是否触发上传前的钩子函数
      if (!this.beforeUpload) {
        this.postFile(file);
        return;
      }
      // 是否可继续上传
      const isBefore = this.beforeUpload(file);
      if (isBefore === true) {
        this.postFile(file);
      }
    },
    // 接口调用上传至服务器
    postFile(file) {
      // 默认上传实现
      if (!this.customRequest) {
        // 文件大小校验
        if (this.maxSize) {
          if (file.size > this.maxSize * 1024) {
            this.$notify.error(`文件大小不得超过${this.maxSize}kb`);
            return;
          }
        }
        // 初始化要上传的文件并加到列表中
        this.uploadInit(file);
        const currentFile = this.getFile(file);
        const formData = new FormData();
        formData.append(this.name, file);
        this.$http.post(this.action, formData, {
          headers: { 'Content-type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            // 根据上传进度改变currentFileList中当前文件的上传进度和状态
            currentFile.percentage = (e.loaded / e.total) * 100 | 0;
            currentFile.status = 'uploading';
          },
        }).then((res) => {
          if (res.status === 200) {
            // 上传成功
            currentFile.status = 'success';
            currentFile.showProgress = false;
            this.success(res, file);
          } else {
            // 上传失败
            this.currentFileList.splice(this.currentFileList.indexOf(file), 1);
            this.error(res, file);
          }
        }).catch((err) => {
          this.currentFileList.splice(this.currentFileList.indexOf(file), 1);
          this.error(err, file);
          if (err.message.indexOf('Network Error') > -1) {
            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
            this.$notify.error(`网络出错:${err.message}`);
          } else {
            this.$notify.error(`程序出错：${err.message}`);
          }
        });
      } else {
        // 使用自定义的上传实现
        this.customRequest(file);
      }
    },
    // 对文件进行初始化
    uploadInit(obj) {
      const file = obj;
      file.uuid = `${Date.now()}${(((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)}`;
      const fileInit = {
        status: 'uploading',
        name: file.name,
        size: file.size,
        percentage: 0,
        showProgress: true,
        uuid: file.uuid,
      };
      this.currentFileList.push(fileInit);
    },
    // 在上传文件中查找对应的文件
    getFile(file) {
      const fileList = this.currentFileList;
      const index = fileList.findIndex(item => item.uuid === file.uuid);
      return index > -1 ? fileList[index] : null;
    },
    // 移除文件
    remove(file) {
      const { currentFileList } = this;
      this.onRemove(file, currentFileList);
    },
  },
  watch: {
    // 监听文件列表的变化
    fileList: {
      immediate: true,
      handler(val) {
        // 初始化文件列表
        this.currentFileList = val.map((item) => {
          const file = item;
          file.status = 'success';
          file.percentage = 100;
          file.uuid = `${Date.now()}${(((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)}`;
          return file;
        });
      },
    },
  },
};
</script>
<style lang="less">
.t-upload {
    &-input {
        display: none;
    }
    &-select {
        display: inline-block;
        &-picture {
             display: inline-block;
             border: 1px dashed #e5e5e5;
             width: 100px;
             text-align: center;
             height: 100px;
             vertical-align: middle;
             line-height: 100px;
             margin: 5px;
             cursor: pointer;
            &:hover {
                border-color: #b9b9b9;
             }
        }
    }
    &-list {
        list-style: none;
        margin: 0;
        padding: 0;
        &-text {
            & .t-upload-list-item {
                padding: 10px 5px;
                position: relative;
                cursor:pointer;
                &:hover {
                    background-color: #e7e9ec;
                    & .t-upload-list-item-text {
                        color: #ff5722;
                    }
                 }
            }
        }
        &-picture-card {
            & .t-upload-list-item {
                display: inline-block;
                width: 100px;
                position: relative;
                border: 1px solid transparent;
                -webkit-border-radius: 3px;
                -moz-border-radius: 3px;
                border-radius: 3px;
                float: left;
                margin: 5px;
                height: 100px;
                & img {
                    width: 100%;
                    height: 100%;
                }
                &-text {
                    position: absolute;
                    margin-right: 0;
                    padding-left: 0;
                    top: 0;
                    height: 16px;
                    width: 100%;
                    & .t-upload-list-remove {
                        right: 0;
                        color: #fff;
                        cursor: pointer;
                    }
                }
            }
        }
        &-item-text {
             color: #606266;
             display: block;
             margin-right: 40px;
             overflow: hidden;
             padding-left: 4px;
             text-overflow: ellipsis;
             transition: color .3s;
             white-space: nowrap;
         }
        &-remove {
            position: absolute;
            right: 10px;
        }
    }
}
</style>
