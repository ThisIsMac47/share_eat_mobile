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

    http: any;
    nav: any;
    tags = [];
    users = Array<Profile>();
    allUsers = Array<Profile>();
    searchbarValue = "";


 	constructor(nav: NavController, navParams: NavParams, http: HttpService) {
  		this.nav = nav;
      this.http = http;

      this.getUsersFromTags(navParams.get('tags'));
      this.users = this.allUsers;
	}

  userChoosen(event, item) {

  }

  getUsersFromTags(tags) {
    let request = {'tags' : tags};
    this.http.makeBackendRequest('POST', 'search/user/tags', request,
    response => {
      for(let i = 0; i < response.length; i++) {
        this.allUsers[i] = new Profile(response[i]);
      }
    }, errorMessage => {
      let code = errorMessage.status;
      if (typeof code == "undefined")
          HttpService.showAlert(this.nav, "Serveur non-accessible", "Notre serveur n'a pas répondu, veuillez réessayez", "Ok");
      else if (code == "500")
          HttpService.showAlert(this.nav, "Serveur non-accessible", "Notre serveur n'a pas répondu, veuillez réessayez", "Ok");
    }, true);
  }

  openProfile(user) {
    let modal = Modal.create(ModalProfile, { 'user' : user } );
    this.nav.present(modal);
    modal.onDismiss(data => {
     console.log(data);
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
