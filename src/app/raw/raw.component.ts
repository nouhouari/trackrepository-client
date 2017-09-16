import { Input, ViewChild, TemplateRef } from '@angular/core';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { StompService, StompState } from '@stomp/ng2-stompjs';
import { TrackService } from '../track.service';
import { AcNotification, ActionType, AcEntity } from 'angular-cesium';

import { MapLayerProviderOptions } from 'angular-cesium';
import { CesiumEvent } from 'angular-cesium';
import { PickOptions } from 'angular-cesium';
import { AcMapComponent } from 'angular-cesium';
import { AcLayerComponent } from 'angular-cesium';
import { ViewerConfiguration } from 'angular-cesium';

import { TrackInfoComponent } from '../track-info/track-info.component';

@Component({
  selector: 'app-raw',
  templateUrl: './raw.component.html',
  styleUrls: ['./raw.component.css'],
  providers: [
    TrackService,
    ViewerConfiguration
  ],
  entryComponents: [
    TrackInfoComponent
  ]
})
export class RawComponent implements OnInit, AfterViewInit {

  @Input()
  show: boolean;

  @ViewChild('toto') tracksLayer: AcLayerComponent;

  @ViewChild('cesiumContainer') map: AcMapComponent;

  private tracks$: Observable<AcNotification>;
  private lastPickTrack;

  MapLayerProviderOptions = MapLayerProviderOptions;
  Cesium = Cesium;

  constructor(public trackService: TrackService, public viewerConf: ViewerConfiguration) {
    viewerConf.viewerOptions = {
      sceneMode: Cesium.SceneMode.SCENE3D,
      selectionIndicator: false,
      timeline: false,
      infoBox: false,
      fullscreenButton: false,
      baseLayerPicker: false,
      animation: false,
      homeButton: false,
      geocoder: false,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false,
      terrainProvider: new Cesium.CesiumTerrainProvider({
        url: '//assets.agi.com/stk-terrain/world'
      }),
    };
    this.tracks$ = trackService.getNotificationStream();
  }

  ngAfterViewInit() {
    const mouseOverObservable = this.map.getMapEventManager().register({
      event: CesiumEvent.LEFT_CLICK,
      pick: PickOptions.PICK_FIRST,
      priority: 1,
    });

    mouseOverObservable.subscribe((event) => {
      const track = event.entities !== null ? event.entities[0] : null;
      if (this.lastPickTrack && (!track || track.id !== this.lastPickTrack.id)) {
        this.lastPickTrack.picked = false;
        console.log(' Track unselected ');
      }
      if (track && (!this.lastPickTrack || track.id !== this.lastPickTrack.id)) {
        track.picked = true;
        const t = track;
        t.selected = true;
        this.trackService.getNotificationSubject().next(track);
      }
      this.lastPickTrack = track;
    });
  }

  ngOnInit() { }

  getTrackColor(track): any {
    return Cesium.Color.WHITE;
  }
}
