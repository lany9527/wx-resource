"# 微信小程序webSocket模拟http请求"
 
 ```
 import Ws from
 
 const ws = new Ws("ws://192.168.8.138/api/ws");
 
 ws.get(
       {
         url: 'http://192.168.8.138/api/v1/user/auth/status'
       },
       token
     ).then(function (res) {
       console.log(res);
       data = res;
     });
 ```
