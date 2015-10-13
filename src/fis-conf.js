/**
 * Created by aidenZou on 15/9/19.
 */

fis.set('project.ignore', [
    //'output/**',
    'node_modules/**',
    '.git/**',
    '.svn/**',
    //'static/styles/**.less'
    'fis-conf.js',
    'package.json',
    'bower.json'
]);

fis.match('bower.json', {
    // 设置 release 为 FALSE，不再产出此文件
    release: false
});


// 所有的文件产出到 static/ 目录下
//fis.match('src/static/*', {
fis.match('/static/*', {
//fis.match('/**/*', {
//fis.match('*', {
    release: '/$0'
    //release: '/static/$0'
});

// 所有模板放到 tempalte 目录下
//fis.match('src/templates/*.html', {
//fis.match('/templates/*.html', {
//fis.match('/templates/*', {
fis.match('/*.html', {
    release: '/templates/$0'
});
//
fis.match('/bower_components/**/*', {
    release: '/static/$0'
});

fis.match('/static/styles/*.scss', {
    parser: fis.plugin('scss', {}), //属性 parser 表示了插件的类型
    rExt: '.css'
});

fis.match('/static/styles/*.less', {
    parser: fis.plugin('less'), // invoke `fis-parser-less`,
    rExt: '.css'
});


//fis.match('/src/bower_components/**/*', {
//    //release: '/static/bower_components/$0'
//    //release: '/static/bower_components/$0'
//    release: 'static/$0'
//});

//fis.match('/src/bower_components/angular/angular.min.js', {
//    //release: '/static/bower_components/$0'
//    //release: '/static/bower_components/$0'
//    release: '/static/bower_components/angular/$0'
//});

//// widget源码目录下的资源被标注为组件
//fis.match('/widget/**/*', {
//    isMod: true
//});
//
//// widget下的 js 调用 jswrapper 进行自动化组件化封装
//fis.match('/widget/**/*.js', {
//    postprocessor: fis.plugin('jswrapper', {
//        type: 'commonjs'
//    })
//});
//
///**
// * mock 假数据模拟
// */
//// test 目录下的原封不动产出到 test 目录下
////fis.match('/test/**/*', {
////    release: '$0'
////});
//
//fis.match('/test/**', {
//    release: '$0'
//});
//
//fis.match('/test/server.conf', {
//    release: '/config/server.conf'
//});
//
//
//// optimize
//fis.media('prod')
//    .match('*.js', {
//        optimizer: fis.plugin('uglify-js', {
//            mangle: {
//                expect: ['require', 'define', 'some string'] //不想被压的
//            }
//        })
//    })
//    .match('*.css', {
//        optimizer: fis.plugin('clean-css', {
//            'keepBreaks': true //保持一个规则一个换行
//        })
//    });
//
//// pack
//fis.media('prod')
//    // 启用打包插件，必须匹配 ::package
//    .match('::package', {
//        packager: fis.plugin('map'),
//        spriter: fis.plugin('csssprites', {
//            layout: 'matrix',
//            margin: '15'
//        })
//    })
//    .match('*.js', {
//        packTo: '/static/all_others.js'
//    })
//    .match('*.css', {
//        packTo: '/staitc/all_others.js'
//    })
//    .match('/widget/**/*.js', {
//        packTo: '/static/all_comp.js'
//    })
//    .match('/widget/**/*.css', {
//        packTo: '/static/all_comp.css'
//    });


/**********************生产环境下CSS、JS压缩合并*****************/
//使用方法 fis3 release prod
fis.media('prod')
    //注意压缩时.async.js文件是异步加载的，不能直接用annotate解析
    //.match('**!(.async).js', {
    //    preprocessor: fis.plugin('annotate'),
    //    optimizer: fis.plugin('uglify-js')
    //})
    //.match('**.css', {
    //    optimizer: fis.plugin('clean-css')
    //})
    //.match("lib/mod.js", {
    //    packTo: "/pkg/vendor.js"
    //})
    //所有页面中引用到的bower js资源
    .match("bower_components/**/*.js", {
        packTo: "/pkg/vendor.js"
    })
    //所有页面中引用到的bower css资源
    .match("bower_components/**/*.css", {
        packTo: "/pkg/vendor.css"
    });