/* eslint-disable import/no-extraneous-dependencies, import/first */
import $ from 'jquery';

// Local imports
import framer from './components/frame';
import Tree from './components/tree';
import Pen from './components/pen';
import search from './search';
import events from './events';

document.addEventListener('DOMContentLoaded', () => {
  framer($('#frame'));
  $.map($('[data-behaviour="tree"]'), t => new Tree(t));
  $.map($('[data-behaviour="pen"]'), p => new Pen(p));
  search();
});

export default events;
