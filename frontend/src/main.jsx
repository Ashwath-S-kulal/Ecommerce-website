import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner'
import { Provider } from 'react-redux'
import store from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'

// 1. Initialize Redux Persistor
let persistor = persistStore(store)

// 2. Service Worker Registration
// This must point to sw.js in your PUBLIC folder
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => console.log('SW Registered!', reg))
      .catch((err) => console.log('SW Registration Failed!', err));
  });
}

// 3. PWA "Install" Logic
// We store the event in a global variable so any component can trigger the "Download"
window.deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  window.deferredPrompt = e;
  
  // Custom event to notify React components that the install button can be shown
  window.dispatchEvent(new Event('pwa-can-install'));
  console.log('PWA is ready to be installed');
});

// 4. Global Function to trigger installation
// You can call this from any button: onClick={() => window.installSanjeeviniApp()}
window.installSanjeeviniApp = async () => {
  const promptEvent = window.deferredPrompt;
  if (!promptEvent) {
    // If not installable, give user instructions (especially for iOS)
    alert("To install: Tap your browser menu and select 'Install App' or 'Add to Home Screen'.");
    return;
  }
  // Show the install prompt
  promptEvent.prompt();
  // Wait for the user to respond to the prompt
  const { outcome } = await promptEvent.userChoice;
  console.log(`User response to install: ${outcome}`);
  // We've used the prompt, and can't use it again
  window.deferredPrompt = null;
};

// 5. Render App
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        <Toaster position="top-center" richColors />
      </PersistGate>
    </Provider>
  </StrictMode>,
)