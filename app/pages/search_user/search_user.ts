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
    loading = true;
    tmp: any;
    parent: any;

 	constructor(public nav: NavController, navParams: NavParams, public http: HttpService) {
  		this.nav = nav;
      this.http = http;

      this.getUsersFromTags(navParams.get('tags'));
      this.parent = navParams.get('parent');
      this.users = this.allUsers;
	}

  userChoosen(event, item) {

  }

  getUsersFromTags(tags) {
    let request = {'tags' : tags};
    this.http.makeBackendRequest('POST', 'search/user/tags', request,
    response => {
      // for earch id, get the profile
      for(let i = 0; i < response.length; i++) {
        this.tmp = response[i];
        this.http.makeBackendRequest('GET', 'profile/show/' + response[i], null, response => {
            let profile = new Profile(response);
            profile.id = this.tmp;
            this.allUsers.push(profile);
        }, errorMessage => {  }, true);
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
    modal.onDismiss(result => {
      if (result) {
        this.parent.users.push(user);
        console.log(Object.keys(this.nav));
        let alert = Alert.create({
          title: "Informations",
          subTitle: user.name +" is now invited at your diner",
          buttons: ["Ok"]
        });
        this.nav.present(alert);
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
