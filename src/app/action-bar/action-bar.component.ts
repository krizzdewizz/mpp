import { Component } from '@angular/core'
import { ModalService } from '../modal.service'
import { TracksService } from '../tracks.service'

@Component({
  selector: 'mpp-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss']
})
export class ActionBarComponent {

  constructor(private tracksService: TracksService, private modalService: ModalService) {
  }

  onAdd() {
    this.modalService.openTrack().subscribe()
  }

  onEdit() {
    this.modalService.openTrack(this.tracksService.selection).subscribe()
  }

  onDelete() {
    this.tracksService.deleteSelection()
    this.tracksService.open()
  }

}
