module mpp.controller.main {

    var AUTO_FOCUS_TIMEOUT = 1000;

    interface Scope extends ng.IScope {
        session: Session;
        sessions: Session[];
        mppPlayer: mpp.Player; // see index.html
        playPause();
        ctrl: MainCtrl;
        currentTime: string;
        editingSession: Session;
    }

    class MainCtrl {

        activeMarkerNumber: number;

        constructor(private scope: Scope, private $interval: ng.IIntervalService, $timeout: ng.ITimeoutService, private sessionService: service.session.SessionService) {

            this.scope.sessions = sessionService.sessions;
            this.scope.session = sessionService.lastSession;

            this.scope.$watch('session',() => {
                this.onSessionChanged();
            });

            this.scope.$on('placeholderClicked',() => {
                this.addSession();
            });

            // WTF??
            scope.ctrl = this;

            var autoFocus;

            $('#main').bind('focus', ev=> {
                if (autoFocus) {
                    $timeout.cancel(autoFocus);
                    autoFocus = undefined;
                }
                $('#keyStrokes').removeClass('keysDisabled');
            }).bind('blur', ev=> {
                $('#keyStrokes').addClass('keysDisabled');
                if (autoFocus) {
                    $timeout.cancel(autoFocus);
                    autoFocus = undefined;
                }
                autoFocus = $timeout(() => {
                    $('#main').focus();
                }, AUTO_FOCUS_TIMEOUT);
            });

            scope.$watch('$viewContentLoaded', function () {
                $('#main').focus();
            });
        }

        private onSessionChanged(): void {
            this.activeMarkerNumber = undefined;
            this.sessionService.setSessionSelected(this.scope.session);
        }

        private get player(): mpp.Player {
            return this.scope.mppPlayer;
        }

        stop(): void {
            this.player.stopVideo();
            this.scope.currentTime = '';
        }

        playPause(): void {
            if (this.player.getPlayerState() !== mpp.PlayerState.playing) {
                this.player.playVideo();
            } else {
                this.player.pauseVideo();
            }
        }

        private getMarkerValue(markerNumber: number): number {
            return this.scope.session.markers[markerNumber - 1];
        }

        private setMarkerValue(markerNumber: number, value: number): void {
            this.scope.session.markers[markerNumber - 1] = value;
        }

        seek(markerNumber: number): void {
            var marker = this.getMarkerValue(markerNumber);
            if (marker !== undefined) {
                this.player.seekTo(marker, true);
                this.activeMarkerNumber = markerNumber;
            }
        }

        seekToStart(): void {
            this.player.seekTo(0, true);
        }

        backwardForward(backward: boolean): void {
            var amount = 1; // 1sec
            if (backward) {
                amount *= -1;
            }
            this.player.seekTo(this.player.getCurrentTime() + amount, true);
        }

        seekToActiveMarker(): void {
            if (this.activeMarkerNumber) {
                this.seek(this.activeMarkerNumber);
            }
        }

        moveActiveMarker(backward: boolean): void {
            if (this.activeMarkerNumber) {
                var marker = this.getMarkerValue(this.activeMarkerNumber);
                var amount = 1; // 1sec
                if (backward) {
                    amount *= -1;
                }
                var newMarker = marker + amount;
                if (this.scope.session.markers.indexOf(newMarker) < 0) {
                    this.setMarkerValue(this.activeMarkerNumber, newMarker);
                    this.seek(this.activeMarkerNumber);
                    this.scope.$apply();
                }
            }
        }

        addMarker(): void {
            var time = this.player.getCurrentTime();
            if (time === 0) {
                return;
            }

            var timeStr = filter.marker.filter(time);
            var self = this;
            var exists = this.scope.session.markers.filter(it => timeStr === filter.marker.filter(it)).length > 0;
            if (exists) {
                return;
            }
            var arr = this.scope.session.markers.slice(0);
            arr.push(time);
            arr = arr.sort((m1, m2) => m1 < m2 ? -1 : 1);
            this.scope.session.markers = arr;
            this.sessionService.saveSessions();
        }

        deleteMarker(markerIndex: number): void {
            this.scope.session.markers = this.scope.session.markers.filter((it, idx) => idx !== markerIndex);
            this.sessionService.saveSessions();
        }

        addSession(): void {

            this.scope.editingSession = { name: '', videoUrl: '', markers: [] };
            var self = this;
            dialog.session.open({
                scope: self.scope,
                isAdd: true,
                onAddOrOk: () => {
                    this.sessionService.add(self.scope.editingSession);
                    self.scope.session = self.scope.editingSession;
                    self.scope.$apply();
                },
                onClose: () => {
                    self.scope.editingSession = undefined;
                }
            });
        }

        editSession(): void {

            if (this.scope.session.isPlaceholder) {
                this.addSession();
                return;
            }

            this.scope.editingSession = angular.copy(this.scope.session);
            var self = this;

            dialog.session.open({
                scope: self.scope,
                isAdd: false,
                onAddOrOk: () => {
                    angular.copy(self.scope.editingSession, self.scope.session);
                    self.scope.$apply();
                },
                onClose: () => {
                    self.scope.editingSession = undefined;
                }
            });
        }

        deleteSession(): void {
            this.scope.session = this.sessionService.remove(this.scope.session);
            setTimeout(() => this.scope.$apply(), 100);
        }

        keyDown(e: JQueryEventObject): void {
            var kc = e.keyCode;
            console.log(`cc=${kc}`);
            var ZERO = 48;
            var NINE = 57;
            var ZERO_NUMPAD = 96;
            var NINE_NUMPAD = 105;
            var handled = false;
            var numPadNum = kc >= ZERO_NUMPAD && kc <= NINE_NUMPAD;
            if (kc >= ZERO && kc <= NINE || numPadNum) {
                var numOff = numPadNum ? ZERO_NUMPAD : ZERO;
                var markerNumber = kc === ZERO || kc === ZERO_NUMPAD ? 10 : (kc - numOff);
                this.seek(markerNumber);
                handled = true;
            } else if (kc === 32) { // space
                this.playPause();
                handled = true;
            } else if (kc === 77 || kc === 65) { // m or a
                this.addMarker();
                handled = true;
            } else if (kc === 13) { // return
                this.seekToStart();
                handled = true;
            } else if (kc === 37 || kc === 39) { // left or right
                this.backwardForward(kc === 37);
                handled = true;
            } else if (kc === 8) { // backspace
                this.seekToActiveMarker();
                handled = true;
            } else if (kc === 38 || kc === 40) { // up or down
                this.moveActiveMarker(kc === 38);
                handled = true;
            }
            if (handled) {
                e.preventDefault();
            }
        }
    }

    export function register(app: ng.IModule): void {
        app.controller('MainCtrl', ['$scope', '$interval', '$timeout', 'SessionService', ($scope, $interval, $timeout, SessionService) => new MainCtrl($scope, $interval, $timeout, SessionService)]);
    }

}