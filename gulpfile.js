var gulp = require('gulp'),
	browserify = require('browserify'),
	reactify = require('reactify'),
	source = require('vinyl-source-stream');;

gulp.task('browserify-reactify', function() {
	var b = browserify();
  	b.transform(reactify); // use the reactify transform
  	b.add('public/js/FoodLog.js');
  	return b.bundle()
    .pipe(source('FoodLog.js'))
    .pipe(gulp.dest('public/build'));
});

gulp.task('default', ['browserify-reactify']);