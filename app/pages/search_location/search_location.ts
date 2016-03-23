import {Page, Modal, NavController, NavParams, Alert, Keyboard} from 'ionic-angular';
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
    loading = false;
    parent: any;
    price = null;

 	constructor(public nav: NavController, navParams: NavParams, public http: HttpService) {
  		this.nav = nav;
      this.http = http;

      this.parent = navParams.get('parent');
	}

  chooseLocation(location) {
    this.parent.location = location;
    this.nav.pop();
  }

  searchLocation(event) {
    if (this.price == null) {
        HttpService.showAlert(this.nav, "Error", "Please choose at least a price for the restaurent", "Ok");
        return;
    }

    // get user input
    let res = this.searchbarValue;
    if (res.length == 0)
        res = "none";

    this.loading = true;
    this.http.makeBackendRequest('GET', 'search/location/' + this.price + '/' + res, null,
    response => {
      this.locations = [];
      // for earch id, get the location
      for(let i = 0; i < response.length; i++) {
        this.http.makeBackendRequest('GET', 'location/show/' + response[i], null, res => {
            let location = res;
            location.id = response[i];
            this.locations.push(location);
        }, errorMessage => {  }, true);
      }
      this.loading = false;
    }, errorMessage => {
      let code = errorMessage.status;
        this.loading = false;
        HttpService.showAlert(this.nav, "Error code : " + code, "Notre serveur n'a pas répondu, veuillez réessayez", "Ok");
    }, true);

  }

  handleKeyPress(code) {
    if (code == 13)
      this.searchLocation(null);
  }

}
