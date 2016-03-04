import {IonicApp, Page, NavController, Events, Alert} from 'ionic-angular';
import {HomePage} from '../home/home';
import {SignupPage} from '../signup/signup';
import {HttpService} from '../../providers/http-service';
import {FormBuilder, Validators, FORM_BINDINGS, ControlGroup} from 'angular2/common'

@Page({
  providers: [HttpService],
  templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {

  nav: any;
  events: any;
  http: any;

  login = {};
  submitted = false;
  loginForm: ControlGroup;

  constructor(formBuilder: FormBuilder, nav: NavController, events: Events, http: HttpService) {
    this.nav = nav;
    this.events = events;
    this.http = http;

    this.loginForm = formBuilder.group({
            username: ["", Validators.required],
            passwordRetry: formBuilder.group({
                password: ["", Validators.required]
            })
        });
  }

  onLogin() {
    this.submitted = true;

    if (this.loginForm.valid) {
      // build the request from the form
      let request = {};
        request['username'] = this.loginForm.value.username;
        request['password'] = this.loginForm.value.password;
        request['accessToken'] = '';
        request['loginMethod'] = 'STANDALONE';

        // make the request
        this.http.makeBackendRequest('POST', 'auth/login', request, this.onLoginSuccess, this.onLoginError, false);
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
