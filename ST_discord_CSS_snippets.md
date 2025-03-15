# CSS snippets from ST discord

- [SillyTavern-CssSnippets](https://github.com/LenAnderson/SillyTavern-CssSnippets/) is a must-have extension for this.
- 🧵 [ST discord: Custom CSS snippet compilation](https://discord.com/channels/1100685673633153084/1226855443586879519/1226855443586879519)
- 🧵 [ST discord: Individual character message styles](https://discord.com/channels/1100685673633153084/1335308918259454122)

<details><summary>[4/8/24] [underscore_x] Change font</summary>

```css
html body {
font-family: 'Comic Sans MS'
}
```
</details>

<details><summary>[4/8/24] [underscore_x] Change font colour on a per-character basis (only for quotes)</summary>

```css
.mes[ch_name="Alice"] .mes_text q { color: green; }
.mes[ch_name="Bob"] .mes_text q { color: red; }
```
</details>

<details><summary>[4/8/24] [underscore_x] Make italicizations in quotes use the quote color</summary>

```css
.mes_text q em { color: var(--SmartThemeQColor); }
```
</details>

<details><summary>[4/8/24] [underscore_x] Hide scrollbar that shows up on overflow</summary>

```css
body { overflow: hidden; }
```
</details>

<details><summary>[4/8/24] [underscore_x] Justify all text</summary>

```css
.mes_text {
  text-align: justify;
}
```
</details>

<details><summary>[4/8/24] [underscore_x] Make all non-quote text formatted like italics text</summary>

```css
.mes_text {
    font-style: italic;
    color: grey;
}

.mes_text q {
    font-style: normal;
}
```
</details>

<details><summary>[4/8/24] [underscore_x] Change codeblock text colour</summary>

```css
#chat code {
color: blue !important;
}
```
</details>

<details><summary>[4/8/24] [underscore_x] Display only the last message in chat while in VN (Waifu) mode</summary>

```css
body.waifuMode div#sheld {
    height: fit-content;
    top: unset;
    display: flex;
    flex-direction: column;
}
body.waifuMode div#sheld > #chat {
    height: fit-content;
    max-height: calc(100vh - calc(var(--topBarBlockSize) + var(--bottomFormBlockSize)) - 9px);
    flex: 1 1 auto;
}
body.waifuMode div#sheld > #chat > .mes {
    display: none;
    &:nth-last-child(1 of :not(.navchat--hidden)) {
        display: flex;
    }
}
body.waifuMode div#sheld > #form_sheld {
    flex: 0 0 auto;
}
```
</details>


<details><summary>[4/8/24] [underscore_x] Style all messages not in context</summary>

Example changes opacity

```css
#chat > .mes:has(~ .lastInContext) { opacity: 0.5; }
```

</details>

<details><summary>[4/8/24] [underscore_x] Change avatar portraits to be square</summary>

```css
body .avatar img,
body .hotswapAvatar,
body .hotswapAvatar img,
body .avatar {
 border-radius: 2px !important;
}
```
</details>

<details><summary>[4/8/24] [underscore_x] Change color of blockquotes</summary>

```css
.mes_text blockquote {
color: salmon;
}
```
</details>

<details><summary>[4/8/24] [underscore_x] Change portrait size and disable token count/message ID for specific messages</summary>

```css
body #chat .mes[is_user="true"] {
    align-items: stretch;
    .mesAvatarWrapper {
        overflow: hidden;
        width: 60px;
        flex: 0 0 60px;
> .avatar {
            height: 0;
            justify-content: start;
        }
> *:not(.avatar) {
            display: none;
        }
    }
}
```
</details>

<details><summary>[4/8/24] [underscore_x] Make swipe arrows smaller</summary>

```css
.swipe_right, .swipe_left {
  font-size: 20px
}
```
</details>


<details><summary>[4/8/24] [underscore_x] Collapse hidden/ghost messages</summary>

Made with Discord theme in mind, needs adjustment when used with other themes.

```css
html > body {
  .mes[is_system="true"] {
    padding: 0;
    .mesAvatarWrapper { display: none; }
    .mes_block {
      .ch_name {
        z-index: 1;
> :nth-child(1) { display: none; }
        .mes_buttons { transform: translate(-10px, 10px); transition: 0ms; z-index: 100; }
    }
    .mes_text {
      font-size: smaller;
      padding: 0;
      max-height: 3em;
      overflow-y: clip;
      mask: linear-gradient(black 0%, black 50%, transparent 100%);
    }
  }
}
```
</details>

<details><summary>[4/8/24] [underscore_x] Replace display name of a character with CSS</summary>

```css
.mes[ch_name="Stella"] span.name_text {
    text-indent: -9999px;
    line-height: 0;
}
.mes[ch_name="Stella"] span.name_text:after {
    display: block;
    content: "New Name";
    text-indent: 0;
    line-height: inherit;
}
```
</details>

<details><summary>[4/8/24] [underscore_x] Change font size</summary>

```css
body #chat .mes_text { font-size: 1.5em; }
```
</details>

<details><summary>[4/8/24] [underscore_x] Hide all toast messages</summary>

```css
html > body #toast-container > .toast {
    display: none;
}
```
</details>

<details><summary>[4/8/24] [underscore_x] Hide specific toast messages based on severity level</summary>

```css
html > body #toast-container > .toast-info
html > body #toast-container > .toast-success
html > body #toast-container > .toast-warning
html > body #toast-container > .toast-error
```
</details>

<details><summary>[4/8/24] [underscore_x] Hide swipe arrows for all messages except the greeting</summary>

```css
.mes:not([mesid="0"]) .swipe_right,
.mes:not([mesid="0"]) .swipe_left {
    display: none !important;
}


.swipe_right:not([mesid="0"]) .swipes-counter {
  opacity: 0 !important;
  pointer-events: none;
}
```
</details>

<details><summary>[4/8/24] [underscore_x] Reduce saturation on themes</summary>

```css
html {
  filter: saturate(0.5);
}
```
</details>

<details><summary>[4/8/24] [underscore_x] Change only the message body font</summary>

```css
html > body #chat .mes .mes_text {
  font-family: 'Comic Sans MS'
}
```
</details>

<details><summary>[4/8/24] [underscore_x] Remove context menu dots in Quick Reply buttons</summary>

```css
#qr--bar > .qr--buttons .qr--button.qr--hasCtx > .qr--button-expander,
#qr--popout > .qr--body > .qr--buttons .qr--button.qr--hasCtx > .qr--button-expander
{
    display: none;
}
```
</details>

<details><summary>[4/8/24] [Wolfsblvt (Shrimp on Duty)] Show message buttons only on hover with transition</summary>

```css
.mes .mes_buttons {
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s 0.5s, opacity 0.5s linear;
}
.mes:hover .mes_buttons {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.5s linear;
}
```
</details>

<details><summary>[4/8/24] [underscore_x] Show only X number of favourite cards in the hotswap menu</summary>

```css
#HotSwapWrapper .avatars_inline {
  overflow: visible;
  max-height: unset;
}
#HotSwapWrapper .avatar:nth-child(n+10) {
  display: none;
}
```
</details>

<details><summary>[4/8/24] [IceFog] Auto open options on hover of border</summary>

```css
#options {
display: block !important;
border-top: 8px groove var(--SmartThemeQuoteColor);
height: 4px;
width: 2.5em;
transition: 0.3s;
overflow-x: auto;
}
#options:hover  {
height: auto !important;
width: auto !important;
}
```
</details>

<details><summary>[4/8/24] [IceFog] Hide and expand Quick Reply buttons on border hover</summary>

```css
#qr--bar:hover{
height: 40px;
transition: all 0.5s ease;
}

#qr--bar{
border-top: 4px solid var(--SmartThemeQuoteColor);
height: 4px;
}
```
</details>

<details><summary>[4/9/24] [underscore_x] Add padding to chat bubbles</summary>

```css
html > body #chat .mes {
  padding-right: 60px;
}
```
</details>

<details><summary>[4/10/24] [⛧EvilF͓̽e͓̽a͓̽r͓̽⛧] Change the top bar icon order</summary>

```css
#logo_block {
  order: 4;
}

#user-settings-button {
  order: 2;
}

#persona-management-button {
  order: 3;
}

#extensions-settings-button {
  order: 3;
}

#sys-settings-button {
  order: 1;
}


#advanced-formatting-button {
  order: 6;
}

#WI-SP-button {
  order: 7;
}

#rightNavHolder {
  order: 8;
}
```
</details>


<details><summary>[4/11/24] [⛧EvilF͓̽e͓̽a͓̽r͓̽⛧] Hide default Custom CSS text box</summary>

```css
.flex-container.flexnowrap.alignitemscenter:has(> textarea#customCSS) {
    display: none !important;
}
```
</details>

<details><summary>[4/13/24] [Nyx] Change the top bar to a horizontally scrollable text menu</summary>

```css
#ai-config-button {
  & .drawer-toggle::after {
    content: "Sampler Settings";
  }

  & .drawer-icon {
    display: none;
  }
}

#sys-settings-button {
  & .drawer-toggle::after {
    content: "API Connection";
  }

  & .drawer-icon {
    display: none;
  }
}

#advanced-formatting-button {
  & .drawer-toggle::after {
    content: "Prompt Formatting";
  }

  & .drawer-icon {
    display: none;
  }
}

#WI-SP-button {
  & .drawer-toggle::after {
    content: "Injections Manager";
  }

  & .drawer-icon {
    display: none;
  }
}

#user-settings-button {
  & .drawer-toggle::after {
    content: "Personalization Settings";
  }

  & .drawer-icon {
    display: none;
  }
}

#logo_block {
  & .drawer-toggle::after {
    content: "Backgrounds";
  }

  & .drawer-icon {
    display: none;
  }
}

#extensions-settings-button {
  & .drawer-toggle::after {
    content: "Extensions";
  }

  & .drawer-icon {
    display: none;
  }
}

#persona-management-button {
  & .drawer-toggle::after {
    content: "Personas";
  }

  & .drawer-icon {
    display: none;
  }
}

.drawer-toggle,
.openDrawer {
    z-index: 4000;
}

#rightNavHolder {
  & .drawer-toggle::after {
    content: "Characters";
  }

  & .drawer-icon {
    display: none;
  }
}

#top-settings-holder {
  gap: 48px;
  left: 0;
  right: 0;
  z-index: unset;
  overflow-x: scroll;
  justify-content: unset;
  padding-left: calc((var(--sheldWidth) / 2) - 7ex);
  padding-right: calc((var(--sheldWidth) / 2) - 5ex);

  & > * {
    overflow-x: unset;
  }
}

#top-settings-holder .drawer {
  white-space: nowrap;
  width: fit-content;
}

.drawer > .drawer-content {
  position: fixed;
}

#top-settings-holder, #top-bar {
  position: absolute;
}

#top-settings-holder::before {
  content: "";
  z-index: 5000;
  background: linear-gradient(90deg, var(--SmartThemeBlurTintColor) 5%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 80%, var(--SmartThemeBlurTintColor) 95%);
  width: var(--sheldWidth);
  height: var(--topBarBlockSize);
  position: fixed;
  left: 0;
  right: 0;
  margin: auto;
  pointer-events: none;
}

@media screen and (max-width: 1000px) {
  #top-settings-holder {
    padding-right: calc((100svw / 2) - 5ex);
    padding-left: calc((100svw / 2) - 7ex);
  }

  #top-settings-holder::before {
      width: 100svw;
  }
}
```
</details>

<details><summary>[4/14/24] [Auspician] Changing the font of just character text but not user text</summary>

```css
body #chat .mes[is_user="false"] .mes_text q {
    font-size: 1.4em;
    font-family: 'Caveat';
}
```
</details>

<details><summary>[4/14/24] [Auspician] Style codeblocks with custom colors and fonts</summary>

```css
body #chat .mes_text pre code { 
    color: white; 
    font-family: 'Garamond'; 
}
```
</details>

<details><summary>[4/20/24] [underscore_x] Move message actions buttons to the bottom of a message</summary>

```css
.mes .mes_block {
    display: flex;
    flex-direction: column-reverse;
}
```
</details>

<details><summary>[4/25/24] [Cohee] Hide code blocks completely</summary>

```css
body #chat .mes_text pre { display: none }
```
</details>

<details><summary>[4/28/24] [underscore_x] Target a specific QR button by the tooltip value</summary>

```css
.qr--button[title="my button title"] {
  background: red;
}
```
</details>

<details><summary>[4/28/24] [Maggotkin] Customizing the extensions menu display</summary>

```css
#extensionsMenu.options-content {
class: font-family-reset;
display: block !important;
border-top: 4px groove var(--SmartThemeQuoteColor);
height: 4px;
width: 2.5em;
transition: 1.0s;
overflow-x: auto;
}
#extensionsMenu:hover  {
height: auto !important;
width: auto !important;
}
```
</details>

<details><summary>[5/2/24] [IceFog] Make edit button larger and display differently</summary>

```css
.fa-pencil-alt::before, .fa-pencil::before {
  content: "\f303";
  font-size: xx-large;
}
.mes_buttons, .extraMesButtons {
display: contents;
}
```
</details>

<details><summary>[5/4/24] [underscore_x] Change the character avatar sizes in the character list</summary>

```css
html, body.charListGrid {
  --avatar-width: 10.0vw;
  --avatar-aspect-ratio: calc(3 / 5.0);

  --avatar-border-width: 1px;
  --avatar-fav-border-width: 2px;
  --avatar-padding: 5px;

  #rm_print_characters_block {
    display: grid;
    grid-auto-rows: max-content;
    grid-template-columns: repeat(
      auto-fill,
      minmax(
        calc(
            var(--avatar-width)
          + var(--avatar-border-width)*2
          + var(--avatar-fav-border-width)*2
          + var(--avatar-padding)*2
        ),
        1fr
      )
    );

    .character_select, .group_select {
      width: 100%;
      max-height: unset;
      min-height: unset;
      max-width: unset;
      min-width: unset;
      height: unset;

      .avatar.avatar_collage {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(50%, 1fr));
        img {
          width: 100%;
          height: 100%;
        }
      }

      .avatar, .avatar_collage, .avatar:not(.avatar_collage) img {
        width: var(--avatar-width);
        width: 100%;
        height: unset;
        aspect-ratio: var(--avatar-aspect-ratio);
        max-height: unset;
        min-height: unset;
        max-width: unset;
        min-width: unset;
        display: block;
        flex: 0 0 auto;
      }

      .character_select_container, .group_select_container {
        align-self: center;
        max-width: unset;
        .ch_name, .ch_additional_info {
          max-width: unset;
          white-space: unset;
        }
      }
    }
  }
}
```
</details>

<details><summary>[5/5/24] [underscore_x] Moving WI field headers by adding padding to the right</summary>

```css
#WIEntryHeaderTitlesPC {
  padding-right: calc(4.5em / 2 * 3) !important;
}
```
</details>

<details><summary>[5/6/24] [underscore_x] Display custom icons for your LLM model ID of choice</summary>

```css
.timestamp[title*="kayra"] ~ .timestamp-icon {
  display: none;
}

.timestamp[title*="kayra"]::after {
    display: inline-flex;
    height: 14px;
    width: 14px;
    content: ' ';
    margin-left: 5px;
    background-image: url(https://civitai.com/favicon.ico);
    background-size: contain;
}
```
</details>

<details><summary>[5/23/24] [BOBcat] Easier expansion of the quick-reply menu</summary>

```css
#send_form:hover #qr--bar 
```
</details>

<details><summary>[5/23/24] [underscore_x] Reverse chat direction visually to be bottom to top</summary>

```css
#chat {
  flex-direction: column-reverse;
}
```
</details>

<details><summary>[5/25/24] [underscore_x] Larger buttons for unknown extension</summary>

```css
.mfc--action {
    font-size: 1.5em;
    padding: 0 1em;
}
```
</details>

<details><summary>[5/26/24] [underscore_x] Blue tinted /comment messages</summary>

```css
html > body {
  .mes[is_system="true"]:has([src="img/quill.png"]) {
    background-color: #12345678;
  }
}
```
</details>

<details><summary>[5/26/24] [underscore_x] Fade hidden non-comment messages</summary>

```css
html > body {
  .mes[is_system="true"]:not( :has([src="img/quill.png"],[src="img/five.png"]) ) .mes_text {
    opacity: .7;
  }
}
```
</details>

<details><summary>[5/28/24] [underscore_x] Set chat width to fixed pixel size</summary>

```css
body {
  --sheldWidth: 1300px;
}
```
</details>

<details><summary>[5/30/24] [underscore_x] Show character avatar as the background</summary>

```css
.zoomed_avatar_container {
    max-height: 100svh;
    max-width: 100svw;
    height: 100svh;
    width: 100svw;
}

.zoomed_avatar {
    display: flex;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1 !important;
    width: 100svw !important;
    height: 100svh !important;
    max-width: unset !important;
    max-height: unset !important;
}

.zoomed_avatar img {
    height: 100svh !important;
    object-fit: cover !important;
    object-position: center top;
}
```
</details>

<details><summary>[6/2/24] [underscore_x] Remove popout button in the quick-reply menu</summary>

```css
html > body {
    #qr--popoutTrigger {
        display: none;
    }
    #qr--bar {
        padding-right: 0;
    }
}
```
</details>

<details><summary>[6/10/24] [Wolfsblvt (Shrimp on Duty)] Hide the charlist filter/search block unless hovering over the heading</summary>

```css
#charListFixedTop {
  display: none;
  transition: all var(--animation-duration-slow) ease-in-out;
  transform-origin: left top;
  animation: pop-out var(--animation-duration-slow) ease-in-out;
}

#right-nav-panel:has(#rm_PinAndTabs:hover, #rm_PinAndTabs:focus-within) #charListFixedTop,
#charListFixedTop:hover,
#charListFixedTop:focus-within {
  display: block;
  animation: pop-in var(--animation-duration-slow) ease-in-out;
}

#rm_button_selected_ch h2::before {
  vertical-align: middle;
  text-align: center;
  content: "\f13a";
  margin-right: 6px;
  line-height: 10%;
  font-family: "Font Awesome 6 Free";
}

#right-nav-panel:has(#rm_PinAndTabs:hover, #rm_PinAndTabs:focus-within, #charListFixedTop:hover, #charListFixedTop:focus-within) #rm_button_selected_ch h2::before {
  content: "\f139";
}
```
</details>

<details><summary>[6/13/24] [underscore_x] Change monospace font app-wide (for autocomplete and code blocks)</summary>

```css
@import url('https://fonts.cdnfonts.com/css/source-code-pro');

body {
  --monoFontFamily: 'Source Code Pro';
}
```
</details>

<details><summary>[6/16/24] [Cohee] Smol swipe arrows (37.5% smoler exactly)</summary>

```css
#chat .swipe_right, #chat .swipe_left {
  width: 25px;
  height: 25px;
  font-size: 20px;
}
```
</details>

<details><summary>[6/17/24] [Wolfsblvt (Shrimp on Duty)] Disable or theme the outline for controls like textboxes and dropdowns</summary>

```css
body {
  --interactable-outline-color: transparent;
  --interactable-outline-color-faint: transparent;
}

/* Or to theme them with a custom color like orange: */
body {
  --interactable-outline-color: rgba(225, 138, 36, 1);
  --interactable-outline-color-faint: rgba(225, 138, 36, 0.3);
}
```
</details>

<details><summary>[7/8/24] [Luccy] Hide Reverse Proxy Warning Message</summary>

```css
#ReverseProxyWarningMessage { display: none !important; }
```
</details>

<details><summary>[7/9/24] [Luccy] Make the Reverse Proxy Warning Message flash when typing in proxy fields</summary>

```css
#openai_api > [data-source*="openai"]:has(input:focus) + #ReverseProxyWarningMessage {
  zoom: 200%;
  animation: annoyer 0.5s cubic-bezier(0, 0.6, 0.9, 1) infinite;
}
@keyframes annoyer {
  from { opacity: 0.7; }
  to { opacity: 1.0; }
}
```
</details>

<details><summary>[7/10/24] [underscore_x] Remove code colors from codeblocks</summary>

```css
.mes_text code * {
  color: unset !important;
}
```
</details>

<details><summary>[7/25/24] [angel 🩷] Custom avatar mask shapes</summary>

```css
body .avatar img,
body .hotswapAvatar,
body .hotswapAvatar img,
body .avatar  {
    mask-image: url(/img/urfilehere.png);
    mask-size: contain;
    mask-position: center;
    mask-repeat: no-repeat;
    border-radius: 0%;
    width: 60px;
    height: 60px;
}

#quickPersonaImg, .quickPersonaMenuImg {
    border-radius: 0%;
    border: 0px solid transparent;
    box-shadow: 0 0 0px var(--black50a);
    outline: 0px solid transparent;
    width: 70px;
    height: 70px;
    object-fit: cover;
    object-position: center center;
    mask-image: url(/img/urfilehere.png);
    mask-size: contain;
    mask-position: center;
    mask-repeat: no-repeat;
    border-radius: 0%;
    margin-left: 7px;
    opacity: 1;
}

.character_select.is_fav .avatar, .group_select.is_fav .avatar, .group_member.is_fav .avatar, .avatar.is_fav {
    -webkit-mask-box-image-source: url(/img/urfilehere.png);
    -webkit-mask-box-image-width: 14.5px;
    -webkit-mask-box-image-height: 4px;
    -webkit-mask-box-image-outset: 1rem;
    background: [whatever colour u want here] !important;
}
```
</details>

<details><summary>[8/11/24] [underscore_x] Left-align the suggestions in the CYOA Extension</summary>

```css
.custom-suggestion {
  align-items: unset !important;
  justify-content: left !important;
  text-align: left !important;
}
```
</details>

<details><summary>[8/12/24] [Grimwalker(De volta ao controle)] Hide Chat Top Info Bar extension when in VN mode</summary>

```css
body.waifuMode #extensionTopBar {
    visibility: hidden;
}
```
</details>

<details><summary>[8/14/24] [Mikael] Style codeblocks as inner monologue</summary>

```css
#chat code {
  color: color-mix(in srgb, rgb(0 0 0) 31.4%, var(--SmartThemeQuoteColor));
  font-style: italic;
  border-color: transparent;
  font-family: var(--mainFontFamily);
  quotes: "'" "'";
}

#chat code:before {
  content: open-quote;
}
#chat code:after {
  content: close-quote;
}
```
</details>

<details><summary>[8/15/24] [Inspector Cal the Caracal] Text Messaging tweaks to bubblechat styling</summary>

```css
/* unset default bubble bg stuff */
body.bubblechat .mes {
  padding: 5px;
  border-radius: unset;
  background-color: unset !important;
  margin-bottom: 0;
  border: none;
}
body.bubblechat .mes[is_user="true"] {
  background-color: unset !important;
}
/* reapply w/ modifications to message block */
body.bubblechat .mes_block {
  background-color: var(--SmartThemeBotMesBlurTintColor);
  padding: 10px;
  border-radius: 10px;
  border: 1px solid var(--SmartThemeBorderColor);
  margin-left: 5px;
  width: max-content;
}
body.bubblechat .mes[is_user="true"] .mes_block {
  background-color: var(--SmartThemeUserMesBlurTintColor);
  order: -1; 
  margin-right: 5px;
  margin-left: auto;
}
body.bubblechat .mes_block {
  padding-bottom: unset;
}
/* hide name/date line */
.mes_block .ch_name { display: none; }
```
</details>

<details><summary>[8/22/24] [computer wizard] Make hovered messages glow</summary>

```css
:root {
--SmartThemeUserGlow: color-mix(in srgb, var(--SmartThemeUserMesBlurTintColor) 90%, var(--SmartThemeBodyColor) 10%);
--SmartThemeBotGlow: color-mix(in srgb, var(--SmartThemeBotMesBlurTintColor) 90%, var(--SmartThemeBodyColor) 10%);
}

.mes {
    transition: all 0.3s
}

.mes:hover[is_user="true"] {
    background-color: var(--SmartThemeUserGlow)  !important;
    box-shadow: 0px 0px 10px 0.15px color-mix(in srgb, var(--SmartThemeUserGlow) 80%, var(--SmartThemeBodyColor));
    transition: all 0.3s
}

.mes:hover[is_user="false"] {
    background-color: var(--SmartThemeBotGlow) !important;
    box-shadow: 0px 0px 10px 0.15px color-mix(in srgb, var(--SmartThemeBotGlow) 80%, var(--SmartThemeBodyColor));
    transition: all 0.3s
}
```
</details>

<details><summary>[8/30/24] [⛧EvilF͓̽e͓̽a͓̽r͓̽⛧] Hide specific OpenAI models in the dropdown</summary>

```css
#model_openai_select optgroup[label="GPT-3.5 Turbo Instruct"],
#model_openai_select optgroup[label="GPT-4"],
#model_openai_select optgroup[label="GPT-3.5 Turbo"],
#model_openai_select optgroup[label="gpt-4o"],
#model_openai_select optgroup[label="gpt-4o-mini"],
#model_openai_select optgroup[label="GPT-4 Turbo"],
#model_openai_select optgroup[label="Other"],
#model_openai_select #openai_external_category {
    display: none !important;
}
```
</details>

<details><summary>[9/11/24] [underscore_x] Change Favourite characters border colour</summary>

```css
#right-nav-panel .character_select.is_fav .avatar, #right-nav-panel .character_select.is_fav .ch_name {
  outline-color: SkyBlue !important;
  color: LightSkyBlue !important;
}
```
</details>

<details><summary>[9/12/24] [underscore_x] Change the swipes counter font size</summary>

```css
#chat .swipes-counter {
font-size: 10px;
}
```
</details>

<details><summary>[9/12/24] [Avery] 'Edit' mode for easier card editing - shoves topbar and shield to left</summary>

```css
/*only apply when not in 'mobile' mode. Source: mobile-styles.css*/
@media screen and (min-width: 1000px) {
    /*override bar and sheld to left*/
    #top-bar {
           margin-left: 0px;
    }
    #top-settings-holder {
        margin-left: 0px;
    }
    
    #sheld {
        margin-left: 0px;
    }
    
    /*******override other menus to right, adjust size,******/
    /*most menus will follow this*/
    .drawer-content,
    #character_popup {
        left: var(--sheldWidth) !important;
        width: calc(100dvw - var(--sheldWidth)) !important;
        max-height: 100dvh !important;
        min-height: 100dvh !important;
        top: 0;        
    }
    
    /*make extension menu mobile style else its ugly when it gets thin*/
    #extensions_settings,
    #extensions_settings2 {
           width: 100% !important;
           min-width: 100% !important;
    }
    
    /*popup character defs*/
    #character_popup{
    
    }
    
    /*****reorder depth of char and preset screen******/
    #right-nav-panel {
        z-index: -10;
    }
    
    #left-nav-panel {
        z-index: -5;
    }
    
    /*push some windows back to normal*/
    /*the csss fullscreen popup*/
    .csss--body {
         left: auto !important;
        width: 100dvh !important;
    }
}
```
</details>

<details><summary>[9/13/24] [BOBcat] Fade in/out the swipe buttons when hovering the last message</summary>

```css
.mes .swipe_right, .mes .swipe_left {
  visibility: hidden;
  opacity: 0 !important;
  transition: visibility 0s 0.5s, opacity 0.5s linear;
}
.mes:hover .swipe_left, .mes:hover .swipe_right{
  visibility: visible;
  opacity: 0.3 !important;
  transition: opacity 0.1s linear;
}
```
</details>

<details><summary>[9/13/24] [BOBcat] Fade in/out buttons when hovering the messages</summary>

```css
.mes .mfc--root{
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s 0.5s, opacity 0.5s linear;
}

.mes:hover .mfc--root{
  visibility: visible;
  opacity: 0.3;
  transition: opacity 0.1s linear;
}
```
</details>

<details><summary>[9/14/24] [underscore_x] Change login screen size/width make 4 accounts per row</summary>

```css
body.login #userList .userSelect { width: 20%; }

body.login #dialogue_popup {
    width: 800px;
}
```
</details>

<details><summary>[10/1/24] [Wicked_ali] Increase the Quick Persona switch extension icon size</summary>

```css
#quickPersona.interactable {
width: 125px;
height: 125px;
}
```
</details>

<details><summary>[10/5/24] [Wicked_ali] Remove the text input area for CYOA extension</summary>

```css
#send_textarea {
display: none;
}
```
</details>

<details><summary>[10/5/24] [Wicked_ali] Menu bar and windows invisible unless hovered</summary>

```css
top-settings-holder:hover {
  opacity: 1;
}

#top-settings-holder {
    opacity: 0;
transition: all 0.4s ease;
}
```
</details>

<details><summary>[10/5/24] [Wicked_ali] Put QR bar and non-QR bar items on the same line</summary>

```css
#qr--bar {
    justify-content: right;
    width: 50%}

#nonQRFormItems {
    position: relative;
    width: 50%;
}
```
</details>

<details><summary>[12/3/24] [Cheeky] Stack QR toggles under the default set</summary>

```css
.qr--buttons > .qr--buttons{
  display: flex !important;
  width: 100%;
  justify-content: center; 
}
```
</details>

<details><summary>[12/15/24] [Squiddybobble] Makes the "Type a message, or /? for a command list" text invisible</summary>

```css
#send_textarea::placeholder {
  opacity: 0;
}
```
</details>

<details><summary>[12/15/24] [Squiddybobble] Hides the Google translate button</summary>

```css
.mes_button.mes_translate[title="Translate message"] {
  display: none;
}
```
</details>

<details><summary>[12/15/24] [Squiddybobble] Change the pencil icon to a symbol of your choice</summary>

```css
.fa-pencil-alt::before, .fa-pencil::before {
  content: "[Insert Your Symbol Here]";
  font-size: inherit;
}
.mes_buttons, .extraMesButtons {
  display: contents;
}
```
</details>

<details><summary>[12/24/24] [Necessity4Fun] Assign a new main text color to only the chat messages</summary>

```css
body.bubblechat .mes {
  --SmartThemeBodyColor: 'your color here';
  --SmartThemeEmColor: 'your color here';
  --SmartThemeUnderlineColor: 'your color here';
}
```
</details>

<details><summary>[12/24/24] [Necessity4Fun] Change color of the grabber UI icon for chat</summary>

```css
#sheld .drag-grabber {
  --SmartThemeBodyColor: 'new color here';
  margin-right: 'px value to move it away for the right edge of chatbox'
}
```
</details>

<details><summary>[1/2/25] [simontheassassin25] Move the input box higher for mobile users</summary>

```css
#send_textarea {
    position: relative;
    bottom: 40px; /*Moved up 40 pixels*/
    background-color: rgba(0, 0, 0, 0); /*Fully transparent background*/
    border: 2px solid lightgrey; /*Light grey border*/
    border-radius: 15px; /*Rounded corners (circular effect)*/
    width: 100%; /*Full width*/
    margin: 0 auto; /*Centers the element horizontally*/
    padding: 10px; /*Adds some padding inside*/
    box-sizing: border-box; /*Ensures padding is included in the width calculation*/
}

/*Media Queries for Responsiveness*/
@media (max-width: 768px) { /*For tablets and smaller devices*/
    #send_textarea {
        width: 100%; /*Full width on smaller screens*/
        padding: 8px; /*Slightly less padding for smaller screens*/
    }
}

@media (max-width: 480px) { /*For very small devices like mobile phones*/
    #send_textarea {
        width: 100%; /*Full width on small screens*/
        padding: 6px; /*Even smaller padding for very small screens*/
    }
}
```
</details>


<details><summary>[1/21/25] Rivelle Expand QR only when the input field is focused</summary>

Works on both desktop and mobile for a sleek experience

```css
#qr--bar {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    transition: max-height 2s, opacity 1.5s ease-in-out !important;
}

#send_form:hover #qr--bar,
#send_form:focus #qr--bar,
#send_form:active #qr--bar {
    max-height: 50dvh;
    opacity: 1;
    transition: all 1s ease-in-out;
}
```
</details>

<details><summary>[1.21.25] [Rivelle] Expand QR to a single line on mobile</summary>

Scroll if the screen is too small. Adjust max-height if needed

```css
@media screen and (max-width: 1000px) {
    #qr--bar > .qr--buttons, 
    #qr--popout > .qr--body > .qr--buttons {
        --qr--color: transparent;
        margin: 0;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 5px;
        width: 100%;
        flex-direction: row;
        max-height: 40px;
        padding: 5px !important;
    }

    #send_form:hover #qr--bar,
    #send_form:focus #qr--bar,
    #send_form:active #qr--bar {
        display: visibility;
        height: 40px;
        opacity: 1;
    }

    #qr--bar{
        display: none;
        height: 0.1px;
        opacity: 0;
        transition: all 0.8s ease-in-out !important;
    }
}
```
</details>

<details><summary>[1/25/25] [Rivelle] Individual character message styles</summary>

- 🧵 [By Rivelle in ST discord](https://discord.com/channels/1100685673633153084/1226855443586879519/1332626877226942544)
- See also: 🧵 [Individual character message styles](https://discord.com/channels/1100685673633153084/1335308918259454122)


```css
/* Character name styling */
.mes[ch_name="Name"] .name_text {
    display: inline-flex !important;
    align-items: baseline;
    text-align: left;
    font-size: 36px;
    font-family: "Ballet", serif; /* Custom font */
    font-style: italic;
    line-height: 1.2;
    padding-right: 5px;

    /* Custom text gradient effect */
    background: linear-gradient(to bottom, 
        rgba(255, 255, 255, 0.8),
        rgba(231, 159, 168, 1)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    /* Custom text shadow */
    text-shadow: 0 0 5px rgba(231, 159, 168, 1), 
                 0 0 10px rgba(255, 255, 255, 0.2);
}

/* Button alignment and layout */
.mes[ch_name="Name"] .mes_buttons,
.mes[ch_name="Name"] .extraMesButtons {
    position: relative;
    gap: 4px;
    flex-wrap: wrap;
    justify-content: flex-start;
    overflow: visible;
    align-items: center;
}

/* Button styles */
.mes[ch_name="Name"] .mes_button, 
.mes[ch_name="Name"] .extraMesButtons > div {
    place-self: center baseline;
    align-self: center;
    font-size: 14px;
    padding: 5px;
    margin-left: 3px;
    border-radius: 50%;
    background: linear-gradient(to bottom, /* Custom button colors */
        rgba(231, 159, 168, 0.8), 
        rgba(255, 255, 255, 0.5)
    );
    color: rgba(255, 255, 255, 0.9); /* Custom button text color */
    box-shadow: 0 0 5px rgba(231, 159, 168, 0.8); /* Custom shadow effect */
    transition: all 0.3s ease-in-out;
}

/* Character message box */
#chat .mes[ch_name="Name"] {
    position: relative;
    padding: 120px 25px 15px !important;
    background: 
        linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 90%, rgba(231, 159, 168, 0.5) 100%), /* Custom gradient */
        var(--SmartThemeBotMesBlurTintColor);
    border: rgba(231, 159, 168, 0.7) solid 2px !important; /* Custom border color */
    box-shadow: 3px 3px 10px rgba(231, 159, 168, 0.25) !important; /* Custom shadow */
}

/* Message background image */
#chat .mes[ch_name="Name"]::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 150px;
    background: url("https://iili.io/2srZJGR.png") top center no-repeat; /* Custom image URL */
    background-size: cover;
    mask-image: linear-gradient(to bottom, black 60%, rgba(0,0,0,0) 100%);
    -webkit-mask-image: linear-gradient(to bottom, black 60%, rgba(0,0,0,0) 100%);
    mask-size: 100% 100%;
    -webkit-mask-size: 100% 100%;
    mask-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;
    z-index: 2;
    pointer-events: none;
}

/* Text and name layering adjustment */
#chat .mes .mes_block .mes_text,
#chat .mes_block .ch_name {
    position: relative;
    z-index: 3;
}

/* Icon styling */
.mes[ch_name="Name"] .icon-svg {
    aspect-ratio: 1;
    margin-left: 5px;
    place-self: unset;
}
```

1. **Replace `"Name"`** with the specific character name in all selectors
  - If you're lazy and want to apply it to all non-user characters, use `.mes[is_user="false"]` (Just replace all `.mes[ch_name="Name"]` with `.mes[is_user="false"]` and that’s it!)
2. **Message background image**
  - Recommended size: **900px × 200 px**
  - The image scales with the message but remains centered at the top
  - Replace the URL in `background: url(...)` with your own image
3. **Styling applies only to a single character**, keeping the default colors unless customized
4. **If using my theme**, replace:
  - `#chat .mes[ch_name="Name"]` → `#chat .mes[ch_name="Name"] .mes_block`
  - `#chat .mes[ch_name="Name"]::before` → `#chat .mes[ch_name="Name"] .mes_block::before`
5. **Custom elements:**
  - Font (`font-family`)
  - Gradient colors (`background`, `text-shadow`)
  - Button styles (`background`, `color`, `box-shadow`)
  - Borders and shadows (`border`, `box-shadow`)
</details>

<details><summary>[2/15/25] [Wolfsblvt (Shrimp on Duty)] Make swipe arrows sticky when scrolling</summary>

```css
#chat {
 --max-swipe-spacing: 150px;
}
.swipe_left {
  position: sticky;
  align-self: end;
  margin-left: -25px;
  width: 25px;
  margin-top: var(--max-swipe-spacing);
}
.flex-container:has(>.swipe_right) {
  position: sticky;
  align-self: end;
  margin-left: 12px;
  margin-right: -54px;
  width: 54px;
  margin-top: var(--max-swipe-spacing);
}
```
</details>

<details><summary>[2/15/25] [Wolfsblvt (Shrimp on Duty)] Sticky avatar when scrolling</summary>

```css
.mesAvatarWrapper {
  position: sticky;
  top: 10px;
}
```
</details>

<details><summary>[2/19/25] [underscore_x] Increase padding of drag handles of the chat completion prompt manager</summary>

```css
#completion_prompt_manager #completion_prompt_manager_list .completion_prompt_manager_prompt:has(.drag-handle.ui-sortable-handle) {
    padding-left: 30px;
}


#completion_prompt_manager #completion_prompt_manager_list .completion_prompt_manager_prompt .drag-handle {
    padding: 10px;
}
```
</details>

<details><summary>[3/13/25] [Rivelle] Makes background appear only within the chat width</summary>

You can set the UI Background opacity to 100 or adjust it to another color yourself :FakeNitroEmoji:

```css
#bg1::before,
#bg_custom::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--SmartThemeBlurTintColor);
    z-index: -1;
    mask-image: linear-gradient(
        to right,
        black 0,
        black calc((100% - var(--sheldWidth)) / 2),
        transparent calc((100% - var(--sheldWidth)) / 2),
        transparent calc((100% - var(--sheldWidth)) / 2 + var(--sheldWidth)),
        black calc((100% - var(--sheldWidth)) / 2 + var(--sheldWidth)),
        black 100%
    );
    -webkit-mask-image: linear-gradient(
        to right,
        black 0,
        black calc((100% - var(--sheldWidth)) / 2),
        transparent calc((100% - var(--sheldWidth)) / 2),
        transparent calc((100% - var(--sheldWidth)) / 2 + var(--sheldWidth)),
        black calc((100% - var(--sheldWidth)) / 2 + var(--sheldWidth)),
        black 100%
    );
}
```
</details>
