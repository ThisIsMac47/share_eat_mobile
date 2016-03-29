import {Injectable} from 'angular2/core';
import {Http, Headers, Response, RequestOptions} from 'angular2/http';
import {Events} from 'ionic-angular';
import {Observable}       from 'rxjs/Observable';
import 'rxjs/Rx'
import {DataService} from './data-service';
import {Alert, NavController} from 'ionic-angular';

@Injectable ()
export class HttpService {

    //url = 'http://localhost:1337/localhost:4242/';
    //url = 'http://localhost:1337/shareeat.vmarchaud.fr:8080/';
    url = 'api/';
    static authToken: any;

    constructor(public http: Http, public event:Events, public data: DataService) {
      this.http = http;
      this.event = event;
      this.data = data;

      // if we get authToken, keep it or wait for a login event to retrieve it.
      data.get('user.auth').then((data) => {
        if (data)
          HttpService.authToken = data;
        else {
          event.subscribe('user.login', (response) => {
              HttpService.authToken = response["0"].id + ':' + response["0"].accessToken;
          });
        }
      });
    }

    /**
    *   A super method to make http request to our backend
    *
    *   method : POST / GET / PUT / DELETE
    *   route : /example/route
    *   request : object that you wanna post/put
    *   successCallback
    *   errorCallback
    *   authNeeded : if the Authorization header is required
    */
    makeBackendRequest(method, route, request, successCallback, errorCallback, authNeeded) {
      let headers: any;

      if (authNeeded) {
          headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': HttpService.authToken});
      }
      else {
        headers = new Headers({ 'Content-Type': 'application/json'});
      }
      let options = new RequestOptions({ headers: headers });

      console.log(method + " request on : " + this.url + route);
      if (method !== 'GET')
        console.log("content : " + JSON.stringify(request));

      let httpRequest: any;
      if (method === 'GET')
        httpRequest = this.http.get(this.url + route, options);
      else if (method === 'PUT')
        httpRequest = this.http.put(this.url + route, JSON.stringify(request), options);
      else if (method === 'POST')
        httpRequest = this.http.post(this.url + route, JSON.stringify(request), options);
      else if (method === 'DELETE')
        httpRequest = this.http.delete(this.url + route, options);

        httpRequest.toPromise()
                    .then(response => response.json())
                    .then((response) => {
                      console.log("response got : " + JSON.stringify(response));
                      successCallback(response);
                    },
                     (err) => {
                       console.log("got an error : " + JSON.stringify(err));
                       errorCallback(err);
                     });

    }

      static showAlert(nav: NavController, title, subTitle, button) {
        let alert = Alert.create({
          title: title,
          subTitle: subTitle,
          buttons: [button]
        });
        nav.present(alert);
      }

}
