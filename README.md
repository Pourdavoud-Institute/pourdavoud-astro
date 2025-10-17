# Pourdavoud Institute Website (Front-end)

This repository contains the front-end code (HTML, CSS, and JavaScript) for the [UCLA Pourdavoud Institute](https://pourdavoud.ucla.edu/) website, part of the UCLA College [Division of Humanities](https://humanities.ucla.edu/). Serving as the "presentation layer" of a "headless" architecture, the codebase uses the Node.js-based Astro web framework to prerender a static site via a build step. The "content layer" is handled separately in a [Sanity Studio app](https://github.com/Pourdavoud-Institute/sanity-studio) and is exposed to the front-end via a query language API.

Use this project to make changes to template files, add new site integrations, or set up a local development environment for testing features / fixes.

## Features

- [Astro v5](https://astro.build/) TypeScript-based static site generator with various first- and third-party plugins and built-in [Vite](http://vite.dev/) server
- Astro's fully-typed [content collections](https://docs.astro.build/en/guides/content-collections/) loading headless data from the [Sanity](https://www.sanity.io/) content platform (accessed with Sanity client + [GROQ queries](https://www.sanity.io/docs/content-lake/how-queries-work))
- [Lightning CSS](https://lightningcss.dev/) scripts to transpile, bundle, and minify CSS
- [Alpine JS](https://alpinejs.dev/start-here) and [Preact](https://preactjs.com/) for lightweight page interactivity
- [Pagefind](https://pagefind.app/) static site search indexing with built-in live search UI
- Fluid typography scaling and spacing with [Utopia](https://utopia.fyi/)
- Formatting with [Prettier](https://prettier.io/) and linting with [ESLint](https://eslint.org/) + Astro plugin
- Design elements and icons based on the [UCLA Design Systems](https://designsystem.brand.ucla.edu/) style guide

## Getting Started

### 1. Prerequisites

To get started locally, ensure that you have [Node](https://nodejs.org/en) and the [npm package manager](https://www.npmjs.com/) installed on your system. The easiest way to do this is by downloading Node, nvm (the Node version manager), and npm all together via the [Node downloads page](https://nodejs.org/en/download).

- [Node](https://nodejs.org/en) (JavaScript runtime environment)
- [npm](https://www.npmjs.com/) (Node package manager)
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) (version control)

### 2. Clone repository

In the terminal, navigate to your projects directory and `git clone` the repository:

```sh
git clone https://github.com/Pourdavoud-Institute/pourdavoud-astro.git
cd pourdavoud-astro
```

### 3. Install dependencies with `npm`

```sh
npm install
```

### 4. Run scripts

The project's `package.json` file registers the following scripts:

<!-- prettier-ignore -->
| Script | Description |
| ------ | ----------- |
| `npm run dev` | Starts the Astro dev server. |
| `npm run index` | Uses `pagefind` to index all marked pages for search. |
| `npm run build` | Builds site to `dist` output directory and runs `index` (see above). |
| `npm run preview` | Previews the *built* site files in a local environment. |

## Project Structure

The project structure follows [Astro's opinionated guide](https://docs.astro.build/en/basics/project-structure/#public).

```yaml
.
├── dist/ # IGNORED - Astro build output
├── public/ # non-code, unprocessed assets (fonts, icons, etc.)
│   ├── images/
│   └── robots.txt
├── src/ # project source code
│   ├── assets/ # assets/images for processing
│   ├── components/ # reusable units of code
│   ├── content/ # schemas for content collections
│   ├── layouts/ # reusable templates for pages
│   ├── lib/ # library of helpers and utility functions
│   │   ├── sanity/ # GROQ queries and other helpers for Sanity
│   │   └── utils/ # general helpers
│   ├── pages/ # REQUIRED - page route definitions
│   ├── styles/ # CSS files
│   ├── content.config.ts # REQUIRED - content collections config
│   └── env.d.ts # Typescript environment config
├── .gitignore # files ignored by repo
├── .prettierrc # config file for formatting
├── astro.config.mjs # REQUIRED - config file for Astro
├── eslint.config.js # config file for linter
├── package.json # REQUIRED - project manifest
├── README.md
└── tsconfig.json # config file for Typescript
```

## License & Contact

This project is open source and licensed under the [MIT license](https://choosealicense.com/licenses/mit/). For questions, contact Daniel Saunders at [dtsaunders@humnet.ucla.edu](mailto:dtsaunders@humnet.ucla.edu).
