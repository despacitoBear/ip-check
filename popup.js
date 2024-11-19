document.addEventListener("DOMContentLoaded", async () => {
    const menuButtons = document.querySelectorAll(".menu-btn");
    const views = document.querySelectorAll(".view");
    const ipInput = document.getElementById("ipInput");
    const checkBtn = document.getElementById("checkBtn");
    const rawBtn = document.getElementById("rawBtn");
    const resultField = document.getElementById("resultField");
    const serverInput = document.getElementById("serverInput");
    const saveSettingsBtn = document.getElementById("saveSettingsBtn");
  
    const loadSettings = async () => {
      const { server } = await chrome.storage.local.get("server");
      if (server) {
        serverInput.value = server;
      }
    };
  
    await loadSettings();
  
    menuButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const viewId = button.getAttribute("data-view");
        switchView(viewId);
      });
    });
  
    function switchView(viewId) {
      views.forEach((view) => {
        view.classList.toggle("visible", view.id === viewId);
      });
    }
  
    saveSettingsBtn.addEventListener("click", async () => {
      const server = serverInput.value.trim();
      if (server) {
        await chrome.storage.local.set({ server });
        serverInput.style.border = "2px solid #4caf50";
        setTimeout(() => (serverInput.style.border = ""), 1500);
      }
    });
  
    const formatServerUrl = (server) => {
      // если оканчивается на '/', оставляем его, иначе добавляем '/'
      return server.endsWith("/") ? server : server + "/";
    };

    checkBtn.addEventListener("click", async () => {
      const { server } = await chrome.storage.local.get("server");
      if (!server) {
        resultField.textContent = "Ошибка: впишите сервер";
        resultField.classList.add("error");
        return;
      }
      
      const ip = ipInput.value.trim();
      if (!ip) {
        resultField.textContent = "Ошибка: введите IP-адрес";
        resultField.classList.add("error");
        return;
      }
      
      const formattedServer = formatServerUrl(server);
      const url = `${formattedServer}${ip}`;
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          ipInput.classList.remove("input-success", "input-error");
          resultField.classList.remove("text-success", "text-error");
          if (data.detail && data.detail === "iP address not found in deny list") {
            resultField.textContent = "Не в бане";
            ipInput.classList.add("input-success");
            resultField.classList.add("text-success");
          } else if (data.ip) {
            resultField.textContent = "В бане";
            ipInput.classList.add("input-error");
            resultField.classList.add("text-error");
          }
          resultField.textContent = JSON.stringify(data, null, 2);
          resultField.classList.remove("error");
        } else {
          resultField.textContent = `Ошибка ${response.status}`;
          resultField.classList.add("error");
        }
      } catch (error) {
        resultField.textContent = `Ошибка: ${error.message}`;
        resultField.classList.add("error");
      }
    });
  
    // Показ RAW
    rawBtn.addEventListener("click", () => {
      resultField.textContent = resultField.textContent;
    });
  });
  