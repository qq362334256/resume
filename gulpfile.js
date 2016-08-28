var gulp = require('gulp'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber');
    minifyCss = require('gulp-minify-css');

/* task任务
 * auto-less - 自动编译less文件
 */

// 自动编译配置项
var config = {
	// less配置
	less: [
		'static/style/',
	],
	// js配置
	js: [
		
	]
};    

// 自动编译less任务
gulp.task('auto-less', function(){
	config.less.forEach(function(value, key){
		gulp.watch(value +'*.less', function(data){
			gulp.src([data.path, '!'+ value +'fn.less'])
				.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
				.pipe(less())
				.pipe(minifyCss())
				.pipe(rename({suffix: '.min'}))
				.pipe(gulp.dest(value));

			console.log(data.path +'监听完成！');
		});
	});

	console.log('开始监听less变化！');
});