import {Page, Modal, NavController, NavParams, Alert} from 'ionic-angular';
import {ModalProfile} from '../modal_profile/modal_profile';

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
    suggests = [];
    allUsers = [];
    searching = false;
    searchbarValue = "";
    searchbar: any;


 	constructor(nav: NavController, navParams: NavParams, http: HttpService) {
  		this.nav = nav;
      this.http = http;

      this.getUsersFromTags(navParams.get('tags'));

      this.searching = true;
	}

  userChoosen(event, item) {
    
  }

  getUsersFromTags(tags) {
    let request = {'tags' : tags};
    this.http.makeBackendRequest('POST', '/search/user/tags', null, this.onSearchSuccess, this.onSearchError, true);
  }

  onSearchSuccess(response) {
    console.log(JSON.stringify(response));
    this.allUsers = response;
  }

  onSearchError(errorMessage) {
    let code = errorMessage.status;
    if (typeof code == "undefined")
        this.showAlert("Serveur non-accessible", "Notre serveur n'a pas répondu, veuillez réessayez", "Ok");
    else if (code == "500")
        this.showAlert("Serveur non-accessible", "Notre serveur n'a pas répondu, veuillez réessayez", "Ok");
  }

  openProfile(user) {
    let modal = Modal.create(ModalProfile, { 'user' : user } );
    this.nav.present(modal);
    modal.onDismiss(data => {
     console.log(data);
   });
  }

  searchUser(searchbar) {
    this.searchbar = searchbar;

    // get user input
    let res = searchbar.value.trim();
    if (res == '') {
      this.suggests = [];
      return;
    }

    // Suggests input who matches with the existing input
    this.suggests = this.allUsers.filter((v) => {
      if (v.toLowerCase().indexOf(res.toLowerCase()) > -1) {
        return true;
      }
      return false;
    })
  }

  showAlert(title, subTitle, button) {
    let alert = Alert.create({
      title: title,
      subTitle: subTitle,
      buttons: [button]
    });
    this.nav.present(alert);
  }


}
