/* eslint-disable import/no-extraneous-dependencies */
import $ from 'jquery';
import storage from '../storage';
import utils from '../utils';
import events from '../events';

export default element => {
  const el = $(element);
  const dir = $('html').attr('dir');
  const body = el.find('> [data-role="body"]');
  const toggle = el.find('[data-action="toggle-sidebar"]');
  const sidebar = body.children('[data-role="sidebar"]');
  const main = body.children('[data-role="main"]');
  const handle = body.children('[data-role="frame-resize-handle"]');
  const sidebarMin = parseInt(sidebar.css('min-width'), 10);

  let sidebarWidth = utils.isSmallScreen()
    ? sidebarMin
    : storage.get('frame.sidebar', sidebar.outerWidth());
  let sidebarState = utils.isSmallScreen()
    ? 'closed'
    : storage.get('frame.state', 'open');
  const scrollPos = storage.get('frame.scrollPos', 0);
  let dragOccuring = false;
  let isInitialClose = false;
  let handleClicks = 0;

  sidebar.outerWidth(sidebarWidth);

  if (sidebarState === 'closed') {
    isInitialClose = true;
    closeSidebar();
  }

  sidebar.scrollTop(scrollPos);

  handle.on('mousedown', e => {
    handleClicks += 1;

    setTimeout(() => {
      handleClicks = 0;
    }, 400);

    if (handleClicks === 2) {
      dragOccuring = false;
      toggleSidebar();
      handleClicks = 0;
      e.stopImmediatePropagation();
    }
  });

  sidebar.resizable({
    handleSelector: handle,
    resizeHeight: false,
    onDragStart: () => {
      el.addClass('is-resizing');
      events.trigger('start-dragging');
    },
    onDragEnd: () => {
      setSidebarWidth(sidebar.outerWidth());
      el.removeClass('is-resizing');
      events.trigger('end-dragging');
      if (sidebarState === 'closed') {
        dragOccuring = false;
        openSidebar();
      }
    },
    resizeWidthFrom: dir === 'rtl' ? 'left' : 'right',
  });

  sidebar.on(
    'scroll',
    utils.debounce(() => {
      storage.set('frame.scrollPos', sidebar.scrollTop());
    }, 50)
  );

  toggle.on('click', toggleSidebar);

  // Global event listeners

  events.on('toggle-sidebar', toggleSidebar);
  events.on('start-dragging', () => {
    dragOccuring = true;
  });
  events.on('end-dragging', () => {
    setTimeout(() => {
      dragOccuring = false;
    }, 200);
  });

  events.on('data-changed', () => {
    // TODO: make this smarter?
    document.location.reload(true);
  });

  function closeSidebar() {
    if (dragOccuring || (!isInitialClose && sidebarState === 'closed')) {
      return;
    }

    const w = sidebar.outerWidth();
    const translate = dir === 'rtl' ? `${w}px` : `${-1 * w}px`;
    const sidebarProps = {
      transform: `translate3d(${translate}, 0, 0)`,
    };

    if (dir === 'rtl') {
      sidebarProps.marginLeft = `${-1 * w}px`;
    } else {
      sidebarProps.marginRight = `${-1 * w}px`;
    }
    sidebarProps.transition = isInitialClose ? 'none' : '.3s ease all';
    body.css(sidebarProps);
    sidebarState = 'closed';
    el.addClass('is-closed');
    storage.set('frame.state', sidebarState);
    isInitialClose = false;
  }

  function openSidebar() {
    if (dragOccuring || sidebarState === 'open') {
      return;
    }

    if (utils.isSmallScreen()) {
      setSidebarWidth(sidebarMin);
    }

    body.css({
      marginRight: 0,
      marginLeft: 0,
      transition: '.3s ease all',
      transform: 'translate3d(0, 0, 0)',
    });

    sidebarState = 'open';
    el.removeClass('is-closed');
    storage.set('frame.state', sidebarState);
  }

  function toggleSidebar() {
    if (sidebarState === 'open') {
      closeSidebar();
    } else {
      openSidebar();
    }

    return false;
  }

  function setSidebarWidth(width) {
    sidebarWidth = width;
    sidebar.outerWidth(width);
    storage.set('frame.sidebar', width);
  }

  return {
    closeSidebar,
    openSidebar,

    startLoad: () => {
      main.addClass('is-loading');
    },

    endLoad: () => {
      main.removeClass('is-loading');
    },
  };
};
