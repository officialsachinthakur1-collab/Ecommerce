// GetSetMart Pure DOM Content Script for Meesho, Flipkart & Amazon (Clean & Error-Free)

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

    // Fire synthetic event sequence to trigger React component state listeners
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

// Listen for messages from extension popup cleanly
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
