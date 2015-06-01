(function (window, document, undefined) {
	'use strict';
	/* ############################################################################################################
	# @ file realTimeScript
	# @ version 1.0.0
	# @ git git@github.com:eyekorea/CssJsLoader.git
	# @ author Jeung Sang-hyun eyekorea0@gmail.com
	# @ MIT licenses
	############################################################################################################ */
	var UTIL = {
        loadScriptStatus : {} // 동적으로 로드된 js, css 주소를 객체로 저장하여 같은 js, css가 중복으로 로드 되는지를 체크 (key 로 저장)
    };
    UTIL.realTimeScript = function(url, options){
        var set = {
            opt : 'script',
            addId : '',
            id : '',
            callback : 'undefined'
        };
        if(options){
            $.extend(set,options);
        }
        // 같은 스크립트 파일 중복 로드 방지
        // typeof UTIL.loadScriptStatus[url] 이 'undefined' 일경우 UTIL.loadScriptStatus[url] 에 0 을 저장.
        if(typeof UTIL.loadScriptStatus[url] === 'undefined'){
            UTIL.loadScriptStatus[url] = 0;
        }else{
            try {
                if(UTIL.loadScriptStatus[url] < 10){
                    UTIL.loadScriptStatus[url] ++;
                    if(typeof set.callback !== 'undefined' && set.callback !== ''){
                        set.callback();
                    }
                }else{
                    console.log(set.callback + '해당 함수가 10회이상 실행되었습니다. 수정이 필요합니다.');
                }
            }catch(e){console.log(e);}
            return false;
        }
        var loadElement = (function(){
            if(set.opt === 'script'){
                return document.createElement('script');
            }else{
                return document.createElement('link');
            }
        })(),loaded = false;
        var tmpStr = 0,
            loadCompleteFnc = function(){
                loaded = true;
                if(typeof set.callback !== 'undefined' && set.callback !== ''){
                    set.callback();
                }
                UTIL.loadScriptStatus[url] = 'loadComplete';
            },
            insertEle = function(){
                if(set.id !== ''){
                    document.getElementById(set.id).appendChild(loadElement);
                }else{
                    document.getElementsByTagName('head')[0].appendChild(loadElement);
                }
            };
        if(set.opt === 'script'){
            loadElement.setAttribute('src',url);
            loadElement.setAttribute('type','text/javascript');
        }else{
            loadElement.setAttribute('href',url);
            loadElement.setAttribute('type','text/css');
            loadElement.setAttribute('rel','stylesheet');
        }
        if(set.addId !== ''){
            loadElement.setAttribute('id',set.addId);
        }
        if(set.opt === 'script'){
            if(loadElement.addEventListener){
                loadElement.addEventListener('load',function(){
                    if(loaded){
                        return ;
                    }else{
                       loadCompleteFnc();
                    }
                });
            }else{
                loadElement.onreadystatechange = function(){
                    if(this.readyState === 'loaded' || this.readyState === 'complete'){
                        if(loaded){
                            return;
                        }else{
                            loadCompleteFnc();
                        }
                    }
                };
            }
            insertEle();
        }else{
        	// link tag 에서 onload 이벤트가 일부 기기 및 브라우저 에서 미발생하여 document.styleSheets.length 로 체크
            var cssnum = document.styleSheets.length;
            var ti = setInterval(function() {
                if (document.styleSheets.length > cssnum) {
                    loadCompleteFnc();
                    clearInterval(ti);
                }
            }, 10);
            insertEle();
        }
    };
    window.UTIL = UTIL;
}(this, this.document));