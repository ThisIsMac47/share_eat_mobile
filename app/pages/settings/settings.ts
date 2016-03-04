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
  http: any;
  nav: any;
  data: any;
  profile : any;

  constructor(nav: NavController, data: DataService, http: HttpService, formBuilder: FormBuilder) {
    this.http = http;
    this.nav = nav;
    this.data = data;
    this.profile = new Profile(null);

    this.profileForm = formBuilder.group({
            name: ["", Validators.required],
            mail: ["", Validators.required],
            age: ["", Validators.required],
            phone: ["", Validators.required],
            school: ["", Validators.required],
            job: ["", Validators.required],
            description: ["", Validators.required]
    });

     // Get user profile if not already know
     data.get('user.profile').then((data) => {
        if (data)
          this.profile = new Profile(JSON.parse(data));
        else
            this.getUserProfile();
     });
  }

  getUserProfile() {
    this.http.makeBackendRequest('GET', 'me/profile', null, this.onQuerySuccess, this.onQueryError, true);
  }

  onQuerySuccess(response) {
    this.data.set("user.profile", JSON.stringify(response.datas));
    this.profile = response.datas;
  }

  onQueryError(errorMessage) {
    let code = errorMessage.status;
    if (typeof code == "undefined")
        this.showAlert("Serveur non-accessible", "Notre serveur n'a pas répondu, veuillez réessayez", "Ok");
    else if (code == "500")
        this.showAlert("Serveur non-accessible", "Notre serveur n'a pas répondu, veuillez réessayez", "Ok");
  }

  onProfileUpdate() {
      let datas = {};
      console.log(JSON.stringify(this.profile));
      console.log(JSON.stringify(this.profileForm.value));

      if (!_.isEqual(this.profileForm.value.name, this.profile.name))
        datas['name'] = this.profileForm.value.name;

      if (!_.isEqual(this.profileForm.value.mail, this.profile.mail))
        datas['mail'] = this.profileForm.value.mail;

      if (!_.isEqual(this.profileForm.value.age, this.profile.age))
        datas['age'] = this.profileForm.value.age;

      if (!_.isEqual(this.profileForm.value.phone, this.profile.phone))
        datas['phone'] = this.profileForm.value.phone;

      if (!_.isEqual(this.profileForm.value.school, this.profile.school))
        datas['school'] = this.profileForm.value.school;

      if (!_.isEqual(this.profileForm.value.job, this.profile.job))
        datas['job'] = this.profileForm.value.job;

      if (!_.isEqual(this.profileForm.value.description, this.profile.description))
        datas['description'] = this.profileForm.value.description;

      let request = { 'datas' : datas };

      this.http.makeBackendRequest('POST', 'me/update', request, this.onUpdateSuccess, this.onUpdateError, true);
  }


  onUpdateSuccess(response) {
      this.showAlert("Success", "Your profile has been successfuly updated", "Ok");
      this.getUserProfile();
  }

  onUpdateError(errorMessage) {
    let code = errorMessage.status;
    if (typeof code == "undefined")
        this.showAlert("Serveur non-accessible", "Notre serveur n'a pas répondu, veuillez réessayez", "Ok");
    else if (code == "500")
        this.showAlert("Serveur non-accessible", "Notre serveur n'a pas répondu, veuillez réessayez", "Ok");
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
