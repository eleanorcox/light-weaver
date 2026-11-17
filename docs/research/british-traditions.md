# Research: British weaving traditions

What has been found out about the British traditions, and what still needs finding out. First round: 17 November 2026, on tartan, Harris Tweed and Welsh double cloth, by a research subagent, with the key claims spot-checked against their sources afterwards.

How to read the labels:

- **Checked:** the source was read twice, by the researcher and again in a spot-check, and says this.
- **Sourced:** the researcher gives a source; not checked again.
- **Unchecked:** no source yet.

## Summary

| Tradition | Can we model it? | Can we get real patterns? | What we may show |
| --- | --- | --- | --- |
| Tartan | Yes, easily: a sett plus 2/2 twill | Register counts need an account; bulk use unclear | Generated setts freely; real tartans with credit, once access is agreed |
| Hebridean tweed (Harris Tweed) | Yes: 4-shaft twills, herringbone, barleycorn | No official drafts; the structures are general and can be written from first principles | The weaves, but not the name "Harris Tweed" or the Orb |
| Welsh double cloth | Yes: two layers swapping places | No published drafts found | Our own designs in the technique; not named mill designs |

**Recommendation:** start with tartan. Its rules are the clearest, it can be tested exactly, and generated setts need no permission while access to real ones is sorted out. Tweed twills and herringbone come next, written from first principles.

## Tartan

### How it is woven

- A **sett** is the smallest repeating unit of stripes. Traditional tartan is a 2/2 twill (the weft goes over two, under two, stepping one thread each row), and the warp and weft usually follow the same sett. Sourced: [Wikipedia: Tartan](https://en.wikipedia.org/wiki/Tartan), citing standard works.
- A **thread count** is written as colour letters and numbers, such as `K4 R24 K24 Y4`. Checked: [SRT FAQ](https://www.tartanregister.gov.uk/faq): "Each capital letter represents a colour and the number beside each letter dictates the precise number of threads".
- Most setts are **symmetric**: the sequence reverses at each end (a **pivot**). A `/` marks a pivot count, as in `K/2 R24 K24 Y/2`. **Asymmetric** setts repeat without reversing. Sourced: Wikipedia, above.
- **For the code:** a sett is a list of (colour, count) with a symmetric or asymmetric flag. Expand it, mirroring at the pivots, and use the same sequence for warp and weft. Whether the warp is on top at a crossing follows the twill, for example when `(i + j) mod 4` is 0 or 1. The rule is the researcher's own working, not from a source; it will be tested against a register picture.
- Unchecked: how to expand half counts exactly at the pivots.

### Where patterns are published

- The **Scottish Register of Tartans** (run by National Records of Scotland since an Act of the Scottish Parliament in 2008) is free to search online. Each entry shows the name, designer, date, the reasons for the design and a picture. Sourced: [SRT](https://www.tartanregister.gov.uk/aboutYourTartan); Act sourced: [legislation.gov.uk](https://www.legislation.gov.uk/asp/2008/7/enacted).
- **Thread counts need an account**: "Request threadcount information" is listed among the services needing one. Checked. Whether it costs anything is unclear; the fees page lists "Provision of information about the Register" at £85 but no separate thread-count fee. Checked: [SRT fees](https://www.tartanregister.gov.uk/fees.aspx).
- No official bulk download or interface for programs was found.
- **A third-party copy** of about 7,400 register setts exists, from 2016–17, via the Tartan Dictionary and the `thetartan/tartan-database` project on GitHub. It labels its own capture CC BY-NC-ND 4.0 (no commercial use, no changes). Sourced: [Tartan Dictionary](https://tartandictionary.org/sources/register-of-tartans/). Not to be used until the terms are clear.

### What may be reproduced

- The register's text is Crown copyright and "You may re-use the Crown copyright protected text free of charge in any format and for any purpose", with acknowledgement. Its pictures may be re-used free "for fair dealing purposes"; otherwise contact National Records of Scotland. Checked: [SRT copyright](https://www.tartanregister.gov.uk/copyright.aspx).
- For older tartans (registered before 2009, from the earlier registers), re-users of the text "should contact the STA" (the Scottish Tartans Authority). Checked: same page.
- Whether thread counts count as re-usable "text" is unclear. Ask before importing many.
- Registration gives no rights; copyright and design right stay with the designer. Sourced: [SRT copyright and design right](https://www.tartanregister.gov.uk/copyrightDesignRight).
- "There are no laws about which tartan you may wear, just traditions". A new clan tartan must be approved by the clan chief when it is registered. Checked: [SRT FAQ](https://www.tartanregister.gov.uk/faq).
- **Royal tartans:** Balmoral is traditionally worn only by the royal family, with the sovereign's permission. Sourced from press and retailers only: [The Scotsman](https://www.scotsman.com/whats-on/arts-and-entertainment/royals-banned-public-from-wearing-official-balmoral-tartan-1469710). Leave it out.
- **Wording:** "Tartan *Name*, as recorded in the Scottish Register of Tartans (National Records of Scotland, Crown copyright)", plus the designer where the register names one.

### Caption draft

Tartan is a check of coloured stripes, set down as a precise count of threads and woven in a 2/2 twill. Thousands of tartans are recorded in the Scottish Register of Tartans, set up by Act of the Scottish Parliament in 2008. (Older history: unchecked.)

## Hebridean tweed (Harris Tweed)

### How it is woven

- The commonest weave is the "common twill", also called "two and two twill". Sourced: [Harris Tweed Authority journal](https://www.harristweed.org/journal/tweed-or-twill).
- A weaver lists plain twill, 4x4 and 8x8 twill, herringbone (a twill that reverses direction, making a V), barleycorn, barleycorn wave and overchecks; most looms are set up as four-shaft 2/2 twill. Sourced from one weaver's site: [Harris Tweed Weaver](https://harristweedweaver.com/tweed-information/).
- **For the code:** a four-shaft draft: straight threading and a 2/2 tie-up for twill; reverse the threading for herringbone; colour order in warp and weft for checks. These are general structures and can be written from first principles.
- No drafts published by the Authority were found.

### What may be reproduced

- Harris Tweed is defined in law by the Harris Tweed Act 1993: handwoven by islanders at their homes in the Outer Hebrides, from pure virgin wool dyed and spun there, and finished there. Sourced: [the Act, Part III](https://www.legislation.gov.uk/ukla/1993/11/part/III/enacted).
- "HARRIS TWEED" and the Orb "are the intellectual property of the Harris Tweed Authority. There are strict rules surrounding their use", enforced strictly. Checked: [HTA brand rules](https://www.harristweed.org/labels-policy-and-brand-rules/).
- Rules reported from the Authority's brand rules document (2020): the name is a noun, not an adjective; no suggestion of connection or endorsement. Sourced, but the spot-check could not read the document. Unchecked whether "Harris Tweed-style" is acceptable.
- **So:** our cloth is not Harris Tweed and must not be called that. Use "tweed twills and herringbones, in the tradition of Hebridean weaving". Ask the Authority before naming it even in a caption.

### Caption draft

Islanders on Lewis, Harris, the Uists and Barra had long woven tweed at home. From 1846 Lady Dunmore promoted Harris cloth further afield; after imitations appeared, the Harris Tweed Association was formed in 1909 and its Orb mark was first stamped in 1911. The Harris Tweed Act 1993 protects the cloth in law. Sourced: [Outer Hebrides Heritage](https://www.outerhebridesheritage.org.uk/discover/harris-tweed-an-islands-story/).

## Welsh double cloth

### How it is woven

- "Welsh Tapestry is the term applied to double cloth woven blankets, producing a pattern on both sides that is reversible and is the icon of the Welsh woollen industry." Checked: [Museum Wales blog](https://museum.wales/blog/2169/Welsh-Blankets--Beauty-Warmth-and-a-Little-Bit-of-Home/). That the colours swap on the back is stated by the mill but not by the museum: [Melin Tregwynt](https://melintregwynt.co.uk/blogs/journal/vintage-star-behind-the-pattern).
- **Double weave** in general: two layers woven at once on at least four shafts, one layer's warp lifted out of the way while the other is woven; where the layers swap places, the pattern appears. Sourced: [Schacht Spindle](https://www.schachtspindle.com/getting-started-with-double-weave/).
- Melin Tregwynt says each of its double cloth designs needs at least 16 shafts. Sourced: [Melin Tregwynt](https://melintregwynt.co.uk/about).
- **For the code:** two warp and two weft colours, and a grid saying which layer is on the face at each point; the back is the reverse.
- No published Welsh double cloth drafts were found.

### What may be reproduced

- The technique is general. Named mill designs (Melin Tregwynt's Vintage Star, St David's Cross, Knot Garden) are treated as the mill's and not reproduced without permission. Who owns them legally is unchecked.
- **A lead:** a pattern book from 1775 by William Jones of Holt, Denbighshire, "shows many different examples of tapestry patterns". Checked: Museum Wales blog, above. Where it is held, and whether it is digitised, is unchecked. Being from 1775, its patterns would be out of copyright, but the holder's terms for photographs apply.
- Museum Wales holds carthenni (Welsh blankets) in its online collection, such as a 1923 Melin Tregwynt double cloth blanket, but with no stated licence. Sourced: [Museum Wales collections](https://museum.wales/collections/online/object/acfecfb3-c16b-34a4-aaf5-1de5b9583518).
- **Wording:** "Welsh double cloth, in the tradition of the carthen and Welsh tapestry". Credit Amgueddfa Cymru – Museum Wales and the National Wool Museum.
- Whether "tapestri" is a Welsh term for the cloth is unchecked; the museum says "tapestry".

### Caption draft

Welsh tapestry is double cloth: two layers woven together that swap places to make a pattern, reversible from one side to the other. A pattern book of 1775 already shows many designs, and the cloth became known as the icon of the Welsh woollen industry.

## General drafts

- **WIF** (Weaving Information File) is the common file format for drafts: plain text, version 1.1, supported by most weaving software. Sourced: [The National Archives, PRONOM](https://pronom.nationalarchives.gov.uk/fmt/2072). Worth reading later, so drafts from weaving software can be imported.
- **Handweaving.net** has a large draft collection, © Kris Bruland; its terms for re-use could not be read. Ask before using drafts from it.
- Simple structures such as twills and herringbone appear everywhere and can be written from first principles, with a source cited for how they work.

## Still to find out

1. Will National Records of Scotland allow thread counts to be used in the piece, and at what cost? Ask them; also the Scottish Tartans Authority for pre-2009 tartans.
2. How the register marks restricted tartans, if at all; look at the live Balmoral entry.
3. Whether "Harris Tweed" may be named in a caption at all; ask the Authority.
4. Where the 1775 William Jones pattern book is held and whether it is digitised.
5. Who legally owns Welsh mill designs.
6. Handweaving.net's terms.
7. Whether "tapestri" is a Welsh term.
8. Not yet researched: houndstooth and Glen check, Welsh flannel, Witney blankets, Paisley shawls, Spitalfields silk, Irish linen damask, woven carpets.
