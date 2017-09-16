import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { TrackProvider } from './track-provider';
import { Track } from './track';
import { AcNotification, ActionType, AcEntity } from 'angular-cesium';
import { StompService, StompState } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';

@Injectable()
export class TrackService implements TrackProvider {

  public stream: Observable<AcNotification>;
  public subject: Subject<AcNotification>;
  public trackStream: Observable<Track>;

  // Stomp Subscription
  private stompSubscription: Observable<Message>;
  private currentSubscription;

  constructor(private _stompService: StompService) {

    this.subject = new Subject<AcNotification>();

    let heading = Cesium.Math.toRadians(0 - 90);
    let pitch = Cesium.Math.toRadians(0.0);
    let roll = Cesium.Math.toRadians(0.0);
    let position = Cesium.Cartesian3.fromDegrees(6, 43, 10000);
    let groundPosition = Cesium.Cartesian3.fromDegrees(6, 43, 0);
    let hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    let orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

    let track1: AcNotification = {
      // tslint:disable-next-line:indent
      id: '0',
      actionType: ActionType.ADD_UPDATE,
      entity: AcEntity.create({
        'id': 0,
        'name': 'Hello Track',
        'isTarget': true,
        'scale': 0.03,
        'callsign': 'track0',
        'image': '/assets/fighter-jet.png',
        'heading': heading,
        'position': position,
        'futurePosition': groundPosition,
        'orientation': orientation,
        'lat': 43,
        'lon': 6,
        'sp': 45.0,
        'ut' : new Date()
      })
    };
    const trackArray = [track1];
    this.stream = Observable.create(obs => {
      setInterval(function () {

        heading = Cesium.Math.toRadians(0 - 90);
        pitch = Cesium.Math.toRadians(0.0);
        roll = Cesium.Math.toRadians(0.0);
        const lon = 6 + Math.random() * 0.0001;
        const lat = 43 + Math.random() * 0.0001;
        position = Cesium.Cartesian3.fromDegrees(lon, lat, 10000);
        groundPosition = Cesium.Cartesian3.fromDegrees(lon, lat, 0);
        hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
        orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

        track1 = {
          // tslint:disable-next-line:indent
          id: '0',
          actionType: ActionType.ADD_UPDATE,
          entity: AcEntity.create({
            'id': 0,
            'name': 'Hello Track',
            'isTarget': true,
            'scale': 0.03,
            'callsign': 'track0',
            'image': '/assets/fighter-jet.png',
            'heading': heading,
            'position': position,
            'futurePosition': groundPosition,
            'orientation': orientation,
            'lat': lat,
            'lon': lon,
            'sp': 45.0 + Math.random(),
            'ut' : new Date(),
            'selected' : false
          })
        };
        obs.next(track1);
      }, 5000);
    });
  }

  /**
   * Return notification observable.
   */
  public getNotificationStream(): Observable<AcNotification> {
    return this.stream;
  }

  /**
   * Return notification subject.
   */
  public getNotificationSubject(): Subject<AcNotification> {
    return this.subject;
  }

  /**
  * Subscribe to Stomp topic.
  */
  public subscribe(): Observable<AcNotification> {
    this.stompSubscription = this._stompService.subscribe('/topic/track');
    const stompStream: Observable<any> = this.stompSubscription
      .map((message: Message) => {
        return JSON.parse(message.body);
      });

    // Create a track stream
    this.trackStream = stompStream.map(m => {
      const track: Track = new Track();
      track.ei = m.ei;
      track.latitude = m.geo[0];
      track.longitude = m.geo[1];
      track.heading = m.he;
      track.speed = m.sp;
      return track;
    });

    // Notification stream
    const obs: Observable<AcNotification> = stompStream
      .map(j => {
        const heading = Cesium.Math.toRadians(j.he + 90);
        const pitch = Cesium.Math.toRadians(0.0);
        const roll = Cesium.Math.toRadians(0.0);
        const position = Cesium.Cartesian3.fromDegrees(j.geo[1], j.geo[0], j.al);
        const groundPosition = Cesium.Cartesian3.fromDegrees(j.geo[0], j.geo[1], 0);
        const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
        const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

        const acNotification: AcNotification = {
          // tslint:disable-next-line:indent
          id: j.ei,
          actionType: ActionType.ADD_UPDATE,
          entity: AcEntity.create({
            'id': j.id,
            'name': j.ei,
            'isTarget': true,
            'scale': 0.03,
            'image': '/assets/fighter-jet.png',
            'heading': j.he,
            'position': position,
            'futurePosition': groundPosition,
            'orientation': orientation,
            'selected' : false
          })
        };
        return acNotification;
      });
    this.subject.merge(obs);
    this.currentSubscription = obs.subscribe();
    return obs;
  }

  /**
   * Unsubscribe to Stomp topic.
   */
  public unSubscribe(): void {
    if (this.currentSubscription !== undefined) {
      console.log('UnSubscribe');
      this.currentSubscription.unsubscribe();
    }
  }
}
