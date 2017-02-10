import {Promise} from 'es6-promise';

declare const wx: any;

interface ReqObj {
  url: string,
  data?: any
}
var Ws = (function () {
  function Ws(wsUrl) {
    wx.connectSocket({
      url: wsUrl,
    });
  }

  Ws.prototype.get = (reqObj:ReqObj, token:string) => {
    return new Promise((resolve, reject) => {
      wx.onSocketOpen(function (res) {
        console.log('WebSocket连接已打开！', res);
        sendMsg(reqObj, "GET", token);
      });
      receiveMsg(resolve);
      handleError(reject);
      closeWs();
    });

  };
  Ws.prototype.post = (reqObj:ReqObj, token:string) => {
    return new Promise((resolve, reject) => {
      wx.onSocketOpen(function (res) {
        console.log('WebSocket连接已打开！', res);
        sendMsg(reqObj, "POST", token);
      });
      receiveMsg(resolve);
      handleError(reject);
      closeWs();
    })
  };
  Ws.prototype.delete = (reqObj:ReqObj, token:string) => {
    return new Promise((resolve, reject) => {
      wx.onSocketOpen(function (res) {
        console.log('WebSocket连接已打开！', res);
        sendMsg(reqObj, "DELETE", token);
      });
      receiveMsg(resolve);
      handleError(reject);
      closeWs();
    })
  };
  Ws.prototype.update = (reqObj:ReqObj, token:string) => {
    return new Promise((resolve, reject) => {
      wx.onSocketOpen(function (res) {
        console.log('WebSocket连接已打开！', res);
        sendMsg(reqObj, "UPDATE", token);
      });
      receiveMsg(resolve);
      handleError(reject);
      closeWs();
    })
  };

  /**
   * 用于处理发送信息
   * @param reqObj  请求数据
   * @param token   get方法需要用到的token
   * @param method  请求方法
   */
  function sendMsg(reqObj:ReqObj, method: string, token?: string) {

    // 判断是否传入token
    let header = {};
    if (token === undefined) {
      console.log("token没有传入");
      header = {
        "S-Request-Id": Date.now() + Math.random().toString(20).substr(2, 6)
      }
    } else if (token !== undefined) {
      console.log("传入token");
      header = {
        "S-Request-Id": Date.now() + Math.random().toString(20).substr(2, 6),
        "Authentication": "Bearer " + token
      }
    }
    wx.sendSocketMessage({
      data: JSON.stringify({
        "method": method,
        "url": reqObj.url,
        "header": header,
        "body": JSON.stringify(reqObj.data)
      }),
      success: function (res) {
        console.log("发送成功", res)
      },
      fail: function (res) {
        console.log("发送失败", res)
      }
    })
  }

  // 显示错误信息
  function handleError(reject) {
    wx.onSocketError(function (res) {
      reject(res);
      console.log(res, 'WebSocket连接打开失败，请检查！')
    });
  }

  // 处理服务器返回内容
  function receiveMsg(resolve) {
    wx.onSocketMessage(function (res) {
      resolve(JSON.parse(res.data));
      // console.log(JSON.parse(res.data));
    });
  }

  // 关闭websocket
  function closeWs() {
    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！')
    })
  }

  return Ws
}());
export default Ws;

