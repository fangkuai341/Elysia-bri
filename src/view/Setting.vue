<template>
  <div>
    <h1>设置</h1>
    <div>
      <div>结束时间</div>
      <input type="time" @change="change" v-model="endTime" />
    </div>
    <div>
      <div>总点击的次数（只可以设置一次）</div>
      <input type="text" @change="change" v-model="clickNum" />
    </div>
    <div>
      <div>速率调节（点击一次相当于点击了x次）</div>
      <input type="text" @change="change" v-model="speed" />
    </div>
    <button>直接100%</button>
    <button @click="yGame">樱游戏展示</button>
    <button @click="sGame">蛇游戏页面</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const channel = ref();
const endTime = ref();
const clickNum = ref();
const speed = ref();
const yVal = ref(false);
const sVal = ref(false);
onMounted(() => {
  channel.value = new BroadcastChannel("setting");
});
const change = (e) => {
  channel.value.postMessage({
    endTime: endTime.value,
    clickNum: +clickNum.value,
    speed: +speed.value,
  });
};
const yGame = (val) => {
  yVal.value = !yVal.value;
  channel.value.postMessage({
    yGame: yVal.value,
  });
};
const sGame = (val) => {
  sVal.value = !sVal.value;
  channel.value.postMessage({
    sGame: sVal.value,
  });
};
</script>

<style></style>
