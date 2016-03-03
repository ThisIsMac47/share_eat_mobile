import {Page, Modal, NavController, ViewController} from 'ionic/ionic';

@Page({
  templateUrl: 'build/pages/modal_profile/modal_profile.html'
})

class ModalProfile {
 constructor(viewCtrl: ViewController, params: NavParams) {
   this.viewCtrl = viewCtrl;
   this.user = params.get('user');
 }

 dismiss() {
   this.viewCtrl.dismiss(this.user);
 }

}
