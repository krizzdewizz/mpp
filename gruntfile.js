var path = require('path');
var fs = require('fs');

var targetFolder = 'app/dist';

module.exports = function (grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        clean: {
            clean: '.tmp',
            options: {
                'no-write': false
            }
        },
        
        copy: {
            main: {
                files: [
                    { expand: true, src: ['README.md', 'LICENSE'], dest: targetFolder },
                    { expand: true, flatten: true, src: ['build/*'], dest: targetFolder },
                    { expand: true, cwd: 'scripts', src: ['follow-redirects/**'], dest: path.join(targetFolder, 'lib') },
                ],
            },
        },
        
        typescript: {
            base: {
                src: 'app/scripts/*.ts',
                dest: '.tmp/tsc',
                options: {
                    module: 'commonjs',
                    target: 'es5',
                    basePath: 'app/scripts',
                    declaration: false,
                    references: [
                        'app/scripts/**/*.d.ts'
                    ]
                }
            }
        },
        
        removeDevDeps: {
            src: ['.', targetFolder],
        },
        
        // qqqq
        concat: {
            dist: {
                src: ['.tmp/tsc/**/*.js'],
                dest: '.tmp/concat/js/app.js',
            },
        },

        useminPrepare: {
            html: 'app/index.html',
            options: {
                dest: 'app/dist',
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

        //uglify: {
        //    generated: {
        //        dest: 'dist/js/app.js',
        //        src: ['.tmp/concat/js/app.js']
        //    }
        //}
    });
    
    // qq
    
    
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-concat');
    //grunt.loadNpmTasks('grunt-cssmin');
    grunt.loadNpmTasks('grunt-uglify');
    //grunt.loadNpmTasks('grunt-filerev');
    grunt.loadNpmTasks('grunt-usemin');
    
    grunt.registerTask('build', [
        'useminPrepare',
        'concat',
        //'cssmin:generated',
        //'uglify:generated',
        //'filerev',
        'usemin'
    ]);
    
    grunt.registerTask('default', ['clean', 'typescript', 'concat']);

};