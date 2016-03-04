import {Page, Modal, NavController, NavParams} from 'ionic/ionic';
import {ModalProfile} from '../modal_profile/modal_profile';
import {Http, Headers, RequestOptions} from 'angular2/http';
import {Observable}       from 'rxjs/Observable';
import {DataService} from '../../providers/data-service';
import 'rxjs/Rx'

import {SearchUserByTagRequest} from '../../models/request/SearchUserByTagRequest';

@Page({
  templateUrl: 'build/pages/search_user/search_user.html'
})

export class SearchUserPage {
 	constructor(nav: NavController, data: DataService, navParams: NavParams, http: Http) {
  		this.nav = nav;
      this.http = http;
      this.data = data;
      this.searchQuery = "";
    	this.pageTitle = "Search user";

      this.data.get('user.auth').then((data) => {
        this.userAuth = data;
        this.getUsersFromTags(navParams.get('tags'));
      }
      this.url = 'http://localhost:1337/localhost:4242';

      this.suggests = [];
      this.searching = true;
	}

  userChoosen(event, item) {

  }

  getUsersFromTags(tags) {
    console.log(tags);

    let headers = new Headers({ 'Content-Type': 'application/json', "Authorization" : this.userAuth});
    let options = new RequestOptions({ headers: headers });

    SearchUserByTagRequest request = new SearchUserByTagRequest();
    request.tags = tags;

    console.log(JSON.stringify(request));

    this.http.post(this.url + '/search/user/tags', JSON.stringify(request), options)
                  .toPromise()
                  .then(response => response.json())
                  .then((response) => this.onSearchSuccess(response),
                   (errorMessage) => this.onSearchError(errorMessage));
  }

  openProfile(user) {
    let modal = Modal.create(ModalProfile, { user : this.user } );
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
    this.suggests = this.items.filter((v) => {
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

  onSearchSuccess(response) {
    console.log(JSON.stringify(response));
    this.users = response;
  }

  onLoginError(errorMessage) {
    let code = errorMessage.status;
    if (typeof code == "undefined")
        this.showAlert("Serveur non-accessible", "Notre serveur n'a pas répondu, veuillez réessayez", "Ok");
    else if (code == "500")
        this.showAlert("Serveur non-accessible", "Notre serveur n'a pas répondu, veuillez réessayez", "Ok");
  }
}
