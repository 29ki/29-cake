import React from 'react';
import DrawerMenu from './DrawerMenu';

import * as Buttons from '../../components/Buttons/Buttons.library';
import * as Cards from '../../components/Cards/Cards.library';
import * as Icons from '../../components/Icons/Icons.library';
import * as Typography from '../../components/Typography/Typography.library';
import * as UiSettings from '../../constants/UiSettings.library';
import * as Session from '../../../routes/Session/components/Session.library';
import * as Screen from '../../components/Screen/Screen.library';
import * as Modals from '../../components/Modals/Modals.library';
import * as ActionList from '../../components/ActionList/ActionList.library';
import * as ProfilePicture from '../../components/User/ProfilePicture.library';

export type ComponentLibrary = {[key: string]: React.ComponentType};
export type ComponentList = {[key: string]: Array<ComponentLibrary>};

const menuItems: ComponentList = {
  Buttons: [Buttons],
  Cards: [Cards],
  Icons: [Icons],
  ActionList: [ActionList],
  Modals: [Modals],
  Typography: [Typography],
  Screen: [Screen],
  SessionComponents: [Session],
  ProfilePicture: [ProfilePicture],
  UiSettings: [UiSettings],
};

const UiLibRootComponent = () => <DrawerMenu items={menuItems} />;

export default UiLibRootComponent;
