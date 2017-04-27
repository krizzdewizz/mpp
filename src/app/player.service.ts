import { Injectable } from '@angular/core'
import { Player, PlayerState } from './model'
import { getIdFromURL } from 'url-parser'

export function incrTime(time: number, backward: boolean): number {
  let amount = 1 // 1sec
  if (backward) {
    amount *= -1
  }
  return Math.max(0, time + amount)
}

declare const YT

@Injectable()
export class PlayerService {

  player: Player

  destroy() {
    if (this.player) {
      this.player.destroy()
      this.player = undefined
    }
  }

  open(url: string) {
    this.destroy()
    this.player = new YT.Player('mpp-player', {
      videoId: getIdFromURL(url),
      playerVars: { controls: 1 }
    })
  }

  playPause() {
    if (this.player.getPlayerState() !== PlayerState.PLAYING) {
      this.player.playVideo()
    } else {
      this.player.pauseVideo()
    }
  }

  getCurrentTime() {
    return this.player.getCurrentTime()
  }

  seekToStart() {
    this.player.seekTo(0, true)
  }

  backwardForward(backward: boolean) {
    this.player.seekTo(incrTime(this.player.getCurrentTime(), backward), true)
  }

  seekTo(seconds: number, allowSeekAhead: boolean) {
    this.player.seekTo(seconds, allowSeekAhead)
  }

  get ready(): boolean {
    return Boolean(this.player)
  }
}
