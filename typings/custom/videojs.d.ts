// Type definitions for Video.js
// Project: https://github.com/zencoder/video-js
// Definitions by: Vincent Bortone <https://github.com/vbortone/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
//
// Edited by: David-Kay Posmyk

// The Video.js API allows you to interact with the video through Javascript, whether the browser is playing the video through HTML5 video, Flash, or any other supported playback technologies.

interface VideoJSOptions {
	techOrder?: string[]; // tech names, default: ['html5','flash']
	sourceOrder?: string[];
	html5?: Object;
	flash?: Object;
	width?: number;
	height?: number;
	aspectRatio?: string; // value should be like '16:9'
	fluid?: boolean; // true will add the 'vjs-fluid' class to the video element
	defaultVolume?: number;
	inactivityTimeout?: number; // in milliseconds
	playbackRates: number[]; // Add playback rate selection by adding rates, like: [0.5, 1, 1.5, 2]
	children?: Object;
	controls?: boolean;
	src?: any; // NOT string|string[]|Object
	autoplay?: boolean;
	loop?: boolean;
	muted?: boolean;
	preload?: string; // 'auto', ??
	language?: string; // default is 'lang' attribute value of the document's <html> tag or the browser language as fallback.
	languages?: string[];
	poster?: string;
	plugins?: any[];
	starttime?: number; // in seconds
	notSupportedMessage: string; // message to show when no appropriate tech / source was found. videojs will try to localize this string by matching it to the language tables. default: 'No compatible source was found for this video.'
}

interface VideoJSSource {
	type: string;
	src: string;
}

interface VideoJSPlayer extends VideoJSComponent {
	controlBar: any;
	options_: VideoJSOptions;

	/**
	 * player's constructor function
	 * @param {Element} tag        The original video tag used for configuring options
	 * @param {Object=} options    Player options
	 * @param {Function=} ready    Ready callback function
	 */
	new(tag: Element, options: any, ready: () => void): VideoJSPlayer;

	/**
	 * Add/remove the vjs-fluid class.
	 *
	 * @param bool Value of true adds the class, value of false removes the class.
	 */
  fluid(bool: boolean): void;

	/**
	 * Set the aspect ratio. This will also set fluid mode if not set currently.
	 *
	 * @param ratio Aspect ratio for player
	 */
  aspectRatio(ratio: string): void;

	/**
	 * Get the aspect ratio
	 *
	 * @return aspectRatio
	 */
  aspectRatio(): string;

	/**
	 * Return a reference to the current tech.
	 * It will only return a reference to the tech if given an object with the
	 * `IWillNotUseThisInPlugins` property on it. This is try and prevent misuse
	 * of techs by plugins.
	 *
	 * @param safety
	 * @return The Tech.
	 */
  tech(safety: {IWillNotUseThisInPlugins: any}): void;

	/**
	 * Sets whether or not the user is "scrubbing". Scrubbing is when the user
	 * has clicked the progress bar handle and is dragging it along the progress bar.
	 *
	 * @param  isScrubbing True/false the user is scrubbing
	 * @return The player when setting
	 */
  scrubbing(isScrubbing: boolean): VideoJSPlayer;

	/**
	 * Returns whether or not the user is "scrubbing". Scrubbing is when the user
	 * has clicked the progress bar handle and is dragging it along the progress bar.
	 *
	 * @return The scrubbing status when getting
	 */
  scrubbing(): boolean;

	play(): VideoJSPlayer;
	pause(): VideoJSPlayer;
	paused(): boolean;
	src(newSource: string): VideoJSPlayer;
	src(newSource: VideoJSSource): VideoJSPlayer;
	src(newSource: VideoJSSource[]): VideoJSPlayer;
	currentTime(seconds: number): VideoJSPlayer;
	currentTime(): number;
	videoWidth(): number;
	videoHeight(): number;
	language(language: string): VideoJSPlayer;
	language(): string;
	languages(): any[];
	toJSON(): any;
	createModal(content?: string|Element|any[]|(() => void), options?: any): any;

	/**
	 * Set the length in time of the video in seconds
	 *
	 * @param seconds Duration when setting
	 * @return The duration of the video in seconds when getting
	 */
	duration(seconds: number): VideoJSPlayer;

	/**
	 * Get the length in time of the video in seconds
	 * **NOTE**: The video must have started loading before the duration can be
	 * known, and in the case of Flash, may not be known until the video starts
	 * playing.
	 *
	 * @return The duration of the video in seconds.
	 */
	duration(): number;

	/**
	 * Calculates how much time is left.
	 * Not a native video element function, but useful.
	 *
	 * @return The time remaining in seconds.
	 */
  remainingTime(): number;

	buffered(): TimeRanges;
	bufferedPercent(): number;
	bufferedEnd(): number;
	volume(percentAsDecimal: number): VideoJSPlayer;
	volume(): number; // between 0 and 1
	muted(isMuted: boolean): VideoJSPlayer;
	muted(): boolean;
	isFullscreen(): boolean;
	supportsFullScreen(): boolean;
	requestFullScreen(): VideoJSPlayer;
	exitFullscreen(): VideoJSPlayer;
	enterFullWindow(): void;
	exitFullWindow(): void;

	/**
	 * @return 'probably','maybe', ''
	 */
	canPlayType(mimeType: string): string;
	selectSource(sources: any): any;
	reset(): VideoJSPlayer;
	currentSrc(): string;
	currentType(): string;
	preload(isPreload: boolean): VideoJSPlayer;
	preload(): boolean;
	autoplay(isAutoplay: boolean): VideoJSPlayer;
	autoplay(): boolean;
	loop(isLoop: boolean): VideoJSPlayer;
	loop(): boolean;
	poster(src: string): VideoJSPlayer;
	poster(): string;
	controls(hasControls: boolean): VideoJSPlayer;
	controls(): boolean;
	error(err: MediaError|string|number): VideoJSPlayer;
	ended(): boolean;
	seeking(): boolean;
	seekable(): boolean;
	userActive(isActive: boolean): VideoJSPlayer;
	userActive(): boolean;
	playbackRate(rate: number): VideoJSPlayer;
	playbackRate(): number;
	isAudio(isAudio: boolean): VideoJSPlayer;
	isAudio(): boolean;
	networkState(): number;
	readyState(): number;
	textTracks(): { [i: number]: VideoJSTextTrack; length: number };
	remoteTextTracks(): any[];
	remoteTextTrackEls(): HTMLTrackElement[];
	addTextTrack(kind: string, label: string, language: string): VideoJSTextTrack|boolean;
	addRemoteTextTrack(options: any): boolean;
	removeRemoteTextTrack(track: any): boolean;
	getCache(): any;
	reportUserActivity(event?: Event): void;
}

interface VideoJSTextTrack {
	kind: string; // 'subtitles'
	label: string;
	language: string;
	id: number;
	mode: string; // 'hidden', 'shown', 'disabled'
	cues: VideoJSTextTrackCueList;
	activeCues: VideoJSTextTrackCueList;

	addCue(cue: VTTCue): void;
	removeCue(cue: VTTCue): void;
}

interface VideoJSTextTrackCueList {
	length: number;

	getCueById(id: string): VTTCue;
}

interface VideoJSTextTrackSettings {
	backgroundOpacity: number;
  textOpacity: number;
  windowOpacity: number;
  edgeStyle: string;
  fontFamily: string;
  color: number[];
  backgroundColor: number[];
  windowColor: number[];
  fontPercent: number;
}

declare class VTTCue {
	public constructor(startTime: number, endTime: number, text: string);

	public id: string;
	public startTime: number;
	public endTime: number;
	public text: string;
	public region: VTTRegion;
	public pauseOnExit: boolean;
	public snapToLines: boolean;
	public line: number|string; // can also be 'auto'
	public position: number; // 0 - 100
	public positionAlign: string; // 'start', 'middle', 'end', 'left', 'right'
	public size: number; // 0 - 100
	public align: string; // 'start', 'middle', 'end', 'left', 'right'
	public lineAlign: string; // 'start', 'middle', 'end', 'left', 'right'
	public vertical: string; // can be '', 'lr', 'rl'
	public scroll: string; // can be '' or 'up'

	public getCueAsHTML(): Element;
}

declare class VTTRegion {
	public constructor();

	public width: number; // 0 - 100
	public height: number; // 0 - 100
	public lines: number;
	public regionAnchorX: number;
	public regionAnchorY: number;
	public viewportAnchorX: number;
	public viewportAnchorY: number;
	public scroll: string; // can be '' or 'up'
}

interface VideoJSComponentOptions {
	id?: number;
	el?: HTMLElement;
	name?: string;
	initChildren?: boolean;
	reportTouchActivity?: boolean;
	children?: VideoJSComponent|string[];
	createEl?: boolean;
}

interface VideoJSChildComponentOptions {
	id?: number|(() => string);
	el?: HTMLElement|(() => HTMLElement);
}

interface VideoJSEventSubject {
	/**
	 * Add an event listener to this component's element.
	 * @param eventName One or more event types to bind to.
	 * @param handler The event handler.
	 */
	on(eventName: string|string[], handler: (eventData: any) => void): VideoJSComponent;

	/**
	 * Add an event listener to this component's element.
	 * @param target The event target.
	 * @param eventName One or more event types to bind to.
	 * @param handler The event handler.
	 */
	//on(target: VideoJSComponent|Element, eventName: string|string[], handler: () => void): VideoJSComponent;

	/**
	 * Add an event listener to be triggered only once and then removed.
	 * @param eventName One or more event types to bind to.
	 * @param handler The event handler.
	 */
	one(eventName: string|string[], handler: (eventData: any) => void): VideoJSComponent;

	/**
	 * Add an event listener to be triggered only once and then removed.
	 * @param target The event target.
	 * @param eventName One or more event types to bind to.
	 * @param handler The event handler.
	 */
	//one(target: VideoJSComponent|Element, eventName: string|string[], handler: () => void): VideoJSComponent;

	/**
	 * Remove an event listener from this component's element.
	 * @param eventName One or more event types to bind to.
	 * @param handler The event handler.
	 */
	off(eventName: string|string[], handler: (eventData: any) => void): VideoJSComponent;

	/**
	 * Remove an event listener from this component's element.
	 * @param target The event target.
	 * @param eventName One or more event types to bind to.
	 * @param handler The event handler.
	 */
	//off(target: VideoJSComponent|Element, eventName: string|string[], handler: () => void): VideoJSComponent;

	/**
	 * Trigger an event on an element.
	 * @param eventName The event type to trigger.
	 * @param hash data hash to pass along with the event.
	 */
	trigger(eventName: string|Event|Object, hash?: any): VideoJSComponent;
}

/**
 * Base UI VideoJSComponent class
 * Components are embeddable UI objects that are represented by both a
 * javascript object and an element in the DOM. They can be children of other
 * components, and can have many children themselves.
 *
 * Events: 'dispose',
 */
declare class VideoJSComponent implements VideoJSEventSubject {
	protected player_: VideoJSPlayer;
	public contentEl_: any;
	public options_: VideoJSComponentOptions|any;

	/**
	 * @param player Main Player
	 * @param options Object of option names and values
	 * @param ready Ready callback function
	 */
	constructor (player?: VideoJSPlayer, options?: VideoJSComponentOptions|any, ready?: () => void);

	/**
	 * Bind a listener to the component's ready state.
	 * Different from event listeners in that if the ready event has already happened
	 * it will trigger the function immediately.
	 *
	 * @param callback Ready callback.
	 * @param sync Whether to exec the listener synchronously if component is ready.
	 */
	public ready(callback: () => void, sync?: boolean): VideoJSComponent;

	/**
	 * Check if the component's element has a CSS class name.
	 *
	 * @param classToCheck Classname to check
	 */
  public hasClass(classToCheck: string): boolean;

	/**
	 * Add a CSS class name to the component's element.
	 *
	 * @param classToAdd Classname to add.
	 */
  public addClass(classToAdd: string): VideoJSComponent;

	/**
	 * Remove a CSS class name from the component's element.
	 *
	 * @param classToRemove Classname to remove.
	 */
  public removeClass(classToRemove: string): VideoJSComponent;

	/**
	 * Add or remove a CSS class name from the component's element
	 *
	 * @param  classToToggle Classname to toggle.
	 * @param  predicate Can be a function that returns a Boolean. If `true`,
	 *         the class will be added; if `false`, the class will be removed.
	 *         If not given, the class will be added if not present and vice versa.
	 */
	public toggleClass(classToToggle: string, predicate?: boolean|((element: Element, classToToggle: string) => boolean)): VideoJSComponent;

	/**
	 * Show the component element if hidden.
	 */
	public show(): VideoJSComponent;

	/**
	 * Hide the component element if currently showing.
	 */
	public hide(): VideoJSComponent;

	/**
	 * Set or get the width of the component (CSS values)
	 * Setting the video tag dimension values only works with values in pixels.
	 * Percent values will not work.
	 * Some percents can be used, but width()/height() will return the number + %,
	 * not the actual computed width/height.
	 *
	 * @param  num Width as number or as percentage string.
	 * @param  skipListeners Whether to skip the 'resize' event trigger.
	 * @return This component.
	 */
	public width(num: number|string, skipListeners: boolean): VideoJSComponent;

	/**
	 * Get the width of the component (CSS values).
	 * Some percents can be used, but width()/height() will return the number + %,
	 * not the actual computed width/height.
	 *
	 * @return The width.
	 */
	public width(): number|string;

	/**
	 * Set or get the width of the component (CSS values)
	 * Setting the video tag dimension values only works with values in pixels.
	 * Percent values will not work.
	 * Some percents can be used, but width()/height() will return the number + %,
	 * not the actual computed width/height.
	 *
	 * @param  num Height as number or as percentage string.
	 * @param  skipListeners Whether to skip the 'resize' event trigger.
	 * @return This component.
	 */
	public height(num: number|string, skipListeners: boolean): VideoJSComponent;

	/**
	 * Get the width of the component (CSS values).
	 * Some percents can be used, but width()/height() will return the number + %,
	 * not the actual computed width/height.
	 *
	 * @return The height.
	 */
	public height(): number|string;

	/**
	 * Set both width and height at the same time.
	 *
	 * @param width The width.
	 * @param height The height.
	 */
	public dimensions(width: number|string, height: number|string): VideoJSComponent;

	/**
	 * Report user touch activity when touch events occur
	 * User activity is used to determine when controls should show/hide. It's
	 * relatively simple when it comes to mouse events, because any mouse event
	 * should show the controls. So we capture mouse events that bubble up to the
	 * player and report activity when that happens.
	 * With touch events it isn't as easy. We can't rely on touch events at the
	 * player level, because a tap (touchstart + touchend) on the video itself on
	 * mobile devices is meant to turn controls off (and on). User activity is
	 * checked asynchronously, so what could happen is a tap event on the video
	 * turns the controls off, then the touchend event bubbles up to the player,
	 * which if it reported user activity, would turn the controls right back on.
	 * (We also don't want to completely block touch events from bubbling up)
	 * Also a touchmove, touch+hold, and anything other than a tap is not supposed
	 * to turn the controls back on on a mobile device.
	 * Here we're setting the default component behavior to report user activity
	 * whenever touch events happen, and this can be turned off by components that
	 * want touch events to act differently.
	 */
	public enableTouchActivity(): void;

	/**
	 * Creates timeout and sets up disposal automatically.
	 *
	 * @param callback The function to run after the timeout.
	 * @param timeout Number of ms to delay before executing specified function.
	 * @return Returns the timeout ID
	 */
  public setTimeout(callback: () => void, timeout: number): number;

	/**
	 * Clears a timeout and removes the associated dispose listener.
	 *
	 * @param timeoutId The id of the timeout to clear.
	 * @return Returns the timeout ID.
	 */
  public clearTimeout(timeoutId: number): number;

	/**
	 * Creates an interval and sets up disposal automatically.
	 *
	 * @param callback The function to run every N seconds.
	 * @param interval Number of ms to delay before executing specified function.
	 * @return Returns the interval ID.
	 */
  public setInterval(callback: () => void, interval: number): number;

	/**
	 * Clears an interval and removes the associated dispose listener.
	 *
	 * @param intervalId The id of the interval to clear.
	 * @return Returns the interval ID.
	 */
  public clearInterval(intervalId: number): number;

	/**
	 * Trigger the ready listeners.
	 */
	public triggerReady(): void;

	/**
	 * @return The current options.
	 * @deprecated Will be removed in 6.0
	 */
	public options(): VideoJSComponentOptions|any;

	/**
	 * Deep merge of options objects.
	 * Whenever a property is an object on both options objects
	 * the two properties will be merged using mergeOptions.
	 * @param  newOptions Object of new option values
	 * @return A NEW object of this.options_ and obj merged
	 */
	options(newOptions: VideoJSComponentOptions|any): void;

	/**
	 * Create the component's DOM element.
	 *
	 * @param  tagName  Element's node type. e.g. 'div'
	 * @param  properties An object of properties that should be set
	 * @param  attributes An object of attributes that should be set
	 * @return {Element}
	 */
	public createEl(tagName?: string, properties?: any, attributes?: any): void;

	public localize(string: string): string;

	/**
	 * Adds a child component inside this component
	 * @param child The class name or instance of a child to add
	 * @param options Options, including options to be passed to children of the child.
	 * @return The child component name.
	 */
	//public addChild(childName: string, options?: VideoJSComponentOptions): VideoJSComponent;

	/**
	 * Adds a child component inside this component
	 * @param child The class name or instance of a child to add
	 * @param options Options, including options to be passed to children of the child.
	 * @return The child component (created by this process if a string was used).
	 */
	public addChild(child: VideoJSComponent, options?: VideoJSChildComponentOptions|any): VideoJSComponent;

	/**
	 * Remove a child component from this component's list of children, and the
	 * child component's element from this component's element.
	 *
	 * @param child VideoJSComponent or the component name of the component to remove.
	 */
	public removeChild(child: string|VideoJSComponent): void;

	/**
	 * Allows sub components to stack CSS class names.
	 *
	 * @return The constructed class name.
	 */
	public buildCSSClass(): string;

	/**
	 * Add and initialize default child components from options.
	 */
	public initChildren(): void;

	/**
	 * Get the component's ID.
	 */
	public id(): string;

	/**
	 * Get the component's name. The name is often used to reference the component.
	 */
	public name(): string;

	/**
	 * Get an array of all child components.
	 */
	public children(): VideoJSComponent[];

	/**
	 * Returns a child component with the provided ID.
	 * @param id
	 */
	public getChildById(id: string): VideoJSComponent;

	/**
	 * Returns a child component with the provided name
	 * @param name
	 */
	public getChild(name: string): VideoJSComponent;

	/**
	 * Return the component's player.
	 */
	public player(): VideoJSPlayer;

	/**
	 * Get the component's DOM element.
	 */
	public el(): any;

	/**
	 * Return the component's DOM element where children are inserted.
	 * Will either be the same as el() or a new element defined in createEl().
	 */
	public contentEl(): any;

	/**
	 * Dispose of the component and all child components
	 */
	public dispose(): void;

	public on(eventName: string|string[], handler: (eventData: any) => void): VideoJSComponent;
	//public on(target: VideoJSComponent|Element, eventName: string|string[], handler: () => void): VideoJSComponent;

	public one(eventName: string|string[], handler: (eventData: any) => void): VideoJSComponent;
	//public one(target: VideoJSComponent|Element, eventName: string|string[], handler: () => void): VideoJSComponent;

	public off(eventName: string|string[], handler: (eventData: any) => void): VideoJSComponent;
	//public off(target: VideoJSComponent|Element, eventName: string|string[], handler: () => void): VideoJSComponent;

	public trigger(eventName: string|Event|Object, hash?: any): VideoJSComponent;

	public lockShowing(): void;
	public unlockShowing(): void;
}

declare class VideoJSButton extends VideoJSComponent {
	public controlText(): string;
	public controlText(text: string): VideoJSButton;
	public handleClick(event: Event): void;
	public handleFocus(): void;
	public handleKeyPress(event: KeyboardEvent): void;
	public handleBlur(): void;
}

declare class VideoJSMenuButton extends VideoJSButton {
	protected buttonPressed_: boolean;
	public menu: VideoJSMenu;
	public items: any[];

	public createMenu(): void;
	public createItems(items: any[]): any[];
	public update(): void;
	public pressButton(): void;
	public unpressButton(): void;
}

declare class VideoJSMenuItem extends VideoJSButton {
	public selected(isSelected: boolean): void;
}

declare class VideoJSMenu extends VideoJSComponent {
	protected player_: VideoJSPlayer;
	public contentEl_: any;
	public options_: VideoJSComponentOptions|any;

	public addItem(component: VideoJSComponent): void;
}

interface VideoJSTech extends VideoJSComponent {}

interface VideoJSStatic extends VideoJSEventSubject {
	VERSION: string;
	options: VideoJSOptions;

	(id: string|Element, options?: VideoJSOptions, ready?: () => void): VideoJSPlayer;

	formatTime(seconds: number, guide?: number): string;

	getPlayers(): VideoJSPlayer[];

	/**
	 * Registers a component
	 * @param name Name of the component to register
	 * @param comp The component to register
	 * @return comp
	 */
  registerComponent(name: string, componentClass: any): any;

	/**
	 * Gets a component by name.
	 * @param name Name of the component to get.
	 * @return The component.
	 */
  getComponent(name: string): any;

	/**
	 * Sets up the constructor using the supplied init method
	 * or uses the init of the parent object.
	 *
	 * @param props An object of properties.
	 * @deprecated
	 */
  extend(props: any): void;

	getTech(name: string): VideoJSTech;
	registerTech(name: string, tech: VideoJSTech): void;
	mergeOptions(...options: VideoJSOptions[]): void;
	plugin(name: string, init: () => void): void;
	addLanguage(code: string, data: any): void;
	createTimeRanges(start: number|any[], end: number): TimeRanges;
	formatTime(seconds: number, guide?: number): string;
}

declare var videojs: VideoJSStatic;
