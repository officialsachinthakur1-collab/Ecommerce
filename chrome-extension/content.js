// GetSetMart Password-Manager Style Isolated Shadow DOM Auto-Fill Engine for Meesho, Flipkart & Amazon

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

// Inject Isolated Shadow DOM Password Manager Widget
function injectIsolatedShadowWidget() {
  if (document.getElementById('gsm-autofill-host')) return;

  const host = document.createElement('div');
  host.id = 'gsm-autofill-host';
  host.style.cssText = 'position: fixed; bottom: 24px; right: 24px; z-index: 999999999;';

  const shadow = host.attachShadow({ mode: 'open' });

  const container = document.createElement('div');
  container.id = 'gsm-autofill-bar';
  container.innerHTML = `
    <style>
      .bar {
        background: #09090b;
        border: 1px solid #dc2626;
        border-radius: 12px;
        padding: 14px 18px;
        box-shadow: 0 12px 36px rgba(0,0,0,0.85);
        color: #ffffff;
        font-family: system-ui, -apple-system, sans-serif;
        width: 300px;
        box-sizing: border-box;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
      .title {
        font-weight: 800;
        font-size: 13px;
        color: #ef4444;
        letter-spacing: 0.5px;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .badge {
        font-size: 10px;
        background: #064e3b;
        color: #34d399;
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: 700;
      }
      .desc {
        font-size: 11px;
        color: #9ca3af;
        margin-bottom: 10px;
        line-height: 1.4;
      }
      select, input {
        width: 100%;
        background: #18181b;
        color: white;
        border: 1px solid #3f3f46;
        padding: 8px 10px;
        border-radius: 6px;
        font-size: 12px;
        margin-bottom: 8px;
        box-sizing: border-box;
        outline: none;
      }
      .btn-group {
        display: flex;
        gap: 8px;
      }
      button {
        flex: 1;
        border: none;
        padding: 10px;
        border-radius: 6px;
        font-weight: 700;
        font-size: 12px;
        cursor: pointer;
      }
      .btn-fill {
        background: #dc2626;
        color: white;
      }
      .btn-fill:hover {
        background: #b91c1c;
      }
      .btn-save {
        background: #2563eb;
        color: white;
      }
      .btn-save:hover {
        background: #1d4ed8;
      }
    </style>
    <div class="bar">
      <div class="header">
        <div class="title">🔐 GETSETMART AUTO-FILL</div>
        <div class="badge">SHADOW DOM</div>
      </div>
      <div class="desc">Password-manager engine ready. Select template to auto-fill React DOM fields:</div>
      <select id="gsm-dom-template-select">
        <option value="">-- Loading Saved Templates --</option>
      </select>
      <input type="text" id="gsm-dom-tpl-name" placeholder="Enter Template Name to Save..." />
      <div class="btn-group">
        <button id="gsm-dom-autofill-btn" class="btn-fill">⚡ Auto-Fill</button>
        <button id="gsm-dom-save-btn" class="btn-save">💾 Save Form</button>
      </div>
    </div>
  `;

  shadow.appendChild(container);
  document.body.appendChild(host);

  const sel = shadow.getElementById('gsm-dom-template-select');
  const nameInput = shadow.getElementById('gsm-dom-tpl-name');
  const autofillBtn = shadow.getElementById('gsm-dom-autofill-btn');
  const saveBtn = shadow.getElementById('gsm-dom-save-btn');

  // Refresh Dropdown in Shadow DOM
  const refreshDropdown = () => {
    if (!sel) return;
    safeStorageGet(['gsm_listing_templates'], (result) => {
      const templates = result.gsm_listing_templates || {};
      sel.innerHTML = '';
      const keys = Object.keys(templates);

      if (keys.length === 0) {
        sel.innerHTML = '<option value="">-- No Templates Saved --</option>';
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
  autofillBtn.addEventListener('click', () => {
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

// Auto-inject Password Manager Widget on Meesho, Flipkart & Amazon Listing pages
if (window.location.href.includes('meesho.com') || window.location.href.includes('flipkart.com') || window.location.href.includes('amazon.in')) {
  setTimeout(injectIsolatedShadowWidget, 1500);
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
