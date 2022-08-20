import React from 'react';
import {SettingsPane, SettingsPage, SettingsContent, SettingsMenu} from 'react-settings-pane'


export default class Dashboard extends React.Component {
  settings = {
    'mysettings.general.name': 'Dennis Stücken',
    'mysettings.general.color-theme': 'purple',
    'mysettings.general.email': 'dstuecken@react-settings-pane.com',
    'mysettings.general.picture': 'earth',
    'mysettings.profile.firstname': 'Dennis',
    'mysettings.profile.lastname': 'Stücken',
  };

  // Define your menu
  menu = [
    {
      title: 'General',          // Title that is displayed as text in the menu
      url: '/settings/general'  // Identifier (url-slug)
    },
    {
      title: 'Profile',
      url: '/settings/profile'
    }
  ];

  // Define one of your Settings pages
  dynamicOptionsForProfilePage = [
    {
      key: 'mysettings.general.email',
      label: 'E-Mail address',
      type: 'text',
    },
    {
      key: 'mysettings.general.password',
      label: 'Password',
      type: 'password',
    }
  ];

  // Save settings after close
  leavePaneHandler(wasSaved: boolean, newSettings: any, oldSettings: any): void {
    // "wasSaved" indicates wheather the pane was just closed or the save button was clicked.
    if (wasSaved && newSettings !== oldSettings) {
      // do something with the settings, e.g. save via ajax.
    }
  };

  settingsChanged(changedSettings: any): void {
    // this is triggered onChange of the inputs
  };

  render() {
    return (
      <SettingsPane items={this.menu} index="/settings/general" settings={this.settings} onPaneLeave={this.leavePaneHandler}>
        <SettingsMenu headline="General Settings" />
        <SettingsContent closeButtonClass="secondary" saveButtonClass="primary" header={true}>
          <SettingsPage handler="/settings/general">
            <fieldset className="form-group">
              <label for="profileName">Name: </label>
              <input type="text" className="form-control" name="mysettings.general.name" placeholder="Name" id="general.ame" onChange={this.settingsChanged} defaultValue={this.settings['mysettings.general.name']} />
            </fieldset>
            <fieldset className="form-group">
              <label for="profileColor">Color-Theme: </label>
              <select name="mysettings.general.color-theme" id="profileColor" className="form-control" defaultValue={this.settings['mysettings.general.color-theme']}>
                <option value="blue">Blue</option>
                <option value="red">Red</option>
                <option value="purple">Purple</option>
                <option value="orange">Orange</option>
              </select>
            </fieldset>
          </SettingsPage>
          <SettingsPage handler="/settings/profile" options={this.dynamicOptionsForProfilePage} />
        </SettingsContent>
      </SettingsPane>
    );
  }
}
