import * as symbols from './symbols.js';


/**
 * Track the classes, styles, and other attributes which have been explicitly
 * set on a component's top-level host element.
 * 
 * @module ExplicitAttributesMixin
 */
export default function ExplicitAttributesMixin(Base) {
  return class OriginalAttributes extends Base {

    connectedCallback() {
      // Calculate original props before we call super. If, e.g., ReactiveMixin
      // is applied before this mixin, we want to get the original props before
      // we render.
      const attributes = currentAttributes(this);
      const classes = currentClasses(this);
      const style = currentStyles(this);
      if (attributes || classes || style) {
        const changes = {};
        if (attributes) {
          changes.explicitAttributes = attributes;
        }
        if (classes) {
          changes.explicitClasses = classes;
        }
        if (style) {
          changes.explicitStyle = style;
        }
        this.setState(changes);
      }

      if (super.connectedCallback) { super.connectedCallback(); }
    }

    get defaultState() {
      return Object.assign(super.defaultState, {
        explicitAttributes: null,
        explicitClasses: null,
        explicitStyle: null
      });
    }

    // See setAttribute
    removeAttribute(name) {
      super.removeAttribute(name);
      if (!this[symbols.rendering] &&
          this.state.explicitAttributes &&
          this.state.explicitAttributes[name] != null) {
        updateOriginalProp(this, name, null);
      }
    }

    // Override role for same reasons as setAttribute.
    get role() {
      return super.role;
    }
    set role(role) {
      if (!this[symbols.rendering]) {
        updateOriginalProp(this, 'role', role);
      }
      super.role = role;
    }

    // Override setAttribute so that, if this is called outside of rendering,
    // we can update our notion of the component's original updates.
    setAttribute(name, value) {
      if (!this[symbols.rendering]) {
        updateOriginalProp(this, name, value);
      }
      super.setAttribute(name, value);
    }

    // Override style for same reasons as setAttribute.
    get style() {
      return super.style;
    }
    set style(style) {
      if (!this[symbols.rendering]) {
        updateOriginalProp(this, 'style', style);
      }
      super.style = style;
    }

    // See setAttribute
    toggleAttribute(name, force) {
      if (!this[symbols.rendering]) {
        let value;
        if (force !== undefined) {
          // Use supplied value.
          value = force ? '' : null;
        } else if (this.state.explicitAttributes &&
            this.state.explicitAttributes[name] !== undefined) {
          // Toggle off
          value = null;
        } else {
          // Toggle on
          value = '';
        }
        updateOriginalProp(this, name, value);
      }
      if (force !== undefined) {
        super.toggleAttribute(name, force);
      } else {
        super.toggleAttribute(name);
      }
    }
  }
}


// Returns a dictionary of the element's current attributes.
function currentAttributes(element) {
  let attributes = null;
  Array.prototype.forEach.call(element.attributes, attribute => {
    if (attribute.name !== 'class' && attribute.name !== 'style') {
      if (!attributes) {
        attributes = {};
      }
      attributes[attribute.name] = attribute.value;
    }
  });
  return attributes;
}


// Returns a dictionary of the element's current classes.
function currentClasses(element) {
  let classes = null;
  Array.prototype.forEach.call(element.classList, className => {
    if (!classes) {
      classes = {};
    }
    classes[className] = true;
  });
  return classes;
}


// Returns a dictionary of the element's current styles.
function currentStyles(element) {
  let style = null;
  if (HTMLElement) {
    Array.prototype.forEach.call(element.style, key => {
      if (!style) {
        style = {};
      }
      style[key] = element.style[key];
    });  
  }
  return style;
}


// Given a space-separated string of class names like "foo bar", return a props
// object like { foo: true, bar: true }.
function parseClassProps(text) {
  const result = {};
  const classes = text.split(' ');
  classes.forEach(className => {
    result[className] = true
  });
  return result;
}


// Given a semicolon-separated set of CSS rules like, return a props object.
// Example: when called with "background: black; color: white", this returns
// { background: 'black', color: 'white' }.
function parseStyleProps(text) {
  const result = {};
  const rules = text.split(';');
  rules.forEach(rule => {
    if (rule.length > 0) {
      const parts = rule.split(':');
      const name = parts[0].trim();
      const value = parts[1].trim();
      result[name] = value;
    }
  });
  return result;
}


// If we're changing an attribute outside of rendering, the element is being
// directly modified by its host. Update our notion of the element's "original"
// props, and give the component a chance to re-render based on this new
// information.
//
// This is important when, for example, a mixin or component wants to provide a
// default value for an attribute. Suppose a mixin wants to set a default
// tabindex of zero if no tabindex is provided by the host. If/when the host
// eventually sets a tabindex, the mixin should see the change, and let the
// host's preferred tabindex stick instead of overwriting it with its default
// tabindex of zero.
//
function updateOriginalProp(element, name, value) {
  switch (name) {
    
    case 'class':
      element.setState({
        explicitClasses: parseClassProps(value)
      });
      break;

    case 'style':
      element.setState({
        explicitStyle: parseStyleProps(value)
      });
      break;
    
    default: {
      const previousAttributes = element.state &&
        element.state.explicitAttributes;
      if (!previousAttributes || previousAttributes[name] !== value) {
        const explicitAttributes = Object.assign(
          {},
          previousAttributes
        );
        if (value !== null) {
          explicitAttributes[name] = value;
        } else {
          delete explicitAttributes[name];
        }
        element.setState({
          explicitAttributes
        });
      }
      break;
    }
  }
}