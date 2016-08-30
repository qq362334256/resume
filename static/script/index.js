$(function(){
	// 页面切换
	function boxSwitch(){
		var container = $('.layout-box'),
			btn = $('.switch-box').find('li'),
			index = 0,
			parS = [false, false, false, false],
			isWheel = true;

		// 调用初始化第一页特效
		loadAnimate(index);

		// 绑定切换功能
		btn.click(function(){
			var height = $(window).height();

			index = btn.index(this);
			switch(index){
				case 0:
						setAnimate(container, btn, height, index);
						break;
				case 1:
						setAnimate(container, btn, height, index);
						break;
				case 2:
						setAnimate(container, btn, height, index);
						break;
				default:
						setAnimate(container, btn, height, index);
			};
		});

		// 绑定滚动切换
		$(window).on('mousewheel', function(e){
			if(isWheel){
				isWheel = false;

				if(e.originalEvent.deltaY > 0){ // 向下
					scrollAlign('top');
				} else { // 向上
					scrollAlign('bottom');
				};	

				setTimeout(function(){
					isWheel = true;
				}, 800);
			};
		});

		// 绑定手势滑动切换
		miaoyu.touch.swipeTwo('top-bottom', $(document), 'topBottomSwitch', function(e){
			scrollAlign(e.touchS.align);
		}, 50);

		// 设置动画
		function setAnimate(element, btn, transY, index){
			element.css(miaoyu.getCompatibleCSS('transform', 'translateY('+ -transY * index +'px)'));

			btn.removeClass('sel').eq(index).addClass('sel');

			loadAnimate(index);
		};

		// 滚动方向
		function scrollAlign(align){
			var height = $(window).height(),
			maxIndex = btn.length - 1;

			if(align === 'bottom'){ // 往下
				if(index-- <= 0) index = 0;
				setAnimate(container, btn, height, index);
			} else { // 往上
				if(index++ >= maxIndex) index = maxIndex;
				setAnimate(container, btn, height, index);
			};
		};

		// 页面加载动画
		function loadAnimate(index){
			if(!parS[index]){
				switch(index){
					case 0: // 第一页动画初始化
							var element = $('#introduce'),
								totem = element.find('figure'),
								text = element.find('p');

							totem.css(miaoyu.getCompatibleCSS('animation', 'repeat-rotate 9s linear infinite'));
							text.each(function(n){
								var _this = this;

								setTimeout(function(){
									$(_this).css('opacity', 1).css(miaoyu.getCompatibleCSS('transform', 'translateY(0)'));
								}, 600 * n);
							});
		
							break;
					case 1: // 第二页动画初始化
							var element = $('#skill'),
								title = element.find('h2'),
								content = element.find('li'),
								strong = element.find('p');

							setTimeout(function(){
								title.css('opacity', 1).css(miaoyu.getCompatibleCSS('transform', 'translateX(0)'));
							
								content.each(function(n){
									var _this = this;

									setTimeout(function(){
										$(_this).css('opacity', 1).css(miaoyu.getCompatibleCSS('transform', 'translateY(0)'));
									}, 300 * n);
								});

								setTimeout(function(){
									strong.css('opacity', 1).css(miaoyu.getCompatibleCSS('transform', 'scale(1)'));
								}, content.length * 300);
							}, 600);
							
							break;
					case 2: // 第三页动画初始化
							var element = $('#workexp'),
								title = element.find('h2'),
								content = element.find('li');

							setTimeout(function(){
								title.css('opacity', 1).css(miaoyu.getCompatibleCSS('transform', 'translateX(0)'));
							
								content.each(function(n){
									var _this = this;

									setTimeout(function(){
										$(_this).css('opacity', 1).css(miaoyu.getCompatibleCSS('transform', 'rotate(0deg)'));
									}, 1000 * n);
								});
							}, 600);

							break;
					default: // 第四页动画初始化
							var element = $('#experience'),
								title = element.find('h2'),
								arc = element.find('li'),
								img = element.find('figure');

							setTimeout(function(){
								title.css('opacity', 1).css(miaoyu.getCompatibleCSS('transform', 'translateX(0)'));
								
								setTimeout(function(){
									arc.css(miaoyu.getCompatibleCSS('animation', 'repeat-rotate 4s linear infinite'));
									
									setTimeout(function(){
										img.css(miaoyu.getCompatibleCSS('animation', 'repeat-rotate-y 3s linear alternate infinite'));
									}, 300);
								}, 600);
							}, 600);
				};

				parS[index] = true;
			};
		};
	};
	boxSwitch();

	// 项目经验
	function experience(){
		var element = $('#experience'),
			btn = element.find('li');

		btn.click(function(){
			switch(btn.index(this)){
				case 0: // mytime商城
						location.href = 'http://shop.truty.cn/#/index';

						break;
				case 1: // 超体官网
						location.href = 'http://www.truty.cn/';

						break;
				case 2: // 超体管理系统
						location.href = 'http://www.truty.cn/admin';

						break;
				default: // SAA雪域援助协会
						location.href = 'http://www.xueyu-aid.com/index';
			};
		});
	};	
	experience();


	miaoyu.plus.msgbox.open();
});