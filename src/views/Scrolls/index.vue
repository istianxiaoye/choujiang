<script setup lang="ts">
// -- imports
import { reactive, onMounted, ref } from "vue";
import json from "./data.json";
import LuckyDraw from "@/utils/LuckyDraw";
import PageBack from "@/components/PageBack/index.vue";
//import { ElMessage } from 'element-plus';

// -- 定义容器内数据类型
interface BoxProps {
  productId: number;
  armsName: string;
  skinsName: string;
  rarityColor: string;
  image: string;
}
interface DataProps {
  title: string;
  pmsBoxProductAbbrList: Array<BoxProps>;
}
interface StateProps {
  /** 数据源 */
  data: DataProps | null;
  /** 抽奖数据（需特殊处理） */
  luckyDrawData: Array<BoxProps> | null;
  /** 中奖结果 */
  luckyDrawResults: BoxProps | null;
  /** 是否展示中间结果 */
  luckyDrawResultsVisible: boolean;
  /** 是否启用音效 */
  openSound: boolean;
  /** 是否启用动效 */
  openAnimation: boolean;
  /** 奖品元素的宽度 */
  itemWidth: number;
  /** 是否正在执行动效 */
  isAnimating: boolean;
}

// -- refs
const luckyDrawRef = ref();
const luckyDrawWrapRef = ref();
// -- state
const state = reactive<StateProps>({
  data: null,
  luckyDrawData: null,
  luckyDrawResults: null,
  luckyDrawResultsVisible: false,
  openSound: true,
  openAnimation: true,
  itemWidth: 0,
  isAnimating: false,
});

// -- life circles
onMounted(() => {
  getData();
  getBoundings();
});

/**
 * 获取元素的样式属性值
 *
 * @param {any} el - DOM元素节点
 * @param {string} attr - 样式属性名称
 * @returns {string} - 样式属性值
 */
const getStyle = (el: any, attr: string) => {
  if (el.currentStyle) {
    return el.currentStyle[attr];
  } else {
    // @ts-ignore
    return getComputedStyle(el, null)[attr];
  }
};
// 获取元素的边界框
const getBoundings = () => {
  // 将元素的宽度转换为整数
  const w = parseInt(getStyle(luckyDrawRef.value, "width"));
  // 计算每个元素的宽度
  state.itemWidth = w / 7;
};

// 获取背景色
const getBgColor = (colorStop: string) => {
  return `linear-gradient(to bottom, #000 50%, ${colorStop} 100%)`;
};
//模拟请求数据
const getData = () => {
  state.data = json;
  state.luckyDrawData = LuckyDraw.getLuckyDrawDataList<BoxProps>({
    source: json.pmsBoxProductAbbrList,
    total: 22,
    visibleCount: 5,
  });
};

// 抽奖事件
const onOpenBox = () => {
  if (!state.data || !state.luckyDrawData || state.isAnimating) return;

  state.luckyDrawResultsVisible = false;
  state.isAnimating = true;
  // -- 模拟ajax请求，获取中奖物品
  const len = state.data.pmsBoxProductAbbrList.length;
  // -- 随机获取一个中奖物品
  const index = Math.floor(Math.random() * len);
  const openResults = state.data.pmsBoxProductAbbrList[index];
  state.luckyDrawResults = openResults;
  // -- 执行动画
  LuckyDraw.draw({
    winningID: openResults.productId,
    winningIDs: state.luckyDrawData.map((item) => item.productId),
    wrap: luckyDrawWrapRef.value,
    itemWidth: state.itemWidth,
    visibleItemCount: 7,
    //动画执行时间，默认10秒
    duration: 5,
    //是否打开动画
    openAnimation: state.openAnimation,
    //是否打开声音
    openSound: state.openSound,
    //音乐开始播放声音
    audioUriForStart: "/mp3s/case-one.mp3",
    //音乐结束播放声音
    audioUriForEnd: "/mp3s/case-coin.mp3",
    //动画结束回调
    completed: () => {
      //关闭动画
      state.isAnimating = false;
      //将抽到的（礼品或者号码等）展示出来
      state.luckyDrawResultsVisible = true;
    },
  });
};
//不展示中奖结果
const onSell = () => {
  state.luckyDrawResultsVisible = false;
};
</script>

<template>
  <div class="page ff-DIN-Bold">
    <div class="contents">
      <PageBack />
      <!-- Header Start -->
      <div class="top">
        <img class="logo" src="../../assets/logo.png" />
        <div class="title">{{ state.data?.title }}</div>
        <div class="controls flex-h-center">
          <div class="item flex-h-center">
            <span class="label">声音是否开启:</span>
            <el-switch v-model="state.openSound" style="--el-switch-on-color: #5fb878" />
          </div>
          <div class="item flex-h-center">
            <span class="label">动画是否开启:</span>
            <el-switch
              v-model="state.openAnimation"
              style="--el-switch-on-color: #5fb878"
            />
          </div>
        </div>
      </div>
      <!-- Header End -->

      <!-- Lucky-draw Start -->
      <div class="lucky-draw" ref="luckyDrawRef">
        <!-- 抽奖标识线 -->
        <div class="lucky-line"></div>
        <!-- 抽奖物品容器 -->
        <div class="lucky-draw-wrap" ref="luckyDrawWrapRef">
          <template v-for="(item, index) in state.luckyDrawData" :key="index">
            <div
              class="lucky-draw-item"
              :style="{
                width: state.itemWidth + 'px',
                background: getBgColor(item.rarityColor),
              }"
            >
              <div class="chance">
                <div>CHANCE</div>
                <div>{{}}%</div>
              </div>
              <img :src="item.image" />
              <div class="infos">
                <div class="arms">{{ item.armsName }}</div>
                <div class="skins">{{ item.skinsName }}</div>
              </div>
            </div>
          </template>
        </div>
        <!-- 抽奖结果 -->
        <div
          class="lucky-draw-results flex-h-center"
          :class="{ visible: state.luckyDrawResultsVisible }"
        >
          <div class="infos flex-h-center">
            <div class="a-item">
              <div>{{}}</div>
              <div>
                <div>CHANCE</div>
                <div>{{}}%</div>
              </div>
            </div>
            <img :src="state.luckyDrawResults?.image" />
            <div class="a-item">
              <div class="armsName">{{ state.luckyDrawResults?.armsName }}</div>
              <div class="skinsName">
                {{ state.luckyDrawResults?.skinsName }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Lucky-draw End -->

      <!-- Actions Start -->
      <div v-if="state.luckyDrawResultsVisible" class="flex-h-center">
        <div class="action-button" @click="state.luckyDrawResultsVisible = false">
          &lt;
        </div>
        <div class="action-button" @click="onOpenBox">再次抽取</div>
      </div>
      <div v-else class="start-button" style="margin-top: 30px" @click="onOpenBox">
        {{ state.isAnimating ? "正在抽取中..." : `开始抽奖` }}
      </div>
      <!-- Actions End -->
    </div>
  </div>
</template>

<style lang="less" scoped>
.flex-h-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.page {
  padding-top: 100px;
  height: 100%;
  background-color: #111114;
  color: #ffffff;
  font-size: 12px;
}
.contents {
  width: 80%;
  min-width: 1400px;
  max-width: 1680px;
  margin: 0 auto;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  position: relative;
  .logo {
    height: 30px;
  }

  .title {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 1px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .controls {
    .item {
      .label {
        margin-right: 6px;
      }
      &:first-child {
        margin-right: 20px;
      }
    }
  }
}

.lucky-draw {
  height: 20%;
  background-color: transparent;
  position: relative;
  overflow: hidden;
  box-shadow: #42425433 0 0 0 5px;
  .lucky-line {
    height: 100%;
    width: 2px;
    background-color: #dcae64;
    position: absolute;
    z-index: 1;
    left: 50%;
    transform: translateX(-50%);
    &::before,
    &::after {
      content: "";
      display: block;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      z-index: inherit;
      border-style: solid;
      border-width: 16px;
    }
    &::before {
      top: 0;
      border-color: #dcae64 transparent transparent transparent;
    }
    &::after {
      bottom: 0;
      border-color: transparent transparent #dcae64 transparent;
    }
  }

  .lucky-draw-wrap {
    white-space: nowrap;
    height: inherit;
  }

  .lucky-draw-item {
    display: inline-block;
    height: inherit;
    text-align: center;

    padding: 16px;
    position: relative;
    img {
      width: 80%;
      height: auto;
      margin: 16px 0;
    }
    .chance {
      text-align: right;
      color: #b4b8cd;
    }
    .infos {
      text-align: left;
      letter-spacing: 1px;
    }
    .arms {
      font-size: 14px;
      color: #b4b8cd;
      margin-bottom: 4px;
    }
    .skins {
      color: #fff;
      font-size: 16px;
    }
  }

  .lucky-draw-results {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.75);
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    &.visible {
      z-index: 2;
    }
    .infos {
      border: 1px solid #a0804d;
      width: 330px;
      height: 230px;
      background-color: #1c1c24;
      color: #b4b8cd;
      font-weight: 700;
      padding: 16px;
      border-radius: 8px;
      position: inherit;
      img {
        width: 60%;
        height: auto;
        transition: all 0.25s linear;
      }
      &:hover img {
        transform: scale(0.75) rotateZ(10deg);
      }

      .a-item {
        width: 100%;
        padding: 0 12px;
        position: absolute;
        line-height: 17px;
        &:first-child {
          padding: 0 12px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          top: 12px;
        }
        &:last-child {
          bottom: 12px;
        }
        .skinsName {
          color: #fff;
        }
        .price {
          color: #dcae64;
        }
      }
    }
  }
}

.balance {
  text-align: center;
  margin: 30px 0 20px;
  font-size: 14px;
  letter-spacing: 1px;
}
.start-button {
  width: 226px;
  height: 60px;
  margin: 0 auto;
  border: 1px solid #50e36d;
  border-radius: 8px;
  cursor: pointer;
  line-height: 60px;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #50e36d;
  box-shadow: 0 0 6px rgb(80 227 109 / 40%), inset 0 0 6px rgb(80 227 109 / 40%);
  transition: all 0.25s linear;
  &:hover {
    background-color: #21282a;
  }
}

.action-button {
  width: 226px;
  height: 60px;
  border: 1px solid #50e36d;
  border-radius: 8px;
  font-weight: 700;
  font-size: 16px;
  color: #50e36d;
  box-shadow: 0 0 6px rgb(80 227 109 / 40%), inset 0 0 6px rgb(80 227 109 / 40%);
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: #21282a;
  }
  &:nth-child(1) {
    width: 80px;
    border-color: #b4b8cd;
    box-shadow: none;
    color: #b4b8cd;
  }
  &:nth-child(2) {
    margin: 0 20px;
  }
}
</style>
