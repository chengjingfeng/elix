// import { html } from '../node_modules/lit-html/lit-html.js';
import * as props from '../mixins/props.js';
import AttributeMarshallingMixin from '../mixins/AttributeMarshallingMixin.js';
import ClickSelectionMixin from '../mixins/ClickSelectionMixin.js';
import ContentItemsMixin from '../mixins/ContentItemsMixin.js';
import DefaultSlotContentMixin from '../mixins/DefaultSlotContentMixin.js';
import DirectionSelectionMixin from '../mixins/DirectionSelectionMixin.js';
import HostPropsMixin from '../mixins/HostPropsMixin.js';
import KeyboardDirectionMixin from '../mixins/KeyboardDirectionMixin.js';
import KeyboardMixin from '../mixins/KeyboardMixin.js';
import KeyboardPagedSelectionMixin from '../mixins/KeyboardPagedSelectionMixin.js';
import KeyboardPrefixSelectionMixin from '../mixins/KeyboardPrefixSelectionMixin.js';
// import LitHtmlShadowMixin from '../mixins/LitHtmlShadowMixin.js';
import ReactiveMixin from '../mixins/ReactiveMixin.js';
import SelectionAriaMixin from '../mixins/SelectionAriaMixin.js';
import SelectionInViewMixin from '../mixins/SelectionInViewMixin.js';
import ShadowTemplateMixin from '../mixins/ShadowTemplateMixin.js';
import SingleSelectionMixin from '../mixins/SingleSelectionMixin.js';
import symbols from '../mixins/symbols.js';


const Base =
  AttributeMarshallingMixin(
  ClickSelectionMixin(
  ContentItemsMixin(
  DefaultSlotContentMixin(
  DirectionSelectionMixin(
  HostPropsMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
  KeyboardPagedSelectionMixin(
  KeyboardPrefixSelectionMixin(
  ReactiveMixin(
  SelectionAriaMixin(
  SelectionInViewMixin(
  ShadowTemplateMixin(
  SingleSelectionMixin(
    HTMLElement
  )))))))))))))));


/**
 * A simple single-selection list box.
 *
 * This component supports a generic visual style, ARIA support, and full
 * keyboard navigation. See `KeyboardDirectionMixin`,
 * `KeyboardPagedSelectionMixin`, and `KeyboardPrefixSelectionMixin` for
 * keyboard details.
 *
 * @extends {HTMLElement}
 * @mixes AttributeMarshallingMixin
 * @mixes ClickSelectionMixin
 * @mixes ContentItemsMixin
 * @mixes DefaultSlotContentMixin
 * @mixes DirectionSelectionMixin
 * @mixes HostPropsMixin
 * @mixes KeyboardDirectionMixin
 * @mixes KeyboardMixin
 * @mixes KeyboardPagedSelectionMixin
 * @mixes KeyboardPrefixSelectionMixin
 * @mixes SelectedItemTextValueMixin
 * @mixes SelectionAriaMixin
 * @mixes SelectionInViewMixin
 * @mixes ShadowTemplateMixin
 * @mixes SingleSelectionMixin
 */
export default class ListBox extends Base {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      orientation: 'vertical'
    });
  }

  hostProps(original) {
    const base = super.hostProps && super.hostProps(original);
    return props.merge(base, {
      style: {
        'border': '1px solid gray',
        'box-sizing': 'border-box',
        'cursor': 'default',
        'display': 'flex',
        '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)'
      }
    });
  }

  itemProps(item, index, original) {
    const base = super.itemProps ? super.itemProps(item, index, original) : {};
    const selected = index === this.state.selectedIndex;
    const color = selected ? 'highlighttext' : original.style.color;
    const backgroundColor = selected ? 'highlight' : original.style.backgroundColor;
    return props.merge(base, {
      classes: {
        selected
      },
      style: {
        'background-color': backgroundColor,
        color,
        'padding': '0.25em'
      }
    });
  }

  get [symbols.template]() {
    const containerStyle = {
      'flex': '1',
      '-webkit-overflow-scrolling': 'touch', /* for momentum scrolling */
      'overflow-x': 'hidden',
      'overflow-y': 'scroll'
    };
    return `
      <div id="itemsContainer" role="none" style="${props.formatStyleProps(containerStyle)}">
        <slot></slot>
      </div>
    `;
  }

  get [symbols.scrollTarget]() {
    const root = this.shadowRoot || this;
    const itemsContainer = root.querySelector('#itemsContainer');
    return itemsContainer;
  }

}


customElements.define('elix-list-box', ListBox);
