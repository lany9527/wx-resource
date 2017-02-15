/**
 * Created by littlestone on 2017/2/10.
 */

import {Promise} from 'es6-promise';
declare const wx: any;

class WxResource {
  public socketOpen: boolean = false;

  constructor() {
    this.connect();
    this.listen();
    this.afterConnect();
  }

  private listen() {
    return new Promise((resolve, reject) => {
      wx.onSocketOpen((event) => {
        this.socketOpen = true;
        console.log('WebSocket opened：', event);
        resolve(event);
      });
      wx.onSocketError((event) => {
        console.error('Can not open WebSocket, please check...！', event);
        resolve(event);
      });
    })

  }

  private connect(): WxResource {
    wx.connectSocket({
      url: "ws://192.168.8.138/api/ws"
    });
    return this;
  }

  private afterConnect(resolve?, reject?): WxResource {
    wx.onSocketMessage((res) => {
      console.log("Get data from webSocket server：", JSON.parse(res.data));
      resolve(JSON.parse(res.data));
    });
    return this;
  }

  //发送消息
  private sendMsg(reqObj, method) {
    const WxResource: WxResource = this;
    if (WxResource.socketOpen) {
      let header = {};
      let token = reqObj.token;
      if (token === undefined) {
        console.log("no token");
        header = {
          "S-Request-Id": Date.now() + Math.random().toString(20).substr(2, 6)
        }
      } else if (token !== undefined) {
        console.log("get token");
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
          console.log("Send data success: ", res)
        },
        fail: function (res) {
          console.log("Send data fail: ", res)
        }
      })
    } else {
      console.log("websocket server not opened");
    }
  }


  public get(url, token) {
    let _that = this;
    let reqObj = this.handleParams(url,{},token);
    setTimeout(() => {
      this.sendMsg(reqObj, "GET");
    }, 300);
    return new Promise((resolve, reject) => {
      _that.afterConnect(resolve, reject);
    })
  }
  public post(url, data) {
    let _that = this;
    let reqObj = this.handleParams(url, data);
    setTimeout(() => {
      this.sendMsg(reqObj, "POST");
    }, 300);
    return new Promise((resolve, reject) => {
      _that.afterConnect(resolve, reject);
    })
  }
  public update(url, data) {
    let _that = this;
    let reqObj = this.handleParams(url, data);
    setTimeout(() => {
      this.sendMsg(reqObj, "UPDATE");
    }, 300);
    return new Promise((resolve, reject) => {
      _that.afterConnect(resolve, reject);
    })
  }
  public delete(url, data) {
    let _that = this;
    let reqObj = this.handleParams(url, data);
    setTimeout(() => {
      this.sendMsg(reqObj, "DELETE");
    }, 300);
    return new Promise((resolve, reject) => {
      _that.afterConnect(resolve, reject);
    })
  }

  public handleParams(url, data?, token?) {
    let reqObj = {};
    reqObj['url'] = url;
    reqObj['data'] = data;
    reqObj['token'] = token;
    return reqObj;
  }
}

export default WxResource;