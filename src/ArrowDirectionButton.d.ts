// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import DarkModeMixin from './DarkModeMixin.js';
import SeamlessButton from './SeamlessButton.js';

export default class ArrowDirectionButton extends
    DarkModeMixin(
      SeamlessButton
    ) {}
