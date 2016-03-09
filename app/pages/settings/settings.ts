import {Page, Modal, NavController, Alert} from 'ionic-angular';
import * as _ from 'lodash';
import {FormBuilder, Validators, FORM_BINDINGS, ControlGroup} from 'angular2/common'

import {ValidationService} from '../../providers/validator-service';
import {HttpService} from '../../providers/http-service';
import {DataService} from '../../providers/data-service';
import {Profile} from '../../models/profile';

@Page({
  providers: [HttpService, ValidationService],
  templateUrl: 'build/pages/settings/settings.html'
})

export class SettingsPage {

  profileForm: ControlGroup;
  profile : any;
  allTags = ["Startup", "Entrepreneur", "Finance", "Partager", "Gastronomie"];
  searchingTags = false;
  searchTags = "";
  searchbar: any;
  suggests: String[];

  constructor(public nav: NavController, public data: DataService, public http: HttpService, formBuilder: FormBuilder) {
    this.http = http;
    this.nav = nav;
    this.data = data;
    this.profile = new Profile(null);

    this.profileForm = formBuilder.group({
            name: [this.profile.name, Validators.required],
            mail: [this.profile.mail, Validators.required],
            age: [this.profile.age, Validators.required],
            phone: [this.profile.phone, Validators.required],
            school: [this.profile.school, Validators.required],
            job: [this.profile.job, Validators.required],
            description: [this.profile.description, Validators.required],
            tags: [this.profile.tags, Validators.required]
    });

    data.get('tags').then((data) => {
       if (data) {
         this.allTags = JSON.parse(data);
       }
    });

     // Get user profile if not already know
     data.get('user.profile').then((data) => {
        if (data) {
          this.profile = new Profile(JSON.parse(data));
          if (this.profile.tags.length < 5) {
             this.searchingTags = true;
          }
        }
        else
            this.getUserProfile();
     });

  }

  getUserProfile() {
    this.http.makeBackendRequest('GET', 'me/profile', null, (response) => {
      this.data.set("user.profile", JSON.stringify(response));
      this.profile = new Profile(response);
    }, errorMessage => {
      let code = errorMessage.status;
      if (typeof code == "undefined")
          HttpService.showAlert(this.nav, "Serveur non-accessible", "Notre serveur n'a pas répondu, veuillez réessayez", "Ok");
      else
          HttpService.showAlert(this.nav, "Un problème est survenu", "Nous avons eu un problème dans l'execution de votre demande.", "Ok");
    }, true);
  }

  onProfileUpdate() {
      if (!this.profileForm.valid)
        return ;

      let request = {};
      request['name'] = this.profile.name;
      request['mail'] = this.profile.mail;
      request['age'] = this.profile.age;
      request['phone'] = this.profile.phone;
      request['school'] = this.profile.school;
      request['job'] = this.profile.job;
      request['description'] = this.profile.description;
      request['avatar'] = this.profile.avatar;

      let tags = "";
      for(var i = 0; i < this.profile.tags.length; i++) {
        tags = tags + this.profile.tags[i];
        if (i + 1 != this.profile.tags.length)
          tags = tags + ",";
      }
      request['tags'] = tags;

      this.http.makeBackendRequest('POST', 'me/update', request,
      response => {
        HttpService.showAlert(this.nav, "Success", "Your profile has been successfuly updated", "Ok");
        this.data.set("user.profile", JSON.stringify(request));
        this.profile = new Profile(request);
      }, errorMessage => {
        let code = errorMessage.status;
        if (typeof code == "undefined")
            HttpService.showAlert(this.nav, "Serveur non-accessible", "Notre serveur n'a pas répondu, veuillez réessayez", "Ok");
        else if (code == "500")
            HttpService.showAlert(this.nav, "Serveur non-accessible", "Notre serveur n'a pas répondu, veuillez réessayez", "Ok");
      }, true);
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
    if (this.profile.tags.indexOf(item) == -1)
      this.profile.tags.push(item);
    // reset search bar and suggestions
    this.suggests = [];
    this.searchbar.value = '';
    // update if we search more tags or not
    if (this.profile.tags.length >= 5)
        this.searchingTags = false;
    else
        this.searchingTags = true;
  }

  removeTags(event, item) {
    let index = this.profile.tags.indexOf(item);
    if (index != -1)
      this.profile.tags.splice(index, 1);
    this.data.set("user.profile", JSON.stringify(this.profile));

    if (this.profile.tags.length < 5) {
       this.searchingTags = true;
    }
  }

  chooseAvatar() {
    let prompt = Alert.create({
      title: 'Change avatar',
      message: "Choose avatar from an url",
      inputs: [
        {
          name: 'url',
          placeholder: 'http://website.com/myavatar.png'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {}
        },
        {
          text: 'Save',
          handler: data => {
            if (data.url.length == 0)
              return ;
            else
              this.profile.avatar = data.url;
          }
        }
      ]
    });
    this.nav.present(prompt);
  }

}
