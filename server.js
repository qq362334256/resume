/* resume启动程序
 ------------------
 *  express - 服务模块
 */

// 模块注入
var express = require('express'),
    app = express();

// 服务器项配置
app.use(express.static(__dirname));
// app.use(favicon(__dirname + '/public/bootstrap-3.3.1/docs/favicon.ico'));
app.listen(process.env.PORT || 5000, function(){
    console.log('web 服务器启动成功！端口：5000！');
});

// 路由配置
app.get('/', function(req, res){
	res.send('index.html'); 
});
app.get('/index', function(req, res){
	res.send('index.html'); 
});