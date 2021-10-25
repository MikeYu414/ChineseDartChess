const ServerHost = 'www.mikebobo.top';
const ServerUrl = `http://${ServerHost}:3456`;
export const Constants = {
  ServerHost,
  ServerUrl
}

function S4() { 
  return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
};

export const CommonFunc = {
  getChesses() {
    let result = null;
    let chessUrl = ServerUrl + '/getchesses';
    this.ajax(chessUrl, function (data) {
      result = JSON.parse(data);
    }, function (error) {
      console.log(error);
    });
    return result;
  },

  restartGame(roomNumber) {
    let result = null;
    let url = ServerUrl + '/restart';
    let param = `room=${roomNumber}`;
    this.ajax(url, function (data) {
      result = JSON.parse(data);
    }, function (error) {
      console.log(error);
    },param);
    return result;
  },

  joinRoom(roomNumber, ip) {
    let result = null;
    let url = ServerUrl + '/joinroom';
    let param = `room=${roomNumber}&ip=${ip}`;
    this.ajax(url, function (data) {
      result = JSON.parse(data);
    }, function (error) {
      console.log(error);
    },param);
    return result;
  },

  ajax: function (url, success, error, data) {
    var xmlHttpRequest = null;
    try { // chrome, Firefox, Opera 8.0+, Safari
      xmlHttpRequest = new XMLHttpRequest();
    } catch (e) { // for IE
      try {
        xmlHttpRequest = new ActiveXObject('Msxml2.XMLHTTP');
      } catch (e) {
        xmlHttpRequest = new ActiveXObject('Microsoft.XMLHTTP');
      }
    }
    xmlHttpRequest.open('POST', url, false);
    xmlHttpRequest.onreadystatechange = function () {
      if (xmlHttpRequest.readyState === 4) {
        xmlHttpRequest.onreadystatechange = null;
        if (xmlHttpRequest.status === 200 || xmlHttpRequest.status === 201 || xmlHttpRequest.status === 204 || xmlHttpRequest.status === 1223) {
          success(xmlHttpRequest.responseText);
        } else {
          error(xmlHttpRequest.responseText);
        }
      }
    };
    xmlHttpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttpRequest.send(data);
  },

  eatCheck(eater, target, allChess) {
    if (!this.checkPosition(eater, target, allChess)) {
      return false;
    }
    let targetV = target.value;
    let result = false;
    switch (eater.value) {
      case 0:
        if (targetV == 6 || targetV == 0) {
          result = true;
        }
        break;
      case 1: //炮
        result = true;
        break;
      case 2:
      case 3:
      case 4:
      case 5:
        if (eater.value - targetV > -1) {
          result = true;
        }
        break;
      case 6:
        if (targetV != 0) {
          result = true;
        }
        break;
      default:
        break;
    }
    return result;
  },

  checkPosition(eater, target, allChess) {
    let result = false;
    if (eater.color == target.color) {
      return result;
    }
    if (eater.value != 1) {
      result = this.moveCheck(eater, target);
    } else { //炮
      result = this.checkGun(eater, target, allChess);
    }
    return result;
  },
  //normal chess
  moveCheck(eater, target) {
    let result = false;
    if (eater.x == target.x) {
      if (Math.abs(target.y - eater.y) == 1) {
        result = true;
      }
    } else if (eater.y == target.y) {
      if (Math.abs(target.x - eater.x) == 1) {
        result = true;
      }
    }
    return result;
  },
  //pao
  checkGun(eater, target, allChess) {
    let sameAttr, diffAttr;
    if (eater.x == target.x) {
      sameAttr = 'x';
      diffAttr = 'y';
    } else if (eater.y == target.y) {
      sameAttr = 'y';
      diffAttr = 'x';
    }
    else {
      return false;
    }
    if (Math.abs(eater[diffAttr] - target[diffAttr]) <= 1) {
      return false;
    }
    let min, max;
    if (eater[diffAttr] > target[diffAttr]) {
      min = target[diffAttr] + 1;
      max = eater[diffAttr] - 1;
    } else {
      min = eater[diffAttr] + 1;
      max = target[diffAttr] - 1;
    }
    let count = 0;
    for (let index = 0; index < allChess.length; index++) {
      const element = allChess[index];
      if (element[sameAttr] != eater[sameAttr] || element.isDead) {
        continue;
      }
      if (element[diffAttr] >= min && element[diffAttr] <= max) {
        count++;
      }
    }

    return count == 1;
  },
  getMyIP() {
    return "123.123";
    let xmlhttp;
    if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
    else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.open("GET", "http://api.hostip.info/get_html.php", false);
    xmlhttp.send();

    let hostipInfo = xmlhttp.responseText.split("\n");

    for (var i = 0; hostipInfo.length >= i; i++) {
      var ipAddress = hostipInfo[i].split(":");
      if (ipAddress[0] == "IP") return ipAddress[1].trim();
    }

    return false;
  },
  
 // Generate a pseudo-GUID by concatenating random hexadecimal. 
  newGuid() { 
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4()); 
  }
}