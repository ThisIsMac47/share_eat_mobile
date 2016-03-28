import {Page, NavController, MenuController} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {DataService} from '../../providers/data-service';

@Page({
  templateUrl: 'build/pages/tutorial/tutorial.html'
})
export class TutorialPage {

    constructor(public nav: NavController, public storage: DataService) {
        this.nav = nav;
    }

    start() {
        this.storage.set('done_tutorial', true);
        this.nav.setRoot(LoginPage);
    }
}
