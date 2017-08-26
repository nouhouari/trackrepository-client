import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { StompService, StompState} from '@stomp/ng2-stompjs';
import { TrackService } from '../track.service';
import { AcNotification, ActionType, AcEntity } from 'angular-cesium';

@Component({
  selector: 'app-raw',
  templateUrl: './raw.component.html',
  styleUrls: ['./raw.component.css']
})
export class RawComponent implements OnInit {

  @Input()
  show: boolean;

  private tracks$: Observable<AcNotification>;

  constructor(public trackService: TrackService) {
    this.tracks$ = trackService.getNotificationStream();
  }

  ngOnInit() {
  }

  getTrackColor(track): any {
   return Cesium.Color.WHITE;
  }
}
