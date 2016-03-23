import {Page, NavController, Events, MenuController} from 'ionic-angular';
import {SettingsPage} from '../settings/settings';
import {FormBuilder, Validators, FORM_BINDINGS, ControlGroup} from 'angular2/common'

import {DataService} from '../../providers/data-service';
import {HttpService} from '../../providers/http-service';
import {ValidationService} from '../../providers/validator-service';


@Page({
  providers: [HttpService, ValidationService],
  templateUrl: 'build/pages/signup/signup.html'
})
export class SignupPage {

    signupForm: ControlGroup;

  constructor(formBuilder: FormBuilder, public nav: NavController, public events: Events, public http: HttpService, public menu: MenuController) {
    this.nav = nav;
    this.http = http;
    this.events = events;

    // Build signupForm with all validators
    this.signupForm = formBuilder.group({
            username: ["", Validators.compose([Validators.required, ValidationService.emailValidator])],
            passwords: formBuilder.group({
                password: ["", Validators.compose([Validators.required, ValidationService.passwordValidator])],
                passwordconfirm: ["", Validators.compose([Validators.required, ValidationService.passwordValidator])]
            }, ValidationService.matchingPasswords('password', 'confirmpassword'))
        });
  }

  onSignup() {
    if (this.signupForm.valid) {
      // build the request
      let request = { mail: this.signupForm.value.username, password: this.signupForm.value.passwords.password};
      // make the request
      this.http.makeBackendRequest('POST', 'auth/register', request,
      (response) => {
        // publish event to update the database
        this.events.publish('user.login', response);

        // show alert to inform user and redirect him to Home
        HttpService.showAlert(this.nav, "Inscription réussi", "Veuillez complétez votre profil dés maintenant !", {
            text: 'Ok',
            handler: () => {
              this.nav.setRoot(SettingsPage);
            }
        });
      }, (errorMessage) => {
        // in case of error
        let code = errorMessage.status;
        if (typeof code == "undefined")
            HttpService.showAlert(this.nav, "Serveur non-accessible", "Notre serveur n'a pas répondu, veuillez réessayez.", "Ok");
        else
            HttpService.showAlert(this.nav, "Erreur code : " + code, "Un problème est survenu.", "Ok");
      }, false);
    }
  }
}
