module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            default: ["src/**/*.js", "Gruntfile.js"],
            options: {
                newcap: false,
            },
        },
        react: {
            default: {
                files: [{
                    expand: true,
                    cwd: "src/components",
                    src: ["*.jsx"],
                    dest: "src/components",
                    ext: ".js",
                }],
            },
        },
        browserify: {
            default: {
                files: {
                    "dist/examples.js": "src/examples.js",
                },
            },
        },
        uglify: {
            default: {
                files: {
                    "dist/examples.min.js": "dist/examples.js",
                },
            },
            options: {
                mangle: true,
                compress: true,
            },
        },
    });
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("grunt-react");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.registerTask("default", ["react", "jshint", "browserify", "uglify"]);
};
