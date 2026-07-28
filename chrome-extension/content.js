// GetSetMart Smart Auto-Learn & 1-Click Listing Assistant Content Script for Meesho, Flipkart & Amazon

let liveCapturedData = {
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

// Helper function to set input value & trigger native React/Angular events
function fillElement(el, val) {
  if (!el || val === undefined || val === null || val === '') return false;
  el.focus();
  el.value = val;
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
  el.dispatchEvent(new Event('blur', { bubbles: true }));
  return true;
}

// Scrape currently filled input fields from the active screen
function scrapeCurrentScreenFields() {
  const allInputs = Array.from(document.querySelectorAll('input, textarea, select'));

  allInputs.forEach(input => {
    const val = (input.value || '').trim();
    if (!val) return;

    const attrStr = `${input.name} ${input.id} ${input.placeholder} ${input.getAttribute('aria-label') || ''}`.toLowerCase();

    if (attrStr.includes('hsn') && !liveCapturedData.hsn) {
      liveCapturedData.hsn = val;
    } else if (attrStr.includes('gst') && !liveCapturedData.gst) {
      liveCapturedData.gst = val;
    } else if ((attrStr.includes('title') || attrStr.includes('product name') || attrStr.includes('item_name')) && !liveCapturedData.title) {
      liveCapturedData.title = val;
    } else if ((attrStr.includes('desc') || input.tagName === 'TEXTAREA') && !liveCapturedData.description) {
      liveCapturedData.description = val;
    } else if (attrStr.includes('brand') && !liveCapturedData.brand) {
      liveCapturedData.brand = val;
    } else if (attrStr.includes('sku') && !liveCapturedData.sku) {
      liveCapturedData.sku = val;
    } else if ((attrStr.includes('price') || attrStr.includes('mrp') || attrStr.includes('sp')) && !liveCapturedData.price) {
      liveCapturedData.price = val;
    } else if ((attrStr.includes('fabric') || attrStr.includes('material')) && !liveCapturedData.fabric) {
      liveCapturedData.fabric = val;
    }
  });

  return liveCapturedData;
}

// Count non-empty captured fields
function getCapturedFieldCount() {
  scrapeCurrentScreenFields();
  let count = 0;
  if (liveCapturedData.title) count++;
  if (liveCapturedData.hsn) count++;
  if (liveCapturedData.gst) count++;
  if (liveCapturedData.fabric) count++;
  if (liveCapturedData.price) count++;
  if (liveCapturedData.description) count++;
  return count;
}

// Inject Floating In-Page Widget for Meesho/Flipkart/Amazon Listing Pages
function injectFloatingWidget() {
  if (document.getElementById('gsm-floating-widget')) return;

  const widget = document.createElement('div');
  widget.id = 'gsm-floating-widget';
  widget.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 999999;
    background: #0d0d0d;
    border: 1px solid #ef4444;
    border-radius: 12px;
    padding: 14px 18px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.8);
    color: white;
    font-family: 'Segoe UI', Tahoma, sans-serif;
    width: 280px;
  `;

  widget.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <div style="font-weight: 800; font-size: 13px; color: #ef4444; letter-spacing: 0.5px;">GETSETMART AI LISTING</div>
      <div id="gsm-field-counter" style="font-size: 10px; background: #166534; color: #4ade80; padding: 2px 6px; border-radius: 4px; font-weight: 700;">🟢 WATCHING FORM</div>
    </div>

    <div style="font-size: 11px; color: #aaa; margin-bottom: 12px; line-height: 1.4;">
      Fill the form once. Click <b>Save Template</b> to record, then <b>Auto-Fill</b> next time!
    </div>

    <select id="gsm-widget-select" style="width: 100%; background: #1a1a1a; color: white; border: 1px solid #333; padding: 8px; border-radius: 6px; font-size: 12px; margin-bottom: 10px; cursor: pointer;">
      <option value="">-- Loading Templates --</option>
    </select>

    <div style="display: flex; gap: 8px;">
      <button id="gsm-widget-autofill" style="flex: 1; background: #ef4444; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: 700; font-size: 12px; cursor: pointer;">⚡ Auto-Fill</button>
      <button id="gsm-widget-save" style="flex: 1; background: #2563eb; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: 700; font-size: 12px; cursor: pointer;">💾 Save Form</button>
    </div>
  `;

  document.body.appendChild(widget);

  // Load Saved Templates into Widget Select
  const loadWidgetTemplates = () => {
    const sel = document.getElementById('gsm-widget-select');
    if (!sel) return;
    chrome.storage.local.get(['gsm_listing_templates'], (result) => {
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

  loadWidgetTemplates();

  // Widget Save Button Event
  document.getElementById('gsm-widget-save').addEventListener('click', () => {
    const scraped = scrapeCurrentScreenFields();
    const count = getCapturedFieldCount();
    if (count === 0) {
      alert("⚠️ Please fill out form fields (Title, HSN, Price, etc.) on screen first before saving!");
      return;
    }

    const name = prompt(`📷 Captured ${count} fields from screen! Enter Template Name (e.g. Anime Hoodie XL):`, scraped.title ? scraped.title.substring(0, 25) : 'My Meesho Product');
    if (!name) return;

    const tplId = `tpl_${Date.now()}`;
    const newTpl = {
      id: tplId,
      name: name,
      title: scraped.title || name,
      hsn: scraped.hsn || '61091000',
      gst: scraped.gst || '5',
      fabric: scraped.fabric || 'Cotton',
      brand: scraped.brand || 'GetSetMart',
      price: scraped.price || '999',
      cost: scraped.cost || '300',
      description: scraped.description || ''
    };

    chrome.storage.local.get(['gsm_listing_templates'], (res) => {
      const current = res.gsm_listing_templates || {};
      current[tplId] = newTpl;
      chrome.storage.local.set({ gsm_listing_templates: current, gsm_templates_initialized: true }, () => {
        loadWidgetTemplates();
        alert(`🎉 Template "${name}" saved! Next time just click ⚡ Auto-Fill.`);
      });
    });
  });

  // Widget Auto-Fill Button Event
  document.getElementById('gsm-widget-autofill').addEventListener('click', () => {
    const sel = document.getElementById('gsm-widget-select');
    const selectedId = sel ? sel.value : '';
    if (!selectedId) {
      alert("⚠️ Please select a template to auto-fill!");
      return;
    }

    chrome.storage.local.get(['gsm_listing_templates'], (res) => {
      const templates = res.gsm_listing_templates || {};
      const tpl = templates[selectedId];
      if (!tpl) return alert("⚠️ Selected template not found!");

      let filledCount = 0;
      const allInputs = Array.from(document.querySelectorAll('input, textarea, select'));

      allInputs.forEach(input => {
        const attrStr = `${input.name} ${input.id} ${input.placeholder} ${input.getAttribute('aria-label') || ''}`.toLowerCase();

        if (attrStr.includes('hsn')) {
          if (fillElement(input, tpl.hsn)) filledCount++;
        } else if (attrStr.includes('gst')) {
          if (fillElement(input, tpl.gst)) filledCount++;
        } else if (attrStr.includes('title') || attrStr.includes('product name') || attrStr.includes('item_name')) {
          if (fillElement(input, tpl.title)) filledCount++;
        } else if (attrStr.includes('desc') || input.tagName === 'TEXTAREA') {
          if (fillElement(input, tpl.description)) filledCount++;
        } else if (attrStr.includes('brand')) {
          if (fillElement(input, tpl.brand || 'GetSetMart')) filledCount++;
        } else if (attrStr.includes('sku')) {
          if (fillElement(input, tpl.sku || `GSM-SKU-${Date.now()}`)) filledCount++;
        } else if (attrStr.includes('price') || attrStr.includes('mrp') || attrStr.includes('sp')) {
          if (fillElement(input, tpl.price)) filledCount++;
        } else if (attrStr.includes('fabric') || attrStr.includes('material')) {
          if (fillElement(input, tpl.fabric)) filledCount++;
        } else if (attrStr.includes('country') || attrStr.includes('origin')) {
          if (fillElement(input, 'India')) filledCount++;
        }
      });

      alert(`✅ Success! Auto-filled ${filledCount} fields using "${tpl.name}".`);
    });
  });
}

// Auto-inject widget on Meesho, Flipkart & Amazon product listing pages
if (window.location.href.includes('meesho.com') || window.location.href.includes('flipkart.com') || window.location.href.includes('amazon.in')) {
  setTimeout(injectFloatingWidget, 1500);
}

// Listen for messages from extension popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'AUTOFILL_LISTING') {
    const data = request.templateData || {};
    let count = 0;

    const allInputs = Array.from(document.querySelectorAll('input, textarea, select'));

    allInputs.forEach(input => {
      const attrStr = `${input.name} ${input.id} ${input.placeholder} ${input.getAttribute('aria-label') || ''}`.toLowerCase();

      if (attrStr.includes('hsn')) {
        if (fillElement(input, data.hsn)) count++;
      } else if (attrStr.includes('gst')) {
        if (fillElement(input, data.gst)) count++;
      } else if (attrStr.includes('title') || attrStr.includes('product name') || attrStr.includes('item_name')) {
        if (fillElement(input, data.title)) count++;
      } else if (attrStr.includes('desc') || input.tagName === 'TEXTAREA') {
        if (fillElement(input, data.description)) count++;
      } else if (attrStr.includes('brand')) {
        if (fillElement(input, data.brand || 'GetSetMart')) count++;
      } else if (attrStr.includes('sku')) {
        if (fillElement(input, data.sku || `GSM-SKU-${Date.now()}`)) count++;
      } else if (attrStr.includes('price') || attrStr.includes('mrp') || attrStr.includes('sp')) {
        if (fillElement(input, data.price)) count++;
      } else if (attrStr.includes('fabric') || attrStr.includes('material')) {
        if (fillElement(input, data.fabric)) count++;
      } else if (attrStr.includes('country') || attrStr.includes('origin')) {
        if (fillElement(input, 'India')) count++;
      }
    });

    sendResponse({ success: true, count });
  } else if (request.action === 'CAPTURE_FORM_DATA') {
    const formData = scrapeCurrentScreenFields();
    sendResponse({ success: true, formData });
  }
  return true;
});
