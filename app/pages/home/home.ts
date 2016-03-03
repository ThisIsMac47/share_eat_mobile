import {Page, NavController, NavParams} from 'ionic/ionic';
import {ItemDetailsPage} from '../item-details/item-details';
import {CreateMeetupPage} from '../create_meetup/create_meetup';

@Page({
  templateUrl: 'build/pages/home/home.html'
})

export class HomePage {
  constructor(nav: NavController, navParams: NavParams) {
  	this.nav = nav;
    this.pageTitle = "Activity";
  	this.icons = ['beer', 'bluetooth', 'paper-plane'];
  	this.titles = ['create a dinner', 'calendar', 'pending invite'];
  	this.items = [];

  	for(let i = 0; i < 3; i++)
  	{
	  	this.items.push({
  			icon: this.icons[i]
  			title: this.titles[i];
  		});
  	}
  }


  itemTapped(event, item) {
    if (item.title == this.titles[0]) {
  	   this.nav.push(CreateMeetupPage);
    } else if (item.title == this.titles[1]) {
      this.nav.push(ItemDetailsPage , {
        item : item
      });
    } else if (item.title == this.titles[2]) {
      this.nav.push(ItemDetailsPage, {
        item : item
      });
    }
  }
}
