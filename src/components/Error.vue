<template>
  <div class="glitch-container">
    <!-- 故障方块 -->
    <div
      v-for="(square, index) in squares"
      :key="index"
      class="glitch-square"
      :style="{
        width: square.size + 'px',
        height: square.size + 'px',
        top: square.top + 'px',
        left: square.left + 'px',
        backgroundPosition: `-${square.bgX}px -${square.bgY}px`,
      }"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// 方块数据
const squares = ref([]);

// 生成故障方块并控制显示和消失
const createGlitchSquares = () => {
  const numSquares = 10; // 控制方块数量
  const imgSize = 200; // 图片的尺寸，可以根据实际图片大小调整

  for (let i = 0; i < numSquares; i++) {
    // 生成方块的随机大小和位置
    const size = Math.random() * 100 + 20;
    const top = Math.random() * window.innerHeight;
    const left = Math.random() * window.innerWidth;
    const bgX = Math.random() * imgSize;
    const bgY = Math.random() * imgSize;

    // 每隔 100ms 添加一个方块（依次出现的效果）
    setTimeout(() => {
      squares.value.push({ size, top, left, bgX, bgY });

      // 随机设置方块的消失时间（0.5 到 1.5 秒之间）
      const disappearTime = Math.random() * 1000 + 500;
      setTimeout(() => {
        squares.value.shift(); // 移除第一个方块实现消失效果
      }, disappearTime);
    }, i * 100);
  }
};

// 定时刷新效果
onMounted(() => {
  createGlitchSquares();

  // 每隔1.5秒重新生成故障方块
  setInterval(() => {
    squares.value = []; // 清空方块数组
    createGlitchSquares();
  }, 1500);
});
</script>

<style scoped>
.glitch-container {
  width: 90vw;
  height: 90vh;
  overflow: hidden;
  background-color: transparent;
  position: absolute;
}

/* 故障方块样式 */
.glitch-square {
  position: absolute;
  background-image: url("../assets/img/bg_no.png"); /* 替换为你的图片路径 */
  background-size: cover;
  opacity: 0.8;
  animation: flash-square 0.2s infinite alternate;
}

/* 方块闪烁动画 */
@keyframes flash-square {
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
