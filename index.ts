/**
 * Created by littlestone on 2017/2/10.
 */

import {Promise} from 'es6-promise';
declare const wx: any;

interface ReqObj {
  url: string;
  data: any;
}
class WxResource {
  retryTime: number = 1000; //断线重连时间间隔
  constructor(private wsUrl: string, private reqObj: ReqObj) {
    this.connect();
  }

  /**
   * 连接webSocket
   * @returns {WxResource}
   */
  public connect(): WxResource {
    wx.connectSocket({
      url: this.wsUrl,
      success: function (res) {
        console.log("connectSocket success ", res);
      },
      fail: function (res) {
        console.log("connectSocket fail ", res);
      },
      complete: function (res) {
        console.log("connectSocket complete ", res);
      },
    });

    return this;
  }

  /**
   * get 方法
   * @param reqObj  传入的请求对象
   * @param token   传入的token【非必传参数】
   * @returns {Promise}
   */
  public get(requrl:string,reqObj: ReqObj, token?: string): Promise<any> {
    let _that = this;
    return new Promise((resolve, reject) => {
      wx.onSocketOpen(function (res) {
        console.log('WebSocket connection has been opened!', res);
        _that.sendMsg(requrl,reqObj, "GET", token);
      });
      this.receiveMsg(resolve);
      this.handleError(reject);
      this.handleSocketClose(reject)
    })
  }

  /**
   * post 方法
   * @param reqObj  传入的请求对象
   * @param token   传入的token【非必传参数】
   * @returns {Promise}
   */
  public post(requrl:string,reqObj: ReqObj, token?: string): Promise<any> {
    let _that = this;
    return new Promise((resolve, reject) => {
      wx.onSocketOpen(function (res) {
        console.log('WebSocket connection has been opened!', res);
        _that.sendMsg(requrl,reqObj, "POST", resolve);
      });
      this.handleError(reject);
      this.handleSocketClose(reject)
    })
  }

  /**
   * delete 方法
   * @param reqObj   传入的请求对象
   * @param token    传入的token【非必传参数】
   * @returns {Promise}
   */
  public delete(requrl:string,reqObj: ReqObj, token?: string): Promise<any> {
    let _that = this;
    return new Promise((resolve, reject) => {
      wx.onSocketOpen(function (res) {
        console.log('WebSocket connection has been opened!', res);
        _that.sendMsg(requrl, reqObj, "DELETE", resolve);
      });
      this.receiveMsg(resolve);

      this.handleError(reject);
    })
  }

  /**
   * update 方法
   * @param reqObj   传入的请求对象
   * @param token    传入的token【非必传参数】
   * @returns {Promise}
   */
  public update(requrl: string,reqObj: ReqObj, token?: string): Promise<any> {
    let _that = this;
    return new Promise((resolve, reject) => {
      wx.onSocketOpen(function (res) {
        console.log('WebSocket connection has been opened!', res);
        _that.sendMsg(requrl,reqObj, "UPDATE", resolve);
      });
      this.receiveMsg(resolve);

      this.handleError(reject);
    })
  }

  /**
   * 处理webSocket发送的信息
   * @param reqObj
   * @param method  请求方法 GET  POST ...
   * @param token
   */
  private sendMsg(requrl:string,reqObj: ReqObj, method: string, resolve, token?: string) {
    // 判断是否传入token
    let header = {};
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
        "url": requrl,
        "header": header,
        "body": JSON.stringify(reqObj.data)
      }),
      success: function (res) {
        console.log("发送成功", res)
      },
      fail: function (res) {
        console.log("发送失败", res)
      }
    });
    this.receiveMsg(resolve);
  }

  // 处理错误信息
  handleError(reject) {
    wx.onSocketError(function (res) {
      reject(res);
      console.log('WebSocket连接打开失败，请检查！', res)
    });
  }

  // 处理服务器返回内容
  receiveMsg(resolve) {
    wx.onSocketMessage(function (res) {
      console.log("接收到服务器返回：", JSON.parse(res.data));
      resolve(JSON.parse(res.data));
    });
  }

  handleSocketClose(reject) {
    let _that = this;
    wx.onSocketClose(function (res) {
      console.log("webSocket关闭, 正在尝试重新连接...", res);
      setTimeout(function () {
        _that.connect();
      }, this.retryTime)
    })
  }

}

export default WxResource;