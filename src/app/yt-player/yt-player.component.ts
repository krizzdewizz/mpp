import { Component, OnInit } from '@angular/core'
import { Player } from '../model'
import { PlayerService } from '../player.service'

@Component({
  selector: 'mpp-yt-player',
  template: '<div id="mpp-player"></div>'
})
export class YtPlayerComponent implements OnInit {

  player: Player

  constructor(private playerService: PlayerService) {
  }

  ngOnInit() {

    const tag = document.createElement('script')

    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

    // (window as any).onYouTubeIframeAPIReady = function () {
    //   console.log('player API ready')
    // }
  }
}
