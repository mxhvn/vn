/**
 * Seedance — FULL app.js (Tap Hint UI + Auto-Next)
 * - Tap while playing => show controls briefly then auto-hide
 * - Toggle mute => hide controls immediately
 * - Pause => show controls (fade in) and keep visible
 * - Consent Like => send quick event immediately ("consent_ok")
 * - Send session analytics on end
 * - Auto-next: when video ended => scroll to next slide (no swipe)
 *
 * NOTE: auto-next needs NO loop. So we REMOVE "loop" on <video>.
 */

const WORKER_BASE = "https://seedance.testmail12071997.workers.dev";
const SESSION_ENDPOINT = `${WORKER_BASE}/api/session`;

/* KEEP YOUR VIDEO URLS */
const RAW_LIST = [
  "https://rr4---sn-npoldn7z.googlevideo.com/videoplayback?expire=1771871130&ei=Okecadz-JvG12roP8PqNqQc&ip=27.75.141.144&id=o-AH9_mDHNCt9Q7vaoa6YTLPNdpAeAgMpt3jaG0OjTzduS&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&cps=419&bui=AVNa5-zu9U50gfpqVt5jcOC6GamtafCVUTy2YNPMrVMlM_IpQhkvwtlWt1kaBp6lkl3zn0rWDvaaWS7U&spc=6dlaFHAqnnK2kCQq7SGBYuuDLwnckZcZtM7QC-rZsuWhg4EasGrAr3h8uHUVW-xcrmg&vprv=1&svpuc=1&mime=video%2Fmp4&rqh=1&cnr=14&ratebypass=yes&dur=3606.058&lmt=1770814249199750&fexp=51552689,51565116,51565682,51580968&c=ANDROID&txp=4538534&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Crqh%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AJEij0EwRQIhAKh-4a1tPAdUXpY4wSn_NUG1LthP8drWMr58b1n1i_SuAiAf8Hkry5SoKw99-LEjJ63HvY7A0USD5w1vRVvCmVZRRg%3D%3D&rm=sn-8pxuuxa-8j5l77e,sn-npo6k7z&rrc=79,191,104&req_id=714474e5899ea3ee&rms=rdu,au&cm2rm=sn-8pxuuxa-nbo6s7z&redirect_counter=3&cms_redirect=yes&cmsv=e&ipbypass=yes&met=1771849752,&mh=Hr&mip=2402:800:631d:7195:bcde:f618:aa88:8d8a&mm=30&mn=sn-npoldn7z&ms=nxu&mt=1771849491&mv=m&mvi=4&pl=48&lsparams=cps,ipbypass,met,mh,mip,mm,mn,ms,mv,mvi,pl,rms&lsig=APaTxxMwRgIhAM6B_viAzOtrQK6gGEU0Qh_cJmjU4hEWxlCJKkWy-4FyAiEA3JuanQ0ZR7u6-e_O_pofqIwBWSgK4V7uSFq1tFMu0fQ%3D",
  "https://rr5---sn-oguesnde.googlevideo.com/videoplayback?expire=1771873928&ei=KFKcad6dI-q02roPxom8qAE&ip=14.245.148.116&id=o-AMjaHUgydUI_Qo8-QhdvarT7HVEGHLUlKvpjnBnXpJ1r&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&cps=340&bui=AVNa5-y89dUaVA6BYNEWGcYHr330tMXcg7sKqr376Jif1Qqu7bYgKVW1_wuQGrXBizBNqzzE6vpHBOTV&spc=6dlaFNtfLyV_3Tf-InTvPvyVsm7LmoyIxSkzyNin5TaP1KdeTJnHoXXmBLeRbQ64ktw&vprv=1&svpuc=1&mime=video%2Fmp4&rqh=1&gir=yes&clen=169522953&ratebypass=yes&dur=4676.847&lmt=1749329277828927&fexp=51552689,51565116,51565681,51580968&c=ANDROID&txp=4438534&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Crqh%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AJEij0EwRQIgejzaQHxw8saalACCPZmIwmZlJIjX800hqiQcbcsBJdECIQCm7CtwrwzpIPUX-IR5G6LWRRUCKJWkp65pP3LPFrkb-Q%3D%3D&rm=sn-8qj-0pi67z,sn-i3bkz7l,sn-npokl7s&rrc=79,104,191,40&req_id=ddf602f1a5c7a3ee&rms=rdu,au&ipbypass=yes&cm2rm=sn-8pxuuxa-nboll7r&redirect_counter=4&cms_redirect=yes&cmsv=e&met=1771852331,&mh=fH&mip=2402:800:631d:7195:bcde:f618:aa88:8d8a&mm=39&mn=sn-oguesnde&ms=ltr&mt=1771852103&mv=m&mvi=5&pl=48&lsparams=cps,ipbypass,met,mh,mip,mm,mn,ms,mv,mvi,pl,rms&lsig=APaTxxMwRQIhAPdne54jcR3I4BgxWQ7Ch_dX8gR1II6Y9PrhEn8dbgWDAiBTe2lBmaoC07S2aC56X0tNqNBXkt2CmMj9M-8mo04ccw%3D%3D",
  "https://rr2---sn-8pxuuxa-nboss.googlevideo.com/videoplayback?expire=1771873954&ei=QlKcaZuyDLWWvcAPsMCyiA8&ip=123.20.100.28&id=o-ACHLE179Xe1Fv1nfNbWZv5IOcJ-aEEfmCdCW6x9SxmVY&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&cps=374&gcr=vn&bui=AVNa5-xWKrUXZy9vZcT-SE-w7Fy3asGyKNMOQ_uddfIdgitfFTGMqjZ3VeDhglcoBn8YwCkI444rGt0-&spc=6dlaFF46GYhJj-M17jFNqBtUk-qD13ixl-dblYDRMGhoC4wLuz2Yyr_h42dX_jLNYus&vprv=1&svpuc=1&xtags=heaudio%3Dtrue&mime=video%2Fmp4&rqh=1&cnr=14&ratebypass=yes&dur=5278.870&lmt=1738738300300704&fexp=51552689,51565115,51565682,51580968&c=ANDROID&txp=5538534&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cgcr%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cxtags%2Cmime%2Crqh%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AJEij0EwRgIhAOp-gUizWdM0JVAr1sqKjpAT7wH16h_aTAARBT8_A5N_AiEAhvfJtObG3xup3aRFnLGZna2cVEAsbAW2DAdKgvgwDLc%3D&rm=sn-8qj-nbo677l,sn-i3byyr7z&rrc=79,104&req_id=36c7d8d24805a3ee&cmsv=e&rms=rdu,au&redirect_counter=2&cms_redirect=yes&ipbypass=yes&met=1771852356,&mh=cM&mip=2402:800:631d:7195:bcde:f618:aa88:8d8a&mm=29&mn=sn-8pxuuxa-nboss&ms=rdu&mt=1771851427&mv=m&mvi=2&pcm2cms=yes&pl=48&lsparams=cps,ipbypass,met,mh,mip,mm,mn,ms,mv,mvi,pcm2cms,pl,rms&lsig=APaTxxMwRAIgRu0SMoKiDykmhCXaCkxECjDXdegjhxctJsOcNWrehg0CIGiOrQ1MHI44acDYZWaRQvqa_n6TxS357Z4VConsDU34",
  "https://rr2---sn-npoeeney.googlevideo.com/videoplayback?expire=1771873983&ei=X1Kcafq8Hbf8pt8Pjr2UyQk&ip=171.238.191.154&id=o-APT4pvzH2PD1APSZIouieUZzSdQUTsCJ7bWzI7_d98wl&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&cps=408&bui=AVNa5-xumwmU3NduTYQZvWAwrJg6b7YWQVBLHB-43reeVEeS72z5OPeos8tqczJc4VVgAVZ1R1aoREIZ&spc=6dlaFKlykqmvbSBj_YrpWf1raNl3sVr9utt3kpFZIEUzlTCY6USytsFD9LKCMUw9PN8&vprv=1&svpuc=1&mime=video%2Fmp4&rqh=1&cnr=14&ratebypass=yes&dur=6208.017&lmt=1696210264087550&fexp=51552689,51565116,51565682,51580968&c=ANDROID&txp=5538434&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Crqh%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AJEij0EwRQIhAMzCw7HPjtNL8pudJXV7Z9Rf4GdQSnYLybqxlZnsnWZNAiACDq99BhSAqYEvszh18dgm0vegHcUboSZalUWfkWFR9w%3D%3D&rm=sn-8pxuuxa-i5o6r7e,sn-i3bkz7l&rrc=79,191,104,191&req_id=22b12ceb8fa8a3ee&rms=rdu,au&cm2rm=sn-8pxuuxa-i5o6d7l,sn-npoze7l&ipbypass=yes&redirect_counter=4&cms_redirect=yes&cmsv=e&met=1771852385,&mh=G6&mip=2402:800:631d:7195:bcde:f618:aa88:8d8a&mm=34&mn=sn-npoeeney&ms=ltu&mt=1771852117&mv=m&mvi=2&pl=48&lsparams=cps,ipbypass,met,mh,mip,mm,mn,ms,mv,mvi,pl,rms&lsig=APaTxxMwRAIgPXVyanQI0IvQNvlWmeJQ-jCvxiA1Mk2p3nIIecrZ5ykCICTsB-HR5F_T1H7wlHwLblGQf--BdH7CjA4zZQOInvBB",
  "https://rr2---sn-npoe7ndy.googlevideo.com/videoplayback?expire=1771874008&ei=eFKcafyRFtDp1d8PnffWqAY&ip=14.230.240.142&id=o-AKYKevM2sSEij4MHGpDKbJsee6W8XE-eo0SYdGFx2bWi&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&cps=527&pcm2=yes&bui=AVNa5-xKCPMqnoC7Dkv0663MtuhVsFH_VmE5PrTav6XWJ1O3ydSe0qRXATa3D8jGrHdD4pHy3xXLCrGb&spc=6dlaFBH3M1P6UaX1f8RraSm63KhBLxFfDJQWg9z8V5eGrX1uxo-vY9qbjNU7b_i2ysA&vprv=1&svpuc=1&mime=video%2Fmp4&rqh=1&gir=yes&clen=51672483&ratebypass=yes&dur=3041.326&lmt=1767952110289245&fexp=51552689,51565116,51565681,51580968&c=ANDROID&txp=4538534&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cpcm2%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Crqh%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AJEij0EwRgIhANF2tpy9vUwMFo0VUI4YjoaRPdHAl63zzU6l34KHwhxnAiEA_3z2pvkjh0OBXKH57M4dqaoHIg1ItSi3Dwyv6KH5RVo%3D&rm=sn-8qj-nbose7l,sn-8qj-nbo667s,sn-i3bkl7l&rrc=79,79,104,191&req_id=45b48e6c2dfba3ee&rms=nxu,au&ipbypass=yes&redirect_counter=4&cm2rm=sn-npo6d7e&cms_redirect=yes&cmsv=e&met=1771852410,&mh=Fy&mip=2402:800:631d:7195:bcde:f618:aa88:8d8a&mm=34&mn=sn-npoe7ndy&ms=ltu&mt=1771852117&mv=m&mvi=2&pl=48&lsparams=cps,ipbypass,met,mh,mip,mm,mn,ms,mv,mvi,pl,rms&lsig=APaTxxMwRAIgBk0ufWDv17hUiGgz7d2HSwsYbRM06cNytF9kMb3sz8UCIASfbULyQ3mgSEa6KcOoJCRziUNu0NAPIpEoKwuAcVJD",
  "https://rr6---sn-8pxuuxa-nbozl.googlevideo.com/videoplayback?expire=1771874036&ei=k1KcaYaSPOOtvcAP7OvZiAU&ip=116.98.92.66&id=o-ANSHeLw76rZuOWrLudkE7xXZPRuaNrl2R9PfEwUBK8sO&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&rms=au%2Cau&bui=AVNa5-xs1yOfP6y6xF5SeWktSWdBRz6X_qZabq_OKMYBWXOXy2dtPcWvDQMrE1MlN-y4ilnyhMUBj5-4&spc=6dlaFCyMrzU5Kj-eLS3LOD3dCYbGNnzw_0uHZWzwGQpW4o85M6pNDV9549_3jv_jc7M&vprv=1&svpuc=1&mime=video%2Fmp4&rqh=1&gir=yes&clen=213246084&ratebypass=yes&dur=10071.098&lmt=1749078653104880&fexp=51552689,51565115,51565681,51580968&c=ANDROID&txp=4538534&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Crqh%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AJEij0EwRAIgWGiQ-xUGvoFbYuUnppSp5sBl5R8xc8QD2V-7M6UjYSsCICoL3ISdiy1WoxtamNeEo7LSGWNKUbNMcAMThzMZYwcL&redirect_counter=1&rm=sn-a5mels7z&rrc=104&req_id=92c59b6b263fa3ee&cms_redirect=yes&cmsv=e&cps=0&ipbypass=yes&met=1771852437,&mh=cb&mip=2402:800:631d:7195:bcde:f618:aa88:8d8a&mm=31&mn=sn-8pxuuxa-nbozl&ms=au&mt=1771852153&mv=m&mvi=6&pl=48&lsparams=cps,ipbypass,met,mh,mip,mm,mn,ms,mv,mvi,pl,rms&lsig=APaTxxMwRQIgT-datUrAZQ-P8v2qb1SA5zWq_WYvhI0XOKKiAIKI0_MCIQC4VlATLMgIwWLgpib8TjYjEad6SLQJC2ItoL-lzlbWOQ%3D%3D",
  "https://rr1---sn-8pxuuxa-nbozr.googlevideo.com/videoplayback?expire=1771874125&ei=7VKcadL5B_-kqfkPsO6qsQc&ip=171.247.25.87&id=o-ALnIoTm9EbI0-uFlFdMv7hQMneTihehUsBkIT-hZginc&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&rms=au%2Cau&bui=AVNa5-xeFcVnE2DWzLClyGVXGllYVgAgy-jrenMsaPS-jdMjzr148iCVZPJQaySGGa_bnG1iZr3E5VHi&spc=6dlaFNKBPkNvHAshdcuESD84qBMhUR4AHD4B01y4QestywnrOf4MnyhSz-zB1EUdmME&vprv=1&svpuc=1&mime=video%2Fmp4&rqh=1&gir=yes&clen=434355202&ratebypass=yes&dur=4706.034&lmt=1768047130106558&fexp=51552689,51565116,51565682,51580968&c=ANDROID&txp=5538534&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Crqh%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AJEij0EwRgIhAOC0mBVe3znGE9UjQO7ls433hHMdnm1xFWyR70dFn2tqAiEAhOV0k_NoOWPQxNQtZCNpV-Tevpl-86gTzr_PjM683K4%3D&redirect_counter=1&rm=sn-npod676&rrc=104&req_id=bca1ec46a805a3ee&cms_redirect=yes&cmsv=e&cps=0&ipbypass=yes&met=1771852527,&mh=kq&mip=2402:800:631d:7195:bcde:f618:aa88:8d8a&mm=31&mn=sn-8pxuuxa-nbozr&ms=au&mt=1771852153&mv=m&mvi=1&pl=48&lsparams=cps,ipbypass,met,mh,mip,mm,mn,ms,mv,mvi,pl,rms&lsig=APaTxxMwRQIhALgxaMGRvC_OUEuZsVGJPGZSbFM5fz5soVsafIDxFCZnAiBvvQ1BaKaEyVVN1WVJr3YuMKe8vKtYFEYEkjvnydu_kg%3D%3D",
  "https://rr4---sn-8pxuuxa-i5o6d.googlevideo.com/videoplayback?expire=1771874161&ei=EVOcaaDdBN2qpt8P_8unmQE&ip=116.107.13.230&id=o-AJ6zzMNbIql-TDtzDc4BU94FYfkXdkwwnZ04sc_LHMkU&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&cps=865&bui=AVNa5-wY1n44jeABf99cGiHiiFLIDqab9YrDwmSd98txdbXjfUK4O_dMQM6qYGe5g4B_ucJhoWWSYZLM&spc=6dlaFIhFZJQem3nCEvdiYc3yKnJbj7SOcHchFldbXexMETcjS-G9LZUMIpKUiSS3Xxs&vprv=1&svpuc=1&mime=video%2Fmp4&rqh=1&gir=yes&clen=1272025323&ratebypass=yes&dur=14102.755&lmt=1770608988162174&fexp=51552689,51565115,51565682,51580968&c=ANDROID&txp=5538534&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Crqh%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AJEij0EwRQIgJXBaIzSh-DzK9JD-GPd1RgOBwjuXhPjLd-L9uovwE3ECIQCgHtuwBUnzPSMUVhHZ4DW1ROQAP3wC1lTUPP9hSWCRKg%3D%3D&redirect_counter=1&rm=sn-8pxuuxa-i2is7d&rrc=79&req_id=23454fdb09b6a3ee&cms_redirect=yes&cmsv=e&met=1771852563,&mh=q_&mm=29&mn=sn-8pxuuxa-i5o6d&ms=rdu&mt=1771852391&mv=m&mvi=4&pcm2cms=yes&pl=21&rms=rdu,au&lsparams=cps,met,mh,mm,mn,ms,mv,mvi,pcm2cms,pl,rms&lsig=APaTxxMwRgIhAM7wYpMz_HRIaXSXDEpVdhJqAWRd3LQhOd1QCe50-zuBAiEAkZfqs03Ss_o_zz5kPEnyCMMHSQrOc-YOrRoLIWmvh6c%3D",
  "https://rr3---sn-oguesnks.googlevideo.com/videoplayback?expire=1771874201&ei=OVOcaf6OCqz4pt8P9_SM2QM&ip=14.245.148.116&id=o-AHUiSFQIDSdHpBimnpl0dajLwggXTgdmMs6l0KM3SACn&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&cps=677&bui=AVNa5-wO7y5nkU1_oFfFIZt8DoRxwDRHEB_hyxc9LSWSA_bXf06nL-c-ecYZq40LeN47XCf_0P4RHYmH&spc=6dlaFP02KBbH86M3aNByPp3qj5Y35RyrRyWbTVSkWmKK-tbo0ozS-XXm6sbZ8mVDfZQ&vprv=1&svpuc=1&mime=video%2Fmp4&rqh=1&gir=yes&clen=662333190&ratebypass=yes&dur=7402.266&lmt=1751164660374259&fexp=51552689,51565116,51565681,51580968&c=ANDROID&txp=4538534&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Crqh%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AJEij0EwRAIgGVErn9nJpIxTzuzGuthPoONmV8NwmJJRfvA0jbYTH8wCICgmAYwebkNtSzcvxHcXIo-j8dqPCMITIetnusVglRtz&rm=sn-8qj-0pi67e,sn-i3bd77z,sn-8pxuuxa-nbo6k7z,sn-npods76,sn-npo6z7s&rrc=79,104,40,40,40&req_id=9fc052309a33a3ee&rms=rdu,au&ipbypass=yes&redirect_counter=5&cms_redirect=yes&cmsv=e&met=1771852603,&mh=mL&mip=2402:800:631d:7195:bcde:f618:aa88:8d8a&mm=39&mn=sn-oguesnks&ms=ltr&mt=1771852343&mv=m&mvi=3&pl=48&lsparams=cps,ipbypass,met,mh,mip,mm,mn,ms,mv,mvi,pl,rms&lsig=APaTxxMwRQIhAKe5lw04qciC4V0QOnW9sjT7kiw7xUX8ziheWU1VX1RaAiAbKJIHatBueVe5C_p5kJLBSMnsAtL00cfOmDj8DgXujA%3D%3D"
];

const TITLE_BANK = [
  "Khoan vuốt… coi cái này thử đi 😳",
  "Ủa sao tự nhiên coi mà cười hoài vậy 😂",
  "Góc này mà không coi là thiếu sót đó nha",
  "Nhìn nhẹ vậy thôi chứ cuốn dữ lắm 😮‍💨",
  "3 giây đầu chưa đủ đâu… coi tiếp đi 😭",
  "Không biết mọi người sao chứ mình dính rồi đó",
  "Cảnh này coi xong là muốn coi lại liền",
  "Ủa alo? Sao clip này coi hoài không chán",
  "Tự nhiên thấy dễ thương ngang 😳",
  "Coi chơi thôi mà ai ngờ coi tới cuối",
  "Vibe này mà coi buổi tối là hết nước chấm",
  "Ủa sao coi mà quên mất thời gian luôn vậy",
  "Đoạn này mà bỏ là tiếc lắm nha",
  "Coi tới cuối mới thấy cái hay của nó 😮‍💨",
  "Nhẹ nhàng vậy mà dính ghê",
  "Ủa sao tự nhiên thấy tim rung rung vậy trời",
  "Coi mà quên luôn mình đang lướt TikTok",
  "Không hiểu sao coi mà thấy chill ghê",
  "Cảnh này bật full màn hình coi mới đã",
  "Ai coi tới đây chắc cũng giống mình thôi 😭",
  "Thoạt nhìn bình thường mà coi kỹ lại cuốn lắm",
  "Coi lần đầu chưa đủ đâu…",
  "Ủa sao coi mà thấy dễ chịu ghê",
  "Góc này mà quay là auto dính",
  "Coi mà tự nhiên muốn lưu lại liền",
  "Không phải khoe chứ clip này coi hơi bị ổn",
  "Coi tới cuối đi rồi quay lại nói chuyện tiếp 😳",
  "Ủa sao coi mà thấy thương ngang vậy trời",
  "Nhìn vậy thôi chứ coi cuốn lắm nha",
  "Ai đang mệt coi cái này thử đi",
  "Cảnh này mà coi ban đêm là hợp vibe lắm",
  "Ủa sao coi mà thấy muốn coi tiếp nữa",
  "Không hiểu sao clip này coi hoài không ngán",
  "Coi tới đoạn sau mới thấy cái hay",
  "Vibe nhẹ nhẹ mà coi đã ghê",
  "Ủa sao coi mà tự nhiên cười vậy nè",
  "Coi mà quên luôn đang định làm gì",
  "Đoạn này mà bỏ là hơi uổng đó",
  "Coi tới cuối thử coi 😳",
  "Không biết sao chứ mình coi lại lần nữa rồi",
  "Cảnh này coi trên màn hình lớn là hết bài",
  "Ủa sao coi mà thấy yên yên vậy trời",
  "Nhìn đơn giản mà coi cuốn ghê",
  "Coi mà tự nhiên thấy dễ chịu ngang",
  "Đoạn sau mới là đoạn hay nè",
  "Coi thử đi rồi hiểu cảm giác này",
  "Ủa sao coi mà thấy thích nhẹ vậy ta",
  "Coi mà quên luôn thời gian trôi",
  "Cảnh này coi lại vẫn thấy ổn",
  "Không biết mọi người sao chứ mình thấy cuốn",
  "Coi mà tự nhiên muốn share cho bạn bè",
  "Góc này mà quay là hợp TikTok lắm",
  "Coi mà thấy vibe dịu ghê",
  "Ủa sao coi mà thấy vui vui vậy",
  "Coi tới cuối đi đừng bỏ giữa chừng",
  "Không hiểu sao coi mà thấy nhẹ lòng",
  "Cảnh này coi hoài vẫn thấy ổn",
  "Coi mà tự nhiên muốn coi thêm nữa",
  "Ủa sao clip này coi mà không tua nổi",
  "Coi mà quên luôn đang lướt mạng",
  "Nhìn vậy thôi chứ coi là dính đó",
  "Coi thử đi biết đâu hợp vibe bạn",
  "Ủa sao coi mà thấy chill dữ vậy",
  "Coi mà tự nhiên thấy dễ thương ghê",
  "Đoạn này coi lại vẫn thấy hay",
  "Coi mà quên luôn mình vô app làm gì",
  "Không biết sao chứ mình thấy clip này ổn",
  "Coi tới cuối thử nha 😳",
  "Cảnh này coi buổi tối là hợp lắm",
  "Coi mà tự nhiên thấy muốn coi thêm",
  "Nhìn đơn giản mà coi là cuốn",
  "Ủa sao coi mà thấy thích ngang vậy",
  "Coi mà quên luôn thời gian",
  "Đoạn này coi lại lần nữa cũng được",
  "Coi thử đi rồi quay lại đây nói chuyện tiếp 😭"
];

// ---------- helpers ----------
function normalizeToUrl(item) { return (item || "").toString().trim(); }
function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function now() { return Date.now(); }

function muteIcon(muted) {
  return muted
    ? `<svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M11 5L6 9H3v6h3l5 4V5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <path d="M23 9l-6 6M17 9l6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>`
    : `<svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M11 5L6 9H3v6h3l5 4V5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <path d="M15 9a4 4 0 0 1 0 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>`;
}

// ---------- DOM ----------
const feedEl = document.getElementById("feed");
const captionEl = document.getElementById("caption");
const toastEl = document.getElementById("toast");
const btnMute = document.getElementById("btnMute");
const btnGift = document.getElementById("btnGift");

// Gift redirect
if (btnGift) btnGift.addEventListener("click", () => (window.location.href = "https://google.com"));

function toast(msg) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  setTimeout(() => toastEl.classList.remove("show"), 900);
}

// ---------- Session analytics ----------
function getUID() {
  const key = "vid_uid";
  let v = localStorage.getItem(key);
  if (!v) {
    v = (crypto?.randomUUID?.() || `u_${Math.random().toString(16).slice(2)}_${Date.now()}`);
    localStorage.setItem(key, v);
  }
  return v;
}
function getOrCreateSessionId() {
  const key = "vid_session_id";
  let sid = sessionStorage.getItem(key);
  if (!sid) {
    sid = (crypto?.randomUUID?.() || `s_${Math.random().toString(16).slice(2)}_${Date.now()}`);
    sessionStorage.setItem(key, sid);
  }
  return sid;
}
const UID = getUID();
const SESSION_ID = getOrCreateSessionId();

const session = {
  sid: SESSION_ID,
  uid: UID,
  startedAt: now(),
  endedAt: null,
  durationMs: 0,
  videosSeen: 0,
  videoIdsSeen: [],
  activeVideoId: null,
  watchMsByVideo: {},
  lastTickAt: now(),
  muted: true,
  ref: document.referrer || "",
  url: location.href,
  lang: navigator.language || "",
  tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
  screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
  ua: (navigator.userAgent || "").slice(0, 220),
};

function markVideoSeen(feedId) {
  if (!feedId) return;
  if (!session.videoIdsSeen.includes(feedId)) {
    session.videoIdsSeen.push(feedId);
    session.videosSeen = session.videoIdsSeen.length;
  }
}

function tickWatchTime() {
  const t = now();
  const dt = Math.max(0, t - session.lastTickAt);
  session.lastTickAt = t;

  if (document.visibilityState !== "visible") return;
  const vid = session.activeVideoId;
  if (!vid) return;

  session.watchMsByVideo[vid] = (session.watchMsByVideo[vid] || 0) + dt;
}
setInterval(tickWatchTime, 1000);

// ---------- Quick log (immediate) ----------
function sendQuickEvent(eventName) {
  const payload = {
    sid: SESSION_ID,
    uid: UID,
    event: eventName,
    ts: Date.now(),
    url: location.href,
    ref: document.referrer || "",
    lang: navigator.language || "",
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
    ua: (navigator.userAgent || "").slice(0, 220),
  };

  try {
    fetch(SESSION_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(() => {});
  } catch {}
}

// ---------- Consent Like (mini, centered) ----------
function ensureConsent() {
  const key = "vid_analytics_ok";
  if (localStorage.getItem(key) === "1") return true;

  const bar = document.createElement("div");
  bar.style.cssText = `
    position:fixed;
    left:50%;
    bottom:16px;
    transform:translateX(-50%);
    z-index:9999;
  `;

  bar.innerHTML = `
    <button id="vidOk" style="
      display:inline-flex;
      align-items:center;
      justify-content:center;
      gap:6px;
      height:40px;
      padding:0 14px;
      border:2px solid #000;
      border-radius:999px;
      font-weight:900;
      font-size:14px;
      background:#fff;
      color:#000;
      cursor:pointer;
      box-sizing:border-box;
    ">
      <span>Like</span>
      <span style="font-size:16px;line-height:1">👍</span>
    </button>
  `;

  document.body.appendChild(bar);

  bar.querySelector("#vidOk").addEventListener("click", () => {
    localStorage.setItem(key, "1");
    sendQuickEvent("consent_ok"); // ✅ vào là có log
    bar.remove();
  });

  return false;
}
ensureConsent();

// ---------- Build feed ----------
const URLS = RAW_LIST.map(normalizeToUrl);
shuffleInPlace(URLS);

const FEED = URLS.map((url, idx) => ({
  id: `v${idx + 1}`,
  url,
  title: pickRandom(TITLE_BANK),
}));

// ---------- Tap Hint UI: controls show/hide ----------
let observer = null;
let globalMuted = true;
let lastTapAt = 0;
let hintTimer = null;

function showControls() {
  if (btnMute) btnMute.classList.remove("is-hidden");
  if (btnGift) btnGift.classList.remove("is-hidden");
  if (captionEl) captionEl.classList.remove("is-hidden");
}
function hideControls() {
  if (btnMute) btnMute.classList.add("is-hidden");
  if (btnGift) btnGift.classList.add("is-hidden");
  if (captionEl) captionEl.classList.add("is-hidden");
}
function showControlsBrief(ms = 1600) {
  showControls();
  if (hintTimer) clearTimeout(hintTimer);
  hintTimer = setTimeout(() => {
    const v = getActiveVideo();
    if (v && !v.paused) hideControls();
  }, ms);
}

function getActiveSlide() {
  const id = session.activeVideoId;
  if (!id) return null;
  return document.querySelector(`.slide[data-id="${CSS.escape(id)}"]`);
}
function getActiveVideo() {
  const slide = getActiveSlide();
  return slide ? slide.querySelector("video") : null;
}

function setMuteAll(muted) {
  globalMuted = muted;
  session.muted = muted;
  document.querySelectorAll(".slide video").forEach(v => (v.muted = muted));
  if (btnMute) btnMute.innerHTML = muteIcon(muted);
  toast(muted ? "Muted" : "Unmuted");
}

if (btnMute) {
  btnMute.addEventListener("click", (e) => {
    e.stopPropagation();
    setMuteAll(!globalMuted);
    hideControls(); // ✅ bấm mute/unmute ẩn ngay
  });
}
if (btnGift) {
  btnGift.addEventListener("click", (e) => e.stopPropagation());
}

// ---------- Auto-next ----------
function goNextFromSlide(slideEl) {
  const next = slideEl?.nextElementSibling;
  if (next && next.classList.contains("slide")) {
    next.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// ---------- Render ----------
function attachVideoSignals(video, slideEl) {
  video.addEventListener("pause", () => {
    // pause => show controls and keep visible
    showControls();
  });

  video.addEventListener("play", () => {
    // playing => keep UI quiet (hidden), but allow tap-hint
    hideControls();
  });

  // ✅ auto-next when video ended
  video.addEventListener("ended", () => {
    // only auto-next if this slide is still the active one
    if (session.activeVideoId !== slideEl?.dataset?.id) return;
    goNextFromSlide(slideEl);
  });
}

function render() {
  if (!feedEl) return;
  feedEl.innerHTML = "";

  FEED.forEach(item => {
    const s = document.createElement("section");
    s.className = "slide";
    s.dataset.id = item.id;
    s.dataset.title = item.title;

    // ✅ REMOVE loop so "ended" will fire for auto-next
    s.innerHTML = `<video playsinline muted preload="metadata" src="${item.url}"></video>`;

    const v = s.querySelector("video");
    if (v) attachVideoSignals(v, s);

    // Tap slide:
    // - If paused -> play
    // - If playing -> (1st tap) show hint, (2nd tap quickly) pause
    s.addEventListener("click", () => {
      const video = s.querySelector("video");
      if (!video) return;

      if (video.paused) {
        video.play().catch(() => {});
        hideControls();
        return;
      }

      const t = now();
      const dt = t - lastTapAt;
      lastTapAt = t;

      if (dt < 320) {
        video.pause();
      } else {
        showControlsBrief(1600);
      }
    });

    feedEl.appendChild(s);
  });

  const first = document.querySelector(".slide");
  if (first?.dataset?.id) {
    session.activeVideoId = first.dataset.id;
    markVideoSeen(first.dataset.id);
    if (captionEl) captionEl.textContent = first.dataset.title || "";
  }

  setupObserver();
}

function setupObserver() {
  if (observer) observer.disconnect();

  observer = new IntersectionObserver((entries) => {
    entries.forEach(async (entry) => {
      const slide = entry.target;
      const video = slide.querySelector("video");
      if (!video) return;

      if (entry.isIntersecting) {
        // pause others
        document.querySelectorAll(".slide video").forEach(v => {
          if (v !== video) v.pause();
        });

        // update active + seen + caption
        const id = slide.dataset.id || null;
        if (id && id !== session.activeVideoId) {
          session.activeVideoId = id;
          markVideoSeen(id);
        }
        if (captionEl) captionEl.textContent = slide.dataset.title || "";

        // autoplay
        try {
          video.muted = globalMuted;
          await video.play();
          hideControls();
        } catch {
          showControls();
        }
      } else {
        video.pause();
      }
    });
  }, { root: feedEl, threshold: 0.66 });

  document.querySelectorAll(".slide").forEach(s => observer.observe(s));
}

// ---------- Send session on end ----------
function buildSessionPayload() {
  const endedAt = now();
  session.endedAt = endedAt;
  session.durationMs = Math.max(0, endedAt - session.startedAt);

  const top = Object.entries(session.watchMsByVideo)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([feedId, ms]) => ({ feedId, ms }));

  return {
    sid: session.sid,
    uid: session.uid,
    startedAt: session.startedAt,
    endedAt: session.endedAt,
    durationMs: session.durationMs,
    videosSeen: session.videosSeen,
    videoIdsSeen: session.videoIdsSeen.slice(0, 50),
    topWatch: top,
    muted: !!session.muted,
    ref: session.ref,
    url: session.url,
    lang: session.lang,
    tz: session.tz,
    screen: session.screen,
    ua: session.ua,
  };
}

let sent = false;
function sendSession() {
  if (sent) return;
  sent = true;

  if (localStorage.getItem("vid_analytics_ok") !== "1") return;

  const body = JSON.stringify(buildSessionPayload());

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(SESSION_ENDPOINT, blob);
    return;
  }

  fetch(SESSION_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true
  }).catch(() => {});
}

window.addEventListener("pagehide", sendSession);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") sendSession();
});

// ---------- Init ----------
render();
setMuteAll(true);
hideControls(); // start quiet