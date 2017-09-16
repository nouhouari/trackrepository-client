import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { TrackService } from '../track.service';
import { NgFor } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-track-info',
  templateUrl: './track-info.component.html',
  styleUrls: ['./track-info.component.scss']
})
export class TrackInfoComponent implements OnInit, AfterViewInit {

  @Input()
  public track: any;

  /**
   * Track subscription
   */
  private subscription: Subscription;

  /**
   * Build a new Track Info component.
   * @param trackService Track service
   */
  constructor(public trackService: TrackService) {
  }

  /**
   * Subscribe to track update after view initialized.
   */
  ngAfterViewInit() {
    console.log('Subscribe to ' + this.track);
    this.subscription = this.trackService.getNotificationStream()
    .filter(n => {console.log(n.entity); const e: any = n.entity; return (e.id === this.track.id); })
    .subscribe(t => {
      console.log('Track update ' + JSON.stringify(t));
      this.track = t.entity;
    }
    );
  }

  /**
   * Inititalize the view.
   */
  ngOnInit() {
  }

  /**
   * Unselect track
   */
  private unselect(): void {
    console.log('unselect track');
    this.track.selected = false;
    this.subscription.unsubscribe();
    this.trackService.getNotificationSubject().next(this.track);
  }

}
