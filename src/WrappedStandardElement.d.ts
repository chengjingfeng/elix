// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="shared.d.ts"/>

import * as symbols from './symbols.js';
import DelegateFocusMixin from './DelegateFocusMixin.js';
import ReactiveElement from './ReactiveElement.js';

export default class WrappedStandardElement extends DelegateFocusMixin(
  ReactiveElement
) {
  [symbols.defaultTabIndex]: number;
  readonly inner: HTMLElement;
  setInnerProperty(name: string, value: any): void;
  static wrap(extendsTag: string): Constructor<WrappedStandardElement>;
}
