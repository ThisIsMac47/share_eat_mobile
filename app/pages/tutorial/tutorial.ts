import {Page, NavController, MenuController} from 'ionic-angular';
import {HomePage} from '../home/home';

@Page({
  templateUrl: 'build/pages/tutorial/tutorial.html'
})
export class TutorialPage {
    nav: NavController;

    constructor(nav: NavController) {
        this.nav = nav;
    }

    start() {
        this.nav.setRoot(HomePage);
    }
}
