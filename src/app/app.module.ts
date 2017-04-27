import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal'

import { AppComponent } from './app.component'
import { TracksDropdownComponent } from './tracks-dropdown/tracks-dropdown.component'
import { TracksService } from './tracks.service'
import { StoreService } from './store.service'
import { YtPlayerComponent } from './yt-player/yt-player.component'
import { KeysComponent } from './keys/keys.component'
import { XlatePipe } from './xlate.pipe'
import { MarkersComponent } from './markers/markers.component'
import { PlayerService } from './player.service'
import { MarkerPipe } from './marker.pipe'
import { ActionBarComponent } from './action-bar/action-bar.component'
import { ModalService } from './modal.service'
import { APP_BASE_HREF } from '@angular/common'
import { environment } from 'environments/environment'

@NgModule({
  declarations: [
    AppComponent,
    TracksDropdownComponent,
    YtPlayerComponent,
    KeysComponent,
    XlatePipe,
    MarkersComponent,
    MarkerPipe,
    ActionBarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule, Ng2Bs3ModalModule
  ],
  providers: [TracksService, StoreService, PlayerService, MarkerPipe, ModalService,
    { provide: APP_BASE_HREF, useValue: environment.baseHref },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
