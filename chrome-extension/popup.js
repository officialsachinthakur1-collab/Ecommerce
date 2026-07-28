document.addEventListener('DOMContentLoaded', () => {
  const siteStatusEl = document.getElementById('site-status');
  const siteBadgeEl = document.getElementById('site-badge');
  const templateSelect = document.getElementById('template-select');
  const autofillBtn = document.getElementById('autofill-btn');
  const cropperBtn = document.getElementById('cropper-btn');
  const syncOrdersBtn = document.getElementById('sync-orders-btn');

  let activeUrl = '';

  // Detect current active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || !tabs[0]) return;
    activeUrl = tabs[0].url || '';

    if (activeUrl.includes('meesho.com')) {
      siteStatusEl.textContent = 'Meesho Supplier Panel Detected';
      siteBadgeEl.textContent = 'MEESHO LIVE';
      siteBadgeEl.style.color = '#f43397';
    } else if (activeUrl.includes('flipkart.com')) {
      siteStatusEl.textContent = 'Flipkart Seller Hub Detected';
      siteBadgeEl.textContent = 'FLIPKART LIVE';
      siteBadgeEl.style.color = '#2874f0';
    } else if (activeUrl.includes('amazon.in')) {
      siteStatusEl.textContent = 'Amazon Seller Central Detected';
      siteBadgeEl.textContent = 'AMAZON LIVE';
      siteBadgeEl.style.color = '#ff9900';
    } else {
      siteStatusEl.textContent = 'GetSetMart Assistant Ready';
      siteBadgeEl.textContent = 'STANDBY';
    }
  });

  // 1-Click Autofill Listing Form Event
  autofillBtn.addEventListener('click', () => {
    const selectedTemplate = templateSelect.value;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'AUTOFILL_LISTING',
          template: selectedTemplate
        }, (response) => {
          if (chrome.runtime.lastError) {
            alert("⚠️ Please open Meesho (supplier.meesho.com), Flipkart, or Amazon Product Listing page first!");
          } else if (response && response.success) {
            alert(`✅ Success! Autofilled ${response.count || 'multiple'} listing fields using GetSetMart template.`);
          }
        });
      }
    });
  });

  // Open 4x6 Thermal Label Cropper Tool
  cropperBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://getsetmart.com/admin/label-cropper' });
  });

  // Sync Orders Event
  syncOrdersBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'SYNC_MARKETPLACE_ORDERS'
        }, (response) => {
          if (chrome.runtime.lastError) {
            alert("⚠️ Please open your Meesho Supplier Orders Page (supplier.meesho.com/panel/v2/new/orders) or Flipkart Seller Orders Page first!");
          } else if (response && response.orders && response.orders.length > 0) {
            // Save synced orders to storage
            chrome.storage.local.set({ gsm_synced_orders: response.orders }, () => {
              alert(`🎉 Success! Synced ${response.orders.length} real orders to GetSetMart Admin Panel! Opening Admin Panel...`);
              chrome.tabs.create({ url: 'https://getsetmart.com/admin/orders' });
            });
          } else {
            alert("⚠️ Opened page detected, but no visible orders table was found on screen. Please make sure you are on the Orders/Dispatches tab!");
          }
        });
      }
    });
  });
});
