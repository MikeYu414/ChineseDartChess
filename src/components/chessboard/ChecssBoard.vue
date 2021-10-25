<template>
  <img :src="chessbackground" class="chess-background">
  <div class="main-panel">
    <div class="chess-container" v-for="(item, index) in chessData" :key="index">
      <Chess :ref="'chess' + index" :refprops="'chess' + index" :is-your-turn="isYourTurn" v-model:chess-data="chessData[index]" />
    </div>
    <br class="clearfix" />
  </div>
</template>

<script>
import chessbackground from '../../assets/chessboard.png';
import Chess from '../chess/Chess.vue'
export default {
  name: 'ChessBoard',
  props: [
    "isYourTurn",
    "chessData",
    "action"
  ],
  components: {
    Chess
  },
  data() {
    return {
      chessbackground
    };
  },
  created() {
    this.init();
  },
  mounted() {

  },
  methods: {
    init() {
      //this.chessData = CommonFunc.getChesses();
    },

    actionHandler(action) {
      if (!action) {
        return;
      }
      let { type, curChess, targetChess, curPos ,targetPos } = action;
      if (type == 0) {// 翻子
        this.$refs[targetChess].chessData.isBuckle = false;
        this.$refs[targetChess].chessData.ifTurn = true;
        return;
      }
      else if (type == 2) {// eat
        this.$refs[targetChess].chessData.isDead = true;
      }
      this.moveTo(this.$refs[curChess], targetPos);
      this.moveTo(this.$refs[targetChess], curPos);
    },

    moveTo(chessRef, position) {
      let { x, y } = position;
      let moveX = x - chessRef.defaultX;
      let moveY = y - chessRef.defaultY;
      chessRef.isSelected = false;
      chessRef.chessData.chessMove = `transform: translate(${moveX * 120}px, ${
        moveY * 120
      }px);`;
      chessRef.chessData.x = x;
      chessRef.chessData.y = y;
    }
  },
  watch: {
    action:{
      deep:true,
      handler(val){
        //action
        this.actionHandler(val);
      }
    },
    chessData:{
      deep:true,
      handler(val){
        this.$root.Chess = val;
      }
    }
  }
};
</script>

<style lang="scss">
@import "./scss/ChessBoard.scss";
</style>