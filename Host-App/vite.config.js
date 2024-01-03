import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from "@originjs/vite-plugin-federation";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host_app',
      filename: 'remoteEntry.js',
      remotes: {
        Folders_MFE: "http://localhost:5002/assets/remoteEntry.js",
        Files_MFE: "http://localhost:5003/assets/remoteEntry.js",
        Auth_MFE: "http://localhost:5005/assets/remoteEntry.js",
        Settings_MFE:"http://localhost:5006/assets/remoteEntry.js",
        Shared: "http://localhost:5007/assets/remoteEntry.js"
      },
      exposes: {
        // './CreateFolderAction':'./src/Redux/actionCreators/FolderActions/CreateFolder',
        // './authActions':'./src/Redux/actionCreators/authActions',
        
    },
      shared: ["react", "react-dom","react-router-dom","redux","react-redux","redux-devtools-extension","redux-thunk","react-toastify"]
  })],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  },
})
