# Pourdavoud Institute Website (Front End)

This repository contains code that builds the front end files (HTML, CSS, and JavaScript) for the [UCLA Pourdavoud Institute](https://pourdavoud.ucla.edu/) website. It does not contain any code or settings for the Sanity.io headless content management system, which is tracked elsewhere. Use this project to track changes to template files, add new site integrations, or set up a local development environment.

## Features

- [Astro v5](https://astro.build/) TypeScript-based static site generator with various first- and third-party plugins with build-in [Vite](http://vite.dev/) server
- Astro's fully-typed [content collections](https://docs.astro.build/en/guides/content-collections/) loading headless data from [Sanity](https://www.sanity.io/) content platform (accessed with Sanity client + GROQ queries)
- [Lightning CSS](https://lightningcss.dev/) scripts to transpile, bundle, and minify CSS
- [Alpine JS](https://alpinejs.dev/start-here) and [Preact](https://preactjs.com/) for lightweight interactivity
- Fluid typography scaling and spacing with [Utopia](https://utopia.fyi/)
- Formatting ([Prettier](https://prettier.io/)) and linting ([ESLint](https://eslint.org/) + Astro plugin)
- Design elements and icons based on the [UCLA Design Systems](https://designsystem.brand.ucla.edu/) style guide

## Getting Started

### 1. Prerequisites

To get started locally, ensure that you have [Node](https://nodejs.org/en) and the [npm package manager](https://www.npmjs.com/) installed on your system. The easiest way to do this is by downloading Node, nvm (the Node version manager), and npm all together via the [Node downloads page](https://nodejs.org/en/download).

- [Node](https://nodejs.org/en) (JavaScript runtime environment)
- [npm](https://www.npmjs.com/) (Node package manager)
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) (version control)

### 2. Clone Repository

Navigate to your projects directory and `git clone` the repository:

```sh
git clone https://github.com/Pourdavoud-Institute/pourdavoud-astro.git
cd pourdavoud-astro
```

### 3. Install dependencies

```sh
npm install
```

#### 4. Run scripts

| Script          | Description                                                          |
| --------------- | -------------------------------------------------------------------- |
| `npm run dev`   | Starts Astro dev server.                                             |
| `npm run build` | Builds site and bundles/minifies JS/CSS to `_site` output directory. |

## Organization

todo

## License & Contact

This project is open source and licensed under the [MIT license](https://choosealicense.com/licenses/mit/). For questions, contact Daniel Saunders at [dtsaunders@humnet.ucla.edu](mailto:dtsaunders@humnet.ucla.edu).
