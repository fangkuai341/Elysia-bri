<template>
  <div @click="startVideo">
    <video
      v-if="!isImgShow"
      width="250"
      height="200"
      autoplay
      muted
      loop
      class="video"
      :style="{ left: progressBarWidth + '%' }"
    >
      <source src="../assets/video/walk.webm" type="video/webm" />
      您的浏览器不支持 video 标签。
    </video>
    <img
      v-else
      src="../assets/img/on.png"
      class="videoImg"
      :style="{ left: progressBarWidth + '%' }"
    />
    <div
      class="progressImg"
      v-if="progressBarWidth > 10"
      :style="{ width: progressBarWidth + '%' }"
    />
    <div
      style="height: 25px"
      v-else
      :style="{ width: progressBarWidth + '%' }"
    />
    <div style="display: flex; align-items: center; gap: 5px">
      <div class="progress-bar-container">
        <div
          class="progress-bar"
          :style="{ width: progressBarWidth + '%' }"
        ></div>
      </div>
      <div class="processTest">{{ progressBarWidth }}%</div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch, ref } from "vue";
const isImgShow = ref(false);
const props = defineProps({
  progress: {
    type: Number,
    required: true,
    default: 0,
  },
});
const progressBarWidth = computed(() => {
  return props.progress > 100 ? 100 : props.progress;
});
const startVideo = () => {
  const video = document.querySelector("video");
  video.play();
};
watch(
  () => progressBarWidth.value,
  (val) => {
    isImgShow.value = true;
    setTimeout(() => {
      console.log(val);
      if (val !== 100) {
        isImgShow.value = false;
      }
    }, 300);
  }
);
</script>

<style scoped>
.progress-bar-container {
  width: 100%;
  height: 40px;
  background-color: #eee; /* 黑色背景部分 */
  border-radius: 20px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: pink; /* 绿色部分背景色 */
  border-radius: 20px;
  transition: width 0.3s ease;
  background-image: repeating-linear-gradient(
    45deg,
    /* 设置斜线角度 */ rgba(0, 0, 0, 0.1),
    /* 第一条斜线颜色（黑色，透明度0.1） */ rgba(0, 0, 0, 0.1) 10px,
    /* 斜线的宽度 */ transparent 10px,
    /* 间隙开始 */ transparent 20px /* 间隙结束，间隙宽度为10px */
  );
}
.video {
  position: absolute;
  transform: translateX(-50%) translateY(-85%);
  left: 0;
  object-fit: fill;
}
.videoImg {
  position: absolute;
  transform: translateX(-50%) translateY(-95%);
  height: 180px;
}
.progressImg {
  background: url(../assets/img/cao.png);
  background-repeat: repeat;
  background-size: contain;
  height: 25px;
}
.processTest {
  font-family: "正文字体", "Franklin Gothic Medium", "Arial Narrow", Arial;
  font-weight: 800;
  min-width: 40px;
  position: absolute;
  right: -45px;
}
</style>
