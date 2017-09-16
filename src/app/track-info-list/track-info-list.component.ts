import { Component, OnInit } from '@angular/core';
import { TrackService } from '../track.service';

@Component({
  selector: 'app-track-info-list',
  templateUrl: './track-info-list.component.html',
  styleUrls: ['./track-info-list.component.scss']
})
export class TrackInfoListComponent implements OnInit {

  public customClass = 'customClass';
  public selectedTracks: Array<any> = new Array();

  constructor(public trackService: TrackService) {
    this.trackService.getNotificationSubject().subscribe(
      n => {
        const e: any = n;
        if (e.selected === true) {
          const index = this.selectedTracks.indexOf(e);
          if (index === -1) {
            // Add tracks to selected tracks list
            this.selectedTracks.push(e);
          }
        } else {
          // Remove track from selected tracks list
          const index = this.selectedTracks.indexOf(e);
          this.selectedTracks.splice(index, 1);
          console.log('Unselect track ' + e.id);
        }
      }
    );
  }

  ngOnInit() {
  }

}
