import {IonicApp, Page, NavController, Events, Alert} from 'ionic-angular';
import {HomePage} from '../home/home';
import {SignupPage} from '../signup/signup';
import {DataService} from '../../providers/data-service';
import {Http, Headers, RequestOptions} from 'angular2/http';
import {Observable}       from 'rxjs/Observable';
import 'rxjs/Rx'

import {UserLoginRequest} from '../../models/request/UserLoginRequest';
import {LoginMethod} from '../../models/request/UserLoginRequest';
import {UserLoginResponse} from '../../models/response/UserLoginResponse';

@Page({
  templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {
  constructor(nav: NavController,  data: DataService, events: Events, http: Http) {
    this.nav = nav;
    this.data = data;
    this.http = http;
    this.events = events;

    this.login = {};
    this.submitted = false;
    this.url = 'http://localhost:1337/localhost:4242';
  }

  onLogin(form) {
    this.submitted = true;

    if (form.valid) {
      UserLoginRequest request;
      request.username = form.form._value.username;
      request.password = form.form._value.password;
      request.accessToken = '';
      request.loginMethod = 'STANDALONE';

      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });

      console.log(JSON.stringify(request));

      this.http.post(this.url + '/auth/login', JSON.stringify(request), options)
                    .toPromise()
                    .then(response => response.json())
                    .then((response) => this.onLoginSuccess(response),
                     (errorMessage) => this.onLoginError(errorMessage));
  }

    void onLoginSuccess(response) {
      console.log(JSON.stringify(response));
      this.data.set('isLogged', true);
      this.data.set('user.token', response.accessToken);
      this.data.set('user.id', response.id);
      this.data.set('user.auth', response.id + ':' + response.accessToken);

      this.events.publish('user:login');

      let alert = Alert.create({
        title: "Connexion réussi",
        subTitle:  "Merci d'utiliser notre application, bon networking !",
        buttons: [{
            text: 'Ok',
            handler: () => {
              this.showAlert("Connexion réussi", "Merci d'utiliser notre application, bon networking !", button);
            }]
      });
      this.nav.present(alert);
  }

  void onLoginError(errorMessage) {
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

  void showAlert(title, subTitle, button) {
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

  onPageWillEnter() {
    showBackButton(false);
  }
}
