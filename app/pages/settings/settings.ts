import {Page, Modal, NavController, Alert} from 'ionic/ionic';
import {Http, Headers, RequestOptions} from 'angular2/http';
import {Observable}       from 'rxjs/Observable';
import {DataService} from '../../providers/data-service';
import {Profile} from '../../models/profile';
import 'rxjs/Rx'
import {isEqual} from 'lodash';
import {FormBuilder, Validators, FORM_BINDINGS, ControlGroup} from 'angular2/common'

@Page({
  viewBindings: [FORM_BINDINGS],
  templateUrl: 'build/pages/settings/settings.html'
})

export class SettingsPage {

  profileForm: ControlGroup;

  constructor(nav: NavController, data: DataService, http: Http, formBuilder: FormBuilder) {
    this.http = http;
    this.nav = nav;
    this.data = data;
    this.url = 'http://localhost:1337/localhost:4242';
    this.pageTitle = "Settings";
    this.form = {};

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
     this.data.get('user.profile').then((data) => {
        if (data) {
          this.profile = new Profile(JSON.parse(data));
          this.data.get('user.auth').then((data) => { this.userAuth = data; };
        }
        else {
          this.data.get('user.auth').then((data) => {
            this.userAuth = data;
            this.getUserProfile();
          }
        }
     }
  }

  getUserProfile() {
    let headers = new Headers({ 'Content-Type': 'application/json', "Authorization" : this.userAuth});
    let options = new RequestOptions({ headers: headers });

    this.http.get(this.url + '/me/profile', options)
                  .toPromise()
                  .then(response => response.json())
                  .then((response) => this.onQuerySuccess(response),
                   (errorMessage) => this.onQueryError(errorMessage));
  }

  showAlert(title, subTitle, button) {
    let alert = Alert.create({
      title: title,
      subTitle: subTitle,
      buttons: [button]
    });
    this.nav.present(alert);
  }

  onQuerySuccess(response) {
    console.log(JSON.stringify(response.datas));
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
      console.log("form : " + JSON.stringify(this.profileForm.value));

      let datas = {};
      if (!isEqual(this.profileForm.value.name, this.profile.name)) 
        datas['name'] = this.profileForm.value.name;

      if (!isEqual(this.profileForm.value.mail, this.profile.mail)) 
        datas['mail'] = this.profileForm.value.mail;
      
      if (!isEqual(this.profileForm.value.age, this.profile.age)) 
        datas['age'] = this.profileForm.value.age;

      if (!isEqual(this.profileForm.value.phone, this.profile.phone)) 
        datas['phone'] = this.profileForm.value.phone;

      if (!isEqual(this.profileForm.value.school, this.profile.school)) 
        datas['school'] = this.profileForm.value.school;
      
      if (!isEqual(this.profileForm.value.job, this.profile.job)) 
        datas['job'] = this.profileForm.value.job;

      if (!isEqual(this.profileForm.value.description, this.profile.description)) 
        datas['description'] = this.profileForm.value.description;

      let headers = new Headers({ 'Content-Type': 'application/json', "Authorization" : this.userAuth});
      let options = new RequestOptions({ headers: headers });
      let request = { 'datas' : datas };
      
      console.log("request : " + JSON.stringify(request));

      this.http.post(this.url + '/me/update', JSON.stringify(request), options)
                    .toPromise()
                    .then(response => response.json())
                    .then((response) => this.onUpdateSuccess(response),
                     (errorMessage) => this.onUpdateError(errorMessage));
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
}
