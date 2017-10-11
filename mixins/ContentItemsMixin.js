import { substantiveElements } from './content.js';
import Symbol from './Symbol.js';
import { currentProps, updateProps } from '../mixins/helpers.js';


// Symbols for private data members on an element.
const itemsKey = Symbol('items');
const originalPropsKey = Symbol('originalProps');
const previousContentKey = Symbol('previousContent');


/**
 * Mixin which maps content semantics (nodes) to list item semantics.
 *
 * Items differ from nodes contents in several ways:
 *
 * * They are often referenced via index.
 * * They may have a selection state.
 * * It's common to do work to initialize the appearance or state of a new
 *   item.
 * * Text nodes are filtered out.
 * * Auxiliary invisible child elements are filtered out and not counted as
 *   items. Auxiliary elements include link, script, style, and template
 *   elements. This filtering ensures that those auxiliary elements can be
 *   used in markup inside of a list without being treated as list items.
 *
 * This mixin expects a component to provide a `content` property returning a
 * raw set of elements. You can provide that yourself, or use
 * [DefaultSlotContentMixin](DefaultSlotContentMixin).
 *
 * The most commonly referenced property defined by this mixin is the `items`
 * property. To avoid having to do work each time that property is requested,
 * this mixin supports an optimized mode. If you invoke the `contentChanged`
 * method when the set of items changes, the mixin concludes that you'll take
 * care of notifying it of future changes, and turns on the optimization. With
 * that on, the mixin saves a reference to the computed set of items, and will
 * return that immediately on subsequent calls to the `items` property. If you
 * use this mixin in conjunction with `DefaultSlotContentMixin`, the
 * `contentChanged` method will be invoked for you when the element's children
 * change, turning on the optimization automatically.
 *
 * Most Elix [elements](elements) use `ContentItemsMixin`, including
 * [ListBox](ListBox), [Modes](Modes), and [Tabs](Tabs).
 *
 * @module ContentItemsMixin
 */
export default function ContentItemsMixin(Base) {
  return class ContentItems extends Base {

    get items() {
      const base = super.items;
      if (base) {
        // Prefer base result if it's defined.
        return base;
      }
      const content = this.state.content;
      if (this[previousContentKey] !== content) {
        // Memoize
        this[itemsKey] = content ?
          substantiveElements(content) :
          [];
        this[previousContentKey] = content;
      }
      return this[itemsKey];
    }

    render() {
      const base = super.render ? super.render() : Promise.resolve();
      return base.then(() => {
        if (this.itemProps) {
          const items = this.items || [];
          items.forEach((item, index) => {
            if (item[originalPropsKey] === undefined) {
              item[originalPropsKey] = currentProps(item);
            }
            updateProps(item, this.itemProps(item, index, item[originalPropsKey]));
          });
        }
      });
    }
    
  }
}
