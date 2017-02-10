# 微信小程序webSocket模拟http请求
 
 # 使用：
 ## 安装
````bash
    npm install wx-resource
````
## 用法示例
```javascript
import Ws from 'wx-resource'
 
 const ws = new Ws("ws://...");
 
 ws.get(
       {
         url: 'http://...'
       },
       token
     ).then(function (res) {
       // ...
     });
 
 ws.post(
        {
          url: 'http://...',
          data: {
            x: y,
            y: y
          }
        },
        token
      ).then(function (res) {
        // ...
      });
 
 ws.delete(
        {
          url: 'http://...',
          data: {
            x: y,
            y: y
          }
        },
        token
      ).then(function (res) {
        // ...
      });
 
 ws.update(
         {
           url: 'http://...',
           data: {
             x: y,
             y: y
           }
         },
         token
       ).then(function (res) {
         // ...
       });
```