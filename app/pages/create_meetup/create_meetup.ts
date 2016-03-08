import {Page, NavController, NavParams, Alert} from 'ionic-angular';
import {SearchUserPage} from '../search_user/search_user';

@Page({
  templateUrl: 'build/pages/create_meetup/create_meetup.html'
})

export class CreateMeetupPage {

  tags = [];
  suggests = [];
  users = ["lol"];
  allTags = ["Startup", "Entrepreneur", "Finance", "Partager", "Gastronomie"];
  searchingTags = true;
  searchTags = "";
  searchbar: any;

 	constructor(public nav: NavController) {
  		this.nav = nav;
	}

  getTags(searchbar) {
    this.searchbar = searchbar;

    // get user input
    let res = searchbar.value.trim();
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
    this.searchbar.value = '';
    // update if we search more tags or not
    if (this.tags.length >= 5)
        this.searchingTags = false;
    else
        this.searchingTags = true;
  }

  searchUser() {
    if (this.tags.length > 0)
      this.nav.push(SearchUserPage, { tags : this.tags});
    else
      this.showAlert("Error", "Please choose at least one tag to search other user.", "Ok");
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
