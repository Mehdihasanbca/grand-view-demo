/* GRAND VIEW CERAMIC AND MARBLE WORK — shared site behaviour
   Plain vanilla JS, no dependencies. Runs on every page. */
(() => {
  'use strict';

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (menuButton && nav) {
    const setMenu = (open) => {
      nav.classList.toggle('is-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      menuButton.textContent = open ? '×' : '☰';
    };
    menuButton.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
    nav.querySelectorAll('a').forEach((link) =>
      link.addEventListener('click', () => setMenu(false))
    );
    // Close on Escape for keyboard users.
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenu(false);
        menuButton.focus();
      }
    });
    // Use capture phase so this fires before the nav's own handlers,
    // ensuring reliable outside-click detection even when nav overlaps content.
    document.addEventListener('click', (event) => {
      if (!nav.classList.contains('is-open')) return;
      if (!nav.contains(event.target) && !menuButton.contains(event.target)) setMenu(false);
    }, { capture: true });
  }

  /* ---------- Scroll Progress Indicator ---------- */
  const progressBar = document.querySelector('#scroll-progress-bar');
  if (progressBar) {
    const onScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      progressBar.style.width = Math.min(100, Math.max(0, scrolled)) + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-current-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Remote image fallback ----------
     Remote Unsplash photos need an internet connection. If one fails to
     load (offline, blocked CDN, etc.) swap in the on-brand placeholder. */
  const PLACEHOLDER = 'assets/images/placeholder.svg';
  document.querySelectorAll('img').forEach((img) => {
    const fail = () => {
      if (img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied = 'true';
      img.classList.add('is-fallback');
      img.src = PLACEHOLDER;
    };
    img.addEventListener('error', fail);
    // Catch images that already errored before this script ran.
    if (img.complete && img.naturalWidth === 0) fail();
  });

  /* ---------- WhatsApp enquiry form ---------- */
  const form = document.querySelector('#enquiry-form');
  if (form) {
    // Disable native browser constraint validation UI so our custom status
    // message (aria-live) always fires. The required attributes remain in HTML
    // for semantics and no-JS fallback; we re-implement the check ourselves.
    form.noValidate = true;

    const status = document.querySelector('#form-status');
    const setStatus = (message, state) => {
      if (!status) return;
      status.textContent = message;
      status.classList.remove('is-error', 'is-success');
      if (state) status.classList.add(state);
    };

    // Friendly, accessible per-field validation on blur.
    form.querySelectorAll('input, select, textarea').forEach((field) => {
      field.addEventListener('blur', () => {
        const wrap = field.closest('.field');
        if (!wrap) return;
        const invalid = !field.checkValidity();
        wrap.classList.toggle('has-error', invalid && field.value !== '');
        let msg = wrap.querySelector('.field-error');
        if (invalid && field.value !== '') {
          if (!msg) {
            msg = document.createElement('small');
            msg.className = 'field-error';
            wrap.appendChild(msg);
          }
          msg.textContent = field.validationMessage || 'Please complete this field.';
        } else if (msg) {
          msg.remove();
        }
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        setStatus('Please complete the required fields marked with * before continuing.', 'is-error');
        // Focus the first invalid field for accessibility.
        const firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      const data = new FormData(form);
      const service = (data.get('service') || '').toString().trim() || 'General enquiry';
      const message = [
        'Hello GRAND VIEW CERAMIC AND MARBLE WORK,',
        '',
        'I would like to enquire about your services.',
        'Name: ' + (data.get('name') || '').toString().trim(),
        'Phone: ' + (data.get('phone') || '').toString().trim(),
        'Location: ' + ((data.get('location') || '').toString().trim() || 'Not provided'),
        'Email: ' + ((data.get('email') || '').toString().trim() || 'Not provided'),
        'Service required: ' + service,
        'Project details: ' + (data.get('message') || '').toString().trim(),
        '',
        'Please contact me to discuss the next steps.'
      ].join('\n');
      const url = 'https://wa.me/971581645299?text=' + encodeURIComponent(message);
      window.open(url, '_blank', 'noopener,noreferrer');
      setStatus(
        'Your enquiry message has been prepared in WhatsApp. Please review it and press Send in WhatsApp.',
        'is-success'
      );
    });
  }

  /* ---------- NX-6 & NX-7: Material Category Filter Tabs & Preview ---------- */
  const materialTabs = document.querySelectorAll('.material-tab-btn');
  const materialCards = document.querySelectorAll('.material-card');
  const previewImg = document.querySelector('#mat-preview-img');
  const previewTitle = document.querySelector('#mat-preview-title');
  const previewDesc = document.querySelector('#mat-preview-desc');
  const previewTag = document.querySelector('#mat-preview-tag');
  const previewFormat = document.querySelector('#mat-preview-format');
  const previewEnquiry = document.querySelector('#mat-preview-enquiry');

  if (materialTabs.length > 0 && materialCards.length > 0) {
    const updatePreviewFromCard = (card) => {
      if (!card) return;
      const title = card.querySelector('h3')?.textContent || '';
      const desc = card.querySelector('p')?.textContent || '';
      const tag = card.querySelector('.material-card-tag')?.textContent || '';
      const imgSrc = card.querySelector('img')?.getAttribute('src') || '';
      const specs = card.querySelectorAll('.material-specs li span:last-child');
      const format = specs[0]?.textContent || '';

      if (previewTitle) previewTitle.textContent = title;
      if (previewDesc) previewDesc.textContent = desc;
      if (previewTag) previewTag.textContent = tag;
      if (previewImg && imgSrc) previewImg.setAttribute('src', imgSrc);
      if (previewFormat) previewFormat.textContent = format;

      if (previewEnquiry) {
        const msg = 'Hello Grand View, I would like to enquire about material options for: ' + title;
        previewEnquiry.setAttribute('href', 'https://wa.me/971581645299?text=' + encodeURIComponent(msg));
      }
    };

    materialTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const cat = tab.dataset.category;
        materialTabs.forEach((t) => t.classList.toggle('is-active', t === tab));
        let firstVisible = null;
        materialCards.forEach((card) => {
          if (cat === 'all' || card.dataset.category === cat) {
            card.style.display = 'flex';
            if (!firstVisible) firstVisible = card;
          } else {
            card.style.display = 'none';
          }
        });
        if (firstVisible) updatePreviewFromCard(firstVisible);
      });
    });

    materialCards.forEach((card) => {
      card.addEventListener('click', () => {
        updatePreviewFromCard(card);
      });
    });
  }

  /* ---------- NX-6: Tile Area Calculator ---------- */
  const calcContainer = document.querySelector('#tile-calculator');
  if (calcContainer) {
    const lenInput = calcContainer.querySelector('#calc-length');
    const widthInput = calcContainer.querySelector('#calc-width');
    const tileSelect = calcContainer.querySelector('#calc-tile-size');
    const wasteSelect = calcContainer.querySelector('#calc-waste');
    const resArea = calcContainer.querySelector('#calc-res-area');
    const resTiles = calcContainer.querySelector('#calc-res-tiles');
    const resBoxes = calcContainer.querySelector('#calc-res-boxes');
    const resWaste = calcContainer.querySelector('#calc-res-waste');
    const shareBtn = calcContainer.querySelector('#calc-share-whatsapp');
    const copyBtn = calcContainer.querySelector('#calc-copy-btn');
    const copyStatus = calcContainer.querySelector('#calc-copy-status');

    const updateCalc = () => {
      const len = parseFloat(lenInput?.value) || 0;
      const wid = parseFloat(widthInput?.value) || 0;
      const tileArea = parseFloat(tileSelect?.value) || 0.36; // default 60x60 = 0.36m2
      const wastePct = parseFloat(wasteSelect?.value) || 0.10; // default 10%
      const tilesPerBox = parseFloat(tileSelect?.selectedOptions[0]?.dataset.perBox) || 4;
      const tileLabel = tileSelect?.selectedOptions[0]?.textContent || '60×60 cm';

      const netArea = len * wid;
      const grossArea = netArea * (1 + wastePct);
      const estTiles = Math.ceil(grossArea / tileArea);
      const estBoxes = Math.ceil(estTiles / tilesPerBox);

      if (resArea) resArea.textContent = netArea > 0 ? netArea.toFixed(2) + ' m²' : '—';
      if (resWaste) resWaste.textContent = netArea > 0 ? (grossArea - netArea).toFixed(2) + ' m² (' + Math.round(wastePct * 100) + '%)' : '—';
      if (resTiles) resTiles.textContent = netArea > 0 ? estTiles.toLocaleString() + ' tiles' : '—';
      if (resBoxes) resBoxes.textContent = netArea > 0 ? estBoxes.toLocaleString() + ' boxes' : '—';

      // Update pattern visualizer grid
      const visGrid = calcContainer.querySelector('#calc-vis-grid');
      const visCaption = calcContainer.querySelector('#calc-vis-caption');
      if (visGrid) {
        const aspect = tileSelect?.selectedOptions[0]?.dataset.aspect;
        const isRect = aspect === '1/2';
        visGrid.classList.toggle('is-rectangular', isRect);
        if (visCaption) {
          const rawFormat = tileLabel.split('(')[0].trim();
          visCaption.textContent = rawFormat + ' Alignment Preview';
        }
      }

      // Live update WhatsApp share link
      if (shareBtn && netArea > 0) {
        const msg = [
          'Hello GRAND VIEW CERAMIC AND MARBLE WORK,',
          '',
          'I estimated my room requirements using your Tile Area Calculator:',
          '- Room Dimensions: ' + len + 'm × ' + wid + 'm',
          '- Net Surface Area: ' + netArea.toFixed(2) + ' m²',
          '- Format: ' + tileLabel,
          '- Cutting Allowance: ' + Math.round(wastePct * 100) + '%',
          '- Estimated Tiles: ' + estTiles + ' pieces (~' + estBoxes + ' boxes)',
          '- Location: Abu Dhabi, UAE',
          '',
          'Please let me know your recommendations and next steps.'
        ].join('\n');
        shareBtn.setAttribute('href', 'https://wa.me/971581645299?text=' + encodeURIComponent(msg));
      }
    };

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const len = lenInput?.value || '0';
        const wid = widthInput?.value || '0';
        const area = resArea?.textContent || '0 m²';
        const tiles = resTiles?.textContent || '0 tiles';
        const boxes = resBoxes?.textContent || '0 boxes';
        const summary = 'Grand View Tile Estimate: Room ' + len + 'm x ' + wid + 'm | Net Area: ' + area + ' | Est. Tiles: ' + tiles + ' (' + boxes + ')';

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(summary).then(() => {
            if (copyStatus) {
              copyStatus.style.display = 'block';
              copyStatus.textContent = 'Calculation summary copied to clipboard!';
              setTimeout(() => { copyStatus.style.display = 'none'; }, 3500);
            }
          }).catch(() => {});
        }
      });
    }

    [lenInput, widthInput, tileSelect, wasteSelect].forEach((input) => {
      if (input) {
        input.addEventListener('input', updateCalc);
        input.addEventListener('change', updateCalc);
      }
    });
    updateCalc();
  }

  /* ---------- NX-6: Project Enquiry Builder ---------- */
  const builderContainer = document.querySelector('#project-enquiry-builder');
  if (builderContainer) {
    const propertyChips = builderContainer.querySelectorAll('[data-property]');
    const scopeChips = builderContainer.querySelectorAll('[data-scope]');
    const timelineChips = builderContainer.querySelectorAll('[data-timeline]');
    const sendBtn = builderContainer.querySelector('#builder-send-whatsapp');

    const setupChips = (chips) => {
      chips.forEach((chip) => {
        chip.addEventListener('click', () => {
          chips.forEach((c) => c.classList.remove('is-selected'));
          chip.classList.add('is-selected');
        });
      });
    };

    setupChips(propertyChips);
    setupChips(scopeChips);
    setupChips(timelineChips);

    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        const selectedProp = builderContainer.querySelector('[data-property].is-selected')?.textContent.trim() || 'Residential';
        const selectedScope = builderContainer.querySelector('[data-scope].is-selected')?.textContent.trim() || 'General Finishing';
        const selectedTimeline = builderContainer.querySelector('[data-timeline].is-selected')?.textContent.trim() || 'Flexible';

        const message = [
          'Hello GRAND VIEW CERAMIC AND MARBLE WORK,',
          '',
          'I would like to enquire using the Project Enquiry Builder:',
          'Property Type: ' + selectedProp,
          'Scope of Work: ' + selectedScope,
          'Target Timeline: ' + selectedTimeline,
          'Location: Abu Dhabi, UAE',
          '',
          'Please let me know the suitable next steps for a site discussion.'
        ].join('\n');

        const url = 'https://wa.me/971581645299?text=' + encodeURIComponent(message);
        window.open(url, '_blank', 'noopener,noreferrer');
      });
    }
  }

  /* ---------- Gallery Category Filter Tabs ---------- */
  const galleryTabs = document.querySelectorAll('.gallery-tab-btn');
  const galleryCards = document.querySelectorAll('.gallery-card[data-gallery-cat]');
  if (galleryTabs.length > 0 && galleryCards.length > 0) {
    galleryTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const filter = tab.dataset.galleryFilter;
        galleryTabs.forEach((t) => t.classList.toggle('is-active', t === tab));
        galleryCards.forEach((card) => {
          if (filter === 'all' || card.dataset.galleryCat === filter) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ---------- Plumbing & Sanitary Assessment Checklist ---------- */
  const plumbContainer = document.querySelector('#plumbing-scope-builder');
  if (plumbContainer) {
    const spaceChips = plumbContainer.querySelectorAll('[data-plumb-space]');
    const reqChips = plumbContainer.querySelectorAll('[data-plumb-req]');
    const timeChips = plumbContainer.querySelectorAll('[data-plumb-time]');
    const sendPlumbBtn = plumbContainer.querySelector('#plumbing-send-whatsapp');

    const setupChips = (chips) => {
      chips.forEach((chip) => {
        chip.addEventListener('click', () => {
          chips.forEach((c) => c.classList.remove('is-selected'));
          chip.classList.add('is-selected');
        });
      });
    };

    setupChips(spaceChips);
    setupChips(reqChips);
    setupChips(timeChips);

    if (sendPlumbBtn) {
      sendPlumbBtn.addEventListener('click', () => {
        const selectedSpace = plumbContainer.querySelector('[data-plumb-space].is-selected')?.textContent.trim() || 'Bathroom & Washroom';
        const selectedReq = plumbContainer.querySelector('[data-plumb-req].is-selected')?.textContent.trim() || 'Sanitary Ware & Mixer Fixtures';
        const selectedTime = plumbContainer.querySelector('[data-plumb-time].is-selected')?.textContent.trim() || 'Immediate / This Week';

        const message = [
          'Hello GRAND VIEW CERAMIC AND MARBLE WORK,',
          '',
          'I would like to enquire using the Plumbing & Sanitary Assessment Checklist:',
          'Area / Space: ' + selectedSpace,
          'Plumbing Requirement: ' + selectedReq,
          'Timing & Access: ' + selectedTime,
          'Location: Abu Dhabi, UAE',
          '',
          'Please let me know your recommendations and next steps for a site visit/discussion.'
        ].join('\n');

        const url = 'https://wa.me/971581645299?text=' + encodeURIComponent(message);
        window.open(url, '_blank', 'noopener,noreferrer');
      });
    }
  }

  /* ---------- Electrical & Lighting Scope Matrix ---------- */
  const elecContainer = document.querySelector('#electrical-scope-builder');
  if (elecContainer) {
    const spaceChips = elecContainer.querySelectorAll('[data-elec-space]');
    const reqChips = elecContainer.querySelectorAll('[data-elec-req]');
    const timeChips = elecContainer.querySelectorAll('[data-elec-time]');
    const sendElecBtn = elecContainer.querySelector('#electrical-send-whatsapp');

    const setupChips = (chips) => {
      chips.forEach((chip) => {
        chip.addEventListener('click', () => {
          chips.forEach((c) => c.classList.remove('is-selected'));
          chip.classList.add('is-selected');
        });
      });
    };

    setupChips(spaceChips);
    setupChips(reqChips);
    setupChips(timeChips);

    if (sendElecBtn) {
      sendElecBtn.addEventListener('click', () => {
        const selectedSpace = elecContainer.querySelector('[data-elec-space].is-selected')?.textContent.trim() || 'Villa Living & Majlis';
        const selectedReq = elecContainer.querySelector('[data-elec-req].is-selected')?.textContent.trim() || 'Architectural Lighting & Fixtures';
        const selectedTime = elecContainer.querySelector('[data-elec-time].is-selected')?.textContent.trim() || 'Immediate / This Week';

        const message = [
          'Hello GRAND VIEW CERAMIC AND MARBLE WORK,',
          '',
          'I would like to enquire using the Electrical & Lighting Scope Matrix:',
          'Area / Space: ' + selectedSpace,
          'Electrical Requirement: ' + selectedReq,
          'Timing & Access: ' + selectedTime,
          'Location: Abu Dhabi, UAE',
          '',
          'Please let me know your recommendations and next steps for a site visit/discussion.'
        ].join('\n');

        const url = 'https://wa.me/971581645299?text=' + encodeURIComponent(message);
        window.open(url, '_blank', 'noopener,noreferrer');
      });
    }
  }
})();

