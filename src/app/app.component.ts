import { Component, OnInit, ElementRef, ViewChild } from '@angular/core'
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal'
import { TracksService } from './tracks.service'
import { PlayerService } from './player.service'
import { ModalService } from './modal.service'

@Component({
  selector: 'mpp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('focus') focus: ElementRef
  @ViewChild('trackModal') trackModal: ModalComponent

  constructor(private tasksService: TracksService, private playerService: PlayerService, private modalService: ModalService) {
  }

  ngOnInit() {
    this.tasksService.loadTracks()
    // restore focus in case yt player gets focus
    setInterval(() => {
      if (!this.modalService.isAnyModalOpen) {
        this.focus.nativeElement.focus()
      }
    }, 2000)

    this.modalService.trackModal = this.trackModal
  }

  isModalOpen(modal: ModalComponent): boolean {
    return this.modalService.isModalOpen(modal)
  }
}
