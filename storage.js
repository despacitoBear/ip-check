function saveToStorage(key, value) {
    chrome.storage.local.set({ [key]: value });
  }
  
  function getFromStorage(key) {
    return new Promise((resolve) => {
      chrome.storage.local.get(key, (result) => {
        resolve(result[key]);
      });
    });
  }
  