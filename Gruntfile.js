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
                options: {
                    bundleOptions: {
                        debug: true,
                    },
                },
            },
        },
    });
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("grunt-react");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.registerTask("default", ["react", "jshint", "browserify"]);
};
