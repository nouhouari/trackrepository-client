import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TrackProvider } from './track-provider';
import { AcNotification, ActionType, AcEntity } from 'angular-cesium';

@Injectable()
export class TrackService implements TrackProvider {

  public stream: Observable<AcNotification>;

  constructor() {
    const heading =  Cesium.Math.toRadians(0 - 90);
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
    this.stream = Observable.from(trackArray);
  }

  /**
   *
   */
  public getNotificationStream(): Observable<AcNotification> {
    return this.stream;
  }
}
