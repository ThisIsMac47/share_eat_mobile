import {Page, NavController, Events, Alert} from 'ionic/ionic';
import {HomePage} from '../home/home';
import {DataService} from '../../providers/data-service';
import {Http, Headers, RequestOptions} from 'angular2/http';
import {Observable}       from 'rxjs/Observable';
import 'rxjs/Rx'

import {UserRegisterRequest} from '../../models/request/UserRegisterRequest';
import {LoginMethod} from '../../models/request/UserLoginRequest';
import {UserLoginResponse} from '../../models/response/UserLoginResponse';


@Page({
  templateUrl: 'build/pages/signup/signup.html'
})
export class SignupPage {

  

  constructor(nav: NavController, data: DataService, events: Events, http: Http) {
    this.nav = nav;
    this.data = data;
    this.http = http;
    this.events = events;

    this.signup = {};
    this.submitted = false;
    this.url = 'http://localhost:1337/localhost:4242';
  }

  onSignup(form) {
    this.submitted = true;

    if (form.valid) {

      if (form.form._value.password !== form.form._value.passwordconfirm) {
        this.showAlert("Inscription non valide", "Les deux mot de passes  ne sont pas identiques.", "Ok");
        return ;
      }

      let request = {};
      request['mail'] = form.form._value.username;
      request['password'] = form.form._value.password;

      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });

      console.log(JSON.stringify(request));

      this.http.post(this.url + '/auth/register', JSON.stringify(request), options)
                    .toPromise()
                    .then(response => response.json())
                    .then((response) => this.onRegisterSuccess(response),
                     (errorMessage) => this.onRegisterError(errorMessage));
    }
  }

  private onRegisterSuccess(response) {
    console.log(JSON.stringify(response));
    this.data.set('isLogged', true);
    this.data.set('user.token', response.accessToken);
    this.data.set('user.id', response.id);
    this.data.set('user.auth', response.id + ':' + response.accessToken);

    this.events.publish('user:login');

    // Là faut montrer l'alert et après switch de page mais sa marche
    this.nav.setRoot(HomePage);

    /*let alert = Alert.create({
      title: "Connexion réussi",
      subTitle:  "Merci d'utiliser notre application, bon networking !",
      buttons: [{
          text: 'Ok',
          handler: () => {
          }]
    });
    this.nav.present(alert);
    //this.showAlert("Inscriptoin réussi", "Merci d'utiliser notre application, bon networking !", "Ok");*/
  }

  private onRegisterError(errorMessage) {
    let code = errorMessage.status;
    if (typeof code == "undefined")
        this.showAlert("Serveur non-accessible", "Notre serveur n'a pas répondu, veuillez réessayez.", "Ok");
    else if (code == "404")
        this.showAlert("Erreur d'Authentification", "Aucun utilisateur trouvé pour cet email.", "Ok");
    else if (code == "500")
        this.showAlert("Erreur interne", "Nous avons eu un problème, veuillez réessayez.", "Ok");
    else if (code == "403")
        this.showAlert("Erreur d'Authentification", "Le mot-de-passe est incorrect.", "Ok");
  }

  private showAlert(title, subTitle, button) {
    let alert = Alert.create({
      title: title,
      subTitle: subTitle,
      buttons: [button]
    });
    this.nav.present(alert);
  }

}
