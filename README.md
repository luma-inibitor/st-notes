## Guides

- https://rentry.org/how2claude
- [DeepSeek R1 Q1F V1](https://rentry.org/88fr3yr5)


## CSS snippets

Public:
- [Model names styling](https://rentry.org/tavern-model-names)

Discord:
- 🧵 [ST discord: Custom CSS snippet compilation](https://discord.com/channels/1100685673633153084/1226855443586879519/1226855443586879519)
- 🧵 [ST discord: Individual character message styles](https://discord.com/channels/1100685673633153084/1335308918259454122)


<details><summary>Hide overflow</summary>

```css
body { overflow: hidden; }
```
</details>

<details><summary>Style all out-of-context messages</summary>

```css
#chat > .mes:has(~ .lastInContext) { opacity: 0.5; }
```
</details>

<details><summary>Collapse hidden (ghost) messages</summary>

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

<details><summary>Hide default Custom CSS text box</summary>

```css
.flex-container.flexnowrap.alignitemscenter:has(> textarea#customCSS) {
    display: none !important;
}
```
</details>

<details><summary>Remove popout button in the quick-reply menu</summary>

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

<details><summary>Show character avatar as the background</summary>

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

<details><summary>Expand QR only when the input field is focused</summary>

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

<details><summary>Expand QR to a single line on mobile</summary>

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

Very fancy character banner display in messages
<details><summary>Expand for details</summary>

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

<details><summary>Makes background only appear within the chat width</summary>

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
