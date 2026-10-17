import { registerRootComponent } from 'expo';

import Root from './src/web/Root';

// registerRootComponent calls AppRegistry.registerComponent('main', () => Root);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately. Root is just App on phones; on a
// computer's web browser it shows App inside a phone outline.
registerRootComponent(Root);
