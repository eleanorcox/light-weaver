# Research: more weave structures

Second round: 18 November 2026, on structures that can be woven from a draft and colour orders, British, Irish and northern European first. Found by a research subagent; the claims the designs rest on were spot-checked against their pages afterwards. Labels as in [british-traditions.md](british-traditions.md): **checked** (read twice), **sourced** (the researcher's source, not read again), **worked out** (our own reasoning, tested by eye against the screenshot), **unchecked**.

## Summary

| Structure | Built? | Status |
| --- | --- | --- |
| Monk's belt | **Built**, `?scene=monksbelt` | Threading and treadling checked |
| Bird's eye | **Built**, `?scene=birdseye` | Threading checked; treadling worked out |
| Linen damask | **Built**, `?scene=damask`, our own motif | Structure checked |
| Welsh double cloth | **Built**, `?scene=doublecloth`, our own design | Structure sourced in round 1 |
| Rosepath | Not yet | The threading was only in a picture; two versions are in circulation |
| Shepherd's check | Not yet | No thread count found; 4-and-4 would be the same as our houndstooth |
| Overshot coverlets | Not yet | Threading units sourced; no public-domain named draft read yet |
| Summer and winter, huck, M's and O's, honeycomb | Not yet | Threading units only, from weak sources |
| Barleycorn | Not yet | No threading found; American "barley corn" drafts are a different weave |
| Witney blanket bands | Not yet | Thin sources; see the permission note below |

## Left for Eleanor to look into

These may need someone's permission or confirmation, so nothing has been built from them:

- **Hudson's Bay Company stripe** on point blankets: the multi-colour stripe is the company's. A single coloured band at each end, as on a Witney blanket in the Pitt Rivers Museum, would be ours to use.
- **Estate checks** such as Coigach and Ardtornish: whether they are owned by an estate or a mill is unchecked. Coigach was reportedly first woven by Johnstons of Elgin in 1846 (from a search summary; page not read).
- **"Irish Linen"** may be a certification mark (unchecked). Our damask is called "linen damask, in the tradition of Lisburn", not Irish Linen.

## Monk's belt

- "Monk's belt is a two-block form of overshot, with the blocks drafted on opposites" (Helene Bress, *The Weaving Book*, p. 265, quoted by Schacht). Checked: [Schacht Spindle, monk's belt sampler](https://schachtspindle.com/blogs/archives/monks-belt-sampler).
- Block A is threaded on shafts 1 and 2, block B on 3 and 4; "a pattern row alternates with a plain weave or tabby row" (shafts 1 and 3, then 2 and 4). Schacht's example sequence: block A (lift 3 and 4), tabby, A, tabby, A, tabby, block B (lift 1 and 2), tabby, B, tabby, B, tabby. The pattern weft floats over the threads not raised. Checked: same page.
- Where and when it began, and the Swedish name *munkabälte*: unchecked.
- **For the code:** `monksBelt()` in `src/core/draft.ts`, with blocks of six threads; the weft alternates pattern colour and tabby colour.

## Bird's eye

- "Bird's Eye is a point twill or broken twill threading that traditionally creates a diamond pattern with a dot at its center", threaded "4,3,2,3,4,1,2,3,4,3,2,1, repeat". Checked: [Schacht Spindle, twill sampler part 2](https://schachtspindle.com/blogs/archives/weaving-a-twill-sampler-part-2).
- The treadling is only in the page's pictures. Worked out: treadled as drawn in (the treadling follows the threading) on a 2/2 twill tie-up. The screenshot shows diamonds with centre dots.
- An eight-shaft "Bird Eyes and Twilled" draft is in Bronson's *Domestic Manufacturer's Assistant* (1817). Sourced: [Internet Archive](https://archive.org/details/domesticmanufact00bron); not read in detail.

## Linen damask

- "Linen damask is a figured fabric made from one warp and one weft in which, generally, warp-satin and weft-sateen weaves interchange. Twill or binding weaves are sometimes introduced." Checked: [Ferguson's Irish Linen FAQ](https://fergusonsirishlinen.com/pages/faqs).
- "William Coulson (1739-1801) set up a damask linen weaving company in Lisburn in 1764." Checked: [Lisburn Museum](https://www.lisburnmuseum.com/collections/the-coulsons-of-lisburn-damask-manufacturers/). The museum page shows a Jacquard hand-loom damask weaver at Coulson's around 1900; that it holds Coulson's point papers was not supported.
- **For the code:** `damask()` in `src/core/blocks.ts`: a five-end satin, reversed between figure and ground. Firms' own designs are not imitated; the motif is ours.

## Welsh double cloth

- Sources are in [british-traditions.md](british-traditions.md#welsh-double-cloth).
- **For the code:** `doubleCloth()` in `src/core/blocks.ts`: a grid saying which layer is on the face, each layer in plain weave. Only the face is drawn; the hidden layer beneath is left out (worked out, a simplification).

## Rosepath, shepherd's check and the rest

- **Rosepath:** the source's threading was a picture, and two versions (1-2-3-4-3-2-1 and 1-2-3-4-1-4-3-2) are in circulation, both unchecked. [Gist Yarn](https://www.gistyarn.com/blogs/journal/rosepath-twill-scarf).
- **Shepherd's check:** "historically associated with the Anglo-Scottish Border, particularly with the Scottish Borders and Northumberland", "a crossweave of small dark and light checks"; light squares were "simply untreated sheep's wool", and black and white is the modern norm, with dark greys, blues, greens or browns before. Checked: [Wikipedia: Border tartan](https://en.wikipedia.org/wiki/Shepherd%27s_check). No thread count given.
- **Overshot:** threading built from two-thread units on four shafts, a pattern weft alternating with tabby; associated with coverlets of early Scottish and English settlers in North America. Sourced: [Gist Yarn](https://www.gistyarn.com/blogs/how-to-weave/weave-structures-overshot).
- **Summer and winter:** four-end units 1-3-2-3 or 1-4-2-4. Sourced: [Gist Yarn](https://www.gistyarn.com/blogs/how-to-weave/weave-structures-monks-belt-crackle-weave-summer-and-winter-halvdrall).
- **Barleycorn:** a Handwoven editor says the American "barley corn" drafts are "not at all related" to the Scottish eight-shaft twill. Sourced: [Handwoven](https://handwovenmagazine.com/ask-madelyn-barleycorn/).
- **Witney blankets:** a plain wool cloth with coloured bands at each end. Sourced: [Pitt Rivers Museum](https://odp-test.prm.ox.ac.uk/item/prm-object-270987/witney-four-point-blanket-a-large-wool-blanket-red-with-a-black-band-at-each-short-end-jmc-20-7-2018).

## Still to find out

1. A rosepath threading in text, from a guild or book.
2. A thread count for a historic shepherd's check.
3. A named overshot coverlet draft from a public-domain book, read in full (Bronson 1817 is the lead).
4. A Hebridean barleycorn draft.
5. The three permission questions above.
