import {Page, Modal, NavController, ViewController, NavParams} from 'ionic-angular';

@Page({
  templateUrl: 'build/pages/modal_profile/modal_profile.html'
})

export class ModalProfile {
  user: any;
  view: any;

 constructor(viewCtrl: ViewController, params: NavParams) {
   this.view = viewCtrl;
   this.user = params.get('user');
 }

 dismiss() {
   this.view.dismiss(this.user);
 }

}
