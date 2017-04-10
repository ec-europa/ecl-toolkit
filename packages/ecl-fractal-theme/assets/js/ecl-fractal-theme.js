global.jQuery = require('jquery');
global.pjax = require('jquery-pjax');

const $ = global.jQuery;
const doc = $(document);
const frctl = window.frctl || {};

const events = require('./events');
const utils = require('./utils');
const framer = require('./components/frame');
const Tree = require('./components/tree');
const Pen = require('./components/pen');

global.fractal = {
  events,
};

const frame = framer($('#frame'));
$.map($('[data-behaviour="tree"]'), t => new Tree(t));
loadPen();

if (frctl.env === 'server') {
  doc.pjax('a[data-pjax], code a[href], .Prose a[href]:not([data-no-pjax]), .Browser a[href]:not([data-no-pjax])', '#pjax-container', {
    fragment: '#pjax-container',
    timeout: 10000,
  }).on('pjax:start', (e, xhr, options) => {
    if (utils.isSmallScreen()) {
      frame.closeSidebar();
    }
    frame.startLoad();
    events.trigger('main-content-preload', options.url);
  }).on('pjax:end', () => {
    events.trigger('main-content-loaded');
    frame.endLoad();
  });
}

events.on('main-content-loaded', loadPen);

function loadPen() {
  setTimeout(() => {
    $.map($('[data-behaviour="pen"]'), p => new Pen(p));
  }, 1);
}
