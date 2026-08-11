# Report build

`ltm-review.html` one directory up is the deliverable. It is generated. Do not
edit it: edit a source and rebuild.

```
node report/build.mjs
```

| Source | Carries |
| --- | --- |
| `findings.json` | the 83 findings. Edit through `triage-app.cjs`, never by hand. |
| `report/sec-*.html` | hand-written prose: orientation, what happened, what is good, appendices. |
| `wireframes/_shell-hifi.html` | the stylesheet, masthead, constraint cards, journey machinery, deviations table. |
| `wireframes/data-j*.js` | the journey states. |

The findings and the recommendation roll-up are generated from the JSON, so they
cannot drift from it. Everything else is prose.
