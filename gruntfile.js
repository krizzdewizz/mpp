var path = require('path');
var fs = require('fs');

module.exports = function (grunt) {
    
    require('load-grunt-tasks')(grunt);
    
    grunt.initConfig({
        clean: {
            clean: ['.tmp', 'dist'],
            options: {
                'no-write': false
            }
        },
        
        copy: {
            main: {
                files: [{
                        expand: true,
                        cwd: 'app',
                        dest: '.tmp',
                        src: [
                            '**/*', '!**/*.js*',
                        ]
                    }, {
                        expand: true,
                        cwd: 'app',
                        dest: 'dist',
                        src: [
                            '**/*', '!scripts/**', '!styles/**'
                        ]
                    }]
            }
        },
        
        typescript: {
            base: {
                src: '.tmp/**/*.ts',
                options: {
                    module: 'commonjs',
                    target: 'es5',
                    declaration: false,
                    references: [
                        '.tmp/scripts/**/*.d.ts'
                    ]
                }
            }
        },
       
        filerev: {
            dist: {
                src: [
                    'dist/scripts/{,*/}*.js',
                    'dist/styles/{,*/}*.css',
                    'dist/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                ]
            }
        },
        useminPrepare: {
            html: 'app/index.html',
            options: {
                dest: 'dist',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },
        usemin: {
            html: ['dist/{,*/}*.html'],
            css: ['dist/styles/{,*/}*.css'],
            options: {
                assetsDirs: [
                    'dist',
                    'dist/images',
                    'dist/styles'
                ]
            }
        },
        
        ngAnnotate: {
            dist: {
                files: [{
                        expand: true,
                        cwd: '.tmp/concat/scripts',
                        src: '*.js',
                        dest: '.tmp/concat/scripts'
                    }]
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            
            dist: {
                files: [{
                        expand: true,
                        cwd: '.tmp/styles/',
                        src: '{,*/}*.css',
                        dest: '.tmp/styles/'
                    }]
            }
        }, 
        //htmlmin: {
        //    dist: {
        //        options: {
        //            collapseWhitespace: true,
        //            conservativeCollapse: true,
        //            collapseBooleanAttributes: true,
        //            removeCommentsFromCDATA: true,
        //            removeOptionalTags: true
        //        },
        //        files: [{
        //                expand: true,
        //                cwd: 'dist',
        //                src: ['*.html', 'partials/{,*/}*.html'],
        //                dest: 'dist'
        //            }]
        //    }
        //},
        
        // run this task whenever a new image is added to the app
        sprite: {
            all: {
                src: 'app_images/*.png',
                dest: 'app/images/all.png',
                destCss: 'app/styles/all.css'
            }
        }
    });
    
    grunt.registerTask('default', [
        'clean',
        'copy',
        'typescript',
        'useminPrepare',
        'autoprefixer',
        'concat',
        'ngAnnotate',
        'cssmin',
        'uglify',
        'filerev',
        'usemin',
        //'htmlmin' // has some bugs still
    ]);
};