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

 	constructor(public nav: NavController, navParams: NavParams, public http: HttpService) {
  		this.nav = nav;
      this.http = http;

      this.parent = navParams.get('parent');
	}

  openProfile(user) {
    let modal = Modal.create(ModalProfile, { 'user' : user } );
    this.nav.present(modal);
    modal.onDismiss(result => {
      if (result) {
        this.parent.users.push(user);
      }
   });
  }

  searchLocation() {
    // get user input
    let res = this.searchbarValue;
    this.http.makeBackendRequest('GET', 'search/location/' + this.searchbarValue, null,
    response => {
      this.locations = [];
      // for earch id, get the location
      for(let i = 0; i < response.length; i++) {
        this.tmp = response[i];
        this.http.makeBackendRequest('GET', 'location/show/' + response[i], null, response => {
            let profile = new Profile(response);
            profile.id = this.tmp;
            this.locations.push(profile);
        }, errorMessage => {  }, true);
      }
    }, errorMessage => {
      let code = errorMessage.status;
        HttpService.showAlert(this.nav, "Error code : " + code, "Notre serveur n'a pas répondu, veuillez réessayez", "Ok");
    }, true);

  }


}
