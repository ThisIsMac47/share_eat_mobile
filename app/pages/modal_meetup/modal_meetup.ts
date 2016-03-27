import {Page, Modal, NavController, ViewController, NavParams} from 'ionic-angular';
import {CheckoutPage} from '../checkout/checkout';
import {HttpService} from '../../providers/http-service';

@Page({
  templateUrl: 'build/pages/modal_meetup/modal_meetup.html'
})

export class ModalMeetup {
  invitation: any;
  view: any;
  needresponse: boolean;

 constructor(viewCtrl: ViewController, params: NavParams, public nav: NavController, public http: HttpService) {
   this.view = viewCtrl;
   this.invitation = params.get('meetup');
   this.needresponse = params.get('needresponse');
   console.log(JSON.stringify(this.invitation));
 }

 dismiss() {
   this.view.dismiss(null);
 }

 accept() {
     this.nav.push(CheckoutPage, { meetup: this.invitation.meetup });
 }

 refuse() {
   this.http.makeBackendRequest('GET', 'meetup/refuse/' + this.invitation.meetup.id, null, response => {
     HttpService.showAlert(this.nav, "Done !", "The organiser has been notified that you will not go at this meetup, thanks.", "Ok");
    this.view.dismiss(null);
   }, errorMessage => {
     HttpService.showAlert(this.nav, "Error code : " + errorMessage.status, "Notre serveur n'a pas répondu, veuillez réessayez", "Ok");
    this.view.dismiss(null);
    }, true);
 }
}
