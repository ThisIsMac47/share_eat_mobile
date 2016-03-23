import {Page, Modal, NavController, NavParams, Alert} from 'ionic-angular';
import {ModalProfile} from '../modal_profile/modal_profile';
import {Profile} from '../../models/profile';

import {DataService} from '../../providers/data-service';
import {HttpService} from '../../providers/http-service';

@Page({
  providers: [HttpService],
  templateUrl: 'build/pages/search_user/search_user.html'
})

export class SearchUserPage {

    tags = [];
    users = Array<Profile>();
    allUsers = Array<Profile>();
    searchbarValue = "";
    loading = false;
    parent: any;

 	constructor(public nav: NavController, navParams: NavParams, public http: HttpService) {
  		this.nav = nav;
      this.http = http;

      this.getUsersFromTags(navParams.get('tags'));
      this.parent = navParams.get('parent');
      this.users = this.allUsers;
	}

  getUsersFromTags(tags) {
    let request = {'tags' : tags};
    this.loading = true;
    this.http.makeBackendRequest('POST', 'search/user/tags', request,
    response => {
      // for earch id, get the profile
      for(let i = 0; i < response.length; i++) {
        this.http.makeBackendRequest('GET', 'profile/show/' + response[i], null, res => {
            let profile = new Profile(res);
            profile.id = response[i];
            this.allUsers.push(profile);
        }, errorMessage => {  }, true);
      }
        this.loading = false;
    }, errorMessage => {
      let code = errorMessage.status;
      this.loading = false;
      HttpService.showAlert(this.nav, "Error code : " + errorMessage.status, "Notre serveur n'a pas répondu, veuillez réessayez", "Ok");
    }, true);
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

  searchUser() {
    // get user input
    let res = this.searchbarValue;
    if (res == '') {
      this.users = this.allUsers;
      return;
    }

    // Suggests input who matches with the existing input
    this.users = this.allUsers.filter((v) => {
      if (v.name.toLowerCase().indexOf(res.toLowerCase()) > -1) {
        return true;
      }
      return false;
    })
  }


}
