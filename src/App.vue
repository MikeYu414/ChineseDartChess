<template>
  <!-- status -->
  <div v-if="isYourTurn" style="color:green;" class="bounce tip">
    <span class="letter">轮</span>
    <span class="letter">到</span>
    <span class="letter">你</span>
    <span class="letter">了</span>
    <span class="letter">小</span>
    <span class="letter">宝</span>
    <span class="letter">贝</span>
  </div>
  <div v-else class="bounce tip" style="color:red;">
    <span class="letter">对</span>
    <span class="letter">方</span>
    <span class="letter">墨</span>
    <span class="letter">迹</span>
    <span class="letter">中</span>
    <span class="letter">.</span>
    <span class="letter">.</span>
  </div>

  <!-- join game -->
  <a-modal
    v-model:visible="showStart"
    title="Join the game"
    :maskClosable="false"
    :centered="true"
    :closable="false"
    width="300px"
  >
    <a-row>
      <span>Room number:</span>
      <a-input type="text" @keyup.enter="inputRoomNum" v-model:value="roomNumber" />
    </a-row>
    <a-row>
      <span>ID:</span>
      <a-input type="text" @keyup.enter="inputRoomNum" v-model:value="ip" />
    </a-row>
    <a-row>
      <span>Your name:</span>
      <a-input type="text" @keyup.enter="inputRoomNum" v-model:value="userName" />
    </a-row>
    <template #footer>
      <a-button class="btn-joinin" type="primary" key="ok" @click="inputRoomNum">OK</a-button>
    </template>
  </a-modal>
  <teleport to="body">
    <img class="welcome-img" v-if="showStart" :src="welcome" />
  </teleport>
  <a-spin :spinning="spinning" tip="Waiting for response...">
    <ChessBoard :action="action" :chess-data="chessData" :is-your-turn="isYourTurn"/>
  </a-spin>
  <!-- helper -->
  <a-drawer
    title="Game rules"
    :closable="false"
    :visible="ifShowHelp"
    @close="showHelp"
  >
    <p>游戏规则：</p>
    <p>将 > 士 > 象 > 马 > 车 > (兵 | 炮) </p>
    <p>兵 > 将</p>
    <p>'炮' 的攻击需要中间隔一个子，无视距离，无差别攻击</p>
    <p>同级别的子可以相互吃</p>
  </a-drawer>

  <!-- score board -->
  <div class="score-board">
    <a-row>
      <a-button v-show="showButton" danger @click="sendLose">认输</a-button>
      <a-button v-show="showButton" class="button-ml" type="primary" @click="sendDraw">和棋</a-button>
      <a-button class="button-ml" shape="circle" title="Help" @click="showHelp">
        <template #icon>
          <QuestionOutlined />
        </template>
      </a-button>
    </a-row>
    <a-divider style="height: 2px; background-color: #7cb305" orientation="left"></a-divider>
    <a-row class="color-tip" v-if="roomNumber">
      <span class="tip-label">房间号：</span>
      <span style="color:green;">{{roomNumber}}</span>
    </a-row>
    <a-row class="color-tip" v-if="userInfo">
      <span class="tip-label">玩家信息：</span>
      <span v-if="userInfo.userType == 0" style="color:blue;"><span>{{userName}}</span> -- 游客</span>
      <span v-else-if="userInfo.userType == 1" style="color:blue;"><span>{{userName}}</span> -- 玩家1</span>
      <span v-else-if="userInfo.userType == 2" style="color:blue;"><span>{{userName}}</span> -- 玩家2</span>
    </a-row>
    <a-row class="color-tip" v-if="yourColor">
      <span class="tip-label">你的颜色：</span>
      <span v-if="yourColor == 'red'" style="color:red;">红色</span>
      <span v-else style="color:black;">黑色</span>
    </a-row>
    <!-- <a-row>
      <p>
        <span>你的得分：</span>
        <span>0</span>
      </p>
    </a-row>
    <a-row>
      <p>
        <span>对手得分：</span>
        <span>0</span>
      </p>
    </a-row> -->
    <a-row>
      <div class="ContactBox">
        <div class="ContactBox-header">聊天室</div>
        <div class="MessageBox" ref="MessageBox">
          <template  v-for="(item,index) in chatList"
            :key="index">
          <div v-if="item.ip != ip" class="user-name">{{item.name}}</div>
          <div
            class="Message"
            :style="item.ip == ip?'flex-direction:row-reverse':''"
          >
            <div class="UserMsg" :class="item.ip == ip?'RightMessage':'LeftMessage'">
              <span :style="item.ip == ip?' float: right;':''">{{item.content}}</span>
            </div>
          </div>
          </template>
        </div>
        <!-- 输入框 -->
        <div class="InputBox">
          <a-input style="height: 50px;" v-model:value="msg" @pressEnter="sendMsg"></a-input>
          <div class="InputBox-footer">
            <div class="FooterDesc">按Enter键发送</div>
            <a-button type="primary"  @click="sendMsg">发送</a-button>
          </div>
        </div>
      </div>
    </a-row>
  </div>

  <!-- game result -->
  <a-modal
    v-model:visible="showResult"
    class="game-result"
    :maskClosable="false"
    :centered="true"
    :closable="false"
    :mask="false"
    width="500px"
  >
    <div v-if="youWin" class="bounce">
      <span class="letter">Y</span>
      <span class="letter">o</span>
      <span class="letter">u</span>
      <span class="letter">W</span>
      <span class="letter">i</span>
      <span class="letter">n</span>
    </div>
    <div v-else class="bounce" style="color:red;">
      <span class="letter">Y</span>
      <span class="letter">o</span>
      <span class="letter">u</span>
      <span class="letter">L</span>
      <span class="letter">o</span>
      <span class="letter">s</span>
      <span class="letter">e</span>
    </div>
    <template #footer>
      <a-button v-show="!youWin" ghost danger class="btn-restart" key="ok" @click="restart">一雪前耻</a-button>
    </template>
  </a-modal>
</template>

<script>
import ChessBoard from './components/chessboard/ChecssBoard.vue';
import welcome from './assets/welcome.jpeg';
import { CommonFunc, Constants } from './common/common'
import { QuestionOutlined,ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
export default {
  name: 'App',
  data: function () {
    return {
      SelectedChess: null,
      spinning: false,
      ifShowHelp: false,
      Chess: [],
      roomNumber: null,
      showStart: true,
      showResult: false,
      welcome,
      userInfo: null,
      chessData: null,
      ws: null,
      isYourTurn: false,
      yourColor: null,
      ip: null,
      action: null,
      userName: null,
      msg: null,
      chatList: [],
      youWin: false,
    };
  },
  components: {
    ChessBoard,
    QuestionOutlined,
    ExclamationCircleOutlined
  },
  methods: {
    inputRoomNum() {
      //send room number
      if (!this.userName || !this.roomNumber || !this.ip) {
        this.$message.error("Please input the room number, your name and ID.");
        return;
      }
      let res = CommonFunc.joinRoom(this.roomNumber, this.ip);
      this.userInfo = res;
      this.chessData = res.data;
      this.initWebsocket(res, this.ip);
      this.showStart = false;
    },

    showHelp() {
      this.ifShowHelp = !this.ifShowHelp;
    },

    initWebsocket(res, ip) {
      let that = this;
      if (window.WebSocket) {
        var ws = new WebSocket(`ws://${Constants.ServerHost}:${res.port}`);
        ws.onopen = function(e) {
          console.log("连接服务器成功");
          if (res.userType == 0) {
            return;
          }
          let msg = {
            userType: res.userType,
            //toUserType: res.userType == 1 ? 2 : 1,
            ip: ip
          };
          ws.send(JSON.stringify(msg));
        };
        ws.onclose = function(e) {
          console.log("服务器关闭");
        };
        ws.onerror = function() {
          console.log("连接出错");
        };
        // 接收服务器的消息
        ws.onmessage = function(e) {
          let tempData = JSON.parse(e.data);
          let {messageType, toUserType, action, toUserColor, data} = tempData;
          //chat
          if (messageType == 1) {
            that.chatList.push(tempData);
            that.$nextTick(function () {
              let el = that.$refs["MessageBox"];
              el.scrollTop = el.scrollHeight;
            })
            return;
          }

          //restart
          if (messageType == 2) {
            that.initVar();
          }

          //you lose
          if (messageType == 3) {
            if (that.userInfo.userType == 1 || that.userInfo.userType == 2) {
              that.showResult = true;
            }
            return;
          }

          //you win
          if (messageType == 4) {
            if (that.userInfo.userType == 1 || that.userInfo.userType == 2) {
              that.youWin = true;
              that.showResult = true;
            }
            return;
          }

          //draw request
          if (messageType == 5) {
            if (that.userInfo.userType == 1 || that.userInfo.userType == 2) {
              that.confirmRequest();
            }
            return;
          }

          //draw response
          if (messageType == 6) {
            if (that.userInfo.userType == 1 || that.userInfo.userType == 2) {
              that.spinning = false;
              if (tempData.agree) {
                that.restart();
              }
            }
            return;
          }

          // if (!that.yourColor) {
          //   that.yourColor == toUserColor;
          // }
          if (toUserType == that.userInfo.userType) {
            that.isYourTurn = true;
          }

          if (toUserColor) {
            that.yourColor = toUserColor;
          }
          else {
            that.yourColor = tempData.colorCache[that.ip];
          }
          that.action = action;
          //play chess
          if (data && Array.isArray(data)) {
            that.chessData = data;
          }
        };
        that.ws = ws;
      }
    },
    sendToServer(arg) {
      let that = this;
      var t = setInterval(() => {
        if(that.ws.readyState === 1){ 
          that.ws.send(JSON.stringify(arg));
          clearInterval(t);
        }
      },100);
    },
    //发送信息 action{ type: 0翻子 1move 2 吃子，curChess:当前棋子, targetChess:目标点, curPos:当前位置，targetPos：目标位置}
    send(action) {
      debugger;
      let that = this;
      this.$nextTick(function () {
        let tempData = {
          userType: that.userInfo.userType,
          toUserType: that.userInfo.userType == 1 ? 2 : 1,
          ip: that.ip,
          data: that.chessData,
          action
        }
        if (that.yourColor) {
          tempData.toUserColor = that.yourColor == "red" ? "black" : "red";
        }
        that.sendToServer(tempData);
      })
      
    },

    sendMsg() {
      debugger;
      let msg = {
        messageType: 1,
        ip: this.ip,
        name: this.userName,
        content: this.msg
      }
      this.chatList.push(msg);
      this.msg = null;

      //scroll
      this.$nextTick(function () {
        let el = this.$refs["MessageBox"];
        el.scrollTop = el.scrollHeight;
      })
      this.sendToServer(msg);
    },

    sendWin() {
      let msg = {
        messageType: 3,
        ip: this.ip
      }
      this.sendToServer(msg);
    },

    sendLose() {
      let msg = {
        messageType: 4,
        ip: this.ip
      }
      this.sendToServer(msg);
      this.showResult = true;
    },

    sendDraw() {
      let msg = {
        messageType: 5,
        ip: this.ip
      }
      this.sendToServer(msg);
      this.spinning = true;
    },

    responseDraw(agree) {
      let msg = {
        messageType: 6,
        ip: this.ip,
        agree
      }
      this.sendToServer(msg);
      this.initVar();
    },

    confirmRequest() {
      const confirm = Modal.confirm({
        title: 'Confirm',
        icon: createVNode(ExclamationCircleOutlined),
        content: '对方想与你和棋',
        okText: 'OK',
        cancelText: 'No',
        onCancel: () => {
          this.responseDraw(false);
        },
        onOk: () => {
          this.responseDraw(true);
        }
      });
    },

    restart() {
      this.chessData = CommonFunc.restartGame(this.roomNumber);
      let msg = {
        messageType: 2,
        userType: this.userInfo.userType,
        toUserType: this.userInfo.userType == 1 ? 2 : 1,
        ip: this.ip,
        data: this.chessData,
      }
      this.initVar();
      this.sendToServer(msg);
    },

    //初始化变量
    initVar() {
      this.SelectedChess = null;
      this.showResult = false;
      this.isYourTurn = false;
      this.yourColor = null;
      this.youWin = false;
      this.spinning = false;
    }
  },
  watch: {
    // isYourTurn: {
    //   deep: true,
    //   handler(val, oldV) {
    //     if (oldV == false && val == true) {
    //       this.$message.info("It's your turn!");
    //     }
    //   }
    // },
    youWin: {
      deep: true,
      handler(val, oldV) {
        if (oldV == false && val == true) {
          this.sendWin();
        }
      }
    }
  },
  computed: {
    showButton() {
      if (!this.userInfo) {
        return false;
      }
      return (this.userInfo.userType == 1 || this.userInfo.userType == 2)
    }
  }
};
</script>
<style lang="scss">
@import './common/common.scss';
</style>