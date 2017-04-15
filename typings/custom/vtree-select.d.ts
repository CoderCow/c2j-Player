declare module 'vtree-select' {
  import VTree = VirtualDOM.VTree;
  import VNode = VirtualDOM.VNode;

  namespace VTreeSelect {
    export interface ISelectOptions {
      /**
       * Enables case sensitivity for tag names.
       * This is useful for XML, which has case-sensitive tag names.
       * HTML tag names are not case sensitive.
       */
      caseSensitiveTag: boolean;
    }

    export interface IMatch {
      /**
       * Returns an array of matched nodes, or null if no nodes match.
       * Unlike css and querySelectorAll, text nodes are matched and returned.
       * Selectors are case-sensitive.
       */
      (vTree: VTree|VNode): VNode[]|null;

      /**
       * Returns true if the vtree matches the selector, or false otherwise.
       */
      matches(vTree: VTree|VNode): boolean;
    }
  }

  function VTreeSelect(selector: string, options?: VTreeSelect.ISelectOptions): VTreeSelect.IMatch;

  export = VTreeSelect;
}
