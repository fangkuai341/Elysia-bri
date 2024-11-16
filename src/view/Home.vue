<template>
  <div class="home">
    <div
      v-show="xjVideo"
      style="
        position: fixed;
        top: 50%;
        left: 50%;
        min-width: 100%;
        min-height: 100%;
        width: auto;
        height: auto;
        transform: translate(-50%, -50%);
      "
    >
      <video width="100%" height="100%" muted ref="xjVideoRef">
        <source
          src="../assets/video/xj.mp4"
          type="video/mp4"
          ref="xjSourceRef"
        />
        您的浏览器不支持 video 标签。
      </video>
    </div>

    <div>
      <div class="time" :class="{ isErrorPage: isError }">
        <div>
          <span @click="openYGame">距</span><span @click="openLGame">离</span
          ><span @click="fastSpeed">生</span><span @click="slowSpeed">日</span
          ><span @click="speedOne">舞</span>会开始还有
        </div>
        <div>{{ timeValue }}</div>
      </div>
      <div
        style="
          width: 45%;
          position: absolute;
          left: 50%;
          bottom: 16%;
          transform: translateX(-50%);
        "
      >
        <ProgressBar :progress="progress" />
      </div>
      <button @click="click" style="position: absolute">被按下</button>
    </div>

    <div
      class="one-img"
      style="background: transparent"
      v-if="isyGameRule"
      @click="isyGameRule = false"
    >
      <img src="../assets/img/yin.png" style="width: 100%" class="img" />
    </div>
    <div
      class="one-img"
      style="background: transparent"
      v-if="issGameRule"
      @click="issGameRule = false"
    >
      <img src="../assets/img/se.png" style="width: 100%" class="img" />
    </div>
    <div class="one-img" v-if="isOneH">
      <img :src="imgSrc" style="height: 100%" class="img" />
    </div>

    <Error v-if="isErrorPage" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
import { io } from "socket.io-client";
import ProgressBar from "../components/ProgressBar.vue";
import Error from "../components/Error.vue";
import { message } from "ant-design-vue";
const channel = ref();
const socket = ref();
const progress = ref(0);
const endTime = ref<string>("0");
const clickNum = ref(200);
const speed = ref(1);
const isError = ref(false);
const isErrorPage = ref(false);
const timer = ref();
const audio = ref();
const isOneH = ref(false);
const imgSrc = ref();
const issGameRule = ref(false);
const isyGameRule = ref(false);
const timeValue = ref();
const xjVideo = ref(false);
const xjVideoRef = ref();
const xjSourceRef = ref();
onMounted(() => {
  imgSrc.value = "/src/assets/img/hh_0.jpg";
  setInterval(() => {
    getTime();
  }, 1000);
  if (localStorage.getItem("progress")) {
    progress.value = Number(localStorage.getItem("progress"));
  } else {
    localStorage.setItem("progress", "0");
  }
  if (localStorage.getItem("isError")) {
    isError.value = localStorage.getItem("isError") === "true";
  } else {
    localStorage.setItem("isError", "false");
  }
  if (localStorage.getItem("isOneH")) {
    isOneH.value = localStorage.getItem("isOneH") === "true";
  } else {
    localStorage.setItem("isOneH", "false");
  }
  if (localStorage.getItem("isErrorPage")) {
    isErrorPage.value = localStorage.getItem("isErrorPage") === "true";
  } else {
    localStorage.setItem("isErrorPage", "false");
  }
  if (localStorage.getItem("endTime")) {
    endTime.value = localStorage.getItem("endTime") || "0";
  } else {
    localStorage.setItem("endTime", "0");
  }
  if (localStorage.getItem("clickNum")) {
    clickNum.value = Number(localStorage.getItem("clickNum"));
  } else {
    localStorage.setItem("clickNum", "200");
  }
  if (localStorage.getItem("speed")) {
    speed.value = Number(localStorage.getItem("speed"));
  } else {
    localStorage.setItem("speed", "1");
  }
  channel.value = new BroadcastChannel("setting");
  channel.value.onmessage = (e: any) => {
    if (e.data.endTime) {
      localStorage.setItem("endTime", e.data.endTime);
      endTime.value = e.data.endTime;
    }
    if (e.data.clickNum) {
      localStorage.setItem("clickNum", e.data.clickNum);
      clickNum.value = e.data.clickNum;
    }

    if (e.data.speed) {
      localStorage.setItem("speed", e.data.speed);
      speed.value = e.data.speed;
    }

    isyGameRule.value = e.data.yGame;
    issGameRule.value = e.data.sGame;
  };
  audio.value = new Audio();
  audio.value.src = "/src/assets/audio/error.mp3";
  if (progress.value >= 70 && progress.value <= 100 && isError.value) {
    xjVideo.value = true;
    nextTick(() => {
      xjSourceRef.value.src = "/src/assets/video/xunhuanqs.mp4"; // 更新视频源
      xjVideoRef.value.load(); // 重新加载视频
      //视频循环
      xjVideoRef.value.loop = true;
      xjVideoRef.value.play(); // 播放新视频
    });
  }
});

const openYGame = () => {
  isyGameRule.value = !isyGameRule.value;
};
const openLGame = () => {
  issGameRule.value = !issGameRule.value;
};
const fastSpeed = () => {
  //加快速率
  speed.value = speed.value + 1;
  localStorage.setItem("speed", "" + speed.value);
  message.success("速率已加快" + speed.value);
};
const slowSpeed = () => {
  //减慢速率
  if (speed.value > 1) {
    speed.value = speed.value - 1;
  } else {
    speed.value = speed.value / 2;
  }

  localStorage.setItem("speed", "" + speed.value);
  message.success("速率已减慢" + speed.value);
};
const speedOne = () => {
  //速率恢复为1
  speed.value = 1;
  localStorage.setItem("speed", "" + speed.value);
  message.success("速率已恢复为1");
};
socket.value = io(`ws://${location.hostname}:11000/test_conn`);
socket.value.on("server_response", function () {
  // progress.value按照点击次数和速率增加
  progress.value = Number(
    (progress.value + (speed.value * 100) / clickNum.value).toFixed(2)
  );
  if (
    90 > progress.value &&
    progress.value > 70 &&
    isError.value &&
    !isErrorPage.value
  ) {
    setTimeout(() => {
      progress.value = Number(
        (progress.value - (speed.value * 100) / clickNum.value / 2).toFixed(2)
      );
    }, 300);
  }
});
const getTime = () => {
  let timeArray = endTime.value.split(":");
  let date = new Date();
  date.setHours(+timeArray[0], +timeArray[1], 0, 0);
  // 将日期对象转换为时间戳
  let timestamp = date.getTime();
  // 获取当前时间戳
  let now = new Date().getTime();
  // 计算时间差
  let diff = timestamp - now;
  //将时间差转换为hh:ss:mm
  let hour = Math.floor(diff / 1000 / 60 / 60);
  let minute = Math.floor((diff / 1000 / 60) % 60);
  let second = Math.floor((diff / 1000) % 60);
  timeValue.value = `${hour}:${minute}:${second}`;
};
const click = function () {
  // progress.value按照点击次数和速率增加
  progress.value = Number(
    (progress.value + (speed.value * 100) / clickNum.value).toFixed(2)
  );
  if (
    90 > progress.value &&
    progress.value > 70 &&
    isError.value &&
    !isErrorPage.value
  ) {
    setTimeout(() => {
      progress.value = Number(
        (progress.value - (speed.value * 100) / clickNum.value / 2).toFixed(2)
      );
    }, 300);
  }
};
watch(
  () => progress.value,
  async (newVal) => {
    if (newVal >= 90 && !isError.value) {
      xjVideo.value = true;
      isErrorPage.value = true;
      isError.value = true;
      nextTick(() => {
        xjVideoRef.value.play();
        //视频结束
        xjVideoRef.value.onended = function () {
          //替换xjVideoRef的视频
          xjSourceRef.value.src = "/src/assets/video/xunhua.mp4"; // 更新视频源
          xjVideoRef.value.load(); // 重新加载视频
          //视频循环
          xjVideoRef.value.loop = true;
          xjVideoRef.value.play(); // 播放新视频
        };
      });

      audio.value.play().catch(() => {
        console.error("音频播放失败：");
      });
      timer.value = setInterval(() => {
        progress.value = progress.value - 2;
        if (progress.value <= 70) {
          clearInterval(timer.value);
          isErrorPage.value = false;
        }
      }, 300);
    }
    if (newVal >= 100 && isError.value) {
      xjVideo.value = false;
      isOneH.value = true;
      audio.value.src = "/src/assets/audio/huahuo.wav";
      audio.value.play().catch(() => {
        console.error("音频播放失败：");
      });
      //替换img下面的src
      setTimeout(() => {
        imgSrc.value = "/src/assets/img/hh_1.jpg";
        setTimeout(() => {
          isOneH.value = false;
          isErrorPage.value = false;
          isError.value = false;
        }, 3000);
      }, 3000);
    }
    localStorage.setItem("progress", "" + progress.value);
    localStorage.setItem("isError", "" + isError.value);
    localStorage.setItem("isOneH", "" + isOneH.value);
    localStorage.setItem("isErrorPage", "" + isErrorPage.value);
  }
);
// 监听localStorage的变化
</script>

<style>
.home {
  background-image: url("../assets/img/bg_no.png");
  width: 100vw;
  height: 100vh;
  background-size: cover; /* 让图片覆盖整个容器 */
  background-position: center; /* 图片居中显示 */
  background-repeat: no-repeat; /* 不重复显示图片 */
  overflow: hidden;
}

.time {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 3rem;
  font-family: "标题字体", "Franklin Gothic Medium", "Arial Narrow", Arial,
    sans-serif;
  font-weight: 800;
  text-align: center;
  color: #000;
}
.isErrorPage {
  font-family: "侵蚀字体", "Franklin Gothic Medium", "Arial Narrow", Arial,
    sans-serif;
  color: #fff;
}
.one-img {
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  background: #000;
  display: flex;
  justify-content: center;
}
</style>
