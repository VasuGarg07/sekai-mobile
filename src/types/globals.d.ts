// React Native installs these on the global object at startup (Libraries/Core/setUpTimers.js) but ships no typings for them.
declare function requestIdleCallback(callback: () => void): number;
declare function cancelIdleCallback(handle: number): void;
