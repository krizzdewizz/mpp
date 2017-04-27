import { Component, OnInit } from '@angular/core'
import { TracksService } from '../tracks.service'
import { Track } from '../model'
import { ModalService } from '../modal.service'

@Component({
  selector: 'mpp-tracks-dropdown',
  templateUrl: './tracks-dropdown.component.html',
  styleUrls: ['./tracks-dropdown.component.scss']
})
export class TracksDropdownComponent implements OnInit {

  constructor(private tracksService: TracksService, private modalService: ModalService) {
  }

  get selection(): Track {
    return this.tracksService.selection
  }

  get tracks(): Track[] {
    return this.tracksService.tracks
  }

  select(track: Track) {
    this.tracksService.selection = track
    this.openTrack()
  }

  private openTrack() {
    this.tracksService.open()
  }

  onClick() {
    if (this.tracks.length === 0) {
      this.modalService.openTrack().subscribe()
    }
  }

  ngOnInit() {
    setTimeout(() => this.openTrack(), 500)
  }
}
