

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


    export function register(app: ng.IModule): void {
        app.filter('xlate',() => {
            return xlate.filter;
        }).filter('marker',() => {
            return marker.filter;
        });
    }
}