import { copyIndexHtml } from "./copy-Index-html";

// Move src/index.html to /dist
copyIndexHtml().catch((err) => console.error(err));
