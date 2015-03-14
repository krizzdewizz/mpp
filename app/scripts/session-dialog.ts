interface JQuery {
    dialog(options: any): JQuery;
    button(options: any): JQuery;
}

module mpp.dialog.session {

    interface Button {
        label: string;
        onClick: () => void;
        isDefault?: boolean;
    }

    export interface Scope extends ng.IScope {
        editingSession: Session;
    }

    export class SessionDialog {

        private dlg: JQuery;

        constructor(private options: Options) {

            var addButton = {
                label: mpp.filter.xlate.filter(options.isAdd ? 'ADD' : 'OK'),
                onClick: options.onAddOrOk
            };

            var self = this;
            var watcher = () => {
                self.updateButtons();
            };
            options.scope.$watch('editingSession.name', watcher);
            options.scope.$watch('editingSession.videoUrl', watcher);

            this.dlg = $('#sessionDialog').dialog({
                autoOpen: false,
                modal: true,
                resizable: false,
                width: 500,
                title: mpp.filter.xlate.filter(options.isAdd ? 'ADD_SESSION' : 'EDIT_SESSION'),
                close: options.onClose,
                buttons: this.createJQButtons([addButton])
            });

            this.dlg.find("form").on("submit", event => {
                event.preventDefault();
                if (self.isValid()) {
                    addButton.onClick();
                    self.close();
                }
            });
        }

        private isValid(): boolean {
            if (!this.options.scope.editingSession) {
                return false;
            }
            if (!this.options.scope.editingSession.name) {
                return false;
            }
            if (!this.options.scope.editingSession.videoUrl) {
                return false;
            }
            return true;
        }

        private updateButtons(): void {
            $($('.ui-dialog-buttonpane button')[0]).button(this.isValid() ? 'enable' : 'disable');
        }

        private createJQButtons(buttons: Button[]): any {
            var all = {};
            var self = this;
            buttons.forEach(it => {
                all[it.label] = () => {
                    if (self.isValid()) {
                        it.onClick();
                        self.close();
                    }
                };
            });

            all[mpp.filter.xlate.filter('CANCEL')] = () => self.close();

            return all;
        }

        close(): void {
            $(this.dlg).dialog('close');
        }

        open(): void {
            $(this.dlg).dialog('open');
        }
    }

    export interface Options {
        scope: Scope;
        isAdd: boolean;
        onAddOrOk: () => void;
        onClose: () => void;
    };

    export function open(options: Options) {
        new SessionDialog(options).open();
    }
}