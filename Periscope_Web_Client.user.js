// ==UserScript==
// @id          OpenPeriscope@pmmlabs.ru
// @name        Periscope Web Client
// @namespace   https://greasyfork.org/users/23
// @description Periscope client based on API requests. Visit example.net for launch.
// @include     https://*twitter.com/oauth/404*
// @include     http://example.net/*
// @version     1.0
// @author      Pmmlabs@github
// @grant       GM_xmlhttpRequest
// @require     https://code.jquery.com/jquery-1.11.3.js
// @require     http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/hmac-sha1.js
// @require     http://crypto-js.googlecode.com/svn/tags/3.1.2/build/components/enc-base64-min.js
// @require     http://cdn.leafletjs.com/leaflet/v0.7.7/leaflet.js
// @require     http://leaflet.github.io/Leaflet.markercluster/dist/leaflet.markercluster-src.js
// @require     https://github.com/iamcal/js-emoji/raw/master/lib/emoji.js
// @downloadURL https://raw.githubusercontent.com/Pmmlabs/OpenPeriscope/master/Periscope_Web_Client.user.js
// @updateURL   https://raw.githubusercontent.com/Pmmlabs/OpenPeriscope/master/Periscope_Web_Client.meta.js
// @noframes
// ==/UserScript==

if (location.href.indexOf('twitter.com/oauth/404') > 0) {
    location.href = 'http://example.net/' + location.search;
} else {
    $('style').remove();
    $(document.head).append('<style>\
    body {\
        margin: 0;\
        font-family: "Roboto", sans-serif;\
    }\
    body > div {\
        padding: 10px;\
    }\
    #secret, body > a {\
        margin: 10px;\
    }\
    a {\
        color: #039be5;\
        text-decoration: none;\
        cursor: pointer;\
    }\
    input[type="text"], textarea {\
        border: none;\
        border-bottom: 1px solid #9e9e9e;\
        border-radius: 0;\
        outline: none;\
        height: 2rem;\
        margin: 0 10px 10px 0;\
        transition: box-shadow .3s;\
        background: transparent;\
    }\
    input[type="text"] {\
        font-size: 1rem;\
    }\
    textarea:focus {\
        border: 1px solid #E0E0E0;\
    }\
    input[type="text"]:focus, textarea:focus {\
        border-bottom: 1px solid #26a69a;\
        box-shadow: 0 1px 0 0 #26a69a;\
    }\
    #secret {\
        font-size:1.5em;\
        display: block;\
    }\
    .button {\
        border-radius: 2px;\
        line-height: 36px;\
        outline: 0px none;\
        padding: 0px 2rem;\
        text-transform: uppercase;\
        color: #FFF;\
        background-color: #26A69A;\
        letter-spacing: 0.5px;\
        cursor: pointer;\
        display: inline-block;\
        vertical-align: middle;\
        will-change: opacity, transform;\
        transition: all 0.3s ease-out 0s;\
        margin-right: 10px;\
    }\
    .button, .stream {\
        box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.16), 0px 2px 10px 0px rgba(0, 0, 0, 0.12);\
    }\
    .button:hover {\
        background-color: #2bbbad;\
    }\
    .menu {\
        cursor: pointer;\
        transition: all 0.25s ease 0s;\
        color: #26A69A;\
        background-color: #FFF;\
        line-height: 1.5rem;\
        padding: 10px 20px;\
        margin: 0px;\
        border-bottom: 1px solid #E0E0E0;\
    }\
    .menu.active {\
        background-color: #26A69A;\
        color: #EAFAF9;\
    }\
    .menu:hover:not(.active) {\
        background-color: #f0f0f0;\
    }\
    #spinner {\
        display: none;\
        float:right;\
    }\
    #left > a, #left > img {\
        margin-bottom: 5px;\
        margin-top: 10px;\
    }\
    #left {\
        position: fixed;\
        box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.16), 0px 2px 10px 0px rgba(0, 0, 0, 0.12);\
        height: 100%;\
    }\
    #right {\
        width: auto;\
        height: 600px;\
        margin-left: 220px;\
    }\
    #display_name {\
        font-size: 16px;\
    }\
    .username, .leaflet-container a.username {\
        color: grey;\
    }\
    #Map, #Chat {\
        width:100%;\
        height:100%;\
    }\
    .live-cluster-small div{\
        background-color: rgba(222, 0, 0, 0.6);\
    }\
    .live-cluster-medium div {\
        background-color: rgba(180, 0, 0, 0.7);\
    }\
    .live-cluster-large div {\
        background-color: rgba(150, 0, 0, 0.9);\
    }\
    .replay-cluster-small div {\
        background-color: rgba(59, 51, 227, 0.6);\
    }\
    .replay-cluster-medium div {\
        background-color: rgba(43, 38, 174, 0.7);\
    }\
    .replay-cluster-large div {\
        background-color: rgba(33, 29, 128, 0.9);\
    }\
    .marker-cluster {\
        background-clip: padding-box;\
        border-radius: 20px;\
        background-color: white; \
    }\
    .marker-cluster div {\
        width: 36px;\
        height: 36px;\
        margin-left: 2px;\
        margin-top: 2px;\
        text-align: center;\
        border-radius: 18px;\
        font: 12px "Helvetica Neue", Arial, Helvetica, sans-serif;\
    }\
    .marker-cluster span {\
        line-height: 36px;\
        color: white;\
        font-weight: bold;\
    }\
    .leaflet-popup-content .description {\
        width: 300px;\
        min-height: 128px;\
    }\
    .description a {\
        font-weight: bold;\
    }\
    .description img {\
        float: left;\
        margin-right: 10px;\
    }\
    .chatlink, .watching, .hearts {\
        float: right;\
        padding-left: 40px;\
        background-repeat: no-repeat;\
        background-position: 20px center;\
    }\
    .chatlink {\
        background-image: url("//raw.githubusercontent.com/Pmmlabs/OpenPeriscope/master/images/comment-black.png");\
    }\
    .watching {\
        background-image: url("//raw.githubusercontent.com/Pmmlabs/OpenPeriscope/master/images/user-black.png");\
    }\
    .hearts {\
        background-image: url("//raw.githubusercontent.com/Pmmlabs/OpenPeriscope/master/images/heart-black.png");\
    }\
    dt {\
        width: 150px;\
        float: left;\
        padding-top: 0.5rem;\
    }\
    #ApiTest textarea {\
        width: 500px;\
        height: 100px;\
    }\
    #ApiTest input {\
        width: 500px;\
    }\
    pre {\
        background-color: #f0f0f0;\
        padding: 7px;\
        white-space: pre-wrap;\
        word-wrap: break-word;\
    }\
    .stream {\
        font: 14px/1.3 "Helvetica Neue",Arial,Helvetica,sans-serif;\
        height: 128px;\
        margin: 0.5rem 0 1rem 0;\
        background-color: #fff;\
        transition: box-shadow .25s;\
        border-radius: 2px;\
    }\
    .stream .description {\
        padding-top: 10px;\
        padding-right: 10px;\
    }\
    .stream.RUNNING img {\
        border-color: #ED4D4D;;\
    }\
    .stream.ENDED img {\
        border-color: #4350E9;\
    }\
    .stream img {\
        height: 128px;\
        border-right: 5px solid;\
        margin-top: -10px;\
    }\
    /* CHAT */\
    #userlist {\
        float: right;\
        width: 250px;\
    }\
    #chat {\
        margin-right: 250px;\
        word-break: break-all;\
    }\
    #chat, #userlist {\
        border: 1px solid #bcbcbc;\
        height: 84%;\
        padding: 5px;\
        overflow-y: auto;\
    }\
    .user {\
        white-space: nowrap;\
    }\
    #chat .user {\
        color: #2927cc;\
        cursor: pointer;\
    }\
    .user div {\
        display: inline;\
    }\
    #title {\
        font-size: 16px;\
    }\
    #sendMessage, #underchat label {\
        float: right;\
    }\
    #underchat {\
        padding-top: 5px;\
    }\
    #underchat label {\
        margin-top: 0.5em;\
    }\
    #underchat div {\
        margin-right: 230px;\
    }\
    #message {\
        width: 100%;\
    }\
    .service {\
        color: green;\
    }\
    .error {\
        color: red;\
    }\
    /* EMOJI */\
    span.emoji {\
        display: inline-block;\
        width: 1.5em;\
        height: 1.5em;\
        background-size: contain;\
    }\
    span.emoji-sizer {\
        margin: -2px 0;\
    }\
    span.emoji-outer {\
        display: inline-block;\
        height: 1.5em;\
        width: 1.5em;\
    }\
    span.emoji-inner {\
        display: inline-block;\
        width: 100%;\
        height: 100%;\
        vertical-align: baseline;\
    }\
    img.emoji {\
        width: 1.5em;\
        height: 1.5em;\
    }\
    /* USER */\
    img.avatar {\
        border: none;\
    }\
</style>')
        .append('<link href="https://fonts.googleapis.com/css?family=Roboto&subset=latin,cyrillic" rel="stylesheet" type="text/css">');

    $(document.body).html('<div id="left"/><div id="right"/>');
    document.title = 'Periscope Web Client';

    var oauth_token, oauth_verifier, session_key, session_secret, loginTwitter, consumer_secret = localStorage.getItem('consumer_secret');
    if (loginTwitter = localStorage.getItem('loginTwitter')) {
        loginTwitter = JSON.parse(loginTwitter);
        Ready(loginTwitter);
    } else if ((session_key = localStorage.getItem('session_key')) && (session_secret = localStorage.getItem('session_secret'))) {
        SignIn3(session_key, session_secret);
    } else if ((oauth_token = localStorage.getItem('oauth_token')) && (oauth_verifier = localStorage.getItem('oauth_verifier'))) {
        SignIn2(oauth_token, oauth_verifier);
    } else if ((oauth_token = getParameterByName('oauth_token')) && (oauth_verifier = getParameterByName('oauth_verifier'))) {
        localStorage.setItem('oauth_token', oauth_token);
        localStorage.setItem('oauth_verifier', oauth_verifier);
        SignIn2(oauth_token, oauth_verifier);
    } else {
        var signInButton = $('<a class="button">Sign in with twitter</a>');
        signInButton.click(SignIn1);
        $(document.body).html('<input type="text" id="secret" size="60" placeholder="Periscope consumer secret" value="' +
            (consumer_secret || '') + '"/><br/>').append(signInButton);
    }
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function Ready(loginInfo) {
    console.log('ready! ', loginInfo);
    var signOutButton = $('<a class="button">Sign out</a>');
    signOutButton.click(SignOut);

    var left = $('#left').append(signOutButton)
        .append('<img src="//raw.githubusercontent.com/Pmmlabs/OpenPeriscope/master/images/spinner.gif" id="spinner" />\
        <br/><img src="' + loginInfo.user.profile_image_urls[1].url + '"/>\
        <div id="display_name">' + emoji.replace_unified(loginInfo.user.display_name) + '</div>\
        <div class="username">@' + (loginInfo.user.username || loginInfo.user.twitter_screen_name) + '</div>');
    var menu = [
        {text: 'API test', id: 'ApiTest'},
        {text: 'Map', id: 'Map'},
        {text: 'Feeds', id: 'Top'},
        {text: 'New broadcast', id: 'Create'},
        {text: 'Chat', id: 'Chat'},
        {text: 'Suggested people', id: 'People'},
        {text: 'User', id: 'User'}
    ];
    for (var i in menu) {
        var link = $('<div class="menu">' + menu[i].text + '</div>');
        link.click(SwitchSection.bind(null, link, menu[i].id));
        left.append(link);
    }
    $('.menu').first().click();
    emoji.img_sets[emoji.img_set].path = 'http://unicodey.com/emoji-data/img-apple-64/';
}
function SwitchSection(elem, section) {
    // Switch menu
    $('.menu.active').removeClass('active');
    $(elem).addClass('active');
    // Switch content
    $('#right > div:visible').hide();
    var sectionContainer = $('#' + section);
    if (!sectionContainer.length)
        this['Init' + section]();
    else
        sectionContainer.show();
}
var languageSelect = '<dt>Language: <select class="lang">\
            <option>ar</option>\
            <option>de</option>\
            <option>en</option>\
            <option>es</option>\
            <option>fi</option>\
            <option>fr</option>\
            <option>hy</option>\
            <option>id</option>\
            <option>it</option>\
            <option>ja</option>\
            <option>kk</option>\
            <option>other</option>\
            <option>pt</option>\
            <option>ro</option>\
            <option>ru</option>\
            <option>sv</option>\
            <option>tr</option>\
            <option>uk</option>\
            <option>zh</option>\
        </select></dt>';
function InitMap() {
    $(document.head).append('<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet/v0.7.7/leaflet.css" />')
        .append('<link rel="stylesheet" href="http://leaflet.github.io/Leaflet.markercluster/dist/MarkerCluster.css" />');
    $('#right').append('<div id="Map"/>');
    var map = L.map('Map').setView([51.6681, 39.2075], 11);
    var tileLayers = [
        {
            text: "Open Street Map",
            layer: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data &copy; OpenStreetMap'
            }).addTo(map)
        },
        {
            text: "Mapbox",
            layer: L.tileLayer('http://{s}.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpamVuY3cxbzAwMG12ZGx4cGljbGtqMGUifQ.vpDqms08MBqoRgp667Yz5Q', {
                attribution: 'Map data &copy; OpenStreetMap'
            })
        },
        {
            text: "Google",
            layer: L.tileLayer('http://mt{s}.google.com/vt/x={x}&y={y}&z={z}', {
                subdomains: '123',
                attribution: 'Map data &copy; Google'
            })
        }
    ];

    var tileLayersMin = {};
    for (var i in tileLayers)
        tileLayersMin[tileLayers[i].text] = tileLayers[i].layer;
    L.control.layers(tileLayersMin).addTo(map);
    var iconCreate = function (prefix) {
        return function (cluster) {
            var childCount = cluster.getChildCount();
            var c = ' ' + prefix + '-cluster-';
            if (childCount < 10) {
                c += 'small';
            } else if (childCount < 100) {
                c += 'medium';
            } else {
                c += 'large';
            }
            return new L.DivIcon({
                html: '<div><span>' + childCount + '</span></div>',
                className: 'marker-cluster' + c,
                iconSize: new L.Point(40, 40)
            });
        };
    };
    var replay = L.markerClusterGroup({
        showCoverageOnHover: false,
        disableClusteringAtZoom: 16,
        singleMarkerMode: true,
        iconCreateFunction: iconCreate('replay')
    }).addTo(map);
    var live = L.markerClusterGroup({
        showCoverageOnHover: false,
        disableClusteringAtZoom: 16,
        singleMarkerMode: true,
        iconCreateFunction: iconCreate('live')
    }).addTo(map);
    var refreshMap = function (e) {
        //if (e && e.hard === false) return;    // zoom change case
        var mapBounds = map.getBounds();
        Api('mapGeoBroadcastFeed', {
            "include_replay": true,
            "p1_lat": mapBounds._northEast.lat,
            "p1_lng": mapBounds._northEast.lng,
            "p2_lat": mapBounds._southWest.lat,
            "p2_lng": mapBounds._southWest.lng
        }, function (r) {
            //console.log(r);
            var openLL; // for preventing of closing opened popup
            live.eachLayer(function (layer) {
                if (layer.getPopup()._isOpen)
                    openLL = layer.getLatLng();
                else
                    live.removeLayer(layer);
            });
            replay.eachLayer(function (layer) {
                if (layer.getPopup()._isOpen)
                    openLL = layer.getLatLng();
                else
                    replay.removeLayer(layer);
            });
            // adding markers
            for (var i = 0; i < r.length; i++) {
                var stream = r[i];
                var marker = L.marker(new L.LatLng(stream.ip_lat, stream.ip_lng), {title: stream.status || stream.user_display_name});
                if (!marker.getLatLng().equals(openLL)) {
                    var description = getDescription(stream, true);
                    marker.bindPopup(description);
                    marker.on('popupopen', getM3U.bind(null, stream.id, $(description)));
                    marker.on('popupopen', Api.bind(null, 'getBroadcasts', {
                        broadcast_ids: [stream.id]
                    }, function (info) {
                        $('.leaflet-popup-content .watching').text(info[0].n_watching + info[0].n_web_watching);
                    }));
                    marker.on('popupopen', function(e){
                        var img = $(e.popup._content).find('img');
                        img.attr('src', img.attr('lazysrc'));
                    });
                    (stream.state == 'RUNNING' ? live : replay).addLayer(marker);
                }
            }
        });
    };
    map.on('moveend', refreshMap);
    refreshMap();
}
function InitApiTest() {
    var submitButton = $('<a class="button">Submit</div>');
    submitButton.click(function () {
        try {
            var method = $('#method').val().trim();
            if (method == '')
                throw Error('Method is empty');
            var params = $('#params').val().trim();
            if (params == '') {
                params = '{}';
                $('#params').text(params);
            }
            Api(method, JSON.parse(params), function (response) {
                $('#response').html(JSON.stringify(response, null, 4));
                console.log(response);
            }, function (error) {
                $('#response').text(error);
            });
        } catch (e) {
            $('#response').text(e.toString());
        }
    });
    $('#right').append('<div id="ApiTest">Some documentation can be found in ' +
        '<a href="https://github.com/Pmmlabs/periscope_api/blob/api/API.md" target="_blank">periscope_api</a> repository' +
        ' or in <a href="http://static.pmmlabs.ru/OpenPeriscope" target="_blank">docs by @cjhbtn</a>' +
        '<br/><dt>Method</dt><input id="method" type="text" placeholder="mapGeoBroadcastFeed"/><br/>' +
        '<dt>Parameters</dt><textarea id="params" placeholder=\'{"include_replay": true, "p1_lat": 1, "p1_lng": 2, "p2_lat": 3, "p2_lng": 4}\'/><br/><br/>');
    $('#ApiTest').append(submitButton).append('<br/><br/><pre id="response"/>Response is also displayed in the browser console</pre>');
}
function InitTop() {
    var refreshList = function(method, params) {
        Api(method, params, function (response) {
            var result = $('#resultTop');
            result.empty();
            var ids =[];
            for (var i in response) {
                var stream = $('<div class="stream ' + response[i].state + ' '+response[i].id+'"/>').append(getDescription(response[i]));
                var link = $('<a>Get stream link</a>');
                link.click(getM3U.bind(null, response[i].id, stream));
                result.append(stream.append(link));
                ids.push(response[i].id);
            }
            if (response.length)
                Api('getBroadcasts', {
                    broadcast_ids: ids
                }, function(info){
                    for (var i in info)
                        $('.stream.'+info[i].id+' .watching').text(info[i].n_watching);
                })
        });
    };

    $('#right').append($('<div id="Top"/>').append(languageSelect));
    $("#Top .lang").find(":contains("+(navigator.language || navigator.userLanguage).substr(0, 2)+")").attr("selected", "selected");
    var tabs = [
        {text: 'Ranked', method: 'rankedBroadcastFeed', params: {
            languages: [$('#Top .lang').val()]
        }},
        {text: 'Following', method: 'followingBroadcastFeed'},
        {text: 'Featured', method: 'featuredBroadcastFeed'},
        {text: 'Live', method: 'liveBroadcastFeed'},
        {text: 'Newest', method: 'mapBroadcastFeed', params: {
            //since: Math.floor(new Date() / 1000),
            count: 253
        }}
    ];
    for (var i in tabs) {
        var button = $('<a class="button">'+tabs[i].text+'</a>');
        button.click(refreshList.bind(null, tabs[i].method, tabs[i].params));
        $('#Top').append(button);
    }
    var sort = $('<a id="sort" class="watching">Sort by watching</a>');
    sort.click(function(){
        var streams = $('.stream');
        var sorted = streams.sort(function (a, b) {
            return $(b).find('.watching').text() -  $(a).find('.watching').text();
        });
        $('#resultTop').append(sorted);
        return false;
    });
    $('#Top').append(sort).append('<div id="resultTop" />');
    $('#Top .button').first().click();
}
function InitCreate() {
    $('#right').append('<div id="Create">' +
        '<dt>Title:</dt><input id="status" type="text" autocomplete="on"><br/>' +
        '<dt>Width:</dt><input id="width" type="text" autocomplete="on" placeholder="320"><br/>' +
        '<dt>Height:</dt><input id="height" type="text" autocomplete="on" placeholder="568"><br/>' +
        '<dt>Filename:</dt><input id="filename" type="text" autocomplete="on"><br/>' +
        '<dt>Streaming bitrate:</dt><input id="bitrate" type="text" value="200">kBps<br/>' +
        '<dt>Server:</dt><select id="server">' +
            '<option>us-west-1</option>' +
            '<option selected>eu-central-1</option>' +
        '<select><br/>' +
        '<br/></div>');
    var createButton=$('<a class="button">Create</a>');
    createButton.click(createBroadcast);
    $('#Create').append(createButton);
}
function InitChat() {
    $('#right').append('<div id="Chat">id: <input id="broadcast_id" type="text" size="15"></div>');
    var playButton = $('<a class="button" id="startchat">OK</a>');
    playButton.click(playBroadcast);
    $('#Chat').append(playButton).append('<span id="title"/>\
        <br/><br/>\
        <div id="userlist"/>\
        <div id="chat"/>\
        <div id="underchat">\
            <label><input type="checkbox" id="autoscroll" checked/> Autoscroll</label>\
            <a class="button" id="sendMessage">Send</a>\
            <div><input type="text" id="message"></div>\
        </div>');
}
function InitUser() {
    var refreshList = function() {
        var result = $('#resultUser');
        result.empty();
        Api('user', {
            user_id: $('#user_id').val().trim()
        }, function (response) {
            var user = response.user;
            result.append(getUserDescription(user));
            Api('userBroadcasts', {
                user_id: user.id,
                all: true
            }, function(streams){
                var ids =[];
                for (var i in streams) {
                    var stream = $('<div class="stream ' + streams[i].state + ' '+streams[i].id+'">').append(getDescription(streams[i]));
                    var link = $('<a>Get stream link</a>');
                    link.click(getM3U.bind(null, streams[i].id, stream));
                    result.append(stream.append(link));
                    ids.push(streams[i].id);
                }
                Api('getBroadcasts', {
                    broadcast_ids: ids
                }, function(info){
                    for (var i in info)
                        $('.stream.'+info[i].id+' .watching').text(info[i].n_watching);
                })
            })
        });
    };
    $('#right').append('<div id="User">id: <input id="user_id" type="text" size="15"></div>');
    var showButton = $('<a class="button" id="showuser">OK</a>');
    showButton.click(refreshList);
    $('#User').append(showButton).append('<br/><br/><div id="resultUser" />');
}
function InitPeople() {
    var refreshButton = $('<a class="button">Refresh</a>').click(function () {
        Api('suggestedPeople', {
            languages: [$('#People .lang').val()]
        }, function (response) {
            var result = $('#resultPeople');
            result.html('<h1>Featured</h1>');
            for (var i in response.featured)
                result.append($('<div class="stream"/>').append(getUserDescription(response.featured[i])));
            result.append('<h1>Popular</h1>');
            for (var i in response.popular)
                result.append($('<div class="stream"/>').append(getUserDescription(response.popular[i])));
            Api('suggestedPeople', {}, function (response) {
                result.append('<h1>Hearted</h1>');
                for (var i in response.hearted)
                    result.append($('<div class="stream"/>').append(getUserDescription(response.hearted[i])));
            });
        });
    });
    $('#right').append($('<div id="People"/>')
        .append(languageSelect)
        .append(refreshButton)
        .append('<div id="resultPeople" />'));
    $("#People .lang").find(":contains(" + (navigator.language || navigator.userLanguage).substr(0, 2) + ")").attr("selected", "selected");
    refreshButton.click();
}
var chat_interval;
var presence_interval;
var pubnubUrl = 'http://pubsub.pubnub.com';
function playBroadcast() {
    clearInterval(chat_interval);
    clearInterval(presence_interval);
    $('#chat').empty();
    $('#userlist').empty();
    $('#title').empty();
    Api('accessChannel', {
        broadcast_id: $('#broadcast_id').val().trim()
    }, function (broadcast) {
        console.log(broadcast);
        var userLink = $('<a class="username">(@' + broadcast.broadcast.username + ')</a>');
        userLink.click(openUser.bind(null, broadcast.broadcast.user_id));
        $('#title').html((broadcast.publisher == "" ? '<b>FORBIDDEN</b> | ' : '')
            + '<a href="https://www.periscope.tv/w/'+broadcast.broadcast.id+'" target="_blank">'+emoji.replace_unified(broadcast.broadcast.status || 'Untitled') + '</a> | '
            + emoji.replace_unified(broadcast.broadcast.user_display_name) + ' ')
            .append(userLink)
            .append(' | <a href="'+broadcast.hls_url+'">M3U Link</a> | <a href="'+broadcast.rtmp_url+'">RTMP Link</a>');
        // Update users list
        var userlist = $('#userlist');
        function presenceUpdate() {
            userlist.empty();
            $.get(pubnubUrl + '/v2/presence/sub_key/' + broadcast.subscriber + '/channel/' + broadcast.channel, {
                state: 1,
                auth: broadcast.auth_token
            }, function (pubnub) {
                var user;
                for (var i in pubnub.uuids)
                    if ((user = pubnub.uuids[i].state) && user.username)
                        userlist.append('<div class="user">' + emoji.replace_unified(user.display_name) + ' <div class="username">(' + user.username + ')</div></div>');
            }, 'json');
        }
        presence_interval = setInterval(presenceUpdate, 15000);
        presenceUpdate();
        // Update messages list
        var prev_time = 0;      // time of previous result
        var xhr_done = true;    // last request finished, can send next request
        var chat = $('#chat');
        function messagesUpdate() {
            if (xhr_done) {
                xhr_done = false;
                $.get(pubnubUrl + '/subscribe/' + broadcast.subscriber + '/' + broadcast.channel + '-pnpres,' + broadcast.channel + '/0/' + prev_time, {
                    auth: broadcast.auth_token
                }, function (pubnub) {
                    prev_time = pubnub[1];
                    xhr_done = true;
                    // Render messages
                    for (var i in pubnub[0]) {
                        var event = pubnub[0][i];
                        switch (event.type) {
                            case 1:  // text message
                                var date = new Date((parseInt(event.ntpForLiveFrame.toString(16).substr(0, 8), 16) - 2208988800) * 1000);
                                var html = $('<div/>').append('[' + zeros(date.getHours()) + ':' + zeros(date.getMinutes()) + ':' + zeros(date.getSeconds()) + '] ');
                                var username = $('<span class="user">&lt;' + event.username + '&gt;</span>');
                                username.click(insertUsername);
                                html.append(username).append(' ').append(emoji.replace_unified(event.body).replace(/(@\S+)/g, '<b>$1</b>'));
                                if (!event.body)    // for debug
                                    console.log('empty body!', event);
                                chat.append(html);
                                break;
                            case 2: // heart
                                break;
                            case 3: // status messages, see event.body (mostly "joined")
                                break;
                            case 4: // broadcaster moved to new place
                                console.log('new location: ' + event.lat + ', ' + event.lng + ', ' + event.heading);
                                break;
                            case 5: // broadcast ended
                                chat.append('<div class="service">*** ' + event.displayName + ' (@' + event.username + ') ended the broadcast</div>');
                                break;
                            case 6: // invited followers
                                chat.append('<div class="service">*** ' + event.displayName + ' (@' + event.username + '): '+event.body.replace('*%s*', event.invited_count)+'</div>');
                                break;
                            case 7:
                                chat.append('<div class="service">7 *** ' + event.displayName + ' (@' + event.username + ') '+event.body+'</div>');
                                console.log(event);
                                break;
                            case 8: // replay available (?)
                                break;
                            case 9: // don't know. Some action by the broadcaster. timestampPlaybackOffset
                                console.log('TYPE: 9', event);
                                break;
                            default: // service messages (event.action = join, leave, timeout, state_changed)
                                break;
                        }
                    }
                    if ($('#autoscroll')[0].checked)
                        chat[0].scrollTop = chat[0].scrollHeight;
                }, 'json').fail(function () {
                    xhr_done = true;
                });
            }
        }
        chat_interval = setInterval(messagesUpdate, 2000);
        messagesUpdate();
        // Sending messages
        function sendMessage() {
            $('#spinner').show();
            var ntpstamp = parseInt((Math.floor(prev_time/10000000) + 2208988800).toString(16) + '00000000', 16); // timestamp in NTP format
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://signer.periscope.tv/sign',
                data: JSON.stringify({
                    body: $('#message').val(),
                    signer_token: broadcast.signer_token,
                    participant_index: broadcast.participant_index,
                    type: 1,    // "text message"
                    ntpForBroadcasterFrame: ntpstamp,
                    ntpForLiveFrame: ntpstamp
                }),
                onload: function (signed) {
                    signed = JSON.parse(signed.responseText);
                    $.get(pubnubUrl + '/publish/'+broadcast.publisher+'/'+broadcast.subscriber+'/0/'
                        +broadcast.channel +'/0/'+encodeURIComponent(JSON.stringify(signed.message)), {
                        auth: broadcast.auth_token
                    }, function(pubnub){
                        $('#spinner').hide();
                        $('#message').val('');
                        if (pubnub[1]!="Sent")
                            console.log('message not sent', pubnub);
                    }, 'json').fail(function (error) {
                        chat.append('<span class="error">*** Error: ' + error.responseJSON.message + '</span>');
                        $('#spinner').hide();
                    });
                }
            });               
        }
        $('#sendMessage').off().click(sendMessage);
        $('#message').off().keypress(function(e) {
            if(e.which == 13) {
                sendMessage();
                return false;
            }
        });
    }, function (error){
        $('#title').append('<b>' + error + '</b>');
    });
}
function insertUsername() {
    var message = $('#message');
    message.val(message.val() + '@' + $(this).text().substr(1, $(this).text().length - 2) + ' ');
    message.focus();
}
function zeros(number){
    return (100 + number + '').substr(1);
}
function createBroadcast(){
    var widthInput = $('#width');
    var heightInput = $('#height');
    if (widthInput.val().trim() == '')
        widthInput.val(320);
    if (heightInput.val().trim() == '')
        heightInput.val(568);
    Api('createBroadcast', {
        lat: 0,
        lng: 0,
        region: $('#server').val(),
        width: +widthInput.val(),
        height: +heightInput.val()
    }, function(createInfo){
        //console.log(createInfo);
        Api('publishBroadcast', {
            broadcast_id: createInfo.broadcast.id,
            friend_chat: false,
            has_location: false,
            //"locale": "ru",
            //"lat": 0.0,    // location latitude
            //"lng": -20.0,  // location longitude
            status: $('#status').val().trim()
        }, function(){
            var code = 'ffmpeg -re -i "'+$('#filename').val()+'" -vcodec libx264 -b:v '+$('#bitrate').val()+'k' +
                ' -strict experimental -acodec aac -b:a 128k -ac 1 -f flv' +
                ' rtmp://'+createInfo.host+':'+createInfo.port+'/liveorigin?t='+createInfo.credential+'/'+createInfo.stream_name+' & '+
                ' while true; do sleep 5s; curl --form "cookie=' + loginTwitter.cookie +'" --form "broadcast_id='+createInfo.broadcast.id+'" https://api.periscope.tv/api/v2/pingBroadcast;'+
                ' done;'+
                'curl --form "cookie=' + loginTwitter.cookie +'" --form "broadcast_id='+createInfo.broadcast.id+'" https://api.periscope.tv/api/v2/endBroadcast';
            $('#Create').append('<pre>' + code + '</pre><a target="_blank" href="https://www.periscope.tv/w/'+createInfo.broadcast.id+'">Watch your stream</a> | ')
                .append($('<a>Chat</a>').click(openChat.bind(null, createInfo.broadcast.id)))
                .append(' | <a href="data:text/plain;base64,' + btoa('#!/bin/bash\n'+unescape(encodeURIComponent(code))) + '" download="stream.sh">Download .SH</a>');
        });
        //var broadcast = response.broadcast;
    });
}
function getM3U (id, jcontainer) {
    jcontainer.find('.links').empty();
    Api('getAccessPublic', {
        broadcast_id: id
    }, function (r) {
        // For live
        var hls_url = r.hls_url || r.https_hls_url;
        if (hls_url) {
            jcontainer.find('.links').append('<a href="' + hls_url + '">Live M3U link</a>');
        }
        // For replay
        var replay_url = r.replay_url;
        if (replay_url) {
            var replay_base_url = replay_url.replace('playlist.m3u8', '');
            var params = '?';
            for (var i in r.cookies)
                params += r.cookies[i].Name.replace('CloudFront-', '') + '=' + r.cookies[i].Value + '&';
            params += 'Expires=0';
            replay_url += params;
            GM_xmlhttpRequest({
                method: 'GET',
                url: replay_url,
                onload: function (m3u_text) {
                    jcontainer.find('.links').append('<a href="data:text/plain;base64,' + btoa(m3u_text.responseText.replace(/(chunk_\d+\.ts)/g, replay_base_url + '$1' + params)) + '" download="playlist.m3u8">Download replay M3U</a>');
                }
            });
        }
    });
    return false;
}
function getDescription(stream, lazyload) {
    var title = emoji.replace_unified(stream.status || 'Untitled');
    var date_created = new Date(stream.created_at);
    var duration = stream.end || stream.timedout ? new Date(new Date(stream.end || stream.timedout) - date_created) : 0;
    var userLink = $('<a class="username">'+emoji.replace_unified(stream.user_display_name)+' (@' + stream.username + ')</a>');
    userLink.click(openUser.bind(null, stream.user_id));
    var description = $('<div class="description">\
                <a href="'+stream.image_url+'" target="_blank"><img '+(lazyload ? 'lazy' : '')+'src="' + stream.image_url_small + '"/></a>\
                <div class="watching"/>\
                <a target="_blank" href="https://www.periscope.tv/w/' + stream.id + '">' + title + '</a><br/>')
        .append(userLink)
        .append('<br/>Created: ' + zeros(date_created.getDate()) + '.' + zeros(date_created.getMonth()+1) + '.' + date_created.getFullYear() + ' ' + zeros(date_created.getHours()) + ':' + zeros(date_created.getMinutes()) + '\
                '+(duration ? '<br/>Duration: '+zeros(duration.getUTCHours())+':'+zeros(duration.getMinutes())+':'+zeros(duration.getSeconds()) : '')+'\
                '+(stream.country || stream.city ? '<br/>' + stream.country + ', ' + stream.city : '') + '\
        </div>');
    var chatLink = $('<a class="chatlink">Chat</a>');
    chatLink.click(openChat.bind(null, stream.id));
    description.append(chatLink).append('<div class="links" />');
    return description[0];
}
function getUserDescription(user) {
    user.profile_image_urls.sort(function (a, b) {
        return a.width * a.height - b.width * b.height;
    });
    return $('<div class="description"/>')
        .append('<a href="' + user.profile_image_urls[user.profile_image_urls.length - 1].url + '" target="_blank"><img class="avatar" width="128" src="' + user.profile_image_urls[0].url + '"></a>'
        + '<div class="watching">' + user.n_followers + '</div>'
        + (user.n_hearts ? '<div class="hearts">' + user.n_hearts + '</div>' : ''))
        .append($('<a class="username">' + emoji.replace_unified(user.display_name) + ' (@' + user.username + ')</a>').click(openUser.bind(null, user.id)))
        .append((user.is_twitter_verified ? '<svg viewBox="0 0 17 17" width="1em" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-767.000000, -573.000000)"><g transform="translate(-80.000000, -57.000000)"><g transform="translate(100.000000, 77.000000)"><g transform="translate(400.000000, 401.000000)"><g><g><g transform="translate(347.000000, 152.000000)"><path d="M1.74035847,11.2810213 C1.61434984,11.617947 1.54545455,11.982746 1.54545455,12.3636364 C1.54545455,14.0706983 2.92930168,15.4545455 4.63636364,15.4545455 C5.01725401,15.4545455 5.38205302,15.3856502 5.71897873,15.2596415 C6.22025271,16.2899361 7.2772042,17 8.5,17 C9.7227958,17 10.7797473,16.2899361 11.2810213,15.2596415 L11.2810213,15.2596415 C11.617947,15.3856502 11.982746,15.4545455 12.3636364,15.4545455 C14.0706983,15.4545455 15.4545455,14.0706983 15.4545455,12.3636364 C15.4545455,11.982746 15.3856502,11.617947 15.2596415,11.2810213 C16.2899361,10.7797473 17,9.7227958 17,8.5 C17,7.2772042 16.2899361,6.22025271 15.2596415,5.71897873 C15.3856502,5.38205302 15.4545455,5.01725401 15.4545455,4.63636364 C15.4545455,2.92930168 14.0706983,1.54545455 12.3636364,1.54545455 C11.982746,1.54545455 11.617947,1.61434984 11.2810213,1.74035847 C10.7797473,0.71006389 9.7227958,0 8.5,0 C7.2772042,0 6.22025272,0.71006389 5.71897873,1.74035847 C5.38205302,1.61434984 5.01725401,1.54545455 4.63636364,1.54545455 C2.92930168,1.54545455 1.54545455,2.92930168 1.54545455,4.63636364 C1.54545455,5.01725401 1.61434984,5.38205302 1.74035847,5.71897873 C0.71006389,6.22025272 0,7.2772042 0,8.5 C0,9.7227958 0.71006389,10.7797473 1.74035847,11.2810213 L1.74035847,11.2810213 Z" opacity="1" fill="#88C9F9"></path><path d="M11.2963464,5.28945679 L6.24739023,10.2894568 L7.63289664,10.2685106 L5.68185283,8.44985845 C5.27786241,8.07328153 4.64508754,8.09550457 4.26851062,8.499495 C3.8919337,8.90348543 3.91415674,9.53626029 4.31814717,9.91283721 L6.26919097,11.7314894 C6.66180802,12.0974647 7.27332289,12.0882198 7.65469737,11.7105432 L12.7036536,6.71054321 C13.0960757,6.32192607 13.0991603,5.68876861 12.7105432,5.29634643 C12.3219261,4.90392425 11.6887686,4.90083965 11.2963464,5.28945679 L11.2963464,5.28945679 Z" fill="#FFFFFF"></path></g></g></g></g></g></g></g></g></svg>' : '')
        + '<br/>Created: ' + (new Date(user.created_at)).toLocaleString()
        + (user.description ? '<br/>' + emoji.replace_unified(user.description) : ''))
        .append('<br/>')
        .append($('<a class="button">' + (user.is_following ? 'unfollow' : 'follow') + '</a>').click(function () {
            var el = this;
            Api(el.innerHTML, { // follow or unfollow
                user_id: user.id
            }, function (r) {
                if (r.success)
                    el.innerHTML = el.innerHTML == 'follow' ? 'unfollow' : 'follow';
            })
        }))
        .append('<div style="clear:both"/>');
}
function openChat(broadcast_id){
    SwitchSection(null, 'Chat');
    $('#broadcast_id').val(broadcast_id);
    $('#startchat').click();
}
function openUser(user_id){
    SwitchSection(null, 'User');
    $('#user_id').val(user_id);
    $('#showuser').click();
}

function Api(method, params, callback, callback_fail) {
    if (!params)
        params = {};
    if (loginTwitter && loginTwitter.cookie)
        params.cookie = loginTwitter.cookie;
    $('#spinner').show();
    GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://api.periscope.tv/api/v2/' + method,
        data: JSON.stringify(params),
        onload: function (r) {
            $('#spinner').hide();
            if (r.status == 200) {
                var response = JSON.parse(r.responseText);
                callback(response);
            } else {
                var error = 'API error: ' + r.status + ' ' + r.responseText;
                console.log(error);
                if (callback_fail)
                    callback_fail(error);
            }
        }
    });
}
function SignIn3(session_key, session_secret) {
    Api('loginTwitter', {
        "session_key": session_key,
        "session_secret": session_secret
    }, function (response) {
        localStorage.setItem('loginTwitter', JSON.stringify(response));
        loginTwitter = response;
        Ready(loginTwitter);
        if (!loginTwitter.user.username)    // User registration
            Api('verifyUsername', {
                username: loginTwitter.suggested_username,
                display_name: loginTwitter.user.display_name
            }, function (verified) {
                if (verified.success) {
                    loginTwitter.user = verified.user;
                    localStorage.setItem('loginTwitter', JSON.stringify(loginTwitter));
                } else
                    console.log('User verification failed!', verified);
            });
    })
}
function SignIn2(oauth_token, oauth_verifier) {
    OAuth('access_token', function (oauth) {
        localStorage.setItem('session_key', oauth.oauth_token);
        localStorage.setItem('session_secret', oauth.oauth_token_secret);
        session_key = oauth.oauth_token;
        session_secret = oauth.oauth_token_secret;
        SignIn3(session_key, session_secret);
    }, {oauth_token: oauth_token, oauth_verifier: oauth_verifier});
}
/**
 * @return {boolean}
 */
function SignIn1() {
    consumer_secret = $('#secret').val();
    if (consumer_secret) {
        localStorage.setItem('consumer_secret', consumer_secret);
        return OAuth('request_token', function (oauth) {
            location.href = 'https://api.twitter.com/oauth/authorize?oauth_token=' + oauth.oauth_token;
        }, {oauth_callback: '404'});
    }
}
function SignOut() {
    localStorage.clear();
    localStorage.setItem('consumer_secret', consumer_secret);
    location.search = '';
}
/**
 * @return {boolean}
 */
function OAuth(endpoint, callback, extra) {
    var method = 'POST';
    var url = 'https://api.twitter.com/oauth/' + endpoint;
    var params = {
        oauth_consumer_key: '9I4iINIyd0R01qEPEwT9IC6RE',
        oauth_nonce: Date.now(),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: Date.now() / 1000 | 0,
        oauth_version: '1.0'
    };
    for (var i in extra)
        params[i] = extra[i];

    var signatureBase = [];
    var keys = Object.keys(params).sort();
    for (i in keys)
        signatureBase.push(keys[i] + '=' + params[keys[i]]);

    var signatureBaseString = method + '&' + encodeURIComponent(url) + '&' + encodeURIComponent(signatureBase.join('&'));

    params.oauth_signature = encodeURIComponent(
        CryptoJS.enc.Base64.stringify(
            CryptoJS.HmacSHA1(signatureBaseString, consumer_secret + '&' + (session_secret || ''))
        )
    );

    var params_prepared = [];
    for (i in params) {
        params_prepared.push(i + '="' + params[i] + '"');
    }
    GM_xmlhttpRequest({
        method: method,
        url: url,
        headers: {
            Authorization: 'OAuth ' + params_prepared.join(', ')
        },
        onload: function (r) {
            if (r.status == 200) {
                var oauth = {};
                var response = r.responseText.split('&');
                for (var i in response) {
                    var kv = response[i].split('=');
                    oauth[kv[0]] = kv[1];
                }
                callback(oauth);
            }
            else if (r.status == 401) {   // old tokens: reload page
                console.log('oauth error 401: ' + r.responseText);
                SignOut();
            }
            else
                console.log('oauth error: ' + r.status + ' ' + r.responseText);
        }
    });
    return false;
}