/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _response = __webpack_require__(1);
	
	__webpack_require__(8);
	
	__webpack_require__(9);
	
	_response.searchInput.onkeydown = _response.getResponse;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.paging = exports.inputValue = exports.videoPanel = exports.videoPage = exports.searchInput = undefined;
	exports.createSingleVideo = createSingleVideo;
	exports.getResponse = getResponse;
	
	var _DOM = __webpack_require__(2);
	
	var DOM = _interopRequireWildcard(_DOM);
	
	var _paging = __webpack_require__(3);
	
	var _variables = __webpack_require__(4);
	
	var GLOBAL = _interopRequireWildcard(_variables);
	
	var _constants = __webpack_require__(7);
	
	var _pageresize = __webpack_require__(5);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var searchInput = exports.searchInput = DOM.create('input', ['search-input']);
	DOM.append(DOM.create('div', ['search-panel']), 'body');
	DOM.append(searchInput, '.search-panel');
	DOM.attr('.search-input', 'placeholder', 'search here...');
	DOM.attr('.search-input', 'type', 'search');
	
	//create window for video
	var videoWindow = DOM.create('div', ['video-window']);
	var videoPage = exports.videoPage = DOM.create('div', ['video-page']);
	var videoPanel = exports.videoPanel = DOM.append(DOM.create('div', ['video-panel']), 'body');
	var inputValue = exports.inputValue = void 0;
	
	var paging = exports.paging = document.createElement('div');
	paging.classList.add('paging-panel');
	document.body.appendChild(paging);
	
	function cleanInput() {
	    searchInput.value = null;
	}
	
	function createSingleVideo(info, pageNumber) {
	    var videoData = {
	        title: info.snippet.title,
	        descr: info.snippet.description,
	        author: info.snippet.channelTitle,
	        date: info.snippet.publishedAt.slice(0, 10),
	        views: info.statistics.viewCount,
	        likes: info.statistics.likeCount === undefined ? '0' : info.statistics.likeCount
	    };
	    var newVideoWindow = videoWindow.cloneNode(true);
	    var insideList = '';
	    for (var k = 0; k < Object.keys(videoData).length; k++) {
	        insideList += '<dt class="' + Object.keys(videoData)[k] + '-def"></dt>\n        <dd class="' + Object.keys(videoData)[k] + '">' + Object.values(videoData)[k] + '</dd>';
	    }
	    DOM.append(newVideoWindow, '.page-' + pageNumber);
	    insideList = '<a href=\'https://www.youtube.com/watch?v=' + info.id + '\'><image src=\'' + info.snippet.thumbnails.medium.url + '\'></a>\n                <dl>' + insideList + '</dl>';
	    newVideoWindow.innerHTML = insideList;
	}
	
	function createVideoPanel(videoArray) {
	    (0, _pageresize.resizeFunc)();
	    videoArray = _.chunk(videoArray, _pageresize.pageElements); // вынести в отдельную функцию
	
	    for (var i = 0; i < videoArray.length; i++) {
	        var newVideoPage = videoPage.cloneNode(true);
	        newVideoPage.classList.add('page-' + i);
	        if (i === 0) {
	            newVideoPage.classList.add('current-page');
	        }
	        videoPanel.appendChild(newVideoPage);
	
	        for (var j = 0; j < videoArray[i].length; j++) {
	            createSingleVideo(videoArray[i][j], i);
	        }
	    }
	}
	
	function clearPanel() {
	    videoPanel.innerHTML = '';
	}
	
	function getResponse(e) {
	    //проверить ошибку
	    var videoIDs = '';
	    if (e.keyCode === _constants.ENTER_KEY && searchInput.value.length !== 0) {
	        exports.inputValue = inputValue = searchInput.value;
	        clearPanel();
	        (0, _paging.clearPaging)();
	
	        fetch('https://www.googleapis.com/youtube/v3/search?key=' + _constants.API_KEY + '&type=video&part=snippet&maxResults=' + _constants.MAX_RES + '&q=' + inputValue).then(function (response) {
	            return response.json();
	        }).then(function (data) {
	            for (var i = 0; i < data.items.length; i++) {
	                videoIDs += data.items[i].id.videoId + ',';
	            }
	            videoIDs = videoIDs.slice(0, -1);
	            GLOBAL.nextPage = data.nextPageToken;
	            fetch('https://www.googleapis.com/youtube/v3/videos?key=' + _constants.API_KEY + '&id=' + videoIDs + '&part=snippet,statistics').then(function (response) {
	                return response.json();
	            }).then(function (data) {
	                if (data.items.length !== 0) {
	                    createVideoPanel(data.items);
	                    (0, _paging.createPaging)();
	                }
	            });
	        });
	        cleanInput();
	    }
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.create = create;
	exports.append = append;
	exports.attr = attr;
	function create(element, classes) {
	    var el = document.createElement(element);
	    for (var i = 0; i < classes.length; i++) {
	        el.classList.add(classes[i]);
	    }
	    return el;
	}
	
	function append(element, appendTo) {
	    var elementsToAppend = document.querySelectorAll(appendTo);
	    for (var i = 0; i < elementsToAppend.length; i++) {
	        elementsToAppend[i].appendChild(element);
	    }
	    return element;
	}
	
	function attr(selector, attribute, value) {
	    var elements = document.querySelectorAll(selector);
	    if (arguments.length === 3) {
	        for (var i = 0; i < elements.length; i++) {
	            elements[i].setAttribute(attribute, value);
	        }
	        return elements;
	    } else if (arguments.length === 2) {
	        var attrArray = [];
	        for (var _i = 0; _i < elements.length; _i++) {
	            attrArray.push(elements[_i].getAttribute(attribute));
	        }
	        return attrArray;
	    }
	}
	
	// export function addClass(selector, classes) {
	//     let elements = document.querySelectorAll(selector);
	//     for (let i = 0; i < elements.length; i++) {
	//         elements[i].classList.add(classes);
	//     }
	// }

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.showPrevNavs = showPrevNavs;
	exports.createPaging = createPaging;
	exports.clearPaging = clearPaging;
	exports.hidePrevNavs = hidePrevNavs;
	exports.addNewNavs = addNewNavs;
	
	var _variables = __webpack_require__(4);
	
	var GLOBAL = _interopRequireWildcard(_variables);
	
	var _response = __webpack_require__(1);
	
	var _pageresize = __webpack_require__(5);
	
	var _nextpage = __webpack_require__(6);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var pageNav = document.createElement('div');
	pageNav.classList.add('page-navs');
	
	function showPrevNavs() {
	    var currentNumber = +document.querySelector('.current-nav').classList[1].substring(4);
	    var navs = document.querySelectorAll('.page-navs');
	    for (var k = 0; k < navs.length; k++) {
	        navs[k].classList.remove('hidden');
	    }
	    for (var i = navs.length - 1; i > currentNumber + GLOBAL.notHiddenNavs; i--) {
	        navs[i].classList.add('hidden');
	    }
	    for (var j = 0; j < currentNumber - 2 * GLOBAL.notHiddenNavs; j++) {
	        navs[j].classList.add('hidden');
	    }
	}
	
	function choosePage(event) {
	
	    if (event.target.classList[2] === 'current-nav' || event.target.classList[0] === 'paging-panel') {
	        return;
	    }
	
	    var navNumber = event.target.classList[1].substring(4);
	    document.querySelector('.current-nav').classList.remove('current-nav');
	    event.target.classList.add('current-nav');
	    document.querySelector('.current-page').classList.remove('current-page');
	    document.querySelector('.page-' + navNumber).classList.add('current-page');
	
	    if (document.querySelector('.current-page').childNodes.length < _pageresize.pageElements || document.querySelector('.current-nav') === document.querySelector('.paging-panel').lastChild) {
	        (0, _nextpage.getNextPageResponse)();
	    }
	
	    if (event.target.previousSibling && event.target.previousSibling.classList.contains('hidden')) {
	        showPrevNavs();
	    }
	    if (event.target.nextSibling && event.target.nextSibling.classList.contains('hidden')) {
	        hidePrevNavs();
	    }
	}
	
	function createPaging() {
	    var pageNumber = document.querySelector('.video-panel').childNodes.length;
	    for (var i = 0; i < pageNumber; i++) {
	        var page = pageNav.cloneNode(true);
	        page.classList.add('nav-' + i);
	        page.innerHTML = i + 1;
	        _response.paging.appendChild(page);
	    }
	    document.querySelector('.nav-0').classList.add('current-nav');
	    document.querySelector('.paging-panel').addEventListener('click', choosePage);
	    var navs = document.querySelectorAll('.page-navs');
	    if (_pageresize.pageElements === 1) {
	        for (var j = GLOBAL.notHiddenNavs + 2; j < pageNumber; j++) {
	            navs[j].classList.add('hidden');
	        }
	    }
	}
	
	function clearPaging() {
	    _response.paging.innerHTML = '';
	}
	
	function hidePrevNavs() {
	    var currentNumber = +document.querySelector('.current-nav').classList[1].substring(4);
	    var navs = document.querySelectorAll('.page-navs');
	    for (var k = 0; k < navs.length; k++) {
	        navs[k].classList.remove('hidden');
	    }
	    for (var i = 0; i < currentNumber - GLOBAL.notHiddenNavs; i++) {
	        navs[i].classList.add('hidden');
	    }
	    for (var j = navs.length - 1; j > currentNumber + 2 * GLOBAL.notHiddenNavs; j--) {
	        navs[j].classList.add('hidden');
	    }
	}
	
	function addNewNavs(length) {
	    var lastNumber = +document.querySelector('.paging-panel').lastChild.classList[1].substring(4) + 1;
	    for (var i = 0; i < length; i++) {
	        var page = pageNav.cloneNode(true);
	        page.classList.add('nav-' + (lastNumber + i));
	        page.innerHTML = lastNumber + i + 1;
	        _response.paging.appendChild(page);
	    }
	    if (document.querySelectorAll('.page-navs').length > 5) {
	        hidePrevNavs();
	    }
	}
	
	// import * as GLOBAL from './constants';

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.notHiddenNavs = exports.mouseEndX = exports.mouseStartX = exports.prevPage = exports.nextPage = undefined;
	
	var _pageresize = __webpack_require__(5);
	
	var nextPage = exports.nextPage = void 0;
	var prevPage = exports.prevPage = void 0;
	var mouseStartX = exports.mouseStartX = 0;
	var mouseEndX = exports.mouseEndX = 0;
	var notHiddenNavs = exports.notHiddenNavs = void 0;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.pageElements = undefined;
	exports.resizeFunc = resizeFunc;
	
	var _variables = __webpack_require__(4);
	
	var GLOBAL = _interopRequireWildcard(_variables);
	
	var _DOM = __webpack_require__(2);
	
	var DOM = _interopRequireWildcard(_DOM);
	
	var _paging = __webpack_require__(3);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var pageElements = exports.pageElements = void 0;
	var videoPage = DOM.create('div', ['video-page']);
	
	function recreatePaging(leftEl) {
	    var currentIndex = +leftEl.parentNode.classList[1].substring(5);
	    (0, _paging.clearPaging)();
	    (0, _paging.createPaging)();
	    document.querySelector('.current-nav').classList.remove('current-nav');
	    var navs = document.querySelectorAll('.page-navs');
	    for (var i = 0; i < navs.length; i++) {
	        navs[i].classList.remove('hidden');
	    }
	
	    document.querySelector('.nav-' + currentIndex).classList.add('current-nav');
	    for (var _i = 0; _i < currentIndex - 1; _i++) {
	        navs[_i].classList.add('hidden');
	    }
	    for (var _i2 = currentIndex + 2; _i2 < navs.length; _i2++) {
	        navs[_i2].classList.add('hidden');
	    }
	}
	
	function regroupElements(videoArray, pageCount, leftEl) {
	
	    document.querySelector('.video-panel').innerHTML = '';
	    videoArray = _.chunk(videoArray, pageElements);
	
	    for (var i = 0; i < videoArray.length; i++) {
	        var newVideoPage = videoPage.cloneNode(true);
	        newVideoPage.classList.add('page-' + i);
	        document.querySelector('.video-panel').appendChild(newVideoPage);
	
	        for (var j = 0; j < videoArray[i].length; j++) {
	            newVideoPage.appendChild(videoArray[i][j]);
	        }
	    }
	
	    recreatePaging(leftEl);
	    leftEl.parentNode.classList.add('current-page');
	}
	
	function resizeFunc() {
	    var videos = void 0,
	        leftElement = void 0;
	    if (document.body.clientWidth < 655) {
	        GLOBAL.notHiddenNavs = 1;
	        exports.pageElements = pageElements = 1;
	    } else if (document.body.clientWidth < 1000) {
	        GLOBAL.notHiddenNavs = 2;
	        exports.pageElements = pageElements = 2;
	    } else if (document.body.clientWidth < 1340) {
	        GLOBAL.notHiddenNavs = 2;
	        exports.pageElements = pageElements = 3;
	    } else {
	        GLOBAL.notHiddenNavs = 2;
	        exports.pageElements = pageElements = 4;
	    }
	
	    if (document.querySelectorAll('.video-window').length === 0) {
	        return;
	    }
	
	    videos = document.querySelectorAll('.video-window');
	    leftElement = document.querySelector('.current-page').firstChild;
	    regroupElements(videos, pageElements, leftElement);
	}
	
	window.addEventListener('resize', resizeFunc);

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.getNextPageResponse = getNextPageResponse;
	
	var _response = __webpack_require__(1);
	
	var _pageresize = __webpack_require__(5);
	
	var _variables = __webpack_require__(4);
	
	var GLOBAL = _interopRequireWildcard(_variables);
	
	var _constants = __webpack_require__(7);
	
	var _paging = __webpack_require__(3);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function createNewPages(videoArray, pageElements, lastPageNumber) {
	    videoArray = _.chunk(videoArray, pageElements);
	    (0, _paging.addNewNavs)(videoArray.length);
	
	    for (var i = lastPageNumber + 1; i < videoArray.length + lastPageNumber + 1; i++) {
	        var newVideoPage = _response.videoPage.cloneNode(true);
	        newVideoPage.classList.add('page-' + i);
	        _response.videoPanel.appendChild(newVideoPage);
	
	        for (var j = 0; j < videoArray[i - lastPageNumber - 1].length; j++) {
	            (0, _response.createSingleVideo)(videoArray[i - lastPageNumber - 1][j], i);
	        }
	    }
	}
	
	function addVideos(videoArray) {
	    var lastPage = document.querySelector('.video-panel').lastChild;
	    var lastPageNumber = +lastPage.classList[1].substring(5);
	
	    if (lastPage.childNodes.length === _pageresize.pageElements) {
	        createNewPages(videoArray, _pageresize.pageElements, lastPageNumber);
	    } else {
	        for (var k = lastPage.childNodes.length; k < _pageresize.pageElements; k++) {
	            (0, _response.createSingleVideo)(videoArray.shift(), lastPageNumber);
	        }
	        createNewPages(videoArray, _pageresize.pageElements, lastPageNumber);
	    }
	}
	
	function getNextPageResponse() {
	    if (!GLOBAL.nextPage) {
	        return;
	    }
	    var videoIDs = '';
	    fetch('https://www.googleapis.com/youtube/v3/search?key=' + _constants.API_KEY + '&type=video&part=snippet&maxResults=' + _constants.MAX_RES + '&q=' + _response.inputValue + '&pageToken=' + GLOBAL.nextPage).then(function (response) {
	        return response.json();
	    }).then(function (data) {
	        for (var i = 0; i < data.items.length; i++) {
	            videoIDs += data.items[i].id.videoId + ',';
	        }
	        videoIDs = videoIDs.slice(0, -1);
	        GLOBAL.nextPage = data.nextPageToken;
	        GLOBAL.prevPage = data.prevPageToken;
	
	        fetch('https://www.googleapis.com/youtube/v3/videos?key=' + _constants.API_KEY + '&id=' + videoIDs + '&part=snippet,statistics').then(function (response) {
	            return response.json();
	        }).then(function (data) {
	            addVideos(data.items);
	        });
	    });
	}

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var ENTER_KEY = exports.ENTER_KEY = 13;
	var MAX_RES = exports.MAX_RES = 15;
	var DIFF_NUM = exports.DIFF_NUM = 3;
	var PAGE_NUM = exports.PAGE_NUM = 5;
	var API_KEY = exports.API_KEY = 'AIzaSyAHdjm7LHRb6W9oib4QW0qr5YEjX4re9Jc';

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.checkPage = checkPage;
	
	var _paging = __webpack_require__(3);
	
	var _pageresize = __webpack_require__(5);
	
	var _constants = __webpack_require__(7);
	
	var _variables = __webpack_require__(4);
	
	var GLOBAL = _interopRequireWildcard(_variables);
	
	var _nextpage = __webpack_require__(6);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function turnPage(direction) {
	    var currentPage = document.querySelector('.current-page');
	    var currentNav = document.querySelector('.current-nav');
	    var pagingPanel = document.querySelector('.paging-panel');
	    if (direction === 'left') {
	        if (!currentPage.previousSibling) {
	            return;
	        } else {
	
	            currentPage.classList.remove('current-page');
	            currentPage.previousSibling.classList.add('current-page');
	            currentNav.classList.remove('current-nav');
	            currentNav.previousSibling.classList.add('current-nav');
	            currentNav = currentNav.previousSibling;
	            if (currentNav.previousSibling && currentNav.previousSibling.classList.contains('hidden')) {
	                (0, _paging.showPrevNavs)();
	            }
	        }
	    } else if (direction === 'right') {
	        if (!currentPage.nextSibling) {
	            return;
	        } else {
	            var lastPage = document.querySelector('.video-panel').lastChild;
	            var lastPageNumber = +lastPage.classList[1].substring(5);
	            var currentNumber = +currentPage.classList[1].substring(5);
	
	            if (currentNumber === lastPageNumber - _constants.DIFF_NUM || currentPage.nextSibling === lastPage) {
	                (0, _nextpage.getNextPageResponse)();
	            }
	            currentPage.classList.remove('current-page');
	            currentPage.nextSibling.classList.add('current-page');
	            currentNav.classList.remove('current-nav');
	            currentNav.nextSibling.classList.add('current-nav');
	            currentNav = currentNav.nextSibling;
	            if (currentNav.nextSibling && currentNav.nextSibling.classList.contains('hidden')) {
	                (0, _paging.hidePrevNavs)();
	            }
	        }
	    }
	}
	
	function checkPage() {
	    if (GLOBAL.mouseStartX < GLOBAL.mouseEndX && document.querySelector('.video-panel').innerHTML !== '') {
	        turnPage('left');
	    } else if (GLOBAL.mouseStartX > GLOBAL.mouseEndX && document.querySelector('.video-panel').innerHTML !== '') {
	        turnPage('right');
	    }
	}
	
	window.addEventListener('mousedown', function (event) {
	    GLOBAL.mouseStartX = event.screenX;
	});
	
	window.addEventListener('mouseup', function (event) {
	    GLOBAL.mouseEndX = event.screenX;
	    checkPage();
	});
	
	window.addEventListener('mousemove', function (event) {
	    event.preventDefault();
	});

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _pageswipe = __webpack_require__(8);
	
	var _variables = __webpack_require__(4);
	
	var GLOBAL = _interopRequireWildcard(_variables);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	window.addEventListener('touchstart', function (event) {
	    GLOBAL.mouseStartX = event.touches[0].pageX;
	});
	
	window.addEventListener('touchend', function (event) {
	    GLOBAL.mouseEndX = event.changedTouches[0].pageX;
	    (0, _pageswipe.checkPage)();
	});
	
	window.addEventListener('touchmove', function (event) {
	    event.preventDefault();
	});

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map