# Torso print batch 1

Validation: all six saved PNGs are 1024x1536. Background is not exact #FFFFFF: sampled top-left pixels are RGB (253,255,255) for lather front/back and velvet front, and (253,253,255) for velvet back and gator front/back. Subtle color variation also remains. The single regeneration allowance was exhausted; no pixel correction was applied.

Generated with the built-in image generation tool. Both approved references were attached to every call: `torso_engine-six.png` (front) and `torso_engine-six_back.png` (back). Requested size: 1024x1536. Requested background: opaque pure white #FFFFFF.

One permitted regeneration was used for velvet-mob front because the first result included a filled shirt/body silhouette. No other image was regenerated. Outputs are copied without pixel editing; generated colors/background may contain subtle variation rather than exact flat hex values.

## torso_lather-linen.png

Pixel size: 1024x1536 portrait.
Background: requested pure white #FFFFFF (opaque); see validation note above.

Exact prompt:

```text
Use case: stylized-concept
Asset type: flat toy-brick racing game torso print texture, decoration only.
Input images: image 1 approved front style reference; image 2 approved back style reference. Match their simple pad-print graphic style exactly, but obey the stricter flat color and white background requirements below.
Output: exactly 1024x1536 pixels portrait, opaque pure #FFFFFF background for color keying. Leave top 77 pixels and bottom 77 pixels entirely empty white. Artwork spans full width edge to edge within the remaining area. Only isolated printed decorations on white; underlying plastic color is context only and MUST NOT be painted. No torso silhouette, shirt outline, body, person, head, arms, 3D object, shading, gradients, folds, texture, lighting or shadows. Solid flat colors and crisp edges. No text, letters, numbers, logos, brand marks, watermark. Object pictograms only. Nothing inside artwork is white or near-white; lightest permitted neutral is #D2D2D2. White gaps are empty background. Original toy design, no resemblance to any commercial toy-brick character.
Subject: FRONT spa attendant print for cream #F4EFE4 plastic (do not render cream). Gold #C9A24A mandarin collar outline at top; diagonal wrap closure edged aqua #8FC9D6 with exactly three gold buttons. Two gold #C9A24A suspender straps run straight vertically down. Small folded-towel object pictogram in aqua and gold at wearer's left chest, image right. Wrap edge reaches side edge for full-width design.
```

## torso_lather-linen_back.png

Pixel size: 1024x1536 portrait.
Background: requested pure white #FFFFFF (opaque); see validation note above.

Exact prompt:

```text
Use case: stylized-concept
Asset type: flat toy-brick racing game torso print texture, decoration only.
Input images: image 1 approved front style reference; image 2 approved back style reference. Match their simple pad-print graphic style exactly, but obey the stricter flat color and white background requirements below.
Output: exactly 1024x1536 pixels portrait, opaque pure #FFFFFF background for color keying. Leave top 77 pixels and bottom 77 pixels entirely empty white. Artwork spans full width edge to edge within the remaining area. Only isolated printed decorations on white; underlying plastic color is context only and MUST NOT be painted. No torso silhouette, shirt outline, body, person, head, arms, 3D object, shading, gradients, folds, texture, lighting or shadows. Solid flat colors and crisp edges. No text, letters, numbers, logos, brand marks, watermark. Object pictograms only. Nothing inside artwork is white or near-white; lightest permitted neutral is #D2D2D2. White gaps are empty background. Original toy design, no resemblance to any commercial toy-brick character.
Subject: BACK spa attendant print for cream #F4EFE4 plastic (do not render cream). Gold #C9A24A suspenders in a Y: two straps from shoulders meet at upper back, then exactly one strap descends down center. Wide aqua #8FC9D6 sash across waist from left edge to right edge, tied into a bow at center. No other decorations.
```

## torso_velvet-mob.png

Pixel size: 1024x1536 portrait.
Background: requested pure white #FFFFFF (opaque); see validation note above.

Exact initial prompt:

```text
Use case: stylized-concept
Asset type: flat toy-brick racing game torso print texture, decoration only.
Input images: image 1 approved front style reference; image 2 approved back style reference. Match their simple pad-print graphic style exactly, but obey the stricter flat color and white background requirements below.
Output: exactly 1024x1536 pixels portrait, opaque pure #FFFFFF background for color keying. Leave top 77 pixels and bottom 77 pixels entirely empty white. Artwork spans full width edge to edge within the remaining area. Only isolated printed decorations on white; underlying plastic color is context only and MUST NOT be painted. No torso silhouette, shirt outline, body, person, head, arms, 3D object, shading, gradients, folds, texture, lighting or shadows. Solid flat colors and crisp edges. No text, letters, numbers, logos, brand marks, watermark. Object pictograms only. Nothing inside artwork is white or near-white; lightest permitted neutral is #D2D2D2. White gaps are empty background. Original toy design, no resemblance to any commercial toy-brick character.
Subject: FRONT 1930s costume team print for dark charcoal #2B2B33 plastic (do not render charcoal base). Thin grey #7C7C88 vertical pinstripes all over the entire usable width. Two dark #1E1E24 lapels with gold #D9C27A edges form a V. Purple #6E4A86 necktie with gold clip. Two straight vertical gold #D9C27A suspenders. Small gold spade playing-card-suit pictogram pin on wearer's left lapel, image right.
```

Exact final regeneration prompt:

```text
Use case: stylized-concept
Asset type: flat toy-brick racing game torso print texture, decoration only.
Input images: image 1 approved front style reference; image 2 approved back style reference. Match their simple pad-print graphic style exactly, but obey the stricter flat color and white background requirements below.
Output: exactly 1024x1536 pixels portrait, opaque pure #FFFFFF background for color keying. Leave top 77 pixels and bottom 77 pixels entirely empty white. Artwork spans full width edge to edge within the remaining area. Only isolated printed decorations on white; underlying plastic color is context only and MUST NOT be painted. No torso silhouette, shirt outline, body, person, head, arms, 3D object, shading, gradients, folds, texture, lighting or shadows. Solid flat colors and crisp edges. No text, letters, numbers, logos, brand marks, watermark. Object pictograms only. Nothing inside artwork is white or near-white; lightest permitted neutral is #D2D2D2. White gaps are empty background. Original toy design, no resemblance to any commercial toy-brick character.
Subject: FRONT 1930s costume team print for dark charcoal #2B2B33 plastic (do not render charcoal base). Thin grey #7C7C88 vertical pinstripes all over the entire usable width. Two dark #1E1E24 lapels with gold #D9C27A edges form a V. Purple #6E4A86 necktie with gold clip. Two straight vertical gold #D9C27A suspenders. Small gold spade playing-card-suit pictogram pin on wearer's left lapel, image right.
CORRECTION: The charcoal plastic is NOT artwork. Absolutely no filled charcoal shirt/body silhouette or shoulder contour. All space between grey pinstripes must be pure #FFFFFF empty background, exactly like the back reference. Only dark lapel shapes may be filled. Keep all other specified decorations.
```

## torso_velvet-mob_back.png

Pixel size: 1024x1536 portrait.
Background: requested pure white #FFFFFF (opaque); see validation note above.

Exact prompt:

```text
Use case: stylized-concept
Asset type: flat toy-brick racing game torso print texture, decoration only.
Input images: image 1 approved front style reference; image 2 approved back style reference. Match their simple pad-print graphic style exactly, but obey the stricter flat color and white background requirements below.
Output: exactly 1024x1536 pixels portrait, opaque pure #FFFFFF background for color keying. Leave top 77 pixels and bottom 77 pixels entirely empty white. Artwork spans full width edge to edge within the remaining area. Only isolated printed decorations on white; underlying plastic color is context only and MUST NOT be painted. No torso silhouette, shirt outline, body, person, head, arms, 3D object, shading, gradients, folds, texture, lighting or shadows. Solid flat colors and crisp edges. No text, letters, numbers, logos, brand marks, watermark. Object pictograms only. Nothing inside artwork is white or near-white; lightest permitted neutral is #D2D2D2. White gaps are empty background. Original toy design, no resemblance to any commercial toy-brick character.
Subject: BACK 1930s costume team print for dark charcoal #2B2B33 plastic (do not render charcoal base). Thin grey #7C7C88 vertical pinstripes all over the entire usable width. Gold #D9C27A suspenders in an H: two straight vertical straps joined by a short horizontal crossbar between shoulder blades. Purple #6E4A86 belt band at hem, running full width edge to edge above the empty bottom 5%.
```

## torso_gator-gang.png

Pixel size: 1024x1536 portrait.
Background: requested pure white #FFFFFF (opaque); see validation note above.

Exact prompt:

```text
Use case: stylized-concept
Asset type: flat toy-brick racing game torso print texture, decoration only.
Input images: image 1 approved front style reference; image 2 approved back style reference. Match their simple pad-print graphic style exactly, but obey the stricter flat color and white background requirements below.
Output: exactly 1024x1536 pixels portrait, opaque pure #FFFFFF background for color keying. Leave top 77 pixels and bottom 77 pixels entirely empty white. Artwork spans full width edge to edge within the remaining area. Only isolated printed decorations on white; underlying plastic color is context only and MUST NOT be painted. No torso silhouette, shirt outline, body, person, head, arms, 3D object, shading, gradients, folds, texture, lighting or shadows. Solid flat colors and crisp edges. No text, letters, numbers, logos, brand marks, watermark. Object pictograms only. Nothing inside artwork is white or near-white; lightest permitted neutral is #D2D2D2. White gaps are empty background. Original toy design, no resemblance to any commercial toy-brick character.
Subject: FRONT alligator costume print for green #4E8E45 plastic (do not render green base). Pale-yellow #E5D27A segmented belly plates down center, a column of rounded horizontal plates. Dark green #2F5E2C scale dots on both sides extending to side edges. Two straight vertical dark green #2F5E2C suspenders. Tiny simple gator-head object pictogram on wearer's left chest, image right, using dark green and pale-yellow; no white eyes or teeth.
```

## torso_gator-gang_back.png

Pixel size: 1024x1536 portrait.
Background: requested pure white #FFFFFF (opaque); see validation note above.

Exact prompt:

```text
Use case: stylized-concept
Asset type: flat toy-brick racing game torso print texture, decoration only.
Input images: image 1 approved front style reference; image 2 approved back style reference. Match their simple pad-print graphic style exactly, but obey the stricter flat color and white background requirements below.
Output: exactly 1024x1536 pixels portrait, opaque pure #FFFFFF background for color keying. Leave top 77 pixels and bottom 77 pixels entirely empty white. Artwork spans full width edge to edge within the remaining area. Only isolated printed decorations on white; underlying plastic color is context only and MUST NOT be painted. No torso silhouette, shirt outline, body, person, head, arms, 3D object, shading, gradients, folds, texture, lighting or shadows. Solid flat colors and crisp edges. No text, letters, numbers, logos, brand marks, watermark. Object pictograms only. Nothing inside artwork is white or near-white; lightest permitted neutral is #D2D2D2. White gaps are empty background. Original toy design, no resemblance to any commercial toy-brick character.
Subject: BACK alligator costume print for green #4E8E45 plastic (do not render green base). Row of pale-yellow #E5D27A triangular spine ridge pictograms running vertically down center back. Dark green #2F5E2C scale dots distributed across width extending to side edges. Dark green #2F5E2C suspender straps crossing in an X.
```

