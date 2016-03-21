import {Page, NavController, NavParams, Alert} from 'ionic-angular';
import {CheckoutPage} from '../checkout/checkout';
import {SearchUserPage} from '../search_user/search_user';
import {SearchLocationPage} from '../search_location/search_location';
import {HttpService} from '../../providers/http-service';
import {DataService} from '../../providers/data-service';

@Page({
  templateUrl: 'build/pages/create_meetup/create_meetup.html'
})

export class CreateMeetupPage {

  // temp variable for searching tags
  suggests = [];
  allTags = ["Startup", "Entrepreneur", "Finance", "Partager", "Gastronomie"];
  searchingTags = true;
  searchTags = "";
  // data used to create the meetup
  name: String;
  location = null;
  mealplan = null;
  event_date: any;
  users = [];
  tags = [];

 	constructor(public nav: NavController, public http: HttpService, public data: DataService) {
      this.http = http;
      this.data = data;
  		this.nav = nav;
      data.get('tags').then((data) => {
         if (data) {
           this.allTags = JSON.parse(data);
         }
      });
	}

  createMeetup() {
    if (this.users.length == 0 || this.tags.length == 0 || this.location == null || this.event_date == null || this.name.length == 0) {
      this.showAlert("Error", "Please fill all the field", "Ok");
      return;
    }
    let usersList = [];
    for(let i = 0; i < this.users.length; i++) {
      usersList[i] = this.users[i].id;
    }

    let request = {invited: usersList, location: this.location.id, mealplan : this.mealplan, tags : this.tags, date: this.event_date, name : this.name};
    this.http.makeBackendRequest('POST', 'meetup/create/', request, response => {
        HttpService.showAlert(this.nav, "Meetup successfuly created", "All users will receive an invitation", "Ok");
    }, errorMessage => {
      let code = errorMessage.status;
      HttpService.showAlert(this.nav, "Error code : " + code, "Notre serveur n'a pas répondu, veuillez réessayez", "Ok");
    }, true);
  }

  getTags(searchbar) {
    // get user input
    let res = this.searchTags.trim();
    if (res == '') {
      this.suggests = [];
      return;
    }

    // Suggests input who matches with the existing input
    this.suggests = this.allTags.filter((v) => {
      if (v.toLowerCase().indexOf(res.toLowerCase()) > -1) {
        return true;
      }
      return false;
    })
  }

  tagsChoosen(event, item) {
    // verify that the tag doesnt already exist and after push it
    if (this.tags.indexOf(item) == -1)
      this.tags.push(item);
    // reset search bar and suggestions
    this.suggests = [];
    this.searchTags = '';
    // update if we search more tags or not
    if (this.tags.length >= 5)
        this.searchingTags = false;
    else
        this.searchingTags = true;
  }

  searchUser() {
    if (this.tags.length > 0)
      this.nav.push(SearchUserPage, { tags : this.tags, parent: this});
    else
      this.showAlert("Error", "Please choose at least one tag to search other user.", "Ok");
  }

  searchLocation() {
    this.nav.push(SearchLocationPage, { parent: this});
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
