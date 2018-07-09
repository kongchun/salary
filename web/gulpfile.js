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

var server = require('gulp-express');

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
	gulp.src(['node_modules/layui-src/dist/lay/modules/*.js'
	]).pipe(gulp.dest("dist/jlib/lay/lay/modules"));

	gulp.src(['node_modules/layui-src/dist/layui.js',
	'node_modules/layui-src/dist/css/layui.css'
	]).pipe(gulp.dest("dist/jlib/lay"));

	gulp.src(['node_modules/layui-src/dist/font/*'
	]).pipe(gulp.dest("dist/jlib/font"));

	gulp.src(['src/lib/layui/*.js'
	]).pipe(gulp.dest("dist/js/layui"));

	gulp.src(['node_modules/ejs/ejs.min.js'
	]).pipe(gulp.dest("dist/jlib/ejs"));
	

	gulp.src([
			'src/echarts.min.js', "src/macarons.js",  //echart
		]).pipe(concat('vendor-echart.js'))
		.pipe(uglify())
		//.pipe(gulpif(production, uglify({mangle: false})))
		.pipe(gulp.dest('dist/js'));

	gulp.src([
			'src/bmap.min.js', //echart
		]).pipe(concat('vendor-bmap.js'))
		.pipe(uglify())
		//.pipe(gulpif(production, uglify({mangle: false})))
		.pipe(gulp.dest('dist/js'));

	return gulp.src([
			'node_modules/jquery/dist/jquery.js',
			'node_modules/bootstrap/dist/js/bootstrap.js',
			//'node_modules/headroom.js/dist/headroom.js',
			//'node_modules/headroom.js/dist/jQuery.headroom.js'
			//'src/echarts.min.js', "src/macarons.js", //echart
			//'src/echarts.min.js', "src/macarons.js", "src/bmap.min.js" //echart
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
	//manage js 
	let jsFiles = ['company','charts','companyposition','tables'];
	for(var i=0;i<jsFiles.length;i++){
		browserify(['src/manage/'+jsFiles[i]+'.js'])
		.transform(babelify, {
			presets: ['es2015', 'react', 'stage-0']
		})
		.bundle()
		.pipe(source('bundle-'+jsFiles[i]+'.js'))
		.pipe(streamify(uglify()))
		//.pipe(gulpif(production, streamify(uglify({mangle: false}))))
		.pipe(gulp.dest('dist/js'));
	}

	//gulp.src('src/data.js').pipe(uglify()).pipe(gulp.dest('dist/js'));
	browserify(['src/charts/datashow.js'])
		// .transform(babelify, {
		// 	presets: ['es2015', 'react', 'stage-0']
		// })
		.bundle()
		.pipe(source('bundle-datashow.js'))
		// .pipe(streamify(uglify()))
		//.pipe(gulpif(production, streamify(uglify({mangle: false}))))
		.pipe(gulp.dest('dist/js'));


	// browserify(['src/manage/company.js'])
	// 	.transform(babelify, {
	// 		presets: ['es2015', 'react', 'stage-0']
	// 	})
	// 	.bundle()
	// 	.pipe(source('bundle-company.js'))
	// 	.pipe(streamify(uglify()))
	// 	//.pipe(gulpif(production, streamify(uglify({mangle: false}))))
	// 	.pipe(gulp.dest('dist/js'));

	// browserify(['src/manage/charts.js'])
	// 	.transform(babelify, {
	// 		presets: ['es2015', 'react', 'stage-0']
	// 	})
	// 	.bundle()
	// 	.pipe(source('bundle-charts.js'))
	// 	.pipe(streamify(uglify()))
	// 	//.pipe(gulpif(production, streamify(uglify({mangle: false}))))
	// 	.pipe(gulp.dest('dist/js'));

	// browserify(['src/manage/companyposition.js'])
	// 	.transform(babelify, {
	// 		presets: ['es2015', 'react', 'stage-0']
	// 	})
	// 	.bundle()
	// 	.pipe(source('bundle-companyposition.js'))
	// 	.pipe(streamify(uglify()))
	// 	// .pipe(gulpif(production, streamify(uglify({mangle: false}))))
	// 	.pipe(gulp.dest('dist/js'));

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
	gulp.src(['node_modules/layui-src/dist/css/modules/layer/default/*',
	]).pipe(gulp.dest("dist/jlib/lay/css/modules/layer/default"));

	gulp.src(['src/lib/layui/*.css'
	]).pipe(gulp.dest("dist/css/layui"));

	gulp.src(['src/images/*'
	]).pipe(gulp.dest("dist/images"));

	return gulp.src(['src/css/style.css'])
		.pipe(plumber())
		.pipe(less())
		.pipe(autoprefixer())
		.pipe(cssmin())
		//.pipe(gulpif(production, cssmin()))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('html', function() {
	gulp.src(['src/charts/*.html'])
		//.pipe(revCollector())
		.pipe(gulp.dest("dist/charts"));
	gulp.src(['src/manage/*.html'])
		//.pipe(revCollector())
		.pipe(gulp.dest("dist/manage"));
	return gulp.src(['src/*.html'])
		//.pipe(revCollector())
		.pipe(gulp.dest("dist"));
});


gulp.task('build', ['html', 'styles',  'browserify']);


gulp.task('watch', ['build'], function() {
	gulp.watch('src/**/*.*', ['build'])
	//gulp.watch('dist/**/*.*', ['reload']);
});


gulp.task('server', ['watch'], function() {
	process.env.NODE_ENV = 'development';
	process.env.debug = 'salary:*';
	// Start the server at the beginning of the task
	server.run(['./bin/www']);
	gulp.watch('public/**/bundle.js', server.notify);
	gulp.watch('public/**/m_bundle.js', server.notify);
	gulp.watch('public/**/*.css', server.notify);
	gulp.watch('dist/**/*.html', server.notify);
	gulp.watch('dist/**/*.js', server.notify);
	gulp.watch(['app.js', 'routes/**/*.js'], server.run);
});

gulp.task('run', ['watch'], function() {
	// Start the server at the beginning of the task
	server.run(['./bin/www']);
});

//执行gulp server开启服务器
// gulp.task('server', ['start', 'watch']);

// gulp.task('start', function() {
// 	connect.server({
// 		host: '127.0.0.1', //地址，可不写，不写的话，默认localhost
// 		port: 3000, //端口号，可不写，默认8000
// 		root: './', //当前项目主目录
// 		livereload: true //自npm ins动刷新
// 	});
// });
// gulp.task('reload', function() {
// 	return gulp.src('*').pipe(connect.reload());
// });

// gulp.task('default', function() {
// 	gulp.start('server');
// });