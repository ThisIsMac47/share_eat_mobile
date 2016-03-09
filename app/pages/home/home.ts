import {Page, NavController, NavParams, MenuController} from 'ionic-angular';
import {CreateMeetupPage} from '../create_meetup/create_meetup';
import {HttpService} from '../../providers/http-service';
import {DataService} from '../../providers/data-service';

@Page({
  templateUrl: 'build/pages/home/home.html'
})

export class HomePage {

  items: Array<{title: string, component: any, icon: string}>;

  constructor(public nav: NavController, public menu: MenuController, public http: HttpService, public data: DataService) {
  	this.nav = nav;

    this.items = [
      { title: 'Create a dinner', component: CreateMeetupPage, icon: 'beer'},
      { title: 'calendar', component: HomePage, icon: 'bluetooth'},
      { title: 'pending invite', component: HomePage, icon: 'paper-plane'}
    ];

    http.makeBackendRequest('GET', 'me/tags', null, response => {
        data.set('tags', JSON.stringify(response));
    }, errorMessage => { }, true);
  }

  itemTapped(event, item) {
  	this.nav.push(item.component);
  }


    onPageDidEnter() {
      this.menu.enable(true);
      this.menu.swipeEnable(true);
    }
}
