import {Page, NavController, NavParams, MenuController} from 'ionic-angular';
import {ItemDetailsPage} from '../item-details/item-details';
import {CreateMeetupPage} from '../create_meetup/create_meetup';

@Page({
  templateUrl: 'build/pages/home/home.html'
})

export class HomePage {

  items: Array<{title: string, component: any, icon: string}>;

  constructor(public nav: NavController, public menu: MenuController) {
  	this.nav = nav;

    this.items = [
      { title: 'Create a dinner', component: CreateMeetupPage, icon: 'beer'},
      { title: 'calendar', component: HomePage, icon: 'bluetooth'},
      { title: 'pending invite', component: HomePage, icon: 'paper-plane'}
    ];
  }

  itemTapped(event, item) {
  	this.nav.push(item.component);
  }


    onPageDidEnter() {
      this.menu.enable(true);
      this.menu.swipeEnable(true);
    }
}
