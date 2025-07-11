# Spending Tracker

An Electron app for tracking and reporting personal income and expenditures. Build with TypeScript, Electron, React, and SQLite. This [tutorial](https://www.youtube.com/watch?v=fP-371MN0Ck) was used as the basis for setting up the project.

_This project is still in development_

## Getting Started

Prior knowledge of TypeScript, Electron, React, and SQLite are required. Knowledge of Vite, electron-builder, Mui are recommended.

### Prerequisites

* Node.js 22+

### Directory Structure

Underneath the "src" directory you will find two main development sub-directories:

* **electron** - Location of non-UI Electron project files
* **ui** - Location of UI files

### Installing

Clone the repository to your local machine. From the repository root directory, run the command:

```
npm install
```

### Running in development

This project is configured to launch a development Electron project utilizing Vite's hot module reloading. To start the project for development, run the command:

```
npm run dev
```

### Packaging

See each target platform's section for details. Cross-compiling is unstable. It's recommended to package on the same platform as the target platform.

#### MacOS (M-Series)

To package the application for MacOS with M-series processors, run the command:

```
npm run package:mac
```

_Note: cross-compiling for Mac from a Linux distro is not supported by eletron-builder at this time._

#### Linux

Packaging for Linux is configured but unstable. To package for Linux AppImage. Run the command:

```
npm run package:linux
```

_Warning: Fedora 41 results in GTK errors._

#### Windows

Packaging for Windows is not configured at this time.

## Running the tests

There are no tests at this time.

## Built With

* [Electron](https://www.electronjs.org/) - Cross-platform desktop application framework
* [electron-builder](https://www.electron.build/) - Packaging library for Electron
* [TypeScript](https://www.typescriptlang.org/) - Language
* [React](https://react.dev/) - UI framework
* [Vite](https://vite.dev/) - UI tooling

## Authors

* **st003**
