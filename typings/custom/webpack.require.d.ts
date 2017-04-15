declare var require: {
  <T>(path: string): T;
  (paths: string[], callback: (...modules: any[]) => void): void;
  ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
  context: (path: string, includeSubDirs: boolean, pattern: RegExp) => IRequireContext;
};

interface IRequireContext {
  (path: string): any;
  resolve: (path: string) => number;
  keys: () => string[];
  id: number;
}
