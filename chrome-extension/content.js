// GetSetMart Password-Manager Style Pure Programmatic DOM Auto-Fill Engine for Meesho, Flipkart & Amazon

// Global error boundary to prevent extension context crashes
window.addEventListener('error', (e) => {
  if (e.message && e.message.includes('Extension context invalidated')) {
    console.warn('[GetSetMart] Extension updated. Please refresh webpage.');
  }
});

// Check if extension context is valid
function isExtensionValid() {
  return typeof chrome !== 'undefined' && chrome.runtime && !!chrome.runtime.id;
}

// Safe Chrome Storage wrappers to prevent content script context errors
function safeStorageGet(keys, callback) {
  try {
    if (isExtensionValid() && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(keys, (res) => {
        if (isExtensionValid() && chrome.runtime.lastError) {
          callback({});
        } else {
          callback(res || {});
        }
      });
    } else {
      callback({});
    }
  } catch (e) {
    callback({});
  }
}

function safeStorageSet(data, callback) {
  try {
    if (isExtensionValid() && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set(data, () => {
        if (callback) callback();
      });
    } else if (callback) {
      callback();
    }
  } catch (e) {
    if (callback) callback();
  }
}

// Gold-standard React 16+ / Angular native setter bypass supporting INPUT, TEXTAREA, and SELECT
function fillNativeReactInput(el, val) {
  if (!el || val === undefined || val === null || val === '') return false;

  try {
    el.focus();

    const tag = el.tagName ? el.tagName.toUpperCase() : 'INPUT';
    let prototype = window.HTMLInputElement.prototype;
    if (tag === 'TEXTAREA') prototype = window.HTMLTextAreaElement.prototype;
    if (tag === 'SELECT') prototype = window.HTMLSelectElement.prototype;

    const nativeSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;

    if (nativeSetter) {
      nativeSetter.call(el, val);
    } else {
      el.value = val;
    }

    // Fire full synthetic event sequence to trigger native component validation listeners
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new Event('blur', { bubbles: true }));
    return true;
  } catch (err) {
    try {
      el.value = val;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    } catch (e) {
      return false;
    }
  }
}

// Scrape currently filled input fields from active HTML DOM
function scrapeDOMFormFields() {
  const scraped = {
    title: '',
    hsn: '',
    gst: '',
    fabric: '',
    brand: 'GetSetMart',
    price: '',
    cost: '',
    sku: '',
    description: ''
  };

  try {
    const allInputs = Array.from(document.querySelectorAll('input, textarea, select'));

    allInputs.forEach(input => {
      const val = (input.value || '').trim();
      if (!val) return;

      const attrStr = `${input.name} ${input.id} ${input.placeholder} ${input.getAttribute('aria-label') || ''}`.toLowerCase();

      if (attrStr.includes('hsn') && !scraped.hsn) {
        scraped.hsn = val;
      } else if (attrStr.includes('gst') && !scraped.gst) {
        scraped.gst = val;
      } else if ((attrStr.includes('title') || attrStr.includes('product name') || attrStr.includes('item_name')) && !scraped.title) {
        scraped.title = val;
      } else if ((attrStr.includes('desc') || input.tagName === 'TEXTAREA') && !scraped.description) {
        scraped.description = val;
      } else if (attrStr.includes('brand') && !scraped.brand) {
        scraped.brand = val;
      } else if (attrStr.includes('sku') && !scraped.sku) {
        scraped.sku = val;
      } else if ((attrStr.includes('price') || attrStr.includes('mrp') || attrStr.includes('sp')) && !scraped.price) {
        scraped.price = val;
      } else if ((attrStr.includes('fabric') || attrStr.includes('material')) && !scraped.fabric) {
        scraped.fabric = val;
      }
    });
  } catch (err) {
    console.error('[GetSetMart Scraper Error]', err);
  }

  return scraped;
}

// Inject Pure Programmatic Shadow DOM Password Manager Widget (Zero innerHTML, Zero CSS Strings)
function injectPureProgrammaticWidget() {
  if (document.getElementById('gsm-autofill-host')) return;

  const host = document.createElement('div');
  host.id = 'gsm-autofill-host';
  host.style.position = 'fixed';
  host.style.bottom = '24px';
  host.style.right = '24px';
  host.style.zIndex = '2147483647';

  const shadow = host.attachShadow({ mode: 'open' });

  // Main Container Box
  const bar = document.createElement('div');
  bar.style.backgroundColor = '#09090b';
  bar.style.border = '1px solid #dc2626';
  bar.style.borderRadius = '12px';
  bar.style.padding = '14px 18px';
  bar.style.boxShadow = '0 12px 36px rgba(0,0,0,0.85)';
  bar.style.color = '#ffffff';
  bar.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  bar.style.width = '300px';
  bar.style.boxSizing = 'border-box';

  // Header Box
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.marginBottom = '10px';

  const title = document.createElement('div');
  title.style.fontWeight = '800';
  title.style.fontSize = '13px';
  title.style.color = '#ef4444';
  title.style.letterSpacing = '0.5px';
  title.textContent = '🔐 GETSETMART AUTO-FILL';

  const badge = document.createElement('div');
  badge.style.fontSize = '10px';
  badge.style.backgroundColor = '#064e3b';
  badge.style.color = '#34d399';
  badge.style.padding = '2px 6px';
  badge.style.borderRadius = '4px';
  badge.style.fontWeight = '700';
  badge.textContent = 'PURE DOM READY';

  header.appendChild(title);
  header.appendChild(badge);

  // Description Text
  const desc = document.createElement('div');
  desc.style.fontSize = '11px';
  desc.style.color = '#9ca3af';
  desc.style.marginBottom = '10px';
  desc.style.lineHeight = '1.4';
  desc.textContent = 'Password-manager engine ready. Select template to auto-fill React DOM fields:';

  // Dropdown Select
  const sel = document.createElement('select');
  sel.style.width = '100%';
  sel.style.backgroundColor = '#18181b';
  sel.style.color = '#ffffff';
  sel.style.border = '1px solid #3f3f46';
  sel.style.padding = '8px 10px';
  sel.style.borderRadius = '6px';
  sel.style.fontSize = '12px';
  sel.style.marginBottom = '8px';
  sel.style.boxSizing = 'border-box';
  sel.style.outline = 'none';
  sel.style.cursor = 'pointer';

  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.textContent = '-- Loading Saved Templates --';
  sel.appendChild(defaultOpt);

  // Template Name Input
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.placeholder = 'Enter Template Name to Save...';
  nameInput.style.width = '100%';
  nameInput.style.backgroundColor = '#18181b';
  nameInput.style.color = '#ffffff';
  nameInput.style.border = '1px solid #3f3f46';
  nameInput.style.padding = '7px 10px';
  nameInput.style.borderRadius = '6px';
  nameInput.style.fontSize = '11px';
  nameInput.style.marginBottom = '10px';
  nameInput.style.boxSizing = 'border-box';
  nameInput.style.outline = 'none';

  // Button Group Box
  const btnGroup = document.createElement('div');
  btnGroup.style.display = 'flex';
  btnGroup.style.gap = '8px';

  const fillBtn = document.createElement('button');
  fillBtn.style.flex = '1';
  fillBtn.style.backgroundColor = '#dc2626';
  fillBtn.style.color = '#ffffff';
  fillBtn.style.border = 'none';
  fillBtn.style.padding = '10px';
  fillBtn.style.borderRadius = '6px';
  fillBtn.style.fontWeight = '700';
  fillBtn.style.fontSize = '12px';
  fillBtn.style.cursor = 'pointer';
  fillBtn.textContent = '⚡ Auto-Fill';

  const saveBtn = document.createElement('button');
  saveBtn.style.flex = '1';
  saveBtn.style.backgroundColor = '#2563eb';
  saveBtn.style.color = '#ffffff';
  saveBtn.style.border = 'none';
  saveBtn.style.padding = '10px';
  saveBtn.style.borderRadius = '6px';
  saveBtn.style.fontWeight = '700';
  saveBtn.style.fontSize = '12px';
  saveBtn.style.cursor = 'pointer';
  saveBtn.textContent = '💾 Save Form';

  btnGroup.appendChild(fillBtn);
  btnGroup.appendChild(saveBtn);

  bar.appendChild(header);
  bar.appendChild(desc);
  bar.appendChild(sel);
  bar.appendChild(nameInput);
  bar.appendChild(btnGroup);

  shadow.appendChild(bar);
  document.body.appendChild(host);

  // Refresh Dropdown in Shadow DOM
  const refreshDropdown = () => {
    safeStorageGet(['gsm_listing_templates'], (result) => {
      const templates = result.gsm_listing_templates || {};
      sel.innerHTML = '';
      const keys = Object.keys(templates);

      if (keys.length === 0) {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = '-- No Templates Saved --';
        sel.appendChild(opt);
        return;
      }

      keys.forEach(k => {
        const tpl = templates[k];
        if (tpl && tpl.name) {
          const opt = document.createElement('option');
          opt.value = k;
          opt.textContent = tpl.name;
          sel.appendChild(opt);
        }
      });
    });
  };

  refreshDropdown();

  // Save Form Handler
  saveBtn.addEventListener('click', () => {
    try {
      if (!isExtensionValid()) {
        alert("⚠️ Extension updated. Please refresh (F5) this webpage!");
        return;
      }

      const scraped = scrapeDOMFormFields();
      let count = 0;
      Object.values(scraped).forEach(v => { if (v) count++; });

      if (count === 0) {
        alert("⚠️ No filled input fields found on screen! Please type product details in the form first.");
        return;
      }

      const customName = nameInput ? nameInput.value.trim() : '';
      const finalTplName = customName || (scraped.title ? scraped.title.substring(0, 25) : `Meesho Listing ${new Date().toLocaleTimeString()}`);

      const tplId = `tpl_${Date.now()}`;
      const newTplData = {
        id: tplId,
        name: finalTplName,
        title: scraped.title || finalTplName,
        hsn: scraped.hsn || '61091000',
        gst: scraped.gst || '5',
        fabric: scraped.fabric || 'Cotton',
        brand: scraped.brand || 'GetSetMart',
        price: scraped.price || '999',
        cost: scraped.cost || '300',
        description: scraped.description || ''
      };

      safeStorageGet(['gsm_listing_templates'], (res) => {
        const current = res.gsm_listing_templates || {};
        current[tplId] = newTplData;
        safeStorageSet({ gsm_listing_templates: current, gsm_templates_initialized: true }, () => {
          refreshDropdown();
          if (nameInput) nameInput.value = '';
          alert(`🎉 Success! Saved template "${finalTplName}" (${count} fields). Next time click ⚡ Auto-Fill!`);
        });
      });
    } catch (e) {
      alert("⚠️ Error saving template. Please refresh the page and try again.");
    }
  });

  // Auto-Fill Handler
  fillBtn.addEventListener('click', () => {
    try {
      if (!isExtensionValid()) {
        alert("⚠️ Extension updated. Please refresh (F5) this webpage!");
        return;
      }

      const selectedId = sel ? sel.value : '';
      if (!selectedId) {
        alert("⚠️ Please select a template to auto-fill!");
        return;
      }

      safeStorageGet(['gsm_listing_templates'], (res) => {
        const templates = res.gsm_listing_templates || {};
        const tpl = templates[selectedId];
        if (!tpl) return alert("⚠️ Selected template not found!");

        let filledCount = 0;
        const allInputs = Array.from(document.querySelectorAll('input, textarea, select'));

        allInputs.forEach(input => {
          try {
            const attrStr = `${input.name} ${input.id} ${input.placeholder} ${input.getAttribute('aria-label') || ''}`.toLowerCase();

            if (attrStr.includes('hsn')) {
              if (fillNativeReactInput(input, tpl.hsn)) filledCount++;
            } else if (attrStr.includes('gst')) {
              if (fillNativeReactInput(input, tpl.gst)) filledCount++;
            } else if (attrStr.includes('title') || attrStr.includes('product name') || attrStr.includes('item_name')) {
              if (fillNativeReactInput(input, tpl.title)) filledCount++;
            } else if (attrStr.includes('desc') || input.tagName === 'TEXTAREA') {
              if (fillNativeReactInput(input, tpl.description)) filledCount++;
            } else if (attrStr.includes('brand')) {
              if (fillNativeReactInput(input, tpl.brand || 'GetSetMart')) filledCount++;
            } else if (attrStr.includes('sku')) {
              if (fillNativeReactInput(input, tpl.sku || `GSM-SKU-${Date.now()}`)) filledCount++;
            } else if (attrStr.includes('price') || attrStr.includes('mrp') || attrStr.includes('sp')) {
              if (fillNativeReactInput(input, tpl.price)) filledCount++;
            } else if (attrStr.includes('fabric') || attrStr.includes('material')) {
              if (fillNativeReactInput(input, tpl.fabric)) filledCount++;
            } else if (attrStr.includes('country') || attrStr.includes('origin')) {
              if (fillNativeReactInput(input, 'India')) filledCount++;
            }
          } catch (e) {
            // Ignore single field errors
          }
        });

        alert(`⚡ Success! Auto-filled ${filledCount} fields using "${tpl.name}".`);
      });
    } catch (e) {
      alert("⚠️ Error during auto-fill. Please refresh the page and try again.");
    }
  });
}

// Auto-inject Pure Programmatic Widget on Meesho, Flipkart & Amazon Listing pages
if (window.location.href.includes('meesho.com') || window.location.href.includes('flipkart.com') || window.location.href.includes('amazon.in')) {
  setTimeout(injectPureProgrammaticWidget, 1500);
}

// Listen for messages from extension popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    if (request.action === 'AUTOFILL_LISTING') {
      const data = request.templateData || {};
      let count = 0;

      const allInputs = Array.from(document.querySelectorAll('input, textarea, select'));

      allInputs.forEach(input => {
        try {
          const attrStr = `${input.name} ${input.id} ${input.placeholder} ${input.getAttribute('aria-label') || ''}`.toLowerCase();

          if (attrStr.includes('hsn')) {
            if (fillNativeReactInput(input, data.hsn)) count++;
          } else if (attrStr.includes('gst')) {
            if (fillNativeReactInput(input, data.gst)) count++;
          } else if (attrStr.includes('title') || attrStr.includes('product name') || attrStr.includes('item_name')) {
            if (fillNativeReactInput(input, data.title)) count++;
          } else if (attrStr.includes('desc') || input.tagName === 'TEXTAREA') {
            if (fillNativeReactInput(input, data.description)) count++;
          } else if (attrStr.includes('brand')) {
            if (fillNativeReactInput(input, data.brand || 'GetSetMart')) count++;
          } else if (attrStr.includes('sku')) {
            if (fillNativeReactInput(input, data.sku || `GSM-SKU-${Date.now()}`)) count++;
          } else if (attrStr.includes('price') || attrStr.includes('mrp') || attrStr.includes('sp')) {
            if (fillNativeReactInput(input, data.price)) count++;
          } else if (attrStr.includes('fabric') || attrStr.includes('material')) {
            if (fillNativeReactInput(input, data.fabric)) count++;
          } else if (attrStr.includes('country') || attrStr.includes('origin')) {
            if (fillNativeReactInput(input, 'India')) count++;
          }
        } catch (e) {
          // Ignore single field errors
        }
      });

      sendResponse({ success: true, count });
    } else if (request.action === 'CAPTURE_FORM_DATA') {
      const formData = scrapeDOMFormFields();
      sendResponse({ success: true, formData });
    }
  } catch (err) {
    sendResponse({ success: false, error: err.message });
  }
  return true;
});
