<template>
  <div @click="selectChess" :style="chessData.chessMove" :class="['chess-border', chessData.ifTurn ? 'chess-turn' : '']">
    <div
      :class="isSelected ? 'chess-selected' : ''"
    >
      <div
        :style="chessStyle"
        :class="[
          'chess',
          !chessData.isBuckle && chessData.color == 'red'
            ? 'chess-red'
            : 'chess-black'
        ]"
      >
        {{ chessValue }}
      </div>
    </div>
  </div>
</template>

<script>
import { CommonFunc } from '../../common/common';
export default {
  name: 'Checss',
  props: ['chessData','isYourTurn', 'refprops'],
  data() {
    let defaultX = this.chessData.x;
    let defaultY = this.chessData.y;
    return {
      isSelected: false,
      defaultX,
      defaultY
    };
  },
  created() {},
  mounted() {},
  methods: {
    selectChess() {
      debugger;
      if (!this.isYourTurn) {
        return;
      }

      if (this.chessData.isBuckle) {
        //this.chessData.isBuckle = false;
        if (!this.$root.yourColor) {
          this.$root.yourColor = this.chessData.color
        }
        let action = {
          type: 0,
          targetChess: this.refprops
        };
        this.$parent.actionHandler(action);
        this.$root.send(action);
        this.$root.isYourTurn = false;
        if (this.$root.SelectedChess && this.$root.SelectedChess.data) {
          let { that } = this.$root.SelectedChess;
          that.isSelected = false;
        }
        this.$root.SelectedChess = null;
        //done
        return;
      }

      if (this.$root.SelectedChess == null) {
        if (this.chessData.isDead) {
          return;
        }
        if (this.chessData.color != this.$root.yourColor) {
          return;
        }
        var obj = { that: this, data: this.chessData };
        this.$root.SelectedChess = obj;
        this.isSelected = true;
        return;
      } else {
        let { that } = this.$root.SelectedChess;
        if (this.chessData.isDead) {
          //check can move
          let canMove = CommonFunc.moveCheck(this.$root.SelectedChess.data, this.chessData);
          if (canMove) {
            //move to here
            let action = {
              type: 1,
              targetChess: this.refprops,
              curChess: that.refprops,
              targetPos: {
                x: this.chessData.x,
                y: this.chessData.y
              },
              curPos: {
                x: that.chessData.x,
                y: that.chessData.y
              }
            };
            this.$parent.actionHandler(action);
            this.$root.send(action);
            this.$root.isYourTurn = false;
            //that.moveTo(this.chessData.x, this.chessData.y);
            //this.moveTo(oldX, oldY);
            this.$root.SelectedChess = null;
            //done
          }
          return;
        }
        let { data } = this.$root.SelectedChess;
        if (data.x == this.chessData.x && data.y == this.chessData.y) {
          this.isSelected = false;
          this.$root.SelectedChess = null;
          return;
        }
        if (data.color == this.chessData.color) {
          return;
        }
        //eat check
        let ifEat = CommonFunc.eatCheck(
          this.$root.SelectedChess.data,
          this.chessData,
          this.$root.Chess
        );
        if (ifEat) {
          // this.chessData.isDead = true;
          // let oldX = that.chessData.x;
          // let oldY = that.chessData.y;
          // that.moveTo(this.chessData.x, this.chessData.y);
          // this.moveTo(oldX, oldY);
          let action = {
            type: 2,
            targetChess: this.refprops,
            curChess: that.refprops,
            targetPos: {
              x: this.chessData.x,
              y: this.chessData.y
            },
            curPos: {
              x: that.chessData.x,
              y: that.chessData.y
            }
          };
          this.$parent.actionHandler(action);
          this.$root.send(action);
          this.$root.isYourTurn = false;
          this.$root.SelectedChess = null;
          
          //if win
          let opponentColor = this.$root.yourColor == "red" ? "black" : "red";
          this.$root.youWin = false;
          for (let index = 0; index < this.$root.Chess.length; index++) {
            const element = this.$root.Chess[index];
            if (element.color == opponentColor && element.isDead == false) {
              return;
            }
          }
          this.$root.youWin = true;
          this.$root.showResult = true;
        }
        return;
      }
    }
  },
  computed: {
    chessValue() {
      if (this.chessData.isBuckle) {
        return '';
      } else {
        return this.chessData.text;
      }
    },
    chessStyle() {
      if (this.chessData.isDead) {
        return 'visibility: hidden;';
      }

      return '';
    }
  },
  watch: {
    chessData: {
      deep: true,
      handler(val) {
        this.$emit('update:chessData', this.chessData);
      }
    }
  }
};
</script>

<style lang="scss">
@import './scss/Chess.scss';
</style>