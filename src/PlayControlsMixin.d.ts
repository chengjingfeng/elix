// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="shared.d.ts"/>

declare const PlayControlsMixin: Mixin<{}, {}> & {
  inject: symbol;
};

export default PlayControlsMixin;