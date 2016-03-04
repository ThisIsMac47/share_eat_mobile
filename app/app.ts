import {App, IonicApp, Platform, MenuController, Events} from 'ionic-angular';
import {HomePage} from './pages/home/home';
import {ListPage} from './pages/list/list';
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


  constructor(
    private app: IonicApp,
    private platform: Platform,
    private menu: MenuController,
    private events: Events
  ) {

    // set our app's pages
    this.pages = [
      { title: 'Accueil', component: HomePage, icon: 'calendar'},
      { title: 'Friends', component: HomePage, icon: 'log-in'},
      { title: 'Settings', component: SettingsPage, icon: 'person-add'},
      { title: 'Connexion', component: LoginPage, icon: 'log-in'},
    ];

    // Register Events
    events.subscribe('user:login', () => {
      this.updateSideMenuItems(true);
    });

    events.subscribe('user:signup', () => {
      this.updateSideMenuItems(true);
    });

    events.subscribe('user:logout', () => {
      this.updateSideMenuItems(false);
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    let nav = this.app.getComponent('nav');
    if (page.title == 'Deconnexion') {
      nav.setRoot(page.component)
    } else {
      nav.setRoot(page.component);
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
