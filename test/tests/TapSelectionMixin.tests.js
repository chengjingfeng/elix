import ReactiveMixin from '../../src/ReactiveMixin.js';
import TapSelectionMixin from '../../src/TapSelectionMixin.js';
import * as mockInteractions from '../mockInteractions.js';


class TapSelectionTest extends TapSelectionMixin(
    ReactiveMixin(HTMLElement)) {

  connectedCallback() {
    super.connectedCallback();
    const items = Array.prototype.slice.call(this.children);
    this.setState({
      items,
      selectedIndex: -1
    });
  }

  get selectedIndex() {
    return this.state.selectedIndex;
  }
  set selectedIndex(selectedIndex) {
    this.state.selectedIndex = selectedIndex;
  }

}
customElements.define('tap-selection-test', TapSelectionTest);


describe("TapSelectionMixin", function() {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("sets the tapped item as the selected item", done => {
    const fixture = createSampleElement();
    container.appendChild(fixture);
    assert.equal(fixture.state.selectedIndex, -1);
    const item = fixture.state.items[0];
    fixture.addEventListener('mousedown', () => {
      assert.equal(fixture.state.selectedIndex, 0);
      done();
    });
    mockInteractions.dispatchSyntheticMouseEvent(item, 'mousedown');
  });

  it("ignores right clicks", done => {
    const fixture = createSampleElement();
    container.appendChild(fixture);
    assert.equal(fixture.state.selectedIndex, -1);
    const item = fixture.state.items[0];
    fixture.addEventListener('mousedown', () => {
      assert.equal(fixture.state.selectedIndex, -1, "handled mousedown even when right button was pressed");
      done();
    });
    mockInteractions.dispatchSyntheticMouseEvent(item, 'mousedown', {
      button: 2
    });
  });
});


function createSampleElement() {
  const fixture = new TapSelectionTest();
  ['Zero', 'One', 'Two'].forEach(text => {
    const div = document.createElement('div');
    div.textContent = text;
    fixture.appendChild(div);
  });
  return fixture;
}