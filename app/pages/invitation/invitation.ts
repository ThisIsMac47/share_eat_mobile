import {IonicApp, Page, NavController, Events, MenuController, Modal} from 'ionic-angular';
import {HomePage} from '../home/home';
import {ModalMeetup} from '../modal_meetup/modal_meetup';
import * as _ from 'lodash';

import {HttpService} from '../../providers/http-service';

@Page({
  providers: [HttpService],
  templateUrl: 'build/pages/invitation/invitation.html'
})
export class InvitationPage {

  // all datas
  waitingInvitations = Array<any>();
  oldInvitations = Array<any>();
  futureMeetups = Array<any>();

  stats: Object;
  loading = false;

  constructor(public nav: NavController, public events: Events, public http: HttpService, public menu: MenuController, app: IonicApp) {
    this.nav = nav;
    this.events = events;
    this.http = http;
    this.stats = { "received": 0, "futur": 0, "sent": 0};
    this.loading = true;

    // Preload the number
    http.makeBackendRequest('GET', 'me/stats', null, response => {
        this.stats = response;
        this.updateData();
    }, errorMessage => {
        this.loading = false;
        HttpService.showAlert(this.nav, "Error code : " + errorMessage.status, "Notre serveur n'a pas répondu, veuillez réessayez", "Ok");
    }, true);

  }

  updateData() {
    let tmp: Array<any>;
    this.http.makeBackendRequest('GET', 'me/invitations/WAITING', null, response => {
      tmp = response;
      for(let i = 0; i < response.length; i++) {

        this.http.makeBackendRequest('GET', 'meetup/show/' + response[i].meetup, null, res => {
            tmp[i].meetup = res;
            tmp[i].meetup.date = _.replace(tmp[i].meetup.date, 'T', ' at ');
            tmp[i].meetup.tags = _.split(tmp[i].meetup.tags, ',');
            this.http.makeBackendRequest('GET', 'location/show/' + res.location.id, null, re => {
                tmp[i].meetup.location = re;
                this.waitingInvitations.push(tmp[i]);
                this.loading = false;
            }, errorMessage => {  }, true);
        }, errorMessage => {  }, true);

      }
    }, errorMessage => {
      HttpService.showAlert(this.nav, "Error code : " + errorMessage.status, "Notre serveur n'a pas répondu, veuillez réessayez", "Ok");
    }, true);
  }

  openInvitation(invitation) {
    let modal = Modal.create(ModalMeetup, { 'meetup' : invitation } );
    this.nav.present(modal);
    modal.onDismiss(result => {

   });
  }

}
