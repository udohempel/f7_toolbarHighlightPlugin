const ToolbarHighlightPlugin = {
  name: 'toolbarHighlight',
  create() {
    const app = this;
    app.toolbarHighlight = {
      isPressed: false,
      isLongPress: false,
      $activeToolbar: null,
      pressStartTime: 0,
      longPressTimer: null,
      lastFocussedIndex: -1, 
      clampingOffset: 8,    
      expansionOffset: 8,   

      ensureIndicators($container) {
        if (!$container || !$container.length) return null;
        let $activeH = $container.find('.toolbar-indicator-highlight');
        if (!$activeH.length) {
          $activeH = app.$('<span class="toolbar-indicator-highlight"></span>');
          $container.append($activeH);
        }
        let $hoverH = $container.find('.toolbar-hover-indicator');
        if (!$hoverH.length) {
          $hoverH = app.$('<span class="toolbar-hover-indicator"></span>');
          $container.append($hoverH);
        }
        return { $activeH, $hoverH };
      },

      triggerHaptic() {
        if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics) {
          window.Capacitor.Plugins.Haptics.impact({ style: 'LIGHT' });
        } else if (navigator.vibrate) {
          navigator.vibrate(10); 
        }
      },

      update(toolbarEl, animate = true) {
        const $ = app.$;
        const $container = $(toolbarEl).find('.toolbar-pane');
        const indicators = this.ensureIndicators($container);
        if (!indicators) return;

        const $links = $container.find('.link');
        const $activeLink = $container.find('.link-active').eq(0);

        if ($activeLink.length) {
          const isFirst = $activeLink.index() === 0;
          const extraPadding = isFirst ? 2: 0;
          
          const targetWidth = $activeLink[0].offsetWidth + extraPadding;
          const targetX = $activeLink[0].offsetLeft;

          indicators.$activeH.css({
            'transition': animate ? 'transform 400ms cubic-bezier(0.25, 0.1, 0.25, 1.0), width 400ms cubic-bezier(0.25, 0.1, 0.25, 1.0), opacity 200ms' : 'none',
            'width': `${targetWidth+extraPadding}px`,
            'transform': `translate3d(${targetX}px, 0, 0)`,
            'opacity': '1'
          });
        }
      },

      followMouse(e) {
        if (!this.isLongPress || !this.$activeToolbar) return;
        const $ = app.$;
        const $pane = this.$activeToolbar.find('.toolbar-pane');
        const indicators = this.ensureIndicators($pane);
        if (!indicators) return;

        const paneWidth = $pane[0].offsetWidth;
        const paneOffset = $pane.offset().left;
        const pageX = e.type.includes('touch') ? (e.touches[0].pageX || e.originalEvent.touches[0].pageX) : e.pageX;
        const mouseX = pageX - paneOffset;
        
        const $links = $pane.find('.link');
        const baseWidth = $links.length ? $links[0].offsetWidth : 0;
        const expandedWidth = baseWidth + (this.expansionOffset * 2);
        
        let targetX = mouseX - (expandedWidth / 2);
        const minX = -this.clampingOffset;
        const maxX = (paneWidth - expandedWidth) + this.clampingOffset;
        targetX = Math.max(minX, Math.min(targetX, maxX));

        indicators.$hoverH.css({
          'transition': 'none', 
          'transform': `translate3d(${targetX}px, 0, 0)`,
          'width': `${expandedWidth}px`
        });

        const indicatorCenter = targetX + (expandedWidth / 2);
        const maxScale = 1.35; 
        const effectRange = baseWidth * 0.85; 

        let currentFocusIndex = -1;

        window.requestAnimationFrame(() => {
          $links.each((el, index) => {
            const $el = $(el);
            const linkMid = el.offsetLeft + (el.offsetWidth / 2);
            const distance = Math.abs(indicatorCenter - linkMid);
            
            if (distance < effectRange) {
              const factor = 1 - (distance / effectRange); 
              const smoothFactor = 0.5 * (1 + Math.cos(Math.PI * (1 - factor)));
              const scale = 1 + (maxScale - 1) * smoothFactor;
              
              el.style.transition = 'none'; 
              el.style.transform = `scale(${scale})`;
              el.style.zIndex = '10';

              if (distance < baseWidth / 2) {
                currentFocusIndex = index;
                if (!$el.hasClass('link-active')) {
                   $pane.find('.link-active').removeClass('link-active');
                   $el.addClass('link-active');
                }
              }
            } else {
              el.style.transition = 'transform 200ms ease-out';
              el.style.transform = 'scale(1)';
              el.style.zIndex = '5';
            }
          });

          if (currentFocusIndex !== -1 && currentFocusIndex !== this.lastFocussedIndex) {
            this.triggerHaptic();
            this.lastFocussedIndex = currentFocusIndex;
          }
        });
      },

      updatePress(linkEl, $toolbar, isActive) {
        const $ = app.$;
        const $pane = $toolbar.find('.toolbar-pane');
        const indicators = this.ensureIndicators($pane);
        if (!indicators) return;

        if (!isActive) {
          clearTimeout(this.longPressTimer);
          $pane.removeClass('is-pressed');
          this.lastFocussedIndex = -1;
          
          $pane.find('.link').css({
            'transition': 'transform 250ms ease-out',
            'transform': 'scale(1)'
          });
          
          indicators.$hoverH.removeClass('is-active').css('opacity', '0');
          indicators.$activeH.removeClass('is-hidden');
          this.isPressed = false;
          this.isLongPress = false;
          return;
        }

        this.isPressed = true;
        this.$activeToolbar = $toolbar;

        this.longPressTimer = setTimeout(() => {
          if (this.isPressed) {
            this.isLongPress = true;
            $pane.addClass('is-pressed');
            this.triggerHaptic();
            
            const targetWidth = linkEl.offsetWidth + (this.expansionOffset * 2);
            const targetX = linkEl.offsetLeft - this.expansionOffset;

            indicators.$hoverH.css({
              'transition': 'opacity 150ms, width 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              'opacity': '1',
              'width': `${targetWidth}px`,
              'transform': `translate3d(${targetX}px, 0, 0)`
            });
            indicators.$activeH.addClass('is-hidden').css('opacity', '0');
            requestAnimationFrame(() => indicators.$hoverH.addClass('is-active'));
          }
        }, 150);
      },

      reset() {
        if (this.isPressed && this.$activeToolbar) {
          this.updatePress(null, this.$activeToolbar, false);
          this.update(this.$activeToolbar, true);
        }
      }
    };
  },
  on: {
    init() {
      const app = this;
      const $ = app.$;

      $(document).on('mousedown touchstart', '.toolbar-highlight-enabled .link', function (e) {
        app.toolbarHighlight.updatePress(this, $(this).closest('.toolbar'), true);
      });

      $(document).on('mousemove touchmove', function (e) {
        if (app.toolbarHighlight.isPressed) app.toolbarHighlight.followMouse(e);
      });

      $(document).on('mouseup touchend', function (e) {
        if (!app.toolbarHighlight.isPressed || !app.toolbarHighlight.$activeToolbar) return;

        const $toolbar = app.toolbarHighlight.$activeToolbar;
        const $pane = $toolbar.find('.toolbar-pane');
        const indicators = app.toolbarHighlight.ensureIndicators($pane);
        let $finalLink = null;

        if (app.toolbarHighlight.isLongPress) {
          $finalLink = $pane.find('.link-active');
          
          const isFirst = $finalLink.index() === 0;
          const extraPadding = isFirst ? 2 : 0;

          const matrix = indicators.$hoverH.css('transform');
          let currentX = 0;
          if (matrix && matrix !== 'none') {
              const parts = matrix.split(',');
              currentX = parseFloat(parts[4] || parts[12] || 0);
          }
          const currentWidth = indicators.$hoverH[0].offsetWidth + extraPadding;

          indicators.$activeH.removeClass('is-hidden').css({
            'transition': 'none',
            'transform': `translate3d(${currentX}px, 0, 0)`,
            'width': `${currentWidth}px`,
            'opacity': '1'
          });
        } else {
          const pageX = e.type.includes('touch') ? e.changedTouches[0].pageX : e.pageX;
          const pageY = e.type.includes('touch') ? e.changedTouches[0].pageY : e.pageY;
          const targetEl = document.elementFromPoint(pageX - window.pageXOffset, pageY - window.pageYOffset);
          const $clickedLink = $(targetEl).closest('.link');
          
          if ($clickedLink.length) {
            $finalLink = $clickedLink;
            $toolbar.find('.link-active').removeClass('link-active');
            $finalLink.addClass('link-active');

            indicators.$activeH.css({
              'transition': 'transform 400ms cubic-bezier(0.25, 0.1, 0.25, 1.0), width 400ms cubic-bezier(0.25, 0.1, 0.25, 1.0), opacity 200ms'
            });
          }
        }

        if ($finalLink && $finalLink.length) {
          const target = $finalLink.attr('data-target');
          if (target && target !== '#') {
             app.toolbarHighlight.triggerHaptic();
             setTimeout(() => (app.views.main || app.view.current).router.navigate(target), 200);
          }
        }

        app.toolbarHighlight.updatePress(null, $toolbar, false);
        app.toolbarHighlight.update($toolbar, !app.toolbarHighlight.isLongPress);
      });

      $(window).on('resize orientationchange', () => {
        setTimeout(() => {
          app.$('.toolbar-highlight-enabled').each((el) => app.toolbarHighlight.update(el, false));
        }, 150);
      });

      $(document).on('contextmenu', '.toolbar-highlight-enabled .link', (e) => e.preventDefault());
      $(window).on('blur', () => app.toolbarHighlight.reset());
      $(document).on('visibilitychange', () => { if (document.visibilityState === 'hidden') app.toolbarHighlight.reset(); });
      $(document).on('touchcancel', () => app.toolbarHighlight.reset());
      $(document).on('click', '.toolbar-highlight-enabled .link', (e) => e.preventDefault());
    },
    pageInit(page) {
      const app = this;
      page.$el.find('.toolbar-highlight-enabled').each((el) => app.toolbarHighlight.update(el, false));
    }
  }
};

Framework7.use(ToolbarHighlightPlugin);
