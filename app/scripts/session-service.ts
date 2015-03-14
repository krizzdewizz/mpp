

module mpp.service.session {

    var SESSIONS_KEY = 'sessions';
    var LAST_SESSION_INDEX = 'lastSessionIndex';

    var DEFAULT_SESSION = {
        name: filter.xlate.filter('ADD_SESSION_MORE'),
        videoUrl: '',
        markers: [],
        isPlaceholder: true
    };

    function clearArray(a: any[]) {
        while (a.length) {
            a.pop();
        }
    }

    function sessionSorter(s1: Session, s2: Session): number {
        return s1.name.localeCompare(s2.name);
    }

    export class SessionService {

        sessions: Session[];
        private lastSessionIndex: number;

        constructor(private localStorageService) {
            this.sessions = localStorageService.get(SESSIONS_KEY);
            this.lastSessionIndex = localStorageService.get(LAST_SESSION_INDEX) || 0;
            if (this.sessions && this.sessions.length > 0) {
                this.sessions = this.sessions.sort(sessionSorter);
            } else {
                this.sessions = [DEFAULT_SESSION];
            }

            //this.sessions = [{
            //    name: 'Queensryche',
            //    videoUrl: 'https://www.youtube.com/watch?v=3M_ITDg8hIw',
            //    markers: [1, 2, 3, 4, 5, 6, 67, 8, 9, 354, 36, 78, 23, 11, 12, 13, 14, 15, 16, 17, 18, 19],
            //    value: 2,
            //    lyricsUrl: 'http://www.azlyrics.com/lyrics/queensryche/london.html',
            //    tabsUrl: 'https://www.jellynote.com/en/sheet-music-tabs/queensryche/walk-in-the-shadows/504a0e8cd2235a3ff94a9cb3#tabs:%23score_A',
            //    links: 'more tabs=http://www.guitartabs.cc/MPPmore lyrics=http://www.azlyrics.com/lyrics/nsync/pop.html'
            //}, {
            //        name: 'Prodigy',
            //        videoUrl: 'https://www.youtube.com/watch?v=xB_nKpEkILs',
            //        markers: [22, 30, 2 * 60],
            //        value: 1
            //    }, {
            //        name: 'Godfather',
            //        videoUrl: 'https://www.youtube.com?v=_PXC7tOmRds',
            //        markers: [],
            //        value: 3
            //    }, {
            //        name: 'Jesus Christ Superstar',
            //        videoUrl: 'https://www.youtube.com/watch?v=X5DY7vYxSrc',
            //        markers: []
            //        , value: 4
            //    }];
        }

        get lastSession(): Session {
            return this.sessions[this.lastSessionIndex];
        }

        add(session: Session): void {

            var n = this.sessions.filter(it => !it.isPlaceholder);
            n.push(session);
            n = n.sort(sessionSorter);
            clearArray(this.sessions);
            n.forEach(it => this.sessions.push(it));
            this.saveSessions();
        }

        remove(session: Session): Session {
            var idx = this.sessions.indexOf(session);
            var n = this.sessions.filter(it => it !== session);
            if (idx >= n.length) {
                idx = n.length - 1;
            }
            clearArray(this.sessions);
            n.forEach(it => this.sessions.push(it));

            this.saveSessions();

            if (this.sessions.length === 0) {
                this.sessions.push(DEFAULT_SESSION);
                return DEFAULT_SESSION;
            }

            if (idx >= 0) {
                return this.sessions[idx];
            }
            return undefined;
        }

        setSessionSelected(sess: Session) {
            this.localStorageService.set(LAST_SESSION_INDEX, this.sessions.indexOf(sess));
        }

        saveSessions() {
            this.localStorageService.set(SESSIONS_KEY, this.sessions);
        }
    }

    export function register(app: ng.IModule): void {
        app.factory('SessionService', ['localStorageService', localStorageService => new SessionService(localStorageService)]);
    }

}