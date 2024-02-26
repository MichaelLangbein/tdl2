# Design

## Objectives

## Aspects

### Aspects using color

- Color palette

### Aspects using typography

- Types of fonts
- Matching fonts

### Aspects using composition

- Foreground-background
- Dominance
- Similarity
- Rhythm
- Texture
- Direction
- Contrast
- Hierarchy

## Gaze tracking

[Kirtley, 2018: How Images Draw The Eye](https://d1wqtxts1xzle7.cloudfront.net/83340544/0276237417693564-libre.pdf?1649278514=&response-content-disposition=inline%3B+filename%3DHow_Images_Draw_the_Eye.pdf&Expires=1676635930&Signature=XdO4HodkDkoY-W65qcntpcNsCmMV9nXAKzOvH4G2WfJcgJW8aVcRwcGtQYf0xq23ZGiK6iVfdkyj2OOfzbG1qgxhVI6eJwy2ZdSS2TyhiCuTIQeDRqQte8HwqQUM213ye~wPa-eK-81uA7zfx1lQVAFe0af5cPqroZfknoQZ6A9yzxyegrwFSYQquHR9RBeyGqnUlpe5ag29lfFFrTSZFq7PieK2PoPavEg4V4IWHyMCdqqJinLykmaTNIWB0eFTr4wAEKinoMBbz9CEjkqq9ZAYqTezQGwizXoTUXUsCaEupVnRwbPiEp--TQ3mSQthjwUREGj4oGJckWJMcqPqZw__&Key-Pair-Id=APKAJLOHF5GGSLRBV4ZA)

- People _always_ are more attractive than anything else
- Especially their faces
- Outisde of people, contrast, edges etc. do have an impact
- Loomis' suggested paths of entry and exit seem to not hold up.

## Resources

### Inspiration

- https://dribbble.com/tags/ui
- https://www.behance.net

### Assets

- https://sketchfab.com/
- https://www.pexels.com/de-de/

### Colors

- https://paletton.com
- https://colorbrewer2.org
- https://londonimageinstitute.com/how-to-empower-yourself-with-color-psychology/

# Process

## 1. Content & Feeling

1.  What information do we want to convey?
    1. Design: how to best convey that information
2.  How should the user feel about that information?
    1. Art direction
3.  Who is the recipient?
4.  Call to action: a simple way to act upon the desired info & feeling

### 1.1. Information design

How to convey information

- intro
- info
- call to action

##### Hierarchy of graphical dimensions

- Categorical

1. position
2. size
3. color
4. texture

##### Marks & channels

This is about how to visualize attribute types: categorical, ordered, quantitative.

Using:

- Marks are things to be displayed:
  - Numbers, key-value pairs, ...
- Channels are properties of those marks:
  - Position, shape, color, size, opacity, texture, tooltips, ...

Typically, a row in your csv is a mark, and a column is a channel.

### 2.1. Art direction

How to make somebody feel

- Are there any colors you don't like?
- Is there a corporate design?
- Mood-board

##### Color

<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/color_emotions.png">

##### Font

<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/fonts.png">

Google fonts most similar to the above:

- Serif:
  - Humanist: Garamond -> EB Garamond
  - Realist: Baskerville -> Libre Baskerville
  - Geometric: Bodoni -> Libre Bodoni
- Sans:
  - Humanist: Frutiger -> Hind
  - Realist: Helvetica -> Questrial, Roboto
  - Geometric: Futura -> Nunito

Text sizing:

- guide values:
  - title: 32px, bold
  - body: 18px, regular/bold
  - small: 14px, regular
- headings:
  - smaller line-spacing (1.3rem), smaller letter spacing (-5%)
  - not marked through size, but through color and
- copy text:
  - max-width: 700px
- relation between the two:
  - don't mix center-aligned with side-aligned

# Process, practical

1. Define user flow:

- example: entry -> view products -> add to cart -> purchase -> done

2. Get content from your client

- Always get content first, then do design.
- Usually in form of a bunch of word-files and images. Often one doc per page (home, about, products, ...)

3. Wireframing

- balsamic, figma

4. Pick basic design parameters

- if the content is bland, your surrounding page can be shiny. Otherwise if the content can shine, make it sparkle, and dim down the surrounding frame.
- Consistent colors, fonts, buttons, icons, forms, boxes
- Colors:
  - Reflect industry, values, brand, logo
- Fonts
- Icons
  - Flat, scleomorphic, glyph, duotone, 3d, outlined

5. Designing

- Visual hierarchy:
  - Make order of importance of elements clear
- Contrast
  - Distingish a few, make all readable
- Balance
  - Good spacing, alignment
- Consistency
- Simplicity
  - Dont make me think
- Feedback
  - Mark every action clearly as successful

6. Illustrations and visuals

# Good defaults

These will make your stuff look boring, but boring is good at first

- Colors:
  - Backgroud white or black
  - Heading: #2e2e2e, body: #4e4e4e, label: #6e6e6e
  - Accent: Saturation: 90, Lightness: 50
    - Only use accents for 10% of elements on the screen, i.e. main action, maybe a few more.
    - No two buttons both in accent color.
- Fonts
  - Plus Jakarta Sans, Inter , Satoshi, Poppins, Ubuntu, Fira Sans, Figtree, Lato, Muli, Open Sans, PT Sans, Source Sans 3
  - Pick one per project
  - Only three font sizes: 24, 16, 12px (plus 32 only on the landing page)
- Icons
  - Only one set per project
- Spacing
  - 8 point grid: allows spacing units 4, 8, 12, 16, 20, 24, 32, 40
  - Pick five out of these: best 8 12 16 24 32
  - within a group, a distance should be 12 or 16
  - between groups, a distance should be 24 9r 32 (also applies to outside margins)
  - body: max-width 700px

# Layout

- Always content first, then layout
- Content as rows:
  - Every page made of rows, each row one idea. (hero-row, about-row, stats-row, ...)
  - Each row different background (or otherwise visually distinct)
  - Always the same vertical padding between rows
  - common row templates:
    - hero
    - image left, text right
    - two/three colum text with header
    - caroussel
    - map
    - contact form
    - comment
    - call to action
- Frame around content
  - header
  - footer
  - menu-bar
- Grid within each row:
  - helps to make explicit: alignment, white-space, scale, proximity
  - commonly 12-column grid or 8 column grid
- Avoid walls of text, sprinkle white space, images, animations
- Within every grid, consider the following:
  - Focal point
  - rule of thirds
  - white space
  - hierarchy
