"use strict";

var modRewrite = require("connect-modrewrite");

module.exports = function (grunt) {

    var base = grunt.option("base-dir") || "",
        env = grunt.option("env") || "development",
        protractorConf = grunt.option("ci") ?
                        "./tests/e2e/protractor.saucelabs.conf.js" :
                        "./tests/e2e/protractor.conf.js" ;

    grunt.initConfig({

        pkg: grunt.file.readJSON("./package.json"),

        bower: grunt.file.readJSON("./bower.json"),

        env: grunt.file.readJSON("./env.json")[env],

        config: {
            outputDir: "./dist/",
            applicationFiles: grunt.file.readJSON("./scripts.json").application,
            vendorFiles: grunt.file.readJSON("./scripts.json").vendor
        },

        connect: {
            options: {
                hostname: "0.0.0.0",
                port: 8000,
                base: base
            },
            server: {
                options: {
                    livereload: true,
                    middleware: function ( connect, options, middlewares ) {
                        var rules = (base === "dist") ?
                            [ "^/[^\.]*$ /index.html" ] :
                            [ "^/app/[^\.]*$ /app/index.html" ];
                        middlewares.unshift( modRewrite( rules ) );
                        return middlewares;
                    }
                }
            },
            servertest: {
                options: {
                    keepalive: false,
                    livereload: false,
                    base: "<%= config.outputDir %>",
                    middleware: function ( connect, options, middlewares ) {
                        var rules = [ "^/[^\.]*$ /index.html" ];
                        middlewares.unshift( modRewrite( rules ) );
                        return middlewares;
                    }
                }
            }
        },

        watch: {
            options: {
                nospawn: false,
                livereload: true
            },
            css: {
                files: [
                    "./app/index.html",

                    "./app/less/*.less",
                    "./app/less/**/*.less",
                    "./app/less/**/**/*.less",

                    "./app/**/*.html",
                    "./app/components/**/*.html",

                    "./modules/*.html",
                    "./modules/**/*.html",
                    "./modules/**/**/*.html"
                ],
                tasks: ["less:development"]
            },
            javascript: {
                files: [
                    "./app/*.js",
                    "./app/**/*.js",
                    "./app/**/**/*.js",

                    "./tests/unit/*.js",
                    "./tests/unit/**/*.js",
                    "./tests/unit/**/**/*.js",

                    "scripts.json"
                ],
                tasks: ["sails-linker", "test:development"]
            }
        },

        less: {
            options: {
                paths: ["./app/less/"],
                cleancss: false,
                banner: "/*! <%= pkg.name %> - v<%= pkg.version %> - " +
                    "<%= grunt.template.today(\"yyyy-mm-dd\") %> */\n"
            },
            development: {
                files: { "./app/css/all.css": "./app/less/main.less" },
                options: {
                    sourceMap: true,
                    sourceMapFilename: "app/css/all.css.map",
                    sourceMapURL: "all.css.map",
                    outputSourceFiles: true
                }
            },
            production: {
                files: { "<%= config.outputDir %>css/all.min.css": "app/less/main.less" },
                options: {
                    cleancss: true,
                    modifyVars: {
                        "icon-font-path": "'../fonts/'"
                    }
                }
            }
        },

        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            dist: {
                src: ["<%= config.applicationFiles %>"]
            }
        },

        jasmine: {
            options: {
                specs: ["./tests/unit/**/*.js"],
                keepRunner: true,
            },
            development: {
                src: [
                    "<%= ngconstant.options.dest %>",
                    "<%= config.applicationFiles %>"
                ],
                options: {
                    vendor: ["<%= config.vendorFiles %>"],
                    template: require("grunt-template-jasmine-istanbul"),
                    templateOptions: {
                        coverage: "./coverage/coverage.json",
                        report: [
                            {
                                type: "lcov",
                                options: {
                                    dir: "./coverage"
                                }
                            },
                            {
                                type: "text-summary"
                            }
                        ]
                    }
                }
            },
            production: {
                src: ["<%= config.outputDir %>js/app.min.js", "./app/bower_components/angular-mocks/angular-mocks.js"]
            }
        },

        protractor: {
            options: {
                keepAlive: false,
                noColor: false
            },
            dist: {
                options: {
                    configFile: protractorConf
                }
            }
        },

        protractor_webdriver: {
            dist: {
                options: {
                    command: "webdriver-manager update && webdriver-manager start",
                }
            }
        },

        concat: {
            options: {
                sourceMap: true,
                separator: ";",
                banner: "/*! <%= pkg.name %> - v<%= pkg.version %> - " +
                    "<%= grunt.template.today(\"yyyy-mm-dd\") %> */\n"
            },
            production: {
                src: [
                    "<%= config.vendorFiles %>",
                    "<%= ngconstant.options.dest %>",
                    "<%= config.applicationFiles %>"
                ],
                dest: "<%= config.outputDir %>js/app.js"
            }
        },

        uglify: {
            options: {
                sourceMap: true,
                sourceMapIncludeSources: true,
                enclose: { window: "window" },
                banner: "/*! <%= pkg.name %> - v<%= pkg.version %> - " +
                    "<%= grunt.template.today(\"yyyy-mm-dd\") %> */\n"
            },
            production: {
                files: {
                    "<%= config.outputDir %>js/app.min.js":
                    [
                        "<%= config.vendorFiles %>",
                        "<%= ngconstant.options.dest %>",
                        "<%= config.applicationFiles %>"
                    ]
                }
            }
        },

        copy: {
            images: {
                files: [{
                    expand: true,
                    cwd: "./app/img",
                    src: ["**/*", "!test/**"],
                    dest: "<%= config.outputDir %>img/"
                }]
            },
            partials: {
                files: [{
                    expand: true,
                    cwd: "./app",
                    src: ["**/*.html"],
                    dest: "<%= config.outputDir %>"
                }]
            },
            fonts: {
                files: [{
                    expand: true,
                    cwd: "./app/bower_components/bootstrap/fonts",
                    src: ["*"],
                    dest: "<%= config.outputDir %>fonts/"
                }]
            }
        },

        clean: {
            beforeBuild: {
                src: ["<%= config.outputDir %>", "./docs"]
            },
            afterTest: {
                src: ["<%= config.outputDir %>"]
            }
        },

        processhtml: {
            options: {
                strip: true,
                data: { url: "<%= env.BASE_URL %>" }
            },
            production: {
                files: { "<%= config.outputDir %>index.html": ["./app/index.html"] }
            },
            e2e: {
                files: { "<%= config.outputDir %>index.html": ["./app/index.html"] },
                options: {
                    data: { url: "http://127.0.0.1:8000/" }
                }
            }
        },

        yuidoc: {
            compile: {
                name: "<%= pkg.name %>",
                description: "<%= pkg.description %>",
                version: "<%= pkg.version %>",
                url: "<%= pkg.homepage %>",
                options: {
                    paths: "./app/",
                    themedir: "node_modules/yuidoc-bootstrap-theme",
                    helpers: ["node_modules/yuidoc-bootstrap-theme/helpers/helpers.js"],
                    outdir: "./docs/"
                }
            }
        },

        bump: {
            options: {
                files: ["./package.json", "./bower.json"],
                updateConfigs: ["pkg"],
                commit: true,
                commitFiles: ["-a"],
                createTag: true,
                push: true,
                pushTo: "origin master"
            }
        },

        ngconstant: {
            options: {
                name: "config",
                dest: "./app/config/config.js",
                constants: {
                    bower: "<%= bower %>",
                    pkg: "<%= pkg %>",
                    env: "<%= env %>"
                }
            },
            dist: {}
        },

        "sails-linker": {
            scripts: {
                options: {
                    startTag: "<!-- build:js js/app.min.js -->",
                    endTag: "<!-- /build -->",
                    fileTmpl: "<script src=\"%s\"></script>",
                    appRoot: "app/"
                },
                files: {
                    "app/index.html": ["<%= config.vendorFiles %>", "<%= config.applicationFiles %>" ]
                },
            }
        },

        s3: {
            options: {
                // key and secret must be set in env variables
                // we don't want to store them here i.e.
                // export AWS_ACCESS_KEY_ID="KEY"
                // export AWS_SECRET_ACCESS_KEY="SECRET"
                bucket: "prototype.firstmate",
                region: "eu-west-1",
                access: "public-read",
                headers: {
                    // Two Year cache policy (1000 * 60 * 60 * 24 * 730)
                    "Cache-Control": "max-age=630720000, public",
                    "Expires": new Date(Date.now() + 63072000000).toUTCString()
                }
            },
            stage: {
                upload: [
                    {
                        src: "dist/**/*.*",
                        dest: "",
                        rel: "dist",
                        options: { gzip: true }
                    }
                ],
            }
        }

    });

    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-yuidoc");
    grunt.loadNpmTasks("grunt-contrib-jasmine");
    grunt.loadNpmTasks("grunt-protractor-runner");
    grunt.loadNpmTasks("grunt-protractor-webdriver");
    grunt.loadNpmTasks("grunt-processhtml");
    grunt.loadNpmTasks("grunt-ng-constant");
    grunt.loadNpmTasks("grunt-bump");
    grunt.loadNpmTasks("grunt-sails-linker");
    grunt.loadNpmTasks("grunt-s3");

    grunt.registerTask("build", [
        "clean:beforeBuild",
        "less:production",
        "ngconstant",
        "uglify",
        "copy",
        "processhtml:production"
    ]);

    grunt.registerTask("release", [
        "bump-only",
        "build",
        "bump-commit"
    ]);

    grunt.registerTask("deploy", [
        "build",
        "s3"
    ]);

    grunt.registerTask("server", [
        "less:development",
        "sails-linker",
        "ngconstant",
        "connect:server",
        "watch:css"
    ]);

    grunt.registerTask("serverjs", [
        "less:development",
        "sails-linker",
        "ngconstant",
        "connect:server",
        "watch:javascript"
    ]);

    grunt.registerTask("serverall", [
        "less:development",
        "sails-linker",
        "ngconstant",
        "connect:server",
        "watch"
    ]);

    grunt.registerTask("test", [
        "clean:beforeBuild",
        "ngconstant",
        "jshint",
        "uglify",
        "jasmine:production",
        "clean:afterTest"
    ]);

    grunt.registerTask("test:development", [
        "ngconstant",
        "jshint",
        "jasmine:development"
    ]);

    grunt.registerTask("e2e", [
        "uglify",
        "less:production",
        "ngconstant",
        "copy",
        "processhtml:e2e",
        "connect:servertest",
        "protractor_webdriver",
        "protractor:dist",
        "clean:afterTest"
    ]);

    grunt.registerTask("default", ["build"]);

};
