import { Injectable } from '@angular/core'

import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal'
import { Observable } from 'rxjs/Observable'
import { Track } from './model'
import { TracksService } from 'app/tracks.service'

@Injectable()
export class ModalService {
    trackModal: ModalComponent

    protected openedModal: ModalComponent
    isModalOpen(modal: ModalComponent): boolean {
        return this.openedModal === modal
    }

    constructor(private tracksService: TracksService) {
    }

    get isAnyModalOpen(): boolean {
        return Boolean(this.openedModal)
    }

    close(): boolean {
        if (this.openedModal) {
            this.openedModal.close()
            this.openedModal = undefined
            return true
        }
        return false
    }

    openTrack(orgTrack?: Track): Observable<Track> {

        const add = !orgTrack
        const track = add ? { name: '', videoUrl: '', markers: [] } : JSON.parse(JSON.stringify(orgTrack))

        return Observable.create(s => {

            const data = {
                add,
                track,
                isValid: () => track.name && track.videoUrl,
                onSave: () => {
                    this.close()

                    this.tracksService.updateTrack(orgTrack, track)
                    this.tracksService.selection = track
                    this.tracksService.open()

                    s.next(track)
                }
            }

            this.trackModal[`$data`] = data
            this.ifOkToOpen(() => {
                this.openModal(this.trackModal)
                setTimeout(() => document.getElementById('task-modal-name').focus(), 500)
            })
        })
    }

    private openModal(modalToOpen: ModalComponent) {
        this.close()
        let subscriptions
        const modal = this.openedModal = modalToOpen
        const unsetModal = () => {
            subscriptions.forEach(it => it.unsubscribe())
            this.openedModal = undefined
        }
        subscriptions = [
            modal.onClose.subscribe(unsetModal),
            modal.onDismiss.subscribe(unsetModal)
        ]
        modal.open()
    }

    private ifOkToOpen(success: () => void) {
        if (this.isAnyModalOpen) {
            console.warn('Ignoring open modal request because there is already a modal open.')
        } else {
            success()
        }
    }
}