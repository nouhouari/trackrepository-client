import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { TrackProvider } from './track-provider';
import { AcNotification, ActionType, AcEntity } from 'angular-cesium';
import { StompService, StompState } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';

@Injectable()
export class TrackService implements TrackProvider {

  public stream: Observable<AcNotification>;
  public subject: Subject<AcNotification>;

  // Stomp Subscription
  private stompSubscription: Observable<Message>;
  private currentSubscription;

  constructor(private _stompService: StompService) {

    this.subject = new Subject<AcNotification>();

    const heading = Cesium.Math.toRadians(0 - 90);
    const pitch = Cesium.Math.toRadians(0.0);
    const roll = Cesium.Math.toRadians(0.0);
    const position = Cesium.Cartesian3.fromDegrees(6, 43, 10000);
    const groundPosition = Cesium.Cartesian3.fromDegrees(6, 43, 0);
    const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

    const track1: AcNotification = {
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
        'orientation': orientation
      })
    };
    const trackArray = [track1];
    this.stream = Observable.create(obs => {
      obs.next(track1);
    });
  }

  /**
   *
   */
  public getNotificationStream(): Observable<AcNotification> {
    return this.stream;
  }

  /**
  * Subscribe to Stomp topic.
  */
  public subscribe(): Observable<AcNotification> {
    this.stompSubscription = this._stompService.subscribe('/topic/track');
    const obs: Observable<AcNotification> = this.stompSubscription
    .map((message: Message) => {
      return JSON.parse(message.body);
    })
    .map(j => {
      const heading = Cesium.Math.toRadians(j.he + 90);
      const pitch = Cesium.Math.toRadians(0.0);
      const roll = Cesium.Math.toRadians(0.0);
      const position = Cesium.Cartesian3.fromDegrees(j.geo[1], j.geo[0], j.al);
      const groundPosition = Cesium.Cartesian3.fromDegrees(j.geo[0], j.geo[1], 0);
      const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

      const track: AcNotification = {
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
          'orientation': orientation
        })
      };
      return track;
    });
    this.currentSubscription = obs.subscribe();
    return  obs;
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
