

module mpp.filter {

    export module marker {
        export function filter(secs: number): string {
            var m = Math.floor(secs / 60);
            var s: any = Math.floor(secs % 60);
            if (s < 10) {
                s = '0' + s;
            }
            return m + ':' + s;
        }
    }

    export module xlate {
        var DEFAULT = {
            SPACE: 'space',
            RETURN: 'return',
            BACKSPACE: 'backspace',
            PLAY_PAUSE: 'play/pause',
            SEEK_TO_START: 'seek to start',
            BACKWARD_FORWARD: 'backward/forward',
            ADD_MARKER: 'add marker',
            SEEK_TO_MARKER: 'seek to marker',
            SEEK_TO_ACTIVE_MARKER: 'seek to active marker',
            MOVE_ACTIVE_MARKER: 'move active marker',
            DELETE_MARKER: 'delete marker',
            ADD_SESSION: 'add session',
            ADD_SESSION_MORE:'add session...',
            EDIT_SESSION: 'edit session',
            DELETE_SESSION: 'delete session',
            ADD: 'add',
            OK: 'ok',
            CANCEL: 'cancel',
            NAME: 'name',
            YT_URL: 'YouTube video url',
            SEARCH_YT: 'search on YouTube',
            SESSION: 'session',
        };

        var GERMAN = {
            SPACE: 'leertaste',
            RETURN: 'eingabetaste',
            BACKSPACE: 'rücktaste',
            LAY_PAUSE: 'play/pause',
            SEEK_TO_START: 'springe zu anfang',
            BACKWARD_FORWARD: 'vorwärts/rückwärts',
            ADD_MARKER: 'marker hinzufügen',
            SEEK_TO_MARKER: 'springe zu marker',
            SEEK_TO_ACTIVE_MARKER: 'springe zu aktiven marker',
            MOVE_ACTIVE_MARKER: 'verschiebe aktiven marker',
            DELETE_MARKER: 'marker löschen',
            ADD_SESSION: 'session hinzufügen',
            ADD_SESSION_MORE: 'session hinzufügen...',
            EDIT_SESSION: 'session bearbeiten',
            DELETE_SESSION: 'session löschen',
            ADD: 'hinzufügen',
            OK: 'ok',
            CANCEL: 'abbrechen',
            NAME: 'name',
            YT_URL: 'youtube video url',
            SEARCH_YT: 'suche auf youtube',
            SESSION: 'session',
        };

        function getLocale() {
            return GERMAN;
        }

        export function filter(k: string): string {
            var lcl = getLocale();
            return lcl[k] || DEFAULT[k] || k;
            //return lcl[k] || k;
        }
    }

    export function register(app: ng.IModule): void {
        app.filter('xlate',() => {
            return xlate.filter;
        }).filter('marker',() => {
            return marker.filter;
        });
    }
}