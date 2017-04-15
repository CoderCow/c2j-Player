import { Exception } from './Exception';

enum VAlignment { Center, Left, Right }

// Some types are used so extensively that it'd be a burden to import them in every file, so
// we're declaring them in the global context and thus have to define them on window.
// 
// See globals.d.ts for their declaration.
(<any>window).Exception = Exception;
(<any>window).VAlignment = VAlignment;

// Some dark magic in order to allow TypeScript to resolve the video.js classes so that we can
// inherit from them.
(<any>window).VideoJSComponent = videojs.getComponent('Component');
(<any>window).VideoJSButton = videojs.getComponent('Button');
(<any>window).VideoJSMenuButton = videojs.getComponent('MenuButton');
(<any>window).VideoJSMenuItem = videojs.getComponent('MenuItem');
(<any>window).VideoJSMenu = videojs.getComponent('Menu');