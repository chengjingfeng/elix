import * as symbols from '../../src/symbols.js';
import CustomBackdrop from './CustomBackdrop.js';
import CustomOverlayFrame from './CustomOverlayFrame.js';
import Dialog from '../../src/Dialog.js';


class SampleDialog extends Dialog {

  get defaultState() {
    return Object.assign(super.defaultState, {
      backdropRole: CustomBackdrop,
      frameRole: CustomOverlayFrame
    });
  }

  [symbols.render](changed) {
    if (super[symbols.render]) { super[symbols.render](changed); }
    if (changed.frameRole) {
      // Have the dialog close itself when the user clicks anywhere within it. In
      // many cases, you'll want to have a button ("OK", "Close", etc.) that
      // performs this action.
      this.$.frame.addEventListener('click', () => {
        this.close();
      });
    }
  }

}


customElements.define('sample-dialog', SampleDialog);
export default SampleDialog;
