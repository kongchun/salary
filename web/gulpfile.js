var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require("babelify");
var source = require("vinyl-source-stream");
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var less = require('gulp-less');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var cssmin = require('gulp-cssmin');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');

gulp.task('vendor-css', function() {
	gulp.src('node_modules/bootstrap/dist/fonts/*.*')
		.pipe(gulp.dest('public/fonts'));

	return gulp.src(['node_modules/bootstrap/dist/css/bootstrap.min.css',
			'node_modules/animate.css/animate.css'
		])
		.pipe(concat('vendor.css'))
		.pipe(cssmin())
		.pipe(gulp.dest('dist/css'));

});


/*
 |--------------------------------------------------------------------------
 | Combine all JS libraries into a single file for fewer HTTP requests.
 |--------------------------------------------------------------------------
 */

gulp.task('vendor', ['vendor-css'], function() {
	return gulp.src([
			'node_modules/jquery/dist/jquery.js',
			'node_modules/bootstrap/dist/js/bootstrap.js',
			//'node_modules/headroom.js/dist/headroom.js',
			//'node_modules/headroom.js/dist/jQuery.headroom.js'
			//'src/echarts.min.js', "src/macarons.js", //echart
			'src/echarts.min.js', "src/macarons.js", "src/bmap.min.js" //echart
		]).pipe(concat('vendor.js'))
		.pipe(uglify())
		//.pipe(gulpif(production, uglify({mangle: false})))
		.pipe(gulp.dest('dist/js'));
});

/*
 |--------------------------------------------------------------------------
 | Compile only project files, excluding all third-party dependencies.
 |--------------------------------------------------------------------------
 */

gulp.task('browserify', function() {
	gulp.src('src/data.js').pipe(uglify()).pipe(gulp.dest('dist/js'));

	return browserify(['src/main.js'])
		.transform(babelify, {
			presets: ['es2015', 'react', 'stage-0']
		})
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(streamify(uglify()))
		//.pipe(gulpif(production, streamify(uglify({mangle: false}))))
		.pipe(gulp.dest('dist/js'));
});


gulp.task('styles', function() {
	return gulp.src('src/css/style.css')
		.pipe(plumber())
		.pipe(less())
		.pipe(autoprefixer())
		.pipe(cssmin())
		//.pipe(gulpif(production, cssmin()))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('html', function() {
	return gulp.src(['src/*.html'])
		//.pipe(revCollector())
		.pipe(gulp.dest("dist"));
});


gulp.task('build', ['html', 'styles', 'vendor', 'browserify']);


gulp.task('watch', ['build'], function() {
	gulp.watch('src/**/*.*', ['build']);
	gulp.watch('dist/**/*.*', ['reload']);
});


//执行gulp server开启服务器
gulp.task('server', ['connect', 'watch']);

gulp.task('connect', function() {
	connect.server({
		host: '127.0.0.1', //地址，可不写，不写的话，默认localhost
		port: 3000, //端口号，可不写，默认8000
		root: './', //当前项目主目录
		livereload: true //自npm ins动刷新
	});
});
gulp.task('reload', function() {
	return gulp.src('*').pipe(connect.reload());
});

gulp.task('default', function() {
	gulp.start('server');
});