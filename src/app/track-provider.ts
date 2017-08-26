
import { Observable } from 'rxjs/Observable';
import { AcNotification } from 'angular-cesium';

/**
 * Define a TrackProvider interface.
 */
export interface TrackProvider {
    /**
     * Return the Angular Cesium Notification.
     */
    getNotificationStream(): Observable<AcNotification>;
}
