var dropdown;!function(a){function b(a){a.run(["$rootScope",function(a){angular.element(document).on("click",function(b){a.$broadcast("documentClicked",angular.element(b.target))})}]),a.directive("dropdown",["$rootScope",function(a){return{restrict:"E",templateUrl:"partials/dropdown.html",scope:{placeholder:"@",list:"=",selected:"=",property:"@"},link:function(b){b.listVisible=!1,b.isPlaceholder=!0,b.select=function(a){b.isPlaceholder=!1,b.selected=a},b.isSelected=function(a){return a[b.property]===b.selected[b.property]},b.show=function(){return b.selected&&b.selected.isPlaceholder?void a.$broadcast("placeholderClicked"):void(b.listVisible=!b.listVisible)},a.$on("documentClicked",function(a,c){$(c[0]).is(".dropdown-display.clicked")||0!=$(c[0]).parents(".dropdown-display.clicked").length||b.$apply(function(){b.listVisible=!1})}),b.$watch("selected",function(){b.isPlaceholder=void 0===b.selected[b.property],b.display=b.selected[b.property]})}}}])}a.register=b}(dropdown||(dropdown={}));var mpp;!function(a){var b;!function(a){function b(a){a.filter("xlate",function(){return d.filter}).filter("marker",function(){return c.filter})}var c;!function(a){function b(a){var b=Math.floor(a/60),c=Math.floor(a%60);return 10>c&&(c="0"+c),b+":"+c}a.filter=b}(c=a.marker||(a.marker={}));var d;!function(a){function b(){return e}function c(a){var c=b();return c[a]||d[a]||a}var d={SPACE:"space",RETURN:"return",BACKSPACE:"backspace",PLAY_PAUSE:"play/pause",SEEK_TO_START:"seek to start",BACKWARD_FORWARD:"backward/forward",ADD_MARKER:"add marker",SEEK_TO_MARKER:"seek to marker",SEEK_TO_ACTIVE_MARKER:"seek to active marker",MOVE_ACTIVE_MARKER:"move active marker",DELETE_MARKER:"delete marker",ADD_SESSION:"add session",ADD_SESSION_MORE:"add session...",EDIT_SESSION:"edit session",DELETE_SESSION:"delete session",ADD:"add",OK:"ok",CANCEL:"cancel",NAME:"name",YT_URL:"YouTube video url",SEARCH_YT:"search on YouTube",SESSION:"session"},e={SPACE:"leertaste",RETURN:"eingabetaste",BACKSPACE:"rücktaste",LAY_PAUSE:"play/pause",SEEK_TO_START:"springe zu anfang",BACKWARD_FORWARD:"vorwärts/rückwärts",ADD_MARKER:"marker hinzufügen",SEEK_TO_MARKER:"springe zu marker",SEEK_TO_ACTIVE_MARKER:"springe zu aktiven marker",MOVE_ACTIVE_MARKER:"verschiebe aktiven marker",DELETE_MARKER:"marker löschen",ADD_SESSION:"session hinzufügen",ADD_SESSION_MORE:"session hinzufügen...",EDIT_SESSION:"session bearbeiten",DELETE_SESSION:"session löschen",ADD:"hinzufügen",OK:"ok",CANCEL:"abbrechen",NAME:"name",YT_URL:"youtube video url",SEARCH_YT:"suche auf youtube",SESSION:"session"};a.filter=c}(d=a.xlate||(a.xlate={})),a.register=b}(b=a.filter||(a.filter={}))}(mpp||(mpp={}));var mpp;!function(a){var b;!function(b){var c;!function(b){function c(a){for(;a.length;)a.pop()}function d(a,b){return a.name.localeCompare(b.name)}function e(a){a.factory("SessionService",["localStorageService",function(a){return new i(a)}])}var f="sessions",g="lastSessionIndex",h={name:a.filter.xlate.filter("ADD_SESSION_MORE"),videoUrl:"",markers:[],isPlaceholder:!0},i=function(){function a(a){this.localStorageService=a,this.sessions=a.get(f),this.lastSessionIndex=a.get(g)||0,this.sessions=this.sessions&&this.sessions.length>0?this.sessions.sort(d):[h]}return Object.defineProperty(a.prototype,"lastSession",{get:function(){return this.sessions[this.lastSessionIndex]},enumerable:!0,configurable:!0}),a.prototype.add=function(a){var b=this,e=this.sessions.filter(function(a){return!a.isPlaceholder});e.push(a),e=e.sort(d),c(this.sessions),e.forEach(function(a){return b.sessions.push(a)}),this.saveSessions()},a.prototype.remove=function(a){var b=this,d=this.sessions.indexOf(a),e=this.sessions.filter(function(b){return b!==a});return d>=e.length&&(d=e.length-1),c(this.sessions),e.forEach(function(a){return b.sessions.push(a)}),this.saveSessions(),0===this.sessions.length?(this.sessions.push(h),h):d>=0?this.sessions[d]:void 0},a.prototype.setSessionSelected=function(a){this.localStorageService.set(g,this.sessions.indexOf(a))},a.prototype.saveSessions=function(){this.localStorageService.set(f,this.sessions)},a}();b.SessionService=i,b.register=e}(c=b.session||(b.session={}))}(b=a.service||(a.service={}))}(mpp||(mpp={}));var mpp;!function(a){var b;!function(b){var c;!function(b){function c(a){a.controller("MainCtrl",["$scope","$interval","$timeout","SessionService",function(a,b,c,d){return new e(a,b,c,d)}])}var d=1e3,e=function(){function b(a,b,c,e){var f=this;this.scope=a,this.$interval=b,this.sessionService=e,this.scope.sessions=e.sessions,this.scope.session=e.lastSession,this.scope.$watch("session",function(){f.onSessionChanged()}),this.scope.$on("placeholderClicked",function(){f.addSession()}),a.ctrl=this;var g;$("#main").bind("focus",function(){g&&(c.cancel(g),g=void 0),$("#keyStrokes").removeClass("keysDisabled")}).bind("blur",function(){$("#keyStrokes").addClass("keysDisabled"),g&&(c.cancel(g),g=void 0),g=c(function(){$("#main").focus()},d)}),a.$watch("$viewContentLoaded",function(){$("#main").focus()})}return b.prototype.onSessionChanged=function(){this.activeMarkerNumber=void 0,this.sessionService.setSessionSelected(this.scope.session)},Object.defineProperty(b.prototype,"player",{get:function(){return this.scope.mppPlayer},enumerable:!0,configurable:!0}),b.prototype.stop=function(){this.player.stopVideo(),this.scope.currentTime=""},b.prototype.playPause=function(){1!==this.player.getPlayerState()?this.player.playVideo():this.player.pauseVideo()},b.prototype.getMarkerValue=function(a){return this.scope.session.markers[a-1]},b.prototype.setMarkerValue=function(a,b){this.scope.session.markers[a-1]=b},b.prototype.seek=function(a){var b=this.getMarkerValue(a);void 0!==b&&(this.player.seekTo(b,!0),this.activeMarkerNumber=a)},b.prototype.seekToStart=function(){this.player.seekTo(0,!0)},b.prototype.backwardForward=function(a){var b=1;a&&(b*=-1),this.player.seekTo(this.player.getCurrentTime()+b,!0)},b.prototype.seekToActiveMarker=function(){this.activeMarkerNumber&&this.seek(this.activeMarkerNumber)},b.prototype.moveActiveMarker=function(a){if(this.activeMarkerNumber){var b=this.getMarkerValue(this.activeMarkerNumber),c=1;a&&(c*=-1);var d=b+c;this.scope.session.markers.indexOf(d)<0&&(this.setMarkerValue(this.activeMarkerNumber,d),this.seek(this.activeMarkerNumber),this.scope.$apply())}},b.prototype.addMarker=function(){var b=this.player.getCurrentTime();if(0!==b){var c=a.filter.marker.filter(b),d=this.scope.session.markers.filter(function(b){return c===a.filter.marker.filter(b)}).length>0;if(!d){var e=this.scope.session.markers.slice(0);e.push(b),e=e.sort(function(a,b){return b>a?-1:1}),this.scope.session.markers=e,this.sessionService.saveSessions()}}},b.prototype.deleteMarker=function(a){this.scope.session.markers=this.scope.session.markers.filter(function(b,c){return c!==a}),this.sessionService.saveSessions()},b.prototype.addSession=function(){var b=this;this.scope.editingSession={name:"",videoUrl:"",markers:[]};var c=this;a.dialog.session.open({scope:c.scope,isAdd:!0,onAddOrOk:function(){b.sessionService.add(c.scope.editingSession),c.scope.session=c.scope.editingSession,c.scope.$apply()},onClose:function(){c.scope.editingSession=void 0}})},b.prototype.editSession=function(){if(this.scope.session.isPlaceholder)return void this.addSession();this.scope.editingSession=angular.copy(this.scope.session);var b=this;a.dialog.session.open({scope:b.scope,isAdd:!1,onAddOrOk:function(){angular.copy(b.scope.editingSession,b.scope.session),b.scope.$apply()},onClose:function(){b.scope.editingSession=void 0}})},b.prototype.deleteSession=function(){var a=this;this.scope.session=this.sessionService.remove(this.scope.session),setTimeout(function(){return a.scope.$apply()},100)},b.prototype.keyDown=function(a){var b=a.keyCode;console.log("cc="+b);var c=48,d=57,e=!1;if(b>=c&&d>=b){var f=b===c?10:b-c;this.seek(f),e=!0}else 32===b?(this.playPause(),e=!0):77===b?(this.addMarker(),e=!0):13===b?(this.seekToStart(),e=!0):65===b?(this.addSession(),e=!0):69===b?(this.editSession(),e=!0):37===b||39===b?(this.backwardForward(37===b),e=!0):8===b?(this.seekToActiveMarker(),e=!0):(38===b||40===b)&&(this.moveActiveMarker(38===b),e=!0);e&&a.preventDefault()},b}();b.register=c}(c=b.main||(b.main={}))}(b=a.controller||(a.controller={}))}(mpp||(mpp={}));var mpp;!function(a){var b;!function(b){var c;!function(b){function c(a){new d(a).open()}var d=function(){function b(b){this.options=b;var c={label:a.filter.xlate.filter(b.isAdd?"ADD":"OK"),onClick:b.onAddOrOk},d=this,e=function(){d.updateButtons()};b.scope.$watch("editingSession.name",e),b.scope.$watch("editingSession.videoUrl",e),this.dlg=$("#sessionDialog").dialog({autoOpen:!1,modal:!0,resizable:!1,width:500,title:a.filter.xlate.filter(b.isAdd?"ADD_SESSION":"EDIT_SESSION"),close:b.onClose,buttons:this.createJQButtons([c])}),this.dlg.find("form").on("submit",function(a){a.preventDefault(),d.isValid()&&(c.onClick(),d.close())}),$("#sessionDialogSearchYT").click(function(){$("#sessionDialogVideoUrl").focus()})}return b.prototype.isValid=function(){return this.options.scope.editingSession&&this.options.scope.editingSession.name&&this.options.scope.editingSession.videoUrl?!0:!1},b.prototype.updateButtons=function(){$($(".ui-dialog-buttonpane button")[0]).button(this.isValid()?"enable":"disable")},b.prototype.createJQButtons=function(b){var c={},d=this;return b.forEach(function(a){c[a.label]=function(){d.isValid()&&(a.onClick(),d.close())}}),c[a.filter.xlate.filter("CANCEL")]=function(){return d.close()},c},b.prototype.close=function(){$(this.dlg).dialog("close")},b.prototype.open=function(){$(this.dlg).dialog("open")},b}();b.SessionDialog=d,b.open=c}(c=b.session||(b.session={}))}(b=a.dialog||(a.dialog={}))}(mpp||(mpp={}));var mpp;!function(a){!function(a){a[a.unstarted=-1]="unstarted",a[a.ended=0]="ended",a[a.playing=1]="playing",a[a.paused=2]="paused",a[a.buffering=3]="buffering",a[a.video_cued=5]="video_cued"}(a.PlayerState||(a.PlayerState={}));var b=(a.PlayerState,angular.module("mppApp",["youtube-embed","ui.keypress","ui.event","LocalStorageModule"]).config(["localStorageServiceProvider",function(a){a.setPrefix("mpp")}]));a.service.session.register(b),a.filter.register(b),a.controller.main.register(b),dropdown.register(b)}(mpp||(mpp={}));