import { Injectable } from '@angular/core'
import { Mpp } from './model'
// import { TEST_TRACKS } from './test-tracks'

const MPP = 'mpp'

const DEFAULT: Mpp = {
  // tracks: TEST_TRACKS
  tracks: []
}

@Injectable()
export class StoreService {

  mpp: Mpp

  save() {
    localStorage.setItem(MPP, JSON.stringify(this.mpp))
  }

  load() {
    const data = localStorage.getItem(MPP)
    this.mpp = DEFAULT
    try {
      if (data) {
        this.mpp = JSON.parse(data)
      }
    } catch (err) {
      console.error(err)
    }
  }
}
