document.addEventListener('DOMContentLoaded', () => {
  const siteStatusEl = document.getElementById('site-status');
  const siteBadgeEl = document.getElementById('site-badge');
  const templateSelect = document.getElementById('template-select');
  const captureBtn = document.getElementById('capture-btn');
  const autofillBtn = document.getElementById('autofill-btn');
  const deleteBtn = document.getElementById('delete-template-btn');
  
  const mainView = document.getElementById('main-view');
  const formView = document.getElementById('template-form-view');
  const showAddBtn = document.getElementById('show-add-form-btn');
  const cancelBtn = document.getElementById('cancel-template-btn');
  const saveBtn = document.getElementById('save-template-btn');

  // Input Fields
  const tplName = document.getElementById('tpl-name');
  const tplTitle = document.getElementById('tpl-title');
  const tplHsn = document.getElementById('tpl-hsn');
  const tplGst = document.getElementById('tpl-gst');
  const tplFabric = document.getElementById('tpl-fabric');
  const tplBrand = document.getElementById('tpl-brand');
  const tplPrice = document.getElementById('tpl-price');
  const tplCost = document.getElementById('tpl-cost');
  const tplDesc = document.getElementById('tpl-desc');

  const defaultTemplates = {
    hoodie: {
      id: 'hoodie',
      name: 'Oversized Anime Hoodie',
      title: 'GetSetMart Premium Oversized Anime Streetwear Hoodie',
      hsn: '61091000',
      gst: '5',
      fabric: 'Cotton Blend',
      brand: 'GetSetMart',
      price: '1499',
      cost: '450',
      description: 'Ultra-comfortable 380 GSM fleece oversized hoodie featuring high-density graphic print, fleece lining, and reinforced kangaroo pocket.'
    },
    anarkali: {
      id: 'anarkali',
      name: 'Royal Anarkali Suit Set',
      title: 'GetSetMart Royal Flared Anarkali Kurti & Dupatta Set',
      hsn: '62044220',
      gst: '5',
      fabric: 'Rayon Cotton',
      brand: 'GetSetMart',
      price: '1999',
      cost: '580',
      description: 'Elegant ethnic Anarkali suit set with intricate neck lace embroidery, matching dupatta, and breathable premium rayon fabric.'
    },
    jewelry: {
      id: 'jewelry',
      name: 'Kundan Choker Jewelry Set',
      title: 'GetSetMart Royal Kundan Choker Necklace Set',
      hsn: '71179090',
      gst: '3',
      fabric: 'Brass & Kundan',
      brand: 'GetSetMart',
      price: '799',
      cost: '140',
      description: 'Handcrafted traditional Kundan choker set plated in premium gold finish with matching jhumka earrings.'
    }
  };

  let allTemplates = {};

  // Render Template Options in Dropdown cleanly
  const renderTemplateDropdown = () => {
    templateSelect.innerHTML = '';
    const keys = Object.keys(allTemplates);
    if (keys.length === 0) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = '-- No Saved Templates --';
      templateSelect.appendChild(opt);
      return;
    }

    keys.forEach(key => {
      const tpl = allTemplates[key];
      if (tpl && tpl.name) {
        const opt = document.createElement('option');
        opt.value = tpl.id || key;
        opt.textContent = tpl.name;
        templateSelect.appendChild(opt);
      }
    });
  };

  // Load Templates from Chrome Storage with explicit initialization check
  chrome.storage.local.get(['gsm_listing_templates', 'gsm_templates_initialized'], (result) => {
    if (result && result.gsm_templates_initialized) {
      allTemplates = result.gsm_listing_templates || {};
    } else {
      allTemplates = { ...defaultTemplates };
      chrome.storage.local.set({ 
        gsm_listing_templates: defaultTemplates,
        gsm_templates_initialized: true 
      });
    }
    renderTemplateDropdown();
  });

  // Detect current active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || !tabs[0]) return;
    const activeUrl = tabs[0].url || '';

    if (activeUrl.includes('meesho.com')) {
      siteStatusEl.textContent = 'Meesho Listing Panel Detected';
      siteBadgeEl.textContent = 'MEESHO LIVE';
      siteBadgeEl.style.color = '#f43397';
    } else if (activeUrl.includes('flipkart.com')) {
      siteStatusEl.textContent = 'Flipkart Listing Panel Detected';
      siteBadgeEl.textContent = 'FLIPKART LIVE';
      siteBadgeEl.style.color = '#2874f0';
    } else if (activeUrl.includes('amazon.in')) {
      siteStatusEl.textContent = 'Amazon Listing Panel Detected';
      siteBadgeEl.textContent = 'AMAZON LIVE';
      siteBadgeEl.style.color = '#ff9900';
    } else {
      siteStatusEl.textContent = 'GetSetMart Assistant Ready';
      siteBadgeEl.textContent = 'STANDBY';
    }
  });

  // Lisstify-Style 1-Click Form Capture Event
  captureBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;
      chrome.tabs.sendMessage(tabs[0].id, { action: 'CAPTURE_FORM_DATA' }, (response) => {
        if (chrome.runtime.lastError) {
          alert("⚠️ Please open Meesho (supplier.meesho.com), Flipkart, or Amazon Product Listing page first!");
          return;
        }

        if (response && response.success && response.formData) {
          const scraped = response.formData;
          const templateName = prompt("📷 Form Scraped! Enter a name for this Template (e.g. Anime Hoodie XL):", scraped.title ? scraped.title.substring(0, 25) : 'My Product Template');

          if (!templateName) return;

          const tplId = `tpl_${Date.now()}`;
          const newTemplate = {
            id: tplId,
            name: templateName,
            title: scraped.title || templateName,
            hsn: scraped.hsn || '61091000',
            gst: scraped.gst || '5',
            fabric: scraped.fabric || 'Cotton',
            brand: scraped.brand || 'GetSetMart',
            price: scraped.price || '999',
            cost: scraped.cost || '300',
            description: scraped.description || ''
          };

          allTemplates[tplId] = newTemplate;
          chrome.storage.local.set({ 
            gsm_listing_templates: allTemplates,
            gsm_templates_initialized: true 
          }, () => {
            renderTemplateDropdown();
            templateSelect.value = tplId;
            alert(`🎉 Success! Captured form details and saved template "${templateName}". Next time click 1-Click Autofill to fill instantly!`);
          });
        } else {
          alert("⚠️ Could not find filled form fields on screen to capture. Make sure you are on a filled product listing form!");
        }
      });
    });
  });

  // Toggle Form Views
  showAddBtn.addEventListener('click', () => {
    formView.style.display = 'block';
  });

  cancelBtn.addEventListener('click', () => {
    formView.style.display = 'none';
  });

  // Save Custom Template Event
  saveBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const nameVal = tplName.value.trim();
    const titleVal = tplTitle.value.trim();
    const hsnVal = tplHsn.value.trim();
    const gstVal = tplGst.value.trim();
    const fabricVal = tplFabric.value.trim();
    const brandVal = tplBrand.value.trim() || 'GetSetMart';
    const priceVal = tplPrice.value.trim();
    const costVal = tplCost.value.trim();
    const descVal = tplDesc.value.trim();

    if (!nameVal || !titleVal || !hsnVal) {
      alert("⚠️ Please fill Template Name, Product Title and HSN Code!");
      return;
    }

    const tplId = `tpl_${Date.now()}`;
    const newTemplate = {
      id: tplId,
      name: nameVal,
      title: titleVal,
      hsn: hsnVal,
      gst: gstVal || '5',
      fabric: fabricVal || 'Cotton',
      brand: brandVal,
      price: priceVal || '999',
      cost: costVal || '300',
      description: descVal
    };

    allTemplates[tplId] = newTemplate;
    chrome.storage.local.set({ 
      gsm_listing_templates: allTemplates,
      gsm_templates_initialized: true 
    }, () => {
      renderTemplateDropdown();
      templateSelect.value = tplId;
      formView.style.display = 'none';

      // Clear Form
      tplName.value = '';
      tplTitle.value = '';
      tplHsn.value = '';
      tplGst.value = '';
      tplFabric.value = '';
      tplPrice.value = '';
      tplCost.value = '';
      tplDesc.value = '';

      alert(`🎉 Template "${nameVal}" saved successfully!`);
    });
  });

  // Delete Selected Template Event (Permanent Persistence Fix)
  deleteBtn.addEventListener('click', () => {
    const selectedId = templateSelect.value;
    if (!selectedId || !allTemplates[selectedId]) {
      alert("⚠️ No valid template selected to delete!");
      return;
    }

    const tplObj = allTemplates[selectedId];
    if (confirm(`Are you sure you want to delete template "${tplObj.name}"?`)) {
      delete allTemplates[selectedId];
      chrome.storage.local.set({ 
        gsm_listing_templates: allTemplates,
        gsm_templates_initialized: true
      }, () => {
        renderTemplateDropdown();
        alert(`🗑️ Template "${tplObj.name}" deleted.`);
      });
    }
  });

  // 1-Click Autofill Listing Form Event
  autofillBtn.addEventListener('click', () => {
    const selectedId = templateSelect.value;
    const activeTemplate = allTemplates[selectedId];

    if (!activeTemplate) {
      alert("⚠️ No template selected!");
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'AUTOFILL_LISTING',
          templateData: activeTemplate
        }, (response) => {
          if (chrome.runtime.lastError) {
            alert("⚠️ Please open Meesho (supplier.meesho.com), Flipkart, or Amazon Product Listing page first!");
          } else if (response && response.success) {
            alert(`✅ Success! Autofilled ${response.count || 'multiple'} listing fields using "${activeTemplate.name}".`);
          }
        });
      }
    });
  });
});
