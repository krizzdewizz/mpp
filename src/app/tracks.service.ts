import { Injectable } from '@angular/core'
import { Track } from './model'
import { StoreService } from './store.service'
import { MarkerPipe } from './marker.pipe'
import { PlayerService, incrTime } from './player.service'

@Injectable()
export class TracksService {

  get tracks(): Track[] {
    return this.storeService.mpp.tracks
  }

  set tracks(value: Track[]) {
    this.storeService.mpp.tracks = value
  }

  activeMarkerNumber: number

  constructor(private storeService: StoreService, private markerPipe: MarkerPipe, private playerService: PlayerService) {
  }

  get selection(): Track {
    return this.tracks[this.storeService.mpp.lastTrackIndex]
  }

  set selection(value: Track) {
    this.storeService.mpp.lastTrackIndex = this.tracks.indexOf(value)
    this.saveTracks()
  }

  loadTracks() {
    this.storeService.load()
  }

  saveTracks() {
    this.storeService.save()
  }

  deleteMarker(markerIndex: number) {
    this.selection.markers = this.selection.markers.filter((it, idx) => idx !== markerIndex)
    this.saveTracks()
  }

  private markerExists(time: number): boolean {
    const markerPipe = this.markerPipe
    const timeStr = markerPipe.transform(time)
    return this.selection.markers.filter(it => timeStr === markerPipe.transform(it)).length > 0
  }

  seek(markerNumber: number): void {
    const marker = this.getMarkerValue(markerNumber)
    if (marker) {
      this.activeMarkerNumber = markerNumber
      this.playerService.seekTo(marker, true)
    }
  }

  private getMarkerValue(markerNumber: number): number {
    return this.selection.markers[markerNumber - 1]
  }

  addMarker(): void {
    const time = this.playerService.getCurrentTime()
    if (time === 0 || this.markerExists(time)) {
      return
    }

    let arr = this.selection.markers.slice(0)
    arr.push(time)
    arr = arr.sort((m1, m2) => m1 < m2 ? -1 : 1)
    this.selection.markers = arr
    this.activeMarkerNumber = arr.indexOf(time) + 1
    this.saveTracks()
  }

  seekToActiveMarker() {
    if (this.activeMarkerNumber) {
      this.seek(this.activeMarkerNumber)
    }
  }

  moveActiveMarker(backward: boolean) {
    if (!this.activeMarkerNumber) {
      return
    }
    const marker = this.getMarkerValue(this.activeMarkerNumber)
    const newMarker = incrTime(marker, backward)
    if (!this.markerExists(newMarker)) {
      this.setMarkerValue(this.activeMarkerNumber, newMarker)
      this.seek(this.activeMarkerNumber)
    }
  }

  private setMarkerValue(markerNumber: number, value: number): void {
    this.selection.markers[markerNumber - 1] = value
  }

  updateTrack(orgTrack: Track, newTrack: Track) {
    this.tracks = this.tracks.filter(it => it !== orgTrack)
    this.tracks.push(newTrack)
    this.saveTracks()
  }

  deleteSelection() {
    const sel = this.selection
    const idx = this.tracks.indexOf(sel)
    this.tracks = this.tracks.filter(it => it !== sel)
    this.selection = this.tracks[idx] || this.tracks[this.tracks.length - 1]
    this.saveTracks()
  }

  open() {
    const sel = this.selection
    if (sel) {
      this.playerService.open(sel.videoUrl)
    } else {
      this.playerService.destroy()
    }
  }
}
