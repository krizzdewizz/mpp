import { Component, HostListener } from '@angular/core'
import { PlayerService } from '../player.service'
import { TracksService } from 'app/tracks.service'
import { ModalService } from 'app/modal.service'

@Component({
  selector: 'mpp-keys',
  templateUrl: './keys.component.html',
  styleUrls: ['./keys.component.scss']
})
export class KeysComponent {

  constructor(private tracksService: TracksService, private playerService: PlayerService, private modalService: ModalService) { }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): boolean {
    if (e.altKey || e.ctrlKey || e.shiftKey || !this.ready || this.modalService.isAnyModalOpen) {
      return
    }

    const kc = e.keyCode
    //console.log(`cc=${kc}`);
    const ZERO = 48
    const NINE = 57
    const ZERO_NUMPAD = 96
    const NINE_NUMPAD = 105
    const numPadNum = kc >= ZERO_NUMPAD && kc <= NINE_NUMPAD
    if (kc >= ZERO && kc <= NINE || numPadNum) {
      const numOff = numPadNum ? ZERO_NUMPAD : ZERO
      const markerNumber = kc === ZERO || kc === ZERO_NUMPAD ? 10 : (kc - numOff)
      this.tracksService.seek(markerNumber)
      return false
    } else if (kc === 32) { // space
      this.playPause()
      return false
    } else if (kc === 77 || kc === 65) { // m or a
      this.addMarker()
      return false
    } else if (kc === 13) { // return
      this.seekToStart()
      return false
    } else if (kc === 37 || kc === 39) { // left or right
      this.backwardForward(kc === 37)
      return false
    } else if (kc === 8) { // backspace
      this.seekToActiveMarker()
      return false
    } else if (kc === 38 || kc === 40) { // up or down
      this.moveActiveMarker(kc === 38)
      return false
    }
  }

  ///

  playPause() {
    if (this.ready) { this.playerService.playPause() }
  }

  backwardForward(backward: boolean) {
    if (this.ready) { this.playerService.backwardForward(backward) }
  }

  addMarker() {
    this.tracksService.addMarker()
  }

  seekToActiveMarker() {
    this.tracksService.seekToActiveMarker()
  }

  moveActiveMarker(backward: boolean) {
    this.tracksService.moveActiveMarker(backward)
  }

  seekToStart() {
    if (this.ready) { this.playerService.seekToStart() }
  }

  get ready() {
    return this.playerService.ready
  }
}
