import {IonicApp, Page, NavController, Events, MenuController} from 'ionic-angular';
import {HomePage} from '../home/home';
import {SignupPage} from '../signup/signup';
import {FormBuilder, Validators, FORM_BINDINGS, ControlGroup} from 'angular2/common'

import {HttpService} from '../../providers/http-service';
import {ValidationService} from '../../providers/validator-service';

@Page({
  providers: [HttpService, ValidationService],
  templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {

  loginForm: ControlGroup;

  constructor(formBuilder: FormBuilder, public nav: NavController, public events: Events, public http: HttpService, public menu: MenuController) {
    this.nav = nav;
    this.events = events;
    this.http = http;

    // Build login form with validators
    this.loginForm = formBuilder.group({
            username: ["", Validators.compose([Validators.required, ValidationService.emailValidator])],
            password: ["", Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      // build the request from the form
        let request = {};
        request['username'] = this.loginForm.value.username;
        request['password'] = this.loginForm.value.password;
        request['accessToken'] = '';
        request['loginMethod'] = 'STANDALONE';

        // make the request
        this.http.makeBackendRequest('POST', 'auth/login', request,
        (response) => {
          // publish event to update the database
          this.events.publish('user.login', response);

          // show alert to inform user and redirect him to Home
          HttpService.showAlert(this.nav, "Connexion réussi", "Merci d'utiliser notre application, bon networking !", {
              text: 'Ok',
              handler: () => {
                this.nav.setRoot(HomePage);
              }
          });
        }, (errorMessage) => {
          let code = errorMessage.status;
          if (typeof code == "undefined")
              HttpService.showAlert(this.nav, "Serveur non-accessible", "Notre serveur n'a pas répondu, veuillez réessayez", "Ok");
          else if (code == 404)
              HttpService.showAlert(this.nav, "Erreur d'Authentification", "Aucun utilisateur trouvé pour cet email.", "Ok");
          else if (code == 502 || code == 500)
              HttpService.showAlert(this.nav, "Serveur non-accessible", "Notre serveur n'a pas répondu, veuillez réessayez", "Ok");
          else if (code == 403)
              HttpService.showAlert(this.nav, "Erreur d'Authentification", "Le mot-de-passe est incorrect.", "Ok");
        }, false);
    }
  }

  onSignup() {
    this.nav.push(SignupPage);
  }

  onPageDidEnter() {
    this.menu.enable(false);
    this.menu.swipeEnable(false);
  }

}
