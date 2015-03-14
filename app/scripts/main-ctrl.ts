module mpp.controller.main {

    var AUTO_FOCUS_TIMEOUT = 1000;
    interface Link {
        title: string;
        url: string;
    }

    interface Scope extends ng.IScope {
        session: Session;
        sessions: Session[];
        mppPlayer: mpp.Player; // see index.html
        ctrl: MainCtrl;
        editingSession: Session;
        links: Link[];
    }

    function incrTime(time: number, backward: boolean): number {
        var amount = 1; // 1sec
        if (backward) {
            amount *= -1;
        }
        return Math.max(0, time + amount);
    }

    export class MainCtrl {

        activeMarkerNumber: number;

        constructor(private scope: Scope, $timeout: ng.ITimeoutService, private sessionService: service.session.SessionService) {

            this.scope.sessions = sessionService.sessions;
            this.setSession(sessionService.lastSession);

            this.scope.$on('placeholderClicked',() => {
                this.addSession();
            });
            scope.$watch('$viewContentLoaded', function () {
                $('#main').focus();
            });
            scope.$watch('session',() => {
                this.onSessionChanged();
            });

            // WTF??
            scope.ctrl = this;

            this.installAutoFocus($timeout);
        }

        private installAutoFocus($timeout: ng.ITimeoutService): void {
            var autoFocus;
            $('#main').bind('focus', e=> {
                if (autoFocus) {
                    $timeout.cancel(autoFocus);
                    autoFocus = undefined;
                }
                $('#keyStrokes').removeClass('keysDisabled');
            }).bind('blur', e=> {
                $('#keyStrokes').addClass('keysDisabled');
                if (autoFocus) {
                    $timeout.cancel(autoFocus);
                }
                autoFocus = $timeout(() => $('#main').focus(), AUTO_FOCUS_TIMEOUT);
            });
        }

        private onSessionChanged(): void {
            this.activeMarkerNumber = undefined;
            this.scope.links = this.getLinks();
            this.sessionService.setSessionSelected(this.scope.session);
        }

        private setSession(sess: Session): void {
            this.scope.session = sess;
            this.scope.links = this.getLinks();
        }

        private get player(): mpp.Player {
            return this.scope.mppPlayer;
        }

        stop(): void {
            this.player.stopVideo();
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
            this.player.seekTo(incrTime(this.player.getCurrentTime(), backward), true);
        }

        seekToActiveMarker(): void {
            if (this.activeMarkerNumber) {
                this.seek(this.activeMarkerNumber);
            }
        }

        moveActiveMarker(backward: boolean): void {
            if (!this.activeMarkerNumber) {
                return;
            }
            var marker = this.getMarkerValue(this.activeMarkerNumber);
            var newMarker = incrTime(marker, backward);
            if (!this.markerExists(newMarker)) {
                this.setMarkerValue(this.activeMarkerNumber, newMarker);
                this.seek(this.activeMarkerNumber);
                this.scope.$apply();
            }
        }

        private markerExists(time: number): boolean {
            var timeStr = filter.marker.filter(time);
            return this.scope.session.markers.filter(it => timeStr === filter.marker.filter(it)).length > 0;
        }

        addMarker(): void {
            var time = this.player.getCurrentTime();
            if (time === 0 || this.markerExists(time)) {
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

        private getLinks(): Link[] {
            if (!this.scope.session) {
                return [];
            }
            var links = this.scope.session.links;
            if (!links) {
                return [];
            }
            return links.split(/MPP/).map(it => {
                var splits = it.split(/=/);
                return { title: splits[0], url: splits.length > 1 ? splits[1] : splits[0] };
            });
        }

        addSession(): void {
            this.scope.editingSession = { name: '', videoUrl: '', markers: [] };
            var self = this;
            dialog.session.open({
                scope: self.scope,
                isAdd: true,
                onAddOrOk: () => {
                    self.sessionService.add(self.scope.editingSession);
                    self.setSession(self.scope.editingSession);
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
                    self.sessionService.saveSessions();
                    self.scope.links = self.getLinks();
                    self.scope.$apply();
                },
                onClose: () => {
                    self.scope.editingSession = undefined;
                }
            });
        }

        deleteSession(): void {
            this.setSession(this.sessionService.remove(this.scope.session));
            this.sessionService.saveSessions();
            setTimeout(() => this.scope.$apply(), 100);
        }

        keyDown(e: JQueryEventObject): void {
            if (keys.handle(this, e)) {
                e.preventDefault();
            }
        }
    }

    export function register(app: ng.IModule): void {
        app.controller('MainCtrl', ['$scope', '$timeout', 'SessionService', ($scope, $timeout, SessionService) => new MainCtrl($scope, $timeout, SessionService)]);
    }

}