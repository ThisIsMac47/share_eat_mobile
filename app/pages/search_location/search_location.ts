import {Page, Modal, NavController, NavParams, Alert} from 'ionic-angular';
import {ModalProfile} from '../modal_profile/modal_profile';
import {Profile} from '../../models/profile';

import {DataService} from '../../providers/data-service';
import {HttpService} from '../../providers/http-service';

@Page({
  providers: [HttpService],
  templateUrl: 'build/pages/search_location/search_location.html'
})

export class SearchLocationPage {


    locations = Array<Profile>();
    searchbarValue = "";
    loading = true;
    parent: any;
    tmp: any;
    price = null;

 	constructor(public nav: NavController, navParams: NavParams, public http: HttpService) {
  		this.nav = nav;
      this.http = http;

      this.parent = navParams.get('parent');
	}

  chooseLocation(location) {
    this.parent.location = location;
    this.parent.mealplan = this.price;
    this.nav.pop();
  }

  searchLocation(event) {
    // get user input
    let res = this.searchbarValue;
    if (res.length == 0)
        res = "none";
    this.http.makeBackendRequest('GET', 'search/location/' + this.price + '/' + res, null,
    response => {
      this.locations = [];
      // for earch id, get the location
      for(let i = 0; i < response.length; i++) {
        this.tmp = response[i];
        this.http.makeBackendRequest('GET', 'location/show/' + response[i], null, response => {
            let location = response;
            location.id = this.tmp;
            this.locations.push(location);
        }, errorMessage => {  }, true);
      }
    }, errorMessage => {
      let code = errorMessage.status;
        HttpService.showAlert(this.nav, "Error code : " + code, "Notre serveur n'a pas répondu, veuillez réessayez", "Ok");
    }, true);

  }


}
