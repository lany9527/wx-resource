import {Promise} from 'es6-promise';
declare const wx: any;

interface ReqObj {
  url: string;
  data: any;
}
class WxResource {
  constructor(private wsUrl: string, private reqObj: ReqObj) {
    this.connect();
  }

  /**
   * 连接webSocket
   * @returns {WxResource}
   */
  public connect(): WxResource {
    wx.connectSocket({
      url: this.wsUrl
    });
    return this;
  }

  /**
   * get 方法
   * @param reqObj  传入的请求对象
   * @param token   传入的token【非必传参数】
   * @returns {Promise}
   */
  public get(reqObj: ReqObj, token?: string): Promise<any> {
    let _that = this;
    return new Promise((resolve, reject) => {
      wx.onSocketOpen(function (res) {
        console.log('WebSocket connection has been opened!', res);
        _that.sendMsg(reqObj, "GET", token);
      });
      this.receiveMsg(resolve);
      this.handleError(reject);
    })
  }

  /**
   * post 方法
   * @param reqObj  传入的请求对象
   * @param token   传入的token【非必传参数】
   * @returns {Promise}
   */
  public post(reqObj: ReqObj, token?: string): Promise<any> {
    let _that = this;
    return new Promise((resolve, reject) => {
      wx.onSocketOpen(function (res) {
        console.log('WebSocket connection has been opened!', res);
        _that.sendMsg(reqObj, "POST");
      });
      this.receiveMsg(resolve);

      this.handleError(reject);
    })
  }

  /**
   * delete 方法
   * @param reqObj   传入的请求对象
   * @param token    传入的token【非必传参数】
   * @returns {Promise}
   */
  public delete(reqObj: ReqObj, token?: string): Promise<any> {
    let _that = this;
    return new Promise((resolve, reject) => {
      wx.onSocketOpen(function (res) {
        console.log('WebSocket connection has been opened!', res);
        _that.sendMsg(reqObj, "DELETE");
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
  public update(reqObj: ReqObj, token?: string): Promise<any> {
    let _that = this;
    return new Promise((resolve, reject) => {
      wx.onSocketOpen(function (res) {
        console.log('WebSocket connection has been opened!', res);
        _that.sendMsg(reqObj, "UPDATE");
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
  private sendMsg(reqObj: ReqObj, method: string, token?: string) {

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
    });
  }

  // 处理错误信息
  handleError(reject) {
    wx.onSocketError(function (res) {
      reject(res);
      console.log(res, 'WebSocket连接打开失败，请检查！')
    });
  }

  // 处理服务器返回内容
  receiveMsg(resolve) {
    wx.onSocketMessage(function (res) {
      resolve(JSON.parse(res.data));
    });
  }

}

export default WxResource;