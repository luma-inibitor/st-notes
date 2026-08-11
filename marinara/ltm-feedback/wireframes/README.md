# Wireframe sources

`wireframes.html` one directory up is the file to open. It is generated, so edit
the pieces here and rebuild rather than editing it directly.

- `_shell.html` — page scaffold and the whole stylesheet. Every class the frames
  use is defined here; fragments carry no CSS and no inline styles.
- `j1.html` … `j6.html` — one journey per file, each a `<section class="journey">`.

Rebuild:

```
node -e 'const f=require("fs");f.writeFileSync("../wireframes.html",
  f.readFileSync("_shell.html","utf8").replace("<!--JOURNEYS-->",
  ["j1","j2","j3","j4","j5","j6"].map(n=>f.readFileSync(n+".html","utf8").trim()).join("\n\n")))'
```
