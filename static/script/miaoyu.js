(function(){
	function Miaoyu(){
		// 常量
		this._constant_ = {};

		// 插件
		this.plus = {};
	};

	// 原型对象
	Miaoyu.prototype = {
		constructor: Miaoyu,
		/*  
		 * 获取 CSS3 兼容样式对象
		 * 参数：
		 * 		name  -- (字符串型)样式名
		 *   	value -- (字符串型)样式值
		 * 返回值：
		 * 		对象型
		 */
		getCompatibleCSS: function(name, value){
			var prefixS = ['o', 'ms', 'moz', 'webkit'],
				arrS = {};

			prefixS.forEach(function(_value, key){
				arrS[_value + name.charAt(0).toUpperCase() + name.substr(1)] = value;
			});
			arrS[name] = value;
				
			return arrS;
		},
		/* 
		 *  喵鱼手势库
		 *	方法：
		 *		tap - 触碰事件
		 *	 	swipeSingle - 单向滑动监听
		 *	  	swipeTwo - 双向滑动监听
		 */
		touch: {
			// 内部方法
			_inside_: {
				// 滑动长度是否不符合要求(不符合则取消一切事件绑定)
				isTouchWidth: function(align, touchS, distance){
					if(typeof align === 'string'){ // 单项滑动
						if(align === 'top' || align === 'bottom'){
							if(touchS.absY < distance) return false;
						} else {
							if(touchS.absX < distance) return false;
						};
					} else { // 双向滑动
						if(align[0] === 'top' || align[0] === 'bottom'){
							if(touchS.absY < distance) return false;
						} else {
							if(touchS.absX < distance) return false;
						};
					};

					return true;
				},
				// 获取滑动相对角度
				getRelativeAngle: function(touchS){
					return Math.atan(touchS.absY / touchS.absX) * 180 / Math.PI;
				},
				// 获取滑动角度
				getTouchAngle: function(touchS){
					// 象限判定
					if(touchS.moveX >= 0 && touchS.moveY <= 0){ // 第一象限
						if(touchS.angle >= 45){ // 上
							return 'top';
						} else { // 右
							return 'right';
						};
					} else if(touchS.moveX < 0 && touchS.moveY <= 0){ // 第二象限
						if(touchS.angle >= 45){ // 上
							return 'top';
						} else { // 左
							return 'left';
						};
					} else if(touchS.moveX < 0 && touchS.moveY > 0){ // 第三象限
						if(touchS.angle >= 45){ // 下
							return 'bottom';
						} else { // 左
							return 'left';
						};
					} else { // 第四象限
						if(touchS.angle >= 45){ // 下
							return 'bottom';
						} else { // 右
							return 'right';
						};
					};
				},
				// 释放所有事件监听
				offEvent: function(Dom, eventName){
					Dom.off('touchmove'+ eventName).off('touchend'+ eventName);
				}
			},	
			/*  
			 * tap 触碰事件
			 * 参数：
			 * 		Dom -- 需要监听的事件节点
			 *   	anonymous -- 需要声明的匿名空间名称
			 *    	fn -- 需要执行的回调函数
			 *	返回值：
			 *		event对象，包含在回调函数里面
			 */
			tap: function(Dom, anonymous, fn){
				var eventName = !anonymous ? '' : '.'+ anonymous;

				Dom.on('touchstart'+ eventName, function(e){
					fn({
						e: e,  // 原生e事件对象
						this: this,  // 当前this指向
						anonymous: 'touchstart'+ eventName  // 取消绑定事件的匿名空间
					});
				});
			},	
			/*  
			 * swipeSingle 单向滑动监听
			 * 参数：
			 * 		align -- 单向监听的方向，选值为：'left'、'right'、'top'、'bottom'
			 *   	Dom -- 需要监听的事件节点
			 *    	anonymous -- 需要声明的匿名空间名称
			 *     	fn -- 需要执行的回调函数
			 *      [distance] -- [可选]滑动的最低距离，默认为30
			 *      [moveCallback] -- [可选]滑动过程中执行的方法
			 *	返回值：
			 *		event对象，包含在回调函数里面
			 */
			swipeSingle: function(align, Dom, anonymous, fn, distance, moveCallback){
				var _this = this,
					eventName = !anonymous ? '' : '.'+ anonymous,
					distance = !distance ? 30 : Number(distance);

				// 触碰按下事件
				Dom.on('touchstart'+ eventName, function(e){
					var touchS = {
						startX: e.targetTouches[0].clientX,
						startY: e.targetTouches[0].clientY,
						absX: 0,
						absY: 0
					};

					// 触碰滑动事件
					Dom.on('touchmove'+ eventName, function(e){
						touchS.moveX = e.targetTouches[0].clientX - touchS.startX;
						touchS.moveY = e.targetTouches[0].clientY - touchS.startY;
						touchS.absX = Math.abs(touchS.moveX);
						touchS.absY = Math.abs(touchS.moveY);
						touchS.angle = _this._inside_.getRelativeAngle(touchS);

						// 获取滑动角度
						if(_this._inside_.getTouchAngle(touchS) === align){
							touchS.align = align;
							// 禁用滑动默认事件
							e.preventDefault();
						} else {
							// 释放所有事件绑定
							_this._inside_.offEvent(Dom, eventName);
						};

						// 如果滑动回调事件存在就执行
						if(moveCallback) moveCallback({
							e: e,  // 原生e事件对象
							this: this,  // 当前this指向
							touchS: touchS  // 整个滑动的数据对象
						});
					});

					// 抬起手势
					Dom.on('touchend'+ eventName, function(e){
						// 滑动的距离是否满足要求
						if(_this._inside_.isTouchWidth(align, touchS, distance)){
							// 执行回调
							fn({
								e: e,  // 原生e事件对象
								this: this,  // 当前this指向
								anonymous: 'touchstart'+ eventName,  // 取消绑定事件的匿名空间
								touchS: touchS  // 整个滑动的数据对象
							});						
						};

						// 解除事件绑定
						_this._inside_.offEvent(Dom, eventName);
					});
				})
			},	
			/*  
			 * swipeTwo 双向滑动监听
			 * 参数：
			 *  	align -- 双向监听的方向，选值为：'left-right'、'top-bottom'
			 *   	Dom -- 需要监听的事件节点
			 *    	anonymous -- 需要声明的匿名空间名称
			 *     	fn -- 需要执行的回调函数
			 *      [distance] -- [可选]滑动的最低距离，默认为30
			 *      [moveCallback] -- [可选]滑动过程中执行的方法
			 * 返回值：
			 *		event对象，包含在回调函数里面
			 */
			swipeTwo: function(align, Dom, anonymous, fn, distance, moveCallback){
				var _this = this,
					eventName = !anonymous ? '' : '.'+ anonymous,
					distance = !distance ? 30 : Number(distance),
					align = align === 'left-right' ? ['left', 'right'] : ['top', 'bottom'];

				// 触碰按下事件
				Dom.on('touchstart'+ eventName, function(e){
					var targetTouches = e.targetTouches || e.originalEvent.targetTouches,
						touchS = {
							startX: targetTouches[0].clientX || targetTouches[0].clientX,
							startY: targetTouches[0].clientY || targetTouches[0].clientY,
							absX: 0,
							absY: 0
						};

					// 触碰滑动事件
					Dom.on('touchmove'+ eventName, function(e){
						var targetTouches = e.targetTouches || e.originalEvent.targetTouches;

						touchS.moveX = targetTouches[0].clientX - touchS.startX;
						touchS.moveY = targetTouches[0].clientY - touchS.startY;
						touchS.absX = Math.abs(touchS.moveX);
						touchS.absY = Math.abs(touchS.moveY);
						touchS.angle = _this._inside_.getRelativeAngle(touchS);

						// 获取滑动角度
						if(_this._inside_.getTouchAngle(touchS) === align[0]){
							touchS.align = align[0];
							// 禁用滑动默认事件
							e.preventDefault();
						} else if(_this._inside_.getTouchAngle(touchS) === align[1]){
							touchS.align = align[1];
							// 禁用滑动默认事件
							e.preventDefault();
						} else {
							// 释放所有事件绑定
							_this._inside_.offEvent(Dom, eventName);
						};

						// 如果滑动回调事件存在就执行
						if(moveCallback) moveCallback({
							e: e,  // 原生e事件对象
							this: this,  // 当前this指向
							touchS: touchS  // 整个滑动的数据对象
						});
					});

					// 抬起手势
					Dom.on('touchend'+ eventName, function(e){
						// 滑动的距离是否满足要求
						if(_this._inside_.isTouchWidth(align, touchS, distance)){
							// 执行回调
							fn({
								e: e,  // 原生e事件对象
								this: this,  // 当前this指向
								anonymous: 'touchstart'+ eventName,  // 取消绑定事件的匿名空间
								touchS: touchS  // 整个滑动的数据对象
							});						
						};

						// 解除事件绑定
						_this._inside_.offEvent(Dom, eventName);
					});
				})
			}	
		}
	};
	
	// 挂在miaoyu对象
	if(typeof module === 'object' && typeof module.exports === 'object'){ // CommonJS规范兼容
		module.exports = new Miaoyu();
	} else if(typeof define === 'function' && define.amd){ // AMD规范兼容
		define('miaoyu', [], function() {
			return new Miaoyu();
		});
	} else { // 常规版本
		if(window){
			window.miaoyu = new Miaoyu();
		} else {
			this.miaoyu = new Miaoyu();
		};
	};
})();