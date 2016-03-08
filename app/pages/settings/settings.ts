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
            description: [this.profile.description, Validators.required]
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
    this.http.makeBackendRequest('GET', 'me/profile', null, (response) => {
      this.data.set("user.profile", JSON.stringify(response.datas));
      this.profile = new Profile(response.datas);
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

      let datas = {};
      datas['name'] = this.profile.name;
      datas['mail'] = this.profile.mail;
      datas['age'] = this.profile.age;
      datas['phone'] = this.profile.phone;
      datas['school'] = this.profile.school;
      datas['job'] = this.profile.job;
      datas['description'] = this.profile.description;
      datas['avatar'] = this.profile.avatar;
      datas['tags'] = this.profile.tags;

      let request = { 'datas' : datas };

      this.http.makeBackendRequest('POST', 'me/update', request,
      response => {
        HttpService.showAlert(this.nav, "Success", "Your profile has been successfuly updated", "Ok");
        this.profile = datas;
        this.data.set("user.profile", JSON.stringify(datas));
      }, errorMessage => {
        let code = errorMessage.status;
        if (typeof code == "undefined")
            HttpService.showAlert(this.nav, "Serveur non-accessible", "Notre serveur n'a pas répondu, veuillez réessayez", "Ok");
        else if (code == "500")
            HttpService.showAlert(this.nav, "Serveur non-accessible", "Notre serveur n'a pas répondu, veuillez réessayez", "Ok");
      }, true);
  }

}
