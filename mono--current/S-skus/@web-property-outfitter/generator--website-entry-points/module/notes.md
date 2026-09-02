= higher level web property generator

index.html are a mess:

- security
- huge list of meta
  - including social ones (with lots of repetition!)
  - favicons
- critical CSS
- preload
- 3rd party scripts
- webmanifest with repetition: titles, favicons...

And above all it's hard to properly comment!

I need a tool.

TODO good "blog" https://lucumr.pocoo.org/2025/12/17/what-is-plan-mode/ TODO CSP https://centralcsp.com/
https://domsignal.com/csp-test TODO everything here https://domsignal.com/toolbox

NOT IN SCOPE

- minification = not this tool's job
- SSR = maybe one day? but ideally we want full static on CDN

TODO review https://github.com/rudrankriyam/App-Store-Connect-CLI

TODO evaluate https://posthog.com TODO auto "link tree" such as this complex one https://linktr.ee/infinex.xyz

security -- domain name registration, DNS, hosting = don't use the same provider so that a compromise don't allow to
access everything (from a domain recovery expert) https://www.reddit.com/r/Domains/comments/1gdpqdk/comment/miu1osc/

TODO https://paulmillr.com/pgp_proof.txt TODO public-assets/ ex. logos

TODO all sections of https://github.com/about TODO sitelinks?
https://developers.google.com/search/docs/appearance/sitelinks TODO
https://developer.mozilla.org/en-US/docs/Web/Manifest#splash_screens TODO
https://github.com/h5bp/html5-boilerplate#quick-start TODO real example
https://www.domain.com.au/guides/the-ultimate-guide-to-renovating-your-home-982295/ TODO
https://developers.google.com/digital-asset-links/v1/getting-started TODO app stores declarations
https://github.com/BlinqOSS/yurl

legal = all of https://vercel.com/

## fitting inside the box

- TODO "pinned tab" (safari ios)
- TODO preview from gmail

## breaking out of the box

TODO https://web.dev/articles/window-controls-overlay TODO https://alistapart.com/article/breaking-out-of-the-box/ TODO
https://medium.com/samsung-internet-dev/toolbars-keyboards-and-the-viewports-10abcc6c3769 TODO on rotate, should resize
the viewport (TODO test iOs)

### non-rectangle screen shapes

### notches

- https://blog.felgo.com/cross-platform-app-development/notch-developer-guide-ios-android

### (desktop) Window Controls Overlay

- https://web.dev/articles/window-controls-overlay

### virtual keyboard

### foldable screens

- ~testable in Edge
- TODO +++ https://blogs.windows.com/msedgedev/2020/09/14/introducing-dual-screen-foldable-web-apis/
- TODO https://www.apptunix.com/blog/an-ultimate-guide-to-developing-mobile-apps-for-foldable-devices/

### multi screens

- TODO https://web.dev/patterns/web-apps/multiple-screens
- TODO https://medium.com/geekculture/web-based-multi-screen-apps-including-drag-drop-5e161da6507b

## PWA

- TODO https://web.dev/learn/pwa/app-design
- TODO https://www.pwabuilder.com/

### advocacy

- 2023 https://www.computerworld.com/article/3688575/why-is-apple-making-big-improvements-to-web-apps-for-iphone.html

### Windows

- TODO "pinned sites"
  https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/hh772707(v=vs.85)

### macOs

### Android

#### WebView ?

https://developer.chrome.com/docs/multidevice/webview/

### iOs

### ipadOs

## Payment!!

TODO https://developer.mozilla.org/en-US/docs/Web/API/Payment_Handler_API

## URLs

https://blog.jim-nielsen.com/2023/examples-of-great-urls/

TODO XXX https://zerotrickpony.com/articles/browser-bugs/

Something went wrong Try reloading the page, then check our Statuspage for any current outages. If there are no relevant
outages, create a support request so we can help you out.

If you create a request, include the following so we can help you as fast as possible:

Error type: 500 - Internal server error Log reference: xxx-yyy-zzz

TODO https://opengraphgenerator.org/ TODO https://colinkeany.github.io/brandgrab/ TODO https://llmstxt.org
https://github.com/harlan-zw/mdream TODO https://www.debugbear.com/blog/optimize-viewport-for-mobile TODO
/.well-known/appspecific/com.chrome.devtools.json

ex. game landing pages
https://landing.supermembers.net/magical.html?utm_source=ig&utm_medium=da&utm_campaign=마소키_유럽%2F호주_영어_meta_사전%28전환%29_iOS_230726&utm_content=유럽%2F호주_영어_모바일게임&utm_term=영어_iOS_이미지_우주_정방&fbclid=PAAaYP2WCIFHBv6ArME9X1mJdElWLcHPJH6-6NgV-5nm8kQxIhYCcjUfWI1xM_aem_AXL8T9GrNCmgBnKy1TkkSToV8CRs6AdoZhdbWM89EgdOgxCwc3P6NfIfFnPz1RXXXwmOxpeUJTzZ3p3HDgxQx1EU
https://www.dungeonhunter6.com/?locale=AU&referrer=&func=ssr&gttime=1698832284336&utm_source=fb&utm_medium=Instagram_Feed&ad=23857665119560732&cid=23857665119500732&agid=23857665119660732&fbclid=PAAabpS8byfx91r9boUpFCzU9Qdt9oNL-mEcVWYOcS-CUq9nNKpgvbRdYhSY4_aem_AXomBSoltIinPYPqsqVlXDpjp4IEN5vkEzuzSM0ClPvhHrQ8tnH4zu5AycpGQTpGDMcoYjRclZujw8GWyqu2k3JO
https://h5.g123.jp/game/queensblade?platform=auto&utm_source=facebook&utm_campaign=queensblade_en_NewDisplayAdvantageCountry704_adn_all&utm_adgroup=cr_normal_advantage&utm_content=normal08__queensblade20230920_en_h2Ciara_1080-1080.jpg&fbclid=PAAaapADfSOP3neLm2GpfQ2ydACj84Vybz64cnGomVc6EaiNZYfKXBRYWsA1E_aem_Ab5johswRBy3rXKqEamg9RHYyJ1CkOF4mIMZUzW5_MYahwsj2unm1LrwuHjmiP0TVRHdtst-I82JBERBjEw_G9S5&lang=en
https://rvlm.haoplay.com/yy/tyweb1/?fuid=fbiosauV-dz2-6200&fbclid=PAAaYSMCWMahGQW0ggAf6BSLaMEMXx5nkgDIIMtTVRFU_4d0KDb853fyCozB4_aem_AfAxEmE7zgH7LDnxEwhlQNHaW1rIfTooFONEY0biln5txwQhsApPkbkua0SP0xbwg7AXWpGFh53Jz6oe8EhN0jnU
https://act.hoyoverse.com/sr/event/e20231115reflow-bd3a09/index.html?game_biz=hkrpg_global&sign_type=2&auth_appid=e20231115invite&authkey_ver=1&utm_source=ingame&utm_medium=tedian&lang=en&authkey=K%2F3i4xbHfXoVIX%2BGa4Sfaux2Y1h%2BLvKd5WCcuey8UgLfVLymocAt9wmLt9uXxo2SS27QG8hAp9fB5Y0Sg2CGuG87j1w1iAFlnOOUKlv7MM8dEI84iDlm90gDztGYWTd3aMlcFygfYCnH5VCVVaGmdj9kkJoFrlOdnGW1cWu4PvmKvJz9BuxE8ClGsyCU0wFfEqimT%2F%2BpOTpIoQ5MXVWqBoAPXxDetui3f3oxf6F2R%2F%2BEw5j%2F8xYuUxYo%2BvGdB1MrPA1C0l%2BLRyDM9MBxwIetJumvCe7mqEcJ7EJUkhVTvYAm2uT5WKtQzYNy9dSaQrUrC7FJS%2Ff21P%2FW6TAeptHxq6NjW3w%2Be5LE6HGzgZpJJm%2BxLR27txT7mQ%2FfySE55AJ1vpq403xbUDD0fMveHuXsms505dyREhcu%2BRFCMvq8f23QxLvTz%2Bic6bYeMswZohaPxPmA930LopSPeKIPDmICvWUawB7YHeVfzu6X27u%2BP9mZAEAQ2JR8mUknOh3rBEMv1wHN1DzZnpb1a%2BUmtQWQLKg9NWxHHUvogUtW8RLb1JrHy7WPE4MEcUWaxv6fNjx9Jf%2BtDce3luDQbINRIJbD25aZZLmMr5cSHvOO%2Ba9deSnuei5wrNHzVdq6PRSYzmgzLdM6886mk25WNKwh2%2BIzJieuxLZ8HjxYPnBKavKSL%2FQ%3D&os_system=iOS%2017.1.1&device_model=iPhone14%2C7&plat_type=ios
https://vda.afkjourney.com/tracking?dap_code=cvtad_081c348fccc6e821a97fdb9975583bcf&creative_id=120210295242190550&adgroup_id=120210295242150550&campaign_id=120210294782780550&creative_name=iGame_V_EN_3D_comewithme_CB_408_1080x1350_44s_240205_NR_556200.mp4&adgroup_name=iOS-EN-Sales-Hank-PRE-RPG-240214&campaign_name=iGame-iOS-US-Sales-Hank-PRE-LP-240214&fb_platform=Instagram_Feed&fb_site_source_name=ig&fbclid=PAAaYLDeS_UFd7QmCycY3c7a9wjwzo2TKaveeuF3uuJsxT0Y5o13ztPXofLMc_aem_AYbl1gCv4owHRC384RLdomMs1Bm9euoaGDLab6ooIcDhTcABjIVTgJPI67jyQDadgcnkUpYqXpTjC45sgyE0lzMF&dap_page_ids=2616&dap_page_group_id=111
https://pr.overlord4096.com/blue?utm_source=Instagram_Feed&utm_medium=ig&utm_campaign=FB-9Gather-LordEN-IOS-PRE-LPBLUE-T1-VID-0213&utm_content=35pre-16x9-EN%3BZL-AI14图.mp4&fbclid=PAAaYve7q4PxMFzohXZmW3CAsXoVS6CqXTagWzp1AoyXM1mk1agt7bifsEhPw_aem_AYZSlduJvXwMPAp7A3nPBAo07LA7a511IDkqDjZMXtj1WxgFqCwJC29SEvC1xdRopW-p4h80HBwxTTSbAqlmfoth
https://mushroom.joynetgame.com/oio/MuzBEhxZ/10/a1d0c6e8.html?app_id=MuzBEhxZ&cid=51645&oid=42&aid=26498&gid=1704264558952970&utm_source=facebook&utm_campaign=C51645_A26498_T11256_P773866&fbclid=PAAaYcRfpeLis5QZiwyB0PO9vnFSU-ZgDBBuXU8mMxLHGE-eZ6gQpZ5gGlI_k_aem_AUpexypkodq8xPfAoMChFCl-UPvpvVzxErQhAiwGAXtkt_aGEp2p0nbwoOoduBUPH1NrJr5xVLo4oohOOjrOQt33
https://www.cnclegions.com/ua/wand/preregister/index.html?lang_type=en&fbclid=PAAabhvkrFBC5gjhCkWtPilsXrWGcjy_vjHJXVAcKyHHxEASZlScZVjNv8jWM_aem_AawLUyVNIcuxBmBERic6tyPEgD_oU_o9J7isSXr7tyvty6DgAxJtrocS8XknksM9mF4KhDYvga-hHKbXltpY4M4h
https://call-to-adventure.herogame.com/p/CPP7_FB_PRE_VIDEO_2d.html?fbclid=PAAabGj1Y_wtBXsUP8YKL8H17wCg6ECX_uLYxiR2dcWrJQgGw5ow6HnHF796Q_aem_AQpqfvyBJnyjKS8Jk_8RfbJuLyFmj1UQsQsdX9yiVnunJf0ghisPXKOYaOy1i-MFSAhXMXs6H492f_EcBGcig1EI
https://zombieio.joynetgame.com/en.html
https://poster.xd.com/r/NDSQhDLMhPzQ.html?c=FB&fuid=auiosfb-V-gjz-9&utm_medium=paid&utm_source=ig&utm_id=120209575637410074&utm_content=120209653185520074&utm_term=120209653185530074&utm_campaign=120209575637410074&fbclid=PAZXh0bgNhZW0BMAABpnD5iTEZuU9JG1ss5BUH_8jgHqltrgt4hOBBA_a9alkFRuRUR2ZNUI3zdw_aem_zdyPFZ0_oFj3fvnL4dc_Nw
https://talesofterraoen.e-soul.net/landingpage/page03/?utm_source=fbads&utm_medium=paid&utm_id=120212858237320212&utm_content=120213016526400212&utm_term=120212965268650212&utm_campaign=120212858237320212&fbclid=PAZXh0bgNhZW0BMAABph9v2TjK4XhMmSSLxtWf6jeHMPKLg6__lk0KtV6fyl61QPi-2jYyNrOvcQ_aem_vg3HnOOUv83GF6fSLXAw_w
https://talesofterraoen.e-soul.net/landingpage/page04/?utm_source=fbads&fbclid=PAZXh0bgNhZW0BMAABpp0wwQpRHjlndkuNfOab6QFIVqL4y7P116U5mc34YhmijiQDBHXUymKFLg_aem_oHG16_5o9hRJf78uQP-3Ew
https://play.google.com/store/apps/details?id=com.eyougame.msen&referrer=adjust_reftag%3DcXroK0NOlWaVS%26utm_source%3DFB-Pre
https://zenless.hoyoverse.com/ua?ios=01&utm_source=ua&utm_medium=facebook&utm_campaign=ZZZ_SG-AU-NZ_iOS_FB_PCWeb_game_video_20240528&hoyotrace_channel=fa_channel&utm_id=120210203129830696&utm_content=120210206674170696&utm_term=120210206585360696&fbclid=PAZXh0bgNhZW0BMAABpo8yRhx6WHRr0s7Ky7DkZXLSjjCSqf5FLNP9NImGLY4ueBKJuJoyrnsOBA_aem_OYaZRcgsICNNmBaX8dWGmA
https://h5.g123.jp/game/guruguru?lang=en&platform=auto&utm_source=facebook&utm_campaign=guruguru_en_NewDisplayAdvantageNew_adn_all&utm_adgroup=cr_normal_advantage&utm_content=guruguru20240516_en_mi1_1080-1080.jpg&utm_creative=guruguru20240516_en_mi1_1080-1080.jpg&fbclid=PAZXh0bgNhZW0BMAABpjrw70Hb1bvXzabHVb3tiYLUHMVAvVZ4CrUi8aT5zN6RNcDbEjzhavXMuA_aem_caUTAIRBAZaRvotPqIbh_g
https://xsamkok.wattgamesvn.com/p-reg/en.html?qd=FB1&utm_source=facebook&utm_campaign=C52072_A32081_T1_P883109&fbclid=PAZXh0bgNhZW0BMAABpvNkXopnQHdxkFmf_algd3CQiTHrTWIFyVDga0tRM97TUxrFnTQ0RXIJkA_aem_axkxbbfUWMnM7tgjXmhdOQ
https://fyden.luckyyx.com/pre2/index.html?campaign_id=120211594849330304&adset_id=120211594850160304&ad_id=120211594910150304&placement=Instagram_Feed&utm_source=FBlby&utm_medium=paid&utm_id=120211594849330304&utm_content=120211594910150304&utm_term=120211594850160304&utm_campaign=120211594849330304&fbclid=PAZXh0bgNhZW0BMAABpsEGCz384GoNB0X42SVibULqPxqi6POBqYi-hd8oMM8cjH4IfUGjcd09Zg_aem_qwPCp8zB-oS6Fije_EXNOA
https://muffin.xdg.com/en/yyweb/s.html?ppid=b95d9645-6126-4d2a-af31-9b9365c2fa25&fuid=fbios-caau-m-rpg-EN111&fbclid=PAZXh0bgNhZW0BMABhZGlkAasVCOz_rLUBpncTpqu7RDsKJ9hy8Pw7tD_MNrGch3Rf8fWxgGqwrF5u1rjOr8XtlbhZfw_aem_wAhyg1AzXoQi5nQvg_AjKA

https://www.cloudflare.com/learning/bots/what-is-robots-txt/

.well-known/webauthn

domain names https://instantdomainsearch.com/
