import {Injectable} from 'angular2/core';
import {Storage, SqlStorage, Events} from 'ionic-angular';

@Injectable()
export class DataService {
  storage: any;
  events: any;

  constructor(events: Events) {
    this.storage = new Storage(SqlStorage);
    this.events = events;

    // Register the logout event (clear database of all user data)
    events.subscribe('user.logout', () => {
      this.storage.set('isLogged', false);
      this.storage.remove('user.token');
      this.storage.remove('user.id');
      this.storage.remove('user.auth');
      this.storage.remove('user.profile');
    });

    // Register the login event (put all data needed in database)
    events.subscribe('user.login', (response) => {
      this.storage.set('isLogged', true);
      this.storage.set('user.token', response["0"].accessToken);
      this.storage.set('user.id', response["0"].id);
      this.storage.set('user.auth',response["0"].id + ':' + response["0"].accessToken);
    });
  }

  get(key) {
    return this.storage.get(key).then((value) => {
      return value;
    });
  }

  set(key, value) {
    this.storage.set(key, value);
  }

  remove(key) {
    return this.storage.remove(key);
  }

}
