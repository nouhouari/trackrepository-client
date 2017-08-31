import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { StompService, StompState } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.css']
})
export class ConnectionComponent implements OnInit {

  public state: Observable<string>;
  private stompSubscription: Observable<Message>;
  private currentSubscription;

  constructor(
    private _stompService: StompService
  ) {
    this.state = this._stompService.state
      .map((state: number) => StompState[state]);
  }

  ngOnInit() {
  }

  /**
   * Subscribe to Stomp topic.
   */
  public subscribe(): void {
    this.stompSubscription = this._stompService.subscribe('/topic/track');
    this.currentSubscription = this.stompSubscription.map((message: Message) => {
      return message.body;
    }).subscribe((msg_body: string) => {
      console.log(`Received: ${msg_body}`);
    });
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
