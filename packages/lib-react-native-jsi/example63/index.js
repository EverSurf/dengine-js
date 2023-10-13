/**
 * @format
 */

import App from './App';
import {AppRegistry} from 'react-native';
import {TonClient} from '@eversdk/core';
import {DebotClient} from '@eversurf/dengine';
import {name as appName} from './app.json';
import {libReactNativeJsi} from '@eversdk/lib-react-native-jsi';
import {libReactNativeJsi as libDengineJsi} from '@eversurf/dengine-rn-jsi';

// eslint-disable-next-line react-hooks/rules-of-hooks
TonClient.useBinaryLibrary(libReactNativeJsi);
DebotClient.useBinaryLibrary(libDengineJsi);

AppRegistry.registerComponent(appName, () => App);
