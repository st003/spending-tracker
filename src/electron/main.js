import path from 'path';
import { app, BrowserWindow } from 'electron';


app.whenReady().then(() => {

  const mainWindow = new BrowserWindow({
    // TODO: make this fill the screen on open
    width: 1280,
    height: 720
  });

  // path.join() used for file system compatability
  // app.getAppPath() allows the electro app to find its files no matter where it exists on the file system
  mainWindow.loadFile(path.join(app.getAppPath(), '/dist-ui/index.html'));
});
