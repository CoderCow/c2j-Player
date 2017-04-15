// https://github.com/Microsoft/TypeScript/issues/3203
declare namespace JSX {
  import VNode = VirtualDOM.VNode;

  interface Element extends VNode {}
  interface IntrinsicElements {
    [name: string]: any; // allow all html elements
  }
}
