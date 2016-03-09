import {App, IonicApp, Platform, MenuController, Events} from 'ionic-angular';
import {HomePage} from './pages/home/home';
import {LoginPage} from './pages/login/login';
import {TutorialPage} from './pages/tutorial/tutorial';
import {SettingsPage} from './pages/settings/settings';

import {DataService} from './providers/data-service';
import {HttpService} from './providers/http-service';

@App({
  templateUrl: 'build/app.html',
  providers: [HttpService, DataService],
  config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
class MyApp {

  rootPage: any;
  pages: Array<{title: string, component: any, icon: any}>;


  constructor(public app: IonicApp,public platform: Platform, public menu: MenuController, public events: Events, public data: DataService, public http: HttpService) {
    this.app = app;
    this.menu = menu;
    this.events = events;

    // set our app's pages
    this.pages = [
      { title: 'Accueil', component: HomePage, icon: 'calendar'},
      { title: 'Friends', component: HomePage, icon: 'log-in'},
      { title: 'Settings', component: SettingsPage, icon: 'person-add'},
      { title: 'Connexion', component: LoginPage, icon: 'log-in'},
    ];

    // get if user is logged, go the home, if not show login page OR tutorial
    data.get('isLogged').then((isLogged) => {
      if (!isLogged) {
          data.get('hasDoneTutorial').then((done) => {
          if (!done)
            app.getComponent('nav').setRoot(TutorialPage);
          else
            app.getComponent('nav').setRoot(LoginPage);
        });
      }
      else {
        this.pages[3].title = "Deconnexion";
        app.getComponent('nav').setRoot(HomePage);
      }
    });

    // Register Events
    events.subscribe('user.login', (response) => {
      this.pages[3].title = "Deconnexion";
    });

    events.subscribe('user.logout', () => {
      this.pages[3].title = "Connexion";
    });

  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    let nav = this.app.getComponent('nav');
    if (page.title == 'Deconnexion') {
      this.events.publish('user.logout');
    }
    nav.setRoot(page.component);
  }

  updateSideMenuItems(isLogged) {
    if (isLogged) {
      this.findMenuItemByTitle('Connexion').title = 'Deconnexion';
    } else {
      let tab = this.findMenuItemByTitle('Deconnexion');
      if (tab) {
          tab.title = 'Connexion';
      }
    }
  }

  findMenuItemByTitle(title) {
    return this.pages.find((menuItem) => {
      return menuItem.title === title
    })
  }
}
