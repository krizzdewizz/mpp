import { Component } from '@angular/core'
import { TracksService } from '../tracks.service'
import { Track } from '../model'

@Component({
  selector: 'mpp-markers',
  templateUrl: './markers.component.html',
  styleUrls: ['./markers.component.scss']
})
export class MarkersComponent {

  constructor(private tracksService: TracksService) {
  }

  get track(): Track {
    return this.tracksService.selection
  }

  get activeMarkerNumber(): number {
    return this.tracksService.activeMarkerNumber
  }

  deleteMarker(markerIndex: number) {
    this.tracksService.deleteMarker(markerIndex)
    return false
  }

  seek(markerNumber: number): void {
    this.tracksService.seek(markerNumber)
  }
}
