import {IonicApp, Page, NavController, Events, Alert} from 'ionic-angular';
import {HomePage} from '../home/home';
import {SignupPage} from '../signup/signup';
import {FormBuilder, Validators, FORM_BINDINGS, ControlGroup} from 'angular2/common';
import {HttpService} from '../../providers/http-service';

@Page({
  viewBindings: [FORM_BINDINGS],
  providers: [HttpService],
  templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {

  nav: any;
  events: any;
  http: any;

  constructor(nav: NavController, events: Events, http: HttpService) {
    this.nav = nav;
    this.events = events;
    this.http = http;

    this.login = {};
    this.submitted = false;
  }

  onLogin(form) {
    this.submitted = true;

    if (form.valid) {
      // build the request from the form
      let request = {};
        request['username'] = form.form._value.username;
        request['password'] = form.form._value.password;
        request['accessToken'] = '';
        request['loginMethod'] = 'STANDALONE';

        // make the request
        http.makeBackendRequest('POST', 'auth/login', request, onLoginSuccess, onLoginError, false);
      }
  }

    onLoginSuccess(response) {
      // publish event to update the database
      this.events.publish('user:login', response);

      // show alert to inform user and redirect him to Home
      this.showAlert("Connexion réussi", "Merci d'utiliser notre application, bon networking !", {
          text: 'Ok',
          handler: () => {
            this.nav.setRoot(HomePage);
          }
      });
    }

  onLoginError(errorMessage) {
    let code = errorMessage.status;
    if (typeof code == "undefined")
        this.showAlert("Serveur non-accessible", "Notre serveur n'a pas répondu, veuillez réessayez", "Ok");
    else if (code == "404")
        this.showAlert("Erreur d'Authentification", "Aucun utilisateur trouvé pour cet email.", "Ok");
    else if (code == "502")
        this.showAlert("Serveur non-accessible", "Notre serveur n'a pas répondu, veuillez réessayez", "Ok");
    else if (code == "403")
        this.showAlert("Erreur d'Authentification", "Le mot-de-passe est incorrect.", "Ok");
  }

  showAlert(title, subTitle, button) {
    let alert = Alert.create({
      title: title,
      subTitle: subTitle,
      buttons: [button]
    });
    this.nav.present(alert);
  }

  onSignup() {
    this.nav.setRoot(SignupPage);
  }
  
}
