# Generated print prompts

Generated with the built-in image generation tool; three figure renders attached as references to every call. Each asset generated once and regenerated once after rule violations. Final images copied unchanged. Background: near-white (opaque), not transparent, for all three; sampled corner pixels are (253,255,255), (253,255,255), and (254,254,255), respectively. The pure #FFFFFF requirement was not achieved.

Known remaining deviations: face features exceed the central 60% bounds and row placement does not follow the requested square-cell coordinates; subtle shading/color variation remains on all prints. The back omits the matching collar edge. These are pilot outputs, not fully rule-compliant production textures. No further generations were made because of the one-retry limit.

## face_sheet.png

Pixel size: 1536x1024. Background: near-white, opaque; not pure #FFFFFF.

Initial exact prompt:

```text
Use case: stylized-concept
Asset type: flat game texture, face_sheet.png. Generate exactly 1536x1024 pixels landscape.
Input images: all three are reference images for our ORIGINAL rounded-cube-headed toy design only, not edit targets. Do not render the figure. Must not resemble any commercial toy-brick minifigure.
Primary request: Eight isolated flat pad-printed faces, strict 4 columns by 2 rows of equal SQUARE cells. Because canvas is 1536x1024, use a centered 1536x768 grid of 384x384 squares with 128 empty pixels above and below. Cell centers x=192,576,960,1344 and y=320,704. All features of each face contained inside its central 60 percent square (230x230). No visible grid.
Order left to right top then bottom: neutral, determined, shouting, shocked; cheering, dizzy, laughing, worried.
Style: original simple flat pad-print, solid near-black #1D1D22 shapes, crisp edges. Eyebrows on EVERY face. Eyes are tall ovals, never plain round dots; small white eye highlights. Express dizzy with tilted oval eyes and asymmetric brows, no spiral symbols. Open mouths have dark red interiors and white teeth strips. Different clearly legible expressions.
Background: genuinely transparent alpha; if unavailable use pure white #FFFFFF without shadows.
Constraints: only facial features, no skin color, no head outline, no shading, no gradients, no cell borders, no text, letters, numbers, logos, brand marks, watermark, helmet or body.
```

Final exact prompt (retry):

```text
Use case: stylized-concept
Asset type: flat game texture, face_sheet.png. Generate exactly 1536x1024 pixels landscape.
Input images: all three are reference images for our ORIGINAL rounded-cube-headed toy design only, not edit targets. Do not render the figure. Must not resemble any commercial toy-brick minifigure.
Primary request: Eight isolated flat pad-printed faces, strict 4 columns by 2 rows of equal SQUARE cells. Because canvas is 1536x1024, use a centered 1536x768 grid of 384x384 squares with 128 empty pixels above and below. Cell centers x=192,576,960,1344 and y=320,704. All features of each face contained inside its central 60 percent square (230x230). No visible grid.
Order left to right top then bottom: neutral, determined, shouting, shocked; cheering, dizzy, laughing, worried.
Style: original simple flat pad-print, solid near-black #1D1D22 shapes, crisp edges. Eyebrows on EVERY face. Eyes are tall ovals, never plain round dots; small white eye highlights. Express dizzy with tilted oval eyes and asymmetric brows, no spiral symbols. Open mouths have dark red interiors and white teeth strips. Different clearly legible expressions.
Background: genuinely transparent alpha; if unavailable use pure white #FFFFFF without shadows.
Constraints: only facial features, no skin color, no head outline, no shading, no gradients, no cell borders, no text, letters, numbers, logos, brand marks, watermark, helmet or body.
Correction priority: hard flat opaque ink shapes ONLY, absolutely no glows or soft shadows or gradients. Use pure white #FFFFFF background as the permitted fallback. Keep each complete face including brows within 230x230 pixels at the specified centers. Laughing must also have tall oval eyes, not closed slits. Mouth interiors solid dark red with no tongue or extra colors. Precisely respect the square-cell coordinates.
```

## torso_engine-six.png

Pixel size: 1024x1536. Background: near-white, opaque; not pure #FFFFFF.

Initial exact prompt:

```text
Use case: stylized-concept
Asset type: game torso front print, torso_engine-six.png. Exactly 1024x1536 pixels portrait.
Input images: three reference renders of an ORIGINAL toy figure, reference only, not edit targets. Do not depict the figure or imitate any commercial toy-brick minifigure.
Primary request: isolated flat pad-print artwork to apply onto the straight charcoal #2A2D34 torso box. Only the coat decorations, no charcoal coat fill. Transparent background, or pure white #FFFFFF if unavailable.
Flat front view: two horizontal lime-yellow #CFE23A reflective bands with a silver-grey center stripe, one across chest at y=550 and one near hem at y=1320, extending edge to edge across full canvas width. Central vertical closure strip with exactly four small dark clasps. Collar edge at top inside design area. Two bright yellow #F2C230 suspender straps from shoulders straight vertically down front. Small flat red and yellow fire-hydrant pictogram badge on wearer's LEFT chest (image RIGHT).
Keep top 5 percent (77 pixels) and bottom 5 percent completely empty. Design fills full width.
Solid flat colors, crisp printed edges, no shading, no gradients, no folds, no arms, no body or head silhouette, no mockup or perspective, no shadows, no text, letters, numbers, logos or brand marks. Fire hydrant is a simple object pictogram without lettering.
```

Final exact prompt (retry):

```text
Use case: stylized-concept
Asset type: game torso front print, torso_engine-six.png. Exactly 1024x1536 pixels portrait.
Input images: three reference renders of an ORIGINAL toy figure, reference only, not edit targets. Do not depict the figure or imitate any commercial toy-brick minifigure.
Primary request: isolated flat pad-print artwork to apply onto the straight charcoal #2A2D34 torso box. Only the coat decorations, no charcoal coat fill. Transparent background, or pure white #FFFFFF if unavailable.
Flat front view: two horizontal lime-yellow #CFE23A reflective bands with a silver-grey center stripe, one across chest at y=550 and one near hem at y=1320, extending edge to edge across full canvas width. Central vertical closure strip with exactly four small dark clasps. Collar edge at top inside design area. Two bright yellow #F2C230 suspender straps from shoulders straight vertically down front. Small flat red and yellow fire-hydrant pictogram badge on wearer's LEFT chest (image RIGHT).
Keep top 5 percent (77 pixels) and bottom 5 percent completely empty. Design fills full width.
Solid flat colors, crisp printed edges, no shading, no gradients, no folds, no arms, no body or head silhouette, no mockup or perspective, no shadows, no text, letters, numbers, logos or brand marks. Fire hydrant is a simple object pictogram without lettering.
Correction priority: use an entirely pure white #FFFFFF background, including all space between the decorations. NO charcoal torso fill whatsoever. NO glow, no lighting, no shadows, no shading. This is a 2D stencil decal, solid uniform colors. Badge small. All decorations confined y=77 through1458. Precisely two full-width bands.
```

## torso_engine-six_back.png

Pixel size: 1024x1536. Background: near-white, opaque; not pure #FFFFFF.

Initial exact prompt:

```text
Use case: stylized-concept
Asset type: game torso back print, torso_engine-six_back.png. Exactly 1024x1536 pixels portrait.
Input images: three reference renders of our ORIGINAL toy figure, reference only, not edit targets. Do not depict the figure or resemble a commercial toy-brick minifigure.
Primary request: matching isolated flat back pad-print artwork for the charcoal #2A2D34 straight torso box, only coat decorations, no charcoal coat fill. Genuinely transparent background or pure white #FFFFFF if unavailable.
Two horizontal lime-yellow #CFE23A reflective bands each with a silver-grey center stripe, full width edge to edge: chest-level band centered y=550 and near-hem band centered y=1320. Two bright yellow #F2C230 suspender straps start at the shoulders, cross as an X between shoulder blades and continue down the back. Small flat collar edge at top inside design area.
Leave top 77 pixels and bottom 77 pixels completely empty (5 percent each). Design fills full width.
Solid flat colors, crisp printed edges, no shading, gradients, folds, arms, head, body silhouette, perspective, mockup or shadows. No text, letters, numbers, logos or brand marks. No badge on back, no front closure.
```

Final exact prompt (retry):

```text
Use case: stylized-concept
Asset type: game torso back print, torso_engine-six_back.png. Exactly 1024x1536 pixels portrait.
Input images: three reference renders of our ORIGINAL toy figure, reference only, not edit targets. Do not depict the figure or resemble a commercial toy-brick minifigure.
Primary request: matching isolated flat back pad-print artwork for the charcoal #2A2D34 straight torso box, only coat decorations, no charcoal coat fill. Genuinely transparent background or pure white #FFFFFF if unavailable.
Two horizontal lime-yellow #CFE23A reflective bands each with a silver-grey center stripe, full width edge to edge: chest-level band centered y=550 and near-hem band centered y=1320. Two bright yellow #F2C230 suspender straps start at the shoulders, cross as an X between shoulder blades and continue down the back. Small flat collar edge at top inside design area.
Leave top 77 pixels and bottom 77 pixels completely empty (5 percent each). Design fills full width.
Solid flat colors, crisp printed edges, no shading, gradients, folds, arms, head, body silhouette, perspective, mockup or shadows. No text, letters, numbers, logos or brand marks. No badge on back, no front closure.
Correction priority: pure white #FFFFFF background everywhere between the isolated decorations. Absolutely NO glow, NO shadows, NO shading, NO gradients, NO charcoal fill. Only uniform solid flat ink shapes. The yellow straps must cross in X HIGH between shoulder blades above the chest band; then run down to hem. All decorations confined y=77 through1458.
```


