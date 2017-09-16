import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StompConfig, StompService } from '@stomp/ng2-stompjs';

import { AppComponent } from './app.component';
import { ConnectionComponent } from './connection/connection.component';
import { RawComponent } from './raw/raw.component';
import { AngularCesiumModule } from 'angular-cesium';

import { TrackInfoComponent } from './track-info/track-info.component';
import { TrackInfoListComponent } from './track-info-list/track-info-list.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome/angular-font-awesome';
import { AccordionModule } from 'ngx-bootstrap/accordion';


const stompConfig: StompConfig = {
  // Which server?
  url: 'ws://localhost:8080/ws',

  // Headers
  // Typical keys: login, passcode, host
  headers: {
    login: 'guest',
    passcode: 'guest'
  },

  // How often to heartbeat?
  // Interval in milliseconds, set to 0 to disable
  heartbeat_in: 0, // Typical value 0 - disabled
  heartbeat_out: 20000, // Typical value 20000 - every 20 seconds

  // Wait in milliseconds before attempting auto reconnect
  // Set to 0 to disable
  // Typical value 5000 (5 seconds)
  reconnect_delay: 5000,

  // Will log diagnostics on console
  debug: false
};

@NgModule({
  declarations: [
    AppComponent,
    ConnectionComponent,
    RawComponent,
    TrackInfoComponent,
    TrackInfoListComponent
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    AngularCesiumModule,
    AngularFontAwesomeModule,
    AccordionModule.forRoot()
  ],
  providers: [

    // CesiumService.ViewersManagerService,

    StompService,
    {
      provide: StompConfig,
      useValue: stompConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
