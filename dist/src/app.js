'use strict';
      (() => {
        /* ================= UTILITIES ================= */
        const $ = (s, r) => (r || document).querySelector(s);
        const MIN = 6e4, DAY = 864e5;
        const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
        const pad2 = (n) => String(n).padStart(2, '0');
        const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
        const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
        const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
        const downloadFile = (text, name, type) => {
          const blob = new Blob([text], { type });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url; a.download = name;
          document.body.appendChild(a); a.click(); a.remove();
          setTimeout(() => URL.revokeObjectURL(url), 1200);
        };

        /* ================= ICONS ================= */
        const P = {
          star: '<path d="m12 3 2.8 5.7 6.3.9-4.6 4.4 1.1 6.3-5.6-3-5.6 3 1.1-6.3L3 9.6l6.2-.9Z"/>',
          sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
          moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
          printer: '<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
          notes: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
          layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
          shuffle: '<path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.8-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/>',
          check: '<path d="M20 6 9 17l-5-5"/>',
          x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
          right: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
          bookmark: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',
          search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
          download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
          rotate: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
          bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
          zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
          grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
          chart: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
          sliders: '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
          menu: '<line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>',
          alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
          sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>',
          trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
          checkCircle: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
          eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
          film: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/>',
          home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
          flip: '<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/>',
          link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
          quote: '<path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/>',
          keyboard: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h.01"/><path d="M10 9h.01"/><path d="M14 9h.01"/><path d="M18 9h.01"/><path d="M6 13h.01"/><path d="M18 13h.01"/><path d="M9 13h6"/><path d="M8 17h8"/>',
          tag: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
        };
        const icon = (n, s = 18) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;
        const BRAND_MARK = '<svg width="22" height="22" viewBox="0 0 40 40" fill="none" stroke="#30352c" stroke-width="2.4" stroke-linejoin="round" aria-hidden="true"><path d="m8 16 12-6 12 6-12 6Z"/><path d="m8 22 12 6 12-6"/><path d="m8 28 12 6 12-6"/></svg>';

        /* ================= SCENE ART (cue icons) ================= */

        const CUES = {
          geometry: '<path d="M30 120 65 54l35 66Z"/><path d="m117 48 37-20 37 20-37 20Z"/><path d="M117 48v44l37 21 37-21V48m-37 20v45"/><path d="m142 139 22-17 22 17-22 17Z"/>',
          equations: '<path d="M44 133V38m0 95h148m-153-87 5-8 5 8m135 82 8 5-8 5"/><path d="m56 121 28-20 30-24 31-29"/><path d="M114 77v56" stroke-dasharray="4 5"/><text x="148" y="73" font-size="14" fill="currentColor" stroke="none">x, y, z</text>',
          classroom: '<rect x="49" y="26" width="133" height="50" rx="3"/><path d="M65 46h36m-36 12h57m18-16 19 19m0-19-19 19"/><path d="M42 98h37v10H42Zm6 10v32m25-32v32M98 98h37v10H98Zm6 10v32m25-32v32M154 98h37v10h-37Zm6 10v32m25-32v32"/>',
          book: '<path d="M115 48c-20-13-42-12-69-4v80c27-8 49-7 69 5 20-12 42-13 69-5V44c-27-8-49-9-69 4Zm0 0v81"/><path d="M59 65c16-4 29-3 43 1m-43 15c16-4 29-3 43 1m-43 15c16-4 29-3 43 1m28-33c14-4 27-5 43-1m-43 17c14-4 27-5 43-1m-43 17c14-4 27-5 43-1"/>',
          car: '<path d="M39 101V86l22-7 17-26h63l20 26 27 7v15"/><path d="M39 101h15m31 0h59m31 0h13M88 58v23h62l-15-23M61 79h20"/><circle cx="69" cy="103" r="14"/><circle cx="159" cy="103" r="14"/><path d="M31 134h29m14 0h31m14 0h28m14 0h31"/>',
          satellite: '<rect x="99" y="66" width="32" height="36" rx="4"/><rect x="43" y="64" width="47" height="40" rx="2"/><rect x="140" y="64" width="47" height="40" rx="2"/><path d="M90 84h9m32 0h9M43 84h47m50 0h47M59 64v40m15-40v40m82-40v40m15-40v40M115 66V50m-9-8 9 8 9-8M107 120l8-18 8 18"/><path d="M135 35q12 3 15 15m-12-27q23 5 28 28"/>',
          computer: '<rect x="46" y="28" width="138" height="116" rx="5"/><rect x="58" y="39" width="114" height="50" rx="3"/><circle cx="87" cy="64" r="17"/><circle cx="143" cy="64" r="17"/><circle cx="87" cy="64" r="5"/><circle cx="143" cy="64" r="5"/><path d="M87 47v8m0 18v8m-17-17h8m18 0h8m39-17v8m0 18v8m-17-17h8m18 0h8M60 105h61m-61 12h61m-61 12h61"/><rect x="139" y="101" width="30" height="30" rx="2"/><path d="M59 144v8m112-8v8"/>',
          circuit: '<rect x="88" y="57" width="54" height="54" rx="6"/><path d="M101 57V37m14 20V28m14 29V37m-28 74v21m14-21v30m14-30v21M88 70H58V47m30 37H39m49 14H58v25m84-53h30V47m-30 37h49m-49 14h30v25"/><circle cx="58" cy="43" r="4"/><circle cx="172" cy="43" r="4"/><circle cx="58" cy="127" r="4"/><circle cx="172" cy="127" r="4"/>',
          hallway: '<path d="M35 27h160v116H35Z"/><path d="m35 27 38 29m122-29-38 29M35 143l38-29m122 29-38-29"/><rect x="73" y="56" width="84" height="58" rx="2"/><rect x="89" y="62" width="52" height="52" rx="2"/><path d="M133 92h2"/><text x="100" y="80" font-size="10" fill="currentColor" stroke="none">WAIT</text><path d="M115 114v29" stroke-dasharray="5 6"/>',
          running: '<path d="M28 139h168" stroke-dasharray="5 7"/><circle cx="139" cy="43" r="10"/><path d="m132 55-21 34m13-21 20 17 17-8m-37-9-22-5-13 15m22 11 19 20-12 29m-7-49-23 23-24-6" stroke-width="3"/><path d="m54 67 25 0m-37 19h25m-28 20h18"/><text x="39" y="40" font-size="13" fill="currentColor" stroke="none">½ mile</text>',
          church: '<path d="M60 137V78l55-35 55 35v59M52 137h126"/><path d="M115 43V21m-10 9h20"/><path d="M101 137v-31a14 14 0 0 1 28 0v31"/><rect x="72" y="87" width="16" height="23" rx="2"/><rect x="142" y="87" width="16" height="23" rx="2"/><circle cx="115" cy="71" r="9"/>',
          coffee: '<path d="M64 67h52l6 59H58ZM64 67l5-12h43l4 12M64 84l-18-6v19m70-13c20 0 20 27 3 27M57 126h66M80 43c-5-8 5-9 0-17m18 17c-5-8 5-9 0-17M37 143h154"/><rect x="145" y="103" width="29" height="22" rx="3"/><path d="M174 108c13-1 13 13 0 13"/>',
          sharedcoffee: '<path d="M47 65h49l6 54H41ZM47 65l5-12h39l5 12m0 15c16 0 16 25 3 25m-46 14h50M64 41c-4-8 4-8 0-15m16 15c-4-8 4-8 0-15"/><rect x="124" y="71" width="65" height="68" rx="3"/><path d="M137 85h39m-39 12h39m-39 13h18m-18 16h17m6 0h16"/><path d="M31 148h169"/>',
          report: '<path d="M67 26h71l25 25v91H67Zm71 0v25h25"/><path d="M82 71h65m-65 19h55m-55 19h65m-65 19h39" stroke-width="7"/>',
          rain: '<path d="M60 55a15 15 0 0 1 0-30 24 24 0 0 1 46 0 16 16 0 0 1 7 30Z"/><path d="m49 68-6 12m24-12-6 12m24-12-6 12m24-12-6 12m24-12-6 12m24-12-6 12"/><circle cx="116" cy="102" r="10"/><path d="M100 143v-20q16-13 32 0v20m-32-18-14 12m46-12 14 12m-38 6-7 14m23-14 7 14"/>',
          sign: '<rect x="49" y="39" width="132" height="62" rx="4"/><text x="72" y="66" font-size="13" fill="currentColor" stroke="none">RESTROOM</text><path d="M78 82h73m-51 19v40m30-40v40M88 145h54"/><path d="m160 113 20 21m-14-28 20 21m-26-14 6-7m14 28 6-7"/>',
          court: '<g transform="rotate(-34 117 76)"><rect x="87" y="40" width="62" height="24" rx="4"/><path d="M98 40v24m40-24v24M112 64v58h12V64"/></g><rect x="60" y="127" width="109" height="12" rx="4"/><path d="M48 145h134"/>',
          chalkboard: '<rect x="37" y="26" width="156" height="106" rx="4"/><path d="M54 113V45m0 68h118m-107-10c21-1 21-51 43-50 24 1 29 40 57 40M74 145h83m-57-13v13m30-13v13"/><path d="M134 46h42m-42 12h23"/>',
          euler: '<path d="M66 25h74l24 24v94H66Zm74 0v24h24"/><text x="81" y="53" font-size="13" fill="currentColor" stroke="none">Euler</text><path d="M81 125V72m0 53h65m-65-4 12-5 12-7 12-10 12-12 12-14"/><path d="M93 116v-7h12v-10h12V87h12V73h12" stroke-dasharray="3 4"/>',
          orbit: '<circle cx="113" cy="86" r="31"/><ellipse cx="113" cy="86" rx="86" ry="37" transform="rotate(-28 113 86)"/><path d="m163 36 14-7 10 19-14 7ZM177 29l10-5 10 19-10 5"/>',
          pearls: '<path d="M64 35c-24 82-4 111 51 111s75-29 51-111m-67-9 16 11 16-11m-16 11v10"/>',
          mirror: '<rect x="40" y="26" width="150" height="118" rx="5"/><path d="M115 26v118"/><circle cx="78" cy="69" r="12"/><path d="M60 133V97q18-16 36 0v36"/><g opacity=".65"><circle cx="152" cy="69" r="12"/><path d="M134 133V97q18-16 36 0v36"/></g><path d="m47 37 10 10m7-10 14 14"/>',
          dinner: '<path d="M32 103h167M47 103v37m137-37v37"/><ellipse cx="83" cy="98" rx="24" ry="9"/><ellipse cx="152" cy="98" rx="24" ry="9"/><path d="M53 75v28m-5-28v12h10V75m49 0v28m14-28v28"/><path d="M91 36c22-15 43-5 49 7" stroke-dasharray="4 5"/><path d="m137 35 3 8-9-1"/><circle cx="113" cy="55" r="13"/>',
          door: '<path d="M68 148V26h95v122M57 148h118"/><rect x="81" y="39" width="69" height="109" rx="3"/><rect x="92" y="52" width="47" height="35" rx="2"/><rect x="92" y="101" width="47" height="31" rx="2"/><circle cx="141" cy="95" r="3"/>',
          team: '', cheering: '',
        };
        for(let k=0;k<6;k++) CUES.turbine=(CUES.turbine||'<circle cx="115" cy="84" r="51"/><circle cx="115" cy="84" r="11"/><path d="M76 146h78m-62-11v11m46-11v11"/>')+`<path d="M115 73q3-28 28-30-2 22-18 33" transform="rotate(${k*60} 115 84)"/>`;
        for(let k=0;k<11;k++){const t=k/10*Math.PI;CUES.pearls+=`<circle cx="${(115+50*Math.cos(t)).toFixed(1)}" cy="${(75+64*Math.sin(t)).toFixed(1)}" r="6" fill="var(--art-detail)"/>`;}
        [55,95,135,175].forEach((x,i)=>{const y=i===1||i===2?49:62;CUES.team+=`<circle cx="${x}" cy="${y}" r="9"/><path d="M${x-11} ${y+20}q11-8 22 0v32h-22Zm3 32v24m16-24v24m-19-52-7 24m29-24 7 24"/>`;});
        [65,115,165].forEach((x,i)=>{const y=i===1?57:70;CUES.cheering+=`<circle cx="${x}" cy="${y}" r="9"/><path d="M${x} ${y+9}v34m0-27-21-12-5-17m26 29 21-12 5-17m-26 40-12 25m12-25 12 25"/>`;});
        CUES.cheering+='<path d="M37 150h156m-9-116 5-7M43 42l-5-7m69-10 3-6m-25 15-4-5m63 4 4-6"/>';
        CUES._default=CUES.geometry;
        const cueArt=(cue,label,cls='')=>`<svg class="scene-art ${cls}" viewBox="0 0 230 170" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" ${label?`role="img" aria-label="${esc(label)}"`:'aria-hidden="true"'}><circle cx="115" cy="85" r="64" fill="var(--art-wash)" stroke="none"/>${CUES[cue]||CUES._default}</svg>`;

        /* ================= BUILT-IN SCENE LIBRARY ================= */
        const BUILTIN_SCENES = window.SCENESTUDY_MASTER_SCENES;
        const SCENE_ALIASES={52:29,32:31,38:37,54:56,64:55};
        const resolveSceneId=(id,map=null)=>{const n=map?map[Number(id)]:Number(id);return SCENE_ALIASES[n]||n;};
        const FILM_NAME = 'Hidden Figures';
        const MOVIE_SOURCE = 'https://cdn2.etv.nz/vod/etv5-token202504/etv/hidden_figures_tv_3_20181202_2030_640x360_1500k.mp4';
        const FILM_RUNTIME = 8960.52; // seconds, measured from the provided file

        /* ================= SCENE TAGS ================= */
        const TAGS = {
          discrimination:{label:'Discrimination',def:'racial and gender barriers, exclusion and responses to prejudice'},
          opportunity:{label:'Education & Opportunity',def:'learning and access to educational and professional opportunities'},
          expertise:{label:'Expertise & Recognition',def:'skilled work and the recognition it earns'},
          teamwork:{label:'Leadership & Teamwork',def:'shared work, advocacy and collective advancement'},
          family:{label:'Family',def:'relationships, care and support outside the workplace'},
          spacerace:{label:'Space Race & Technology',def:'the mission, computing and technical change'},
        };
        const TECHNIQUES = {"closeup": "Close-up", "medium": "Medium shot", "wide": "Wide shot", "pov": "POV shot", "lowangle": "Low-angle shot", "tracking": "Tracking shot", "natural": "Natural lighting", "lowkey": "Low-key lighting", "crosscut": "Cross-cutting", "montage": "Montage", "props": "Props", "costume": "Costume", "setting": "Setting", "color": "Color palette", "blocking": "Actor blocking"};
        const techniquesOf=s=>Array.isArray(s.techniqueTags)?[...new Set(s.techniqueTags)].filter(t=>TECHNIQUES[t]):[];
        const techniqueLabel=t=>TECHNIQUES[t]||t;
        const techniqueChips=s=>`<span class="technique-chips" aria-label="Film techniques">${techniquesOf(s).map(t=>`<span class="technique-chip">${esc(techniqueLabel(t))}</span>`).join('')}</span>`;
        function tagsOf(scene) {
          return Array.isArray(scene.tags) ? [...new Set(scene.tags)] : [];
        }
        const tagLabel = (t) => (TAGS[t] && TAGS[t].label) || t;
        const importanceOf = s => Number.isInteger(s.essayImportance?.rating) && s.essayImportance.rating >= 1 && s.essayImportance.rating <= 10 ? s.essayImportance.rating : 1;
        const importanceBadge = (s,caption=true) => `<span class="importance-badge" role="img" aria-label="Importance: ${importanceOf(s)} out of 10" title="${esc(s.essayImportance?.reason || '')}">${caption?'<span aria-hidden="true">Importance</span>':''}<span class="importance-stars" aria-hidden="true"><span class="filled">${icon('star',13)}</span><span>${importanceOf(s)}/10</span></span></span>`;
        const tagDef = (t) => (TAGS[t] && TAGS[t].def) || 'a key idea for your essay';
        const tagColor = (t) => `var(--tag-${TAGS[t] ? t : 'default'})`;
        const tagChip = (t, withIcon = true) => {
          const c = tagColor(t);
          return `<span class="tag-chip" style="--tag-color:${c}">${withIcon ? icon('tag', 11) + ' ' : ''}${esc(tagLabel(t))}</span>`;
        };
        const getTagUniverse = () => {
          const counts = {};
          getScenes().forEach((s) => tagsOf(s).forEach((t) => { counts[t] = (counts[t] || 0) + 1; }));
          return Object.keys(counts).sort((a, b) => (counts[b] - counts[a]) || a.localeCompare(b));
        };

        /* Curated essay content — theses, turning points and counter-claims used by the quiz engine */
        const THESES = [
          { text: 'Discrimination in Hidden Figures is not just personal prejudice — it is built into everyday rules and routines.', tags: ['discrimination'], scene: 23 },
          { text: 'Racism and sexism compound each other in a single life, creating a barrier neither would create alone.', tags: ['discrimination'], scene: 13 },
          { text: 'Family support provides a foundation for demanding professional work.', tags: ['family'], scene: 39 },
          { text: 'Institutions only change when discrimination becomes visibly costly to them.', tags: ['discrimination', 'teamwork'], scene: 37 },
          { text: 'Custom and “the way things are done” can exclude people as firmly as any written rule.', tags: ['discrimination'], scene: 22 },
          { text: 'People can take part in injustice while sincerely believing they are free of prejudice.', tags: ['discrimination'], scene: 45 },
          { text: 'Progress is measured in shared victories, not individual promotions.', tags: ['teamwork', 'expertise'], scene: 63 },
          { text: 'Trust across racial lines is earned through demonstrated competence, not granted through goodwill.', tags: ['expertise', 'teamwork'], scene: 56 },
          { text: 'Self-respect is itself a form of resistance.', tags: ['discrimination'], scene: 21 },
          { text: 'A single moment of eloquence can move the people who hold power.', tags: ['discrimination'], scene: 35 },
          { text: 'Technology can either entrench exclusion or break it open — the difference is who is prepared for it.', tags: ['spacerace', 'teamwork'], scene: 33 },
          { text: 'National crisis forces societies to confront the waste of discrimination.', tags: ['spacerace'], scene: 9 },
          { text: 'Information control is a subtle but powerful tool of oppression.', tags: ['discrimination'], scene: 24 },
          { text: 'Endurance has a measurable cost: the film quantifies the tax of segregation.', tags: ['discrimination'], scene: 19 },
          { text: 'Acceptance, when it finally comes, is expressed through small everyday gestures.', tags: ['teamwork', 'expertise', 'discrimination'], scene: 65 },
          { text: 'Foundational knowledge never stops paying off — old mathematics can solve brand-new problems.', tags: ['expertise'], scene: 43 },
        ];
        const TURNING_POINTS = [
          { text: 'silent endurance finally erupts into open resistance', scene: 35 },
          { text: 'the institution physically tears down one of its own symbols of segregation', scene: 37 },
          { text: 'a life is entrusted to Katherine’s calculations because accuracy matters more than prejudice', scene: 56 },
          { text: 'mathematical authority is established in front of the military brass', scene: 44 },
          { text: 'Mary realises that talent without opportunity is wasted', scene: 13 },
          { text: 'years of workplace prejudice dissolve into one small, personal gesture of respect', scene: 65 },
          { text: 'a closed door to the decision-makers is argued open', scene: 48 },
          { text: 'a centuries-old method is proposed to solve a brand-new problem', scene: 43 },
        ];
        const NUANCES = [
          { claim: 'Racism at NASA was always loud and explicit.', scene: 23, why: 'The coffee pot is a quiet, almost polite act of exclusion — discrimination hiding in an everyday object.' },
          { claim: 'Kindness from white colleagues is what solves discrimination in the film.', scene: 11, why: 'Vivian Mitchell is never hostile, yet her polite bureaucracy keeps Dorothy out — niceness is not the same as fairness.' },
          { claim: 'People like Vivian Mitchell are simply villains.', scene: 45, why: 'The mirror scene shows Vivian sincerely believing she bears no animosity — unconscious bias can wear a polite face and still do harm.' },
          { claim: 'Victory in the film belongs to one heroic individual.', scene: 63, why: 'The celebration is deliberately collective — wide views and reaction shots share the celebration across the room, and Katherine is visibly part of it.' },
          { claim: 'Technology simply made human mathematicians unnecessary.', scene: 56, why: 'When the IBM output is doubted, a human being is the final check — the machine never fully replaces judgment.' },
          { claim: 'Once the restroom sign came down, segregation at NASA was over.', scene: 24, why: 'The redacted report is another example of exclusion: removing one sign does not by itself settle every barrier to equal participation.' },
          { claim: 'Katherine’s success is essentially a matter of luck.', scene: 1, why: 'The prologue shows a lifetime of disciplined study behind every ability the plot later uses.' },
          { claim: 'Prejudice at NASA affected social life but never the actual work.', scene: 24, why: 'Blacked-out data directly blocks the trajectory work itself — discrimination reaches into the mathematics.' },
        ];
        const ESSAY_PROMPTS = {
          discrimination:'How do the setting, rules and interactions reveal discrimination in this scene?',
          opportunity:'How does access to learning or professional opportunity change in this scene?',
          expertise:'How does the filmmaking make expertise and recognition visible?',
          teamwork:'How does collective work or leadership shape this scene?',
          family:'How does family support relate to professional responsibility?',
          spacerace:'How do mission urgency and technology shape the choices in this scene?',
        };
        const essayPromptFor = (scene) => {
          const tags = tagsOf(scene).filter((t) => ESSAY_PROMPTS[t]);
          return tags.length ? ESSAY_PROMPTS[tags[0]] : 'How does the filmmaking in this scene reinforce its bigger idea?';
        };
        const displayHeading = (text, fallback) => text && text.length <= 85 ? text : fallback;
        const lower1 = (str) => { if (!str) return str; if (/^[A-Z]{2,}\b/.test(str)) return str; return str.charAt(0).toLowerCase() + str.slice(1); };

        /* ================= STATE ================= */
        const STORE_KEY = 'scenestudy-v2';
        const freshState = () => ({
          v: 4,
          cards: {},            // id -> { dueAt, interval(days), last, reviews }
          bookmarks: [],
          notes: {},            // id -> recall text
          activity: { matches: 0, quizzes: 0, lastScore: null, explanations: [], streak: 0, lastStudyDay: null },
          selectedSceneIds: BUILTIN_SCENES.map((scene) => scene.id),
          history: [],
          watchPos: 0,
          progressRange: '30',
          progressStart: '',
          progressEnd: '',
        });
        // Scene IDs were renumbered 1–67 in film order (previously 1–75 with gaps).
        const IDMAP_V2 = { 1: 1, 2: 16, 3: 13, 4: 21, 7: 6, 8: 9, 9: 23, 10: 19, 11: 31, 13: 11, 14: 24, 15: 35, 16: 37, 19: 44, 20: 56, 21: 47, 22: 65, 24: 45, 25: 39, 28: 43, 29: 22, 30: 63, 31: 2, 32: 3, 33: 4, 34: 5, 35: 7, 36: 8, 37: 10, 38: 32, 39: 25, 40: 12, 41: 14, 42: 15, 43: 18, 44: 17, 45: 34, 46: 36, 47: 38, 48: 27, 49: 28, 50: 33, 51: 26, 52: 40, 53: 41, 54: 42, 55: 29, 56: 48, 57: 54, 58: 58, 59: 57, 60: 59, 61: 60, 62: 61, 63: 62, 64: 64, 65: 46, 66: 49, 67: 52, 68: 53, 69: 51, 70: 30, 71: 20, 72: 55, 73: 50, 74: 66, 75: 67 };
        const remapIdList = (list) => { const seen = new Set(); const out = []; for (const raw of (Array.isArray(list) ? list : [])) { const nid = resolveSceneId(raw,IDMAP_V2); if (nid != null && !seen.has(nid) && BUILTIN_SCENES.some((s) => s.id === nid)) { seen.add(nid); out.push(nid); } } return out; };
        let state = freshState();
        try {
          const raw = localStorage.getItem(STORE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && [3,4].includes(parsed.v)) {
              state = Object.assign(freshState(), parsed);
              if (!Array.isArray(parsed.selectedSceneIds)) state.selectedSceneIds = BUILTIN_SCENES.map((scene) => scene.id);
              if (!Array.isArray(state.history)) state.history = [];
              if (!state.progressRange) state.progressRange = '30';
              if (!Number.isFinite(state.watchPos)) state.watchPos = 0;
            } else if (parsed && parsed.v === 2) {
              const cards = {};
              Object.entries(parsed.cards || {}).forEach(([id, c]) => {
                const nid = IDMAP_V2[Number(id)];
                if (nid) cards[nid] = c;
              });
              const notes = {};
              Object.entries(parsed.notes || {}).forEach(([id, t]) => {
                const nid = IDMAP_V2[Number(id)];
                if (nid) notes[nid] = t;
              });
              state = Object.assign(freshState(), {
                cards,
                bookmarks: remapIdList(parsed.bookmarks),
                notes,
                activity: Object.assign(freshState().activity, parsed.activity || {}, { explanations: remapIdList(parsed.activity && parsed.activity.explanations) }),
                selectedSceneIds: Array.isArray(parsed.selectedSceneIds) ? remapIdList(parsed.selectedSceneIds) : BUILTIN_SCENES.map(s => s.id),
                history: Array.isArray(parsed.history) ? parsed.history.map((e) => ({ ...e, sceneId: e.sceneId != null && IDMAP_V2[e.sceneId] ? IDMAP_V2[e.sceneId] : null })) : [],
                watchPos: parsed.watchPos,
                progressRange: parsed.progressRange,
                progressStart: parsed.progressStart,
                progressEnd: parsed.progressEnd,
              });
              if (!Array.isArray(state.history)) state.history = [];
              if (!state.progressRange) state.progressRange = '30';
              if (!Number.isFinite(state.watchPos)) state.watchPos = 0;
              state.activity.streak = Number.isFinite(state.activity.streak) ? state.activity.streak : 0;
              state.activity.lastStudyDay = state.activity.lastStudyDay || null;
              try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
            }
          }
        } catch (e) { state = freshState(); }

        const validSceneIds = new Set(BUILTIN_SCENES.map(s => s.id));
        const cleanIds = (list, map = null) => [...new Set((Array.isArray(list) ? list : []).map(id => resolveSceneId(id,map)).filter(id => validSceneIds.has(id)))];
        const cardEntries = (cards, map = null) => Object.fromEntries(Object.entries(cards && typeof cards === 'object' && !Array.isArray(cards) ? cards : {}).flatMap(([id,c]) => {
          const n = resolveSceneId(id,map);
          if (!validSceneIds.has(n) || !c || typeof c !== 'object' || Array.isArray(c)) return [];
          return [[id, { interval: Number.isFinite(c.interval) ? clamp(c.interval,0,30) : 0, reviews: Number.isFinite(c.reviews) ? clamp(Math.floor(c.reviews),0,1000000) : 0,
            dueAt: Number.isFinite(c.dueAt) && c.dueAt >= 0 && c.dueAt <= 8640000000000000 ? c.dueAt : 0,
            last: Number.isFinite(c.last) && c.last >= 0 && c.last <= 8640000000000000 ? c.last : 0,
            lastRating: ['again','good','easy'].includes(c.lastRating) ? c.lastRating : null }]];
        }));
        const noteEntries = (notes, map = null) => Object.fromEntries(Object.entries(notes && typeof notes === 'object' && !Array.isArray(notes) ? notes : {}).flatMap(([id,text]) => {
          const n = resolveSceneId(id,map);
          return validSceneIds.has(n) && typeof text === 'string' && text.trim() ? [[id,text.slice(0,200000)]] : [];
        }));
        const cleanCards=(cards,map=null)=>{const out={};for(const [id,c] of Object.entries(cardEntries(cards,map))){const n=resolveSceneId(id,map),prev=out[n];if(!prev){out[n]=c;continue;}out[n]={...(c.last>prev.last?c:prev),reviews:clamp(c.reviews+prev.reviews,0,1000000)};}return out;};
        const cleanNotes=(notes,map=null)=>{const out={};for(const [id,text] of Object.entries(noteEntries(notes,map))){const n=resolveSceneId(id,map);if(!out[n])out[n]=text;else if(out[n].trim()!==text.trim())out[n]=(out[n]+'\n\n'+text).slice(0,200000);}return out;};
        const cleanActivity = (a = {}, map = null) => ({
          matches: Number.isFinite(a?.matches) ? clamp(Math.floor(a.matches),0,1000000) : 0,
          quizzes: Number.isFinite(a?.quizzes) ? clamp(Math.floor(a.quizzes),0,1000000) : 0,
          lastScore: Number.isFinite(a?.lastScore) ? clamp(a.lastScore,0,100) : null,
          explanations: cleanIds(a?.explanations,map),
          streak: Number.isFinite(a?.streak) ? clamp(Math.floor(a.streak),0,100000) : 0,
          lastStudyDay: typeof a?.lastStudyDay === 'string' && Number.isFinite(Date.parse(a.lastStudyDay)) ? a.lastStudyDay : null,
        });
        const cleanHistory = (list, map=null) => (Array.isArray(list) ? list : []).filter(e => e && typeof e === 'object' && Number.isFinite(e.at) && e.at >= 0 && e.at <= Date.now() + DAY && ['review','quiz','matching','explanation'].includes(e.type))
          .slice(-2000).map(e => {const id=resolveSceneId(e.sceneId,map);return { type:e.type, at:e.at, sceneId:validSceneIds.has(id) ? id : null, score:Number.isFinite(e.score) ? clamp(e.score,0,100) : null };});
        const cleanDate = value => typeof value==='string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0,10)===value ? value : '';
        const wasAllSelected=Array.isArray(state.selectedSceneIds)&&Array.from({length:67},(_,i)=>i+1).every(id=>state.selectedSceneIds.includes(id));
        state.v=4;
        state.cards = cleanCards(state.cards);
        state.notes = cleanNotes(state.notes);
        state.bookmarks = cleanIds(state.bookmarks);
        state.selectedSceneIds = wasAllSelected ? BUILTIN_SCENES.map(s=>s.id) : cleanIds(state.selectedSceneIds);
        state.history = cleanHistory(state.history);
        state.activity = cleanActivity(state.activity);
        if (!['7','30','90','all','custom'].includes(state.progressRange)) state.progressRange = '30';
        for (const k of ['progressStart','progressEnd']) state[k]=cleanDate(state[k]);
        state.watchPos = Number.isFinite(state.watchPos) ? clamp(state.watchPos,0,FILM_RUNTIME) : 0;
        { const today = new Date().toDateString(); const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
          if (![today,yesterday.toDateString()].includes(state.activity.lastStudyDay)) state.activity.streak = 0; }
        let saveTimer = null, storageWarning = false;
        const saveNow = () => {
          clearTimeout(saveTimer);
          saveTimer = null;
          try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); storageWarning = false; updateDraftStatus('Draft Saved'); return true; }
          catch (e) { updateDraftStatus('Draft Could Not Be Saved'); if (!storageWarning) { storageWarning = true; toast('Changes could not be saved. Export a backup from Progress.', 'alert'); } return false; }
        };
        function updateDraftStatus(text) { const el = document.getElementById('draftStatus'); if (el) el.textContent = text; }
        const save = () => { clearTimeout(saveTimer); saveTimer = setTimeout(saveNow,150); };
        window.addEventListener('pagehide',saveNow);
        window.addEventListener('beforeunload',saveNow);

        /* ================= ACTIVE SCENE LIBRARY ================= */
        const recordHistory = (type, sceneId = null, score = null) => {
          state.history.push({ type, at: Date.now(), sceneId, score });
          if (state.history.length > 2000) state.history = state.history.slice(-2000);
          save();
        };
        const getScenes = () => {
          const selected = new Set(state.selectedSceneIds);
          return BUILTIN_SCENES.filter((scene) => selected.has(scene.id));
        };
        const getCharacters = () => [...new Set(getScenes().map((s) => s.character).filter(Boolean))];
        const sceneById = (id) => getScenes().find((s) => s.id === id);
        const formatTimecode = (seconds) => {
          if (!Number.isFinite(seconds) || seconds < 0) return '—';
          const total = Math.floor(seconds);
          return `${String(Math.floor(total / 3600)).padStart(2,'0')}:${String(Math.floor(total % 3600 / 60)).padStart(2,'0')}:${String(total % 60).padStart(2,'0')}`;
        };
        const clipFor = (id) => {
          const s = BUILTIN_SCENES.find((x) => x.id === id);
          const t = s && s.timestamps;
          return { start: t ? t.start : null, end: t ? t.end : null };
        };
        const sceneTimeLabel = (id) => {
          const clip = clipFor(id);
          return Number.isFinite(clip.start) && Number.isFinite(clip.end) && clip.end > clip.start
            ? `${formatTimecode(clip.start)} → ${formatTimecode(clip.end)}`
            : 'Time To Be Confirmed';
        };
        let watchTarget = null;
        let watchStopAt = null, watchSceneId = null, watchAutoplay = false;
        function goWatchAt(id) {
          const clip = clipFor(id);
          watchSceneId = id; watchAutoplay = true;
          watchTarget = Number.isFinite(clip.start) ? clip.start : 0;
          watchStopAt = Number.isFinite(clip.end) && clip.end > watchTarget ? clip.end : null;
          go('watch');
        }

        /* ================= SRS ================= */
        function rateCard(id, rating) { // rating: again | good | easy
          const now = Date.now();
          const c = state.cards[id] || { interval: 0, reviews: 0 };
          if (rating === 'again') { c.interval = 0; c.dueAt = now + 10 * MIN; }
          else {
            const base = c.interval || (rating === 'easy' ? 3 : 1);
            c.interval = rating === 'easy' ? Math.min(30, Math.round(base * 2.5) + 1) : Math.min(30, Math.max(1, Math.round(base * 2)));
            c.dueAt = now + c.interval * DAY;
          }
          c.last = now; c.reviews = (c.reviews || 0) + 1; c.lastRating = rating;
          state.cards[id] = c; recordHistory('review', id); markStudied();
        }
        const isDue = (id) => { const c = state.cards[id]; return !c || !c.dueAt || c.dueAt <= Date.now(); };
        const dueCount = () => getScenes().filter((s) => isDue(s.id)).length;
        function masteryOf(id) {
          const c = state.cards[id];
          if (!c || !c.reviews) return 'new';
          return c.interval >= 5 ? 'confident' : 'learning';
        }
        function dueLabel(id) {
          const c = state.cards[id];
          if (!c || !c.reviews) return 'Not Studied Yet';
          const ms = c.dueAt - Date.now();
          if (ms <= 0) return 'Due Now';
          const m = Math.ceil(ms / MIN);
          if (m < 60) return `In ${m} Min`;
          const d = Math.ceil(ms / DAY);
          return d === 1 ? 'Tomorrow' : `In ${d} Days`;
        }
        const nextIntervalText = (id, rating) => {
          if (rating === 'again') return '10 Minutes';
          const c = state.cards[id];
          const base = (c && c.interval) || (rating === 'easy' ? 3 : 1);
          const d = rating === 'easy' ? Math.min(30, Math.round(base * 2.5) + 1) : Math.min(30, Math.max(1, Math.round(base * 2)));
          return d === 1 ? '1 Day' : `${d} Days`;
        };
        function masteryRing(id) {
          const m = masteryOf(id);
          const c = state.cards[id];
          const frac = m === 'confident' ? 1 : m === 'learning' ? clamp(((c && c.interval) || 0) / 5, 0.12, 0.85) : 0;
          const col = m === 'confident' ? '#8a9a6a' : m === 'learning' ? '#e8bd34' : 'var(--line)';
          const label = m === 'confident' ? 'Confident' : m === 'learning' ? 'Learning' : 'Not studied yet';
          return `<span class="tile-ring" data-mastery="${m}" role="img" aria-label="Mastery: ${label}" title="${label}"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8" class="ring-track"/><circle cx="10" cy="10" r="8" class="ring-fill" style="stroke:${col};stroke-dasharray:${(frac * 50.27).toFixed(1)} 50.27"/></svg></span>`;
        }

        /* ================= STUDY STREAK ================= */
        function markStudied() {
          const today = new Date().toDateString();
          const a = state.activity;
          if (a.lastStudyDay === today) return;
          const previousDay = new Date(); previousDay.setDate(previousDay.getDate()-1); const yesterday = previousDay.toDateString();
          a.streak = a.lastStudyDay === yesterday ? (a.streak || 0) + 1 : 1;
          a.lastStudyDay = today;
          save();
        }

        /* ================= TOAST & MODAL ================= */
        const toastRoot = $('#toastRoot');
        function toast(msg, icn = 'sparkles') {
          const el = document.createElement('div');
          el.className = 'toast';
          el.innerHTML = `${icon(icn, 17)}<span>${esc(msg)}</span>`;
          toastRoot.appendChild(el);
          setTimeout(() => { el.classList.add('leaving'); setTimeout(() => el.remove(), 300); }, 3400);
        }
        const modalRoot = $('#modalRoot');
        let lastFocus = null;
        function openModal(html) {
          if (!modalRoot.contains(document.activeElement)) lastFocus = document.activeElement;
          modalRoot.innerHTML = `<div class="modal-backdrop" data-action="closeModal"><div class="modal" role="dialog" aria-modal="true" tabindex="-1" aria-labelledby="modalTitle">${html}</div></div>`;
          syncOverlays();
          const dlg = $('.modal', modalRoot);
          const h2 = $('h2', dlg);
          if (h2) h2.id = 'modalTitle';
          dlg.focus();
          document.body.style.overflow = 'hidden';
        }
        function closeModal() {
          const wasOpen = modalRoot.childElementCount > 0;
          modalRoot.innerHTML = '';
          syncOverlays();
          if (wasOpen && lastFocus) {
            const replacement = lastFocus.dataset?.action ? [...viewEl.querySelectorAll('[data-action]')].find(el=>el.dataset.action===lastFocus.dataset.action && el.dataset.id===lastFocus.dataset.id) : null;
            (lastFocus.isConnected ? lastFocus : replacement || viewEl)?.focus();
          }
          lastFocus = null;
          pendingRestore = null;
        }

        /* ================= NAV / SHELL ================= */
        const NAV = [
          { section: 'Home' },
          { id: 'overview', label: 'Overview', icn: 'home' },
          { id: 'library', label: 'Scene Library', icn: 'grid' },
          { id: 'watch', label: 'Watch Film', icn: 'film' },
          { id: 'progress', label: 'Progress', icn: 'chart' },
          { id: 'selection', label: 'Choose Scenes', icn: 'check' },
          { section: 'Exercises' },
          { id: 'flashcards', label: 'Flashcards', icn: 'layers' },
          { id: 'matching', label: 'Match & Mix', icn: 'link' },
          { id: 'quiz', label: 'Essay Quiz', icn: 'zap' },
          { id: 'recall', label: 'Recall & Explain', icn: 'quote' },

        ];
        let currentView = 'overview';
        const viewEl = $('#view');

        function renderNav() {
          const due = dueCount();
          $('#studyNav').innerHTML = NAV.map((n) => {
            if (n.section) return `<h2 class="nav-section"><span>${n.section}</span></h2>`;
            let count = '';

            if (n.id === 'library') count = `<span class="nav-count">${getScenes().length}</span>`;
            return `<button class="nav-item ${currentView === n.id ? 'active' : ''}" data-action="nav" data-view="${n.id}" ${currentView === n.id ? 'aria-current="page"' : ''}>${icon(n.icn, 20)}<span>${n.label}</span>${count}</button>`;
          }).join('');
          $('#workspaceName').textContent = FILM_NAME;
        }

        function setView(v) {
          clearTimeout(navigationTimer);navigationTimer=null;
          if (currentView === 'watch' && v !== 'watch') clearMovie();
          viewEl.classList.remove('view-pending');viewEl.removeAttribute('aria-busy');
          currentView = v;
          document.body.classList.remove('nav-open');
          $('#menuBtn').setAttribute('aria-expanded', 'false');
          renderNav();
          renderView();
          syncOverlays();
          if (viewEl && viewEl.focus) { try { viewEl.focus({ preventScroll: true }); } catch (e) { try { viewEl.focus(); } catch (e2) {} } }
          $('#main').scrollIntoView({ block: 'start' });
          window.scrollTo(0, 0);
        }
        const go = (v) => setView(v);
        let navigationTimer=null;
        function unloadPlayer() {
          const player=$('#filmPlayer');
          if(player){state.watchPos=player.currentTime;player.pause();player.remove();player.removeAttribute('src');player.querySelectorAll('source').forEach(s=>s.remove());player.srcObject=null;player.load();save();}
          if(navigator.mediaSession){navigator.mediaSession.playbackState='none';navigator.mediaSession.metadata=null;}
        }
        function clearMovie() {
          unloadPlayer();
          watchTarget=null;watchStopAt=null;watchSceneId=null;watchAutoplay=false;
        }
        function navigate(v) {
          if(v===currentView&&navigationTimer==null)return;
          clearTimeout(navigationTimer);
          if(currentView==='watch'&&v!=='watch')clearMovie();
          viewEl.setAttribute('aria-busy','true');viewEl.classList.add('view-pending');$('#main').inert=true;
          navigationTimer=setTimeout(()=>go(v),350+Math.floor(Math.random()*301));
        }
        if(navigator.mediaSession){
          try{navigator.mediaSession.setActionHandler('play',()=>{const p=$('#filmPlayer');if(currentView==='watch'&&navigationTimer==null&&p?.isConnected)p.playClip();});
          navigator.mediaSession.setActionHandler('pause',()=>$('#filmPlayer')?.pause());
          navigator.mediaSession.setActionHandler('stop',()=>{const p=$('#filmPlayer');if(p){p.pause();p.currentTime=0;}watchStopAt=null;watchAutoplay=false;});}catch(e){}
        }

        function renderView() {
          for(const group of viewEl.querySelectorAll('details[data-filter-group]')){(group.dataset.filterScope==='selection'?selection:library).groups[group.dataset.mode][group.dataset.filterGroup]=group.open;}
          const active = document.activeElement;
          const owned = viewEl.contains(active);
          const key = owned && active.dataset ? { action:active.dataset.action, change:active.dataset.change, id:active.dataset.id, domId:active.id, kind:active.dataset.kind, value:active.value } : null;
          const fn = VIEWS[currentView] || VIEWS.overview;
          if ($('#filmPlayer')) unloadPlayer();
          viewEl.innerHTML = '';
          fn(viewEl);
          if (owned && key) {
            const candidates = [...viewEl.querySelectorAll('button,input,select,textarea')];
            const next = candidates.find(el=>!el.disabled && el.getClientRects().length && !el.closest('[hidden]') && (key.domId ? el.id===key.domId : ((key.action && el.dataset.action===key.action) || (key.change && el.dataset.change===key.change)) && (key.id == null || el.dataset.id===key.id) && (key.kind == null || el.dataset.kind===key.kind) && (key.value == null || el.value===key.value)));
            (next || viewEl.querySelector('[data-action="quizNext"]') || viewEl).focus({preventScroll:true});
          }
        }
        /* ================= VIEW STATE ================= */
        const flash = { deck: 'all', order: [], idx: 0, flipped: false, session: [], done: false, focus: null };
        const match = { category: 'technique', left: [], right: [], selL: null, selR: null, pairs: [], attempts: 0, wrong: false, done: false, timer: null };
        const quiz = { qs: [], idx: 0, picked: null, answers: [], done: false, len: 10, focus: 'all', effFocus: 'all' };
        const recall = { sceneId: null, checked: false };
        const facetKeys = ['char','analysis','mastery','tag','technique','importance'];
        const library = { q: '', char: [], tag: [], technique: [], importance: [], analysis: [], mastery: [], sort: 'film', open: false, groups:{phone:{},desktop:{}} };
        const libraryPhone=matchMedia('(max-width:640px)');
        const selection={q:'',char:[],tag:[],technique:[],importance:[],analysis:[],mastery:[],sort:'film',open:false,groups:{phone:{},desktop:{}}};
        function resetViewStates() {
          flash.deck = 'all'; flash.order = []; flash.idx = 0; flash.flipped = false; flash.session = []; flash.done = false; flash.focus = null;
          newMatchRound(); quiz.qs = []; quiz.idx = 0; quiz.picked = null; quiz.answers = []; quiz.done = false; quiz.partial = false;
          recall.sceneId = getScenes()[0] ? getScenes()[0].id : null; recall.checked = false;
          library.q = ''; for (const k of facetKeys) library[k] = []; library.sort = 'film'; library.open = false;
          library.groups={phone:{},desktop:{}};selection.q='';for (const k of facetKeys) selection[k]=[];selection.sort='film';selection.open=false;selection.groups={phone:{},desktop:{}};
        }

        /* ================= OVERVIEW ================= */
        function skillCount() {
          try { return bankMetadata().skills; }
          catch (e) { return 10; }
        }
        const strategies = () => [
          { t: 'Retrieval Practice', d: 'Try to recall a scene before flipping the card. The effort is what builds the memory — feedback comes after.', a: 'Try Flashcards', v: 'flashcards', icn: 'layers', tone: 'yellow' },
          { t: 'Spaced Practice', d: 'Honest card ratings schedule your next review from 10 minutes to 30 days. Revisit right before you forget.', a: 'See Your Review Schedule', v: 'progress', icn: 'chart', tone: 'sage' },
          { t: 'Interleaving', d: `${skillCount()} question skills — thesis matching, technique effects, analysis vs summary — mixed fresh every round, organized by theme.`, a: 'Take The Essay Quiz', v: 'quiz', icn: 'zap', tone: 'lavender' },
          { t: 'Elaborative Interrogation', d: 'Ask how and why a cinematic technique creates meaning — then check your explanation against the reference.', a: 'Explain A Scene', v: 'recall', icn: 'quote', tone: 'yellow' },
          { t: 'Concrete Examples', d: 'Anchor each big idea in specific scenes. Browse every moment with its artwork, themes, and film language.', a: 'Browse The Library', v: 'library', icn: 'grid', tone: 'sage' },
          { t: 'Watch The Film', d: 'Play the provided film with every selected scene as a chapter — jump straight to the moment you are studying.', a: 'Watch The Film', v: 'watch', icn: 'film', tone: 'lavender' },
        ];
        function vOverview(root) {
          const scenes = getScenes();
          const due = dueCount();
          const confident = scenes.filter((s) => masteryOf(s.id) === 'confident').length;
          const learning = scenes.filter((s) => masteryOf(s.id) === 'learning').length;
          root.innerHTML = `
            <section class="hero" aria-labelledby="heroTitle">
              <span class="hero-chip">${icon('film', 15)} ${esc(FILM_NAME)} · ${scenes.length} ${scenes.length === 1 ? 'Scene' : 'Scenes'} · Essay-Ready</span>
              <h1 id="heroTitle">Know Every Scene — And What It Proves.</h1>
              <p class="hero-sub">${esc('Build reliable recall and film-analysis skills through carefully authored scenes and practice.')}</p>
              <div class="hero-actions">
                <button class="button primary" data-action="nav" data-view="flashcards">${icon('layers', 17)} Study Flashcards</button>
                ${due > 0 ? `<button class="button yellow" data-action="studyDue">${icon('zap', 17)} Review ${due} Due</button>` : ''}
                <button class="button secondary" data-action="nav" data-view="watch">${icon('film', 16)} Watch The Film</button>
              </div>
            </section>
            <div class="stat-row" role="list">
              <div class="stat-tile ${due ? 'accent' : ''}" role="listitem"><div class="stat-num">${due}</div><div class="stat-label">Due For Review</div></div>
              <div class="stat-tile" role="listitem"><div class="stat-num">${confident}</div><div class="stat-label">Confident Scenes</div></div>
              <div class="stat-tile" role="listitem"><div class="stat-num">${learning}</div><div class="stat-label">Still Learning</div></div>
              <div class="stat-tile" role="listitem"><div class="stat-num">${state.activity.quizzes && state.activity.lastScore != null ? state.activity.lastScore + '%' : '—'}</div><div class="stat-label">Latest Quiz Score</div></div>
            </div>
            <div class="strategy-heading"><h2>Learn It Properly.</h2><span>Six ways in — each one is a proven study move.</span></div>
            <div class="strategy-grid">
              ${strategies().map((s) => `
                <button class="strategy-card" data-action="nav" data-view="${s.v}">
                  <span class="sc-top"><span class="activity-icon ${s.tone}">${icon(s.icn, 20)}</span></span>
                  <h3>${s.t}</h3>
                  <p>${s.d}</p>
                  <span class="sc-action">${s.a} ${icon('right', 15)}</span>
                </button>`).join('')}
            </div>
`;
        }

        /* ================= FLASHCARDS ================= */
        function flashPool() {
          const scenes = getScenes();
          if (flash.deck === 'due') return scenes.filter((s) => isDue(s.id));
          if (flash.deck === 'saved') return scenes.filter((s) => state.bookmarks.includes(s.id));
          if (flash.deck.startsWith('tag:')) { const t = flash.deck.slice(4); return scenes.filter((s) => tagsOf(s).includes(t)); }
          if (flash.deck === 'all') return scenes;
          return scenes.filter((s) => s.character === flash.deck);
        }
        function flashSetDeck(deck, doShuffle) {
          flash.deck = deck;
          const pool = flashPool();
          flash.order = (doShuffle ? shuffle(pool) : pool).map((s) => s.id);
          flash.idx = 0; flash.flipped = false; flash.session = []; flash.done = false; flash.focus = null;
        }
        function reconcileFlashDeck() {
          const currentCard=flash.order[flash.idx], poolIds=flashPool().map(s=>s.id), eligible=new Set(poolIds);
          flash.order=flash.order.filter(id=>eligible.has(id));
          const additions=poolIds.filter(id=>!flash.order.includes(id));flash.order.push(...additions);
          const retained=currentCard!=null&&flash.order.includes(currentCard);
          flash.idx=retained?flash.order.indexOf(currentCard):Math.min(flash.idx,Math.max(0,flash.order.length-1));
          if(!retained){flash.flipped=false;flash.done=false;}
          if(additions.length)flash.done=false;
        }
        function vFlashcards(root) {
          if (flash.focus) {
            const targetId = flash.focus;
            if (flash.order.indexOf(targetId) < 0) { flash.deck = 'all'; flashSetDeck('all', false); flash.focus = targetId; }
            const i = flash.order.indexOf(targetId);
            flash.idx = i >= 0 ? i : 0;
            flash.focus = null; flash.flipped = false; flash.done = false;
          }
          if (!flash.order.length && getScenes().length) flashSetDeck(flash.deck === 'saved' || flash.deck.startsWith('tag:') || flash.deck === 'due' || flash.deck === 'all' ? flash.deck : 'all', false);
          const scene = sceneById(flash.order[flash.idx]);
          const due = dueCount();
          const confident = getScenes().filter((s) => masteryOf(s.id) === 'confident').length;
          const learning = getScenes().filter((s) => masteryOf(s.id) === 'learning').length;
          const saved = scene ? state.bookmarks.includes(scene.id) : false;
          const charOpts = getCharacters();
          const tagOpts=getTagUniverse();
          if(flash.deck.startsWith('tag:')&&!tagOpts.includes(flash.deck.slice(4)))tagOpts.push(flash.deck.slice(4));
          root.innerHTML = `
            <div class="section-toolbar">
              <div><h2>Flashcards</h2><p class="section-sub">Think first. Flip second.</p></div>
              <div class="toolbar-actions">
                <button class="text-button" data-action="flashPrev" aria-label="Previous Card" ${scene ? '' : 'disabled'}><span aria-hidden="true">‹</span><span>Prev</span></button>
                <button class="text-button" data-action="flashNext" aria-label="Next Card" ${scene ? '' : 'disabled'}><span>Next</span><span aria-hidden="true">›</span></button>
                <button class="text-button" data-action="shuffleDeck" aria-label="Shuffle The Deck" ${flashPool().length < 2 ? 'disabled' : ''}>${icon('shuffle', 16)}<span>Shuffle</span></button>
                <span class="select-wrap"><select aria-label="Flashcard Deck" data-change="deck">
                  <option value="all" ${flash.deck === 'all' ? 'selected' : ''}>All Scenes (${getScenes().length})</option>
                  <option value="due" ${flash.deck === 'due' ? 'selected' : ''}>Due For Review (${due})</option>
                  <option value="saved" ${flash.deck === 'saved' ? 'selected' : ''}>Bookmarked (${getScenes().filter(s => state.bookmarks.includes(s.id)).length})</option>
                  ${charOpts.length ? `<optgroup label="Characters">${charOpts.map((c) => `<option value="${esc(c)}" ${flash.deck === c ? 'selected' : ''}>${esc(c)}</option>`).join('')}</optgroup>` : ''}
                  ${tagOpts.length ? `<optgroup label="Tags">${tagOpts.map((t) => `<option value="tag:${t}" ${flash.deck === 'tag:' + t ? 'selected' : ''}>${esc(tagLabel(t))} (${getScenes().filter(s=>tagsOf(s).includes(t)).length})</option>`).join('')}</optgroup>` : ''}
                </select>${icon('sliders', 14)}</span>
              </div>
            </div>
            ${scene ? `
            <div class="study-layout">
              <section aria-label="Flashcard Study Area">
                <div class="card-progress"><span class="card-count">${pad2(flash.idx + 1)} / ${pad2(flash.order.length)}</span><div class="match-progress"><i style="width:${Math.round(((flash.idx + 1) / flash.order.length) * 100)}%"></i></div></div>
                ${flash.done ? `
                <div class="flashcard complete-card">
                  <div class="completion-icon">${icon('check', 30)}</div>
                  <span class="eyebrow">Session Complete</span>
                  <h3>A Little Practice.<br/>A Stronger Memory.</h3>
                  <p>You reviewed ${plural(flash.session.length, 'scene')}. Your next reviews are scheduled — come back when they're due.</p>
                  <div class="hero-actions" style="justify-content:center">
                     <button class="button primary" data-action="restartDeck">${icon('rotate', 16)} Start This Deck Again</button>
                     <button class="button secondary" data-action="nav" data-view="progress">See Progress</button>
                  </div>
                </div>` : `
                <article class="flashcard ${flash.flipped ? 'flipping' : ''}" aria-label="Flashcard for scene ${scene.id}">
                    <div class="fc-top">
                      <span class="fc-scene-tag">${icon('film', 13)} Scene ${pad2(scene.id)}</span>
                      <span class="fc-time mono" title="Where this scene plays in the provided film">${sceneTimeLabel(scene.id)}</span>
                    <div class="fc-actions">
                      <button class="icon-button ${saved ? 'saved' : ''}" data-action="toggleBookmark" data-id="${scene.id}" aria-pressed="${saved}" aria-label="${saved ? 'Remove Bookmark' : 'Bookmark This Scene'}">${icon('bookmark', 19)}</button>
                      <button class="icon-button" data-action="flipCard" aria-label="${flash.flipped ? 'Show Question Side' : 'Reveal Answer'}">${icon('flip', 19)}</button>
                    </div>
                  </div>
                  ${!flash.flipped ? `
                    <div class="fc-art">${cueArt(scene.cue, scene.cueText)}</div>
                    <h3 class="fc-title">${esc(scene.title)}</h3>
                    ${importanceBadge(scene)}
                    <p class="fc-hint">What happens in this scene — and why does it matter?</p>
                    <p class="flip-hint">Press <kbd>Space</kbd> to flip</p>
                    <div class="rate-row" hidden></div>
                  ` : `
                    <h3 class="fc-fulltitle">${esc(scene.fullTitle)}</h3>
                    ${importanceBadge(scene)}
                    <p class="fc-desc">${esc(scene.description)}</p>
                    ${scene.keyLine ? `<p class="fc-keyline">“${esc(scene.keyLine)}”</p>` : ''}
                    <div class="fc-back-grid">
                      <div class="fc-block"><h4>${esc(displayHeading(scene.techniqueLabel,'Film Technique'))}</h4><p>${esc(scene.techniques)}</p></div>
                      <div class="fc-block"><h4>${esc(displayHeading(scene.meaningLabel,'Meaning & Effect'))}</h4><p>${esc(scene.essay)}</p></div>
                    </div>
                    ${techniqueChips(scene)}<div class="theme-chips">${scene.analysisType ? `<span class="theme-chip analysis-chip">${esc(scene.analysisType)}</span>` : ''}${tagsOf(scene).map((t) => tagChip(t)).join('')}</div>
                    <div class="rate-row">
                      ${[['again', 'Again', 'ok-soft'], ['good', 'Good', ''], ['easy', 'Easy', '']].map(([r, lbl]) => `
                        <button class="rate-btn ${r}" data-action="rate" data-rating="${r}" data-id="${scene.id}">
                          <span>${lbl}</span><small>${esc(nextIntervalText(scene.id, r))}</small>
                        </button>`).join('')}
                    </div>
                    <p class="flip-hint">Rate honestly — the schedule only works if you do. Keys: <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd></p>
                  `}
                </article>`}
              </section>
              <aside class="flash-aside" aria-label="Study Progress">
                <div class="aside-card">
                  <h3>Card Mastery</h3>
                  <div class="mastery-row"><span class="mastery-dot" style="background:#8a9a6a"></span>Confident<b>${confident}</b></div>
                  <div class="mastery-row"><span class="mastery-dot" style="background:#e8bd34"></span>Learning<b>${learning}</b></div>
                  <div class="mastery-row"><span class="mastery-dot" style="background:#d8dcd0"></span>Not started<b>${getScenes().length - confident - learning}</b></div>
                  <div class="mastery-bar">
                    <i style="width:${Math.round((confident / Math.max(1, getScenes().length)) * 100)}%;background:#8a9a6a"></i>
                    <i style="width:${Math.round((learning / Math.max(1, getScenes().length)) * 100)}%;background:#e8bd34"></i>
                  </div>
                </div>
                <div class="aside-card">
                  <h3>Keyboard Shortcuts</h3>
                  <div class="kbd-row"><span>Flip The Card</span><kbd>Space</kbd></div>
                  <div class="kbd-row"><span>Previous / Next</span><span><kbd>←</kbd> <kbd>→</kbd></span></div>
                  <div class="kbd-row"><span>Rate The Card</span><span><kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd></span></div>
                </div>
                <div class="aside-card">
                  <h3>Why Rate Honestly?</h3>
                  <p style="color:var(--muted);font-size:.9rem;line-height:1.6">“Again” brings a card back in 10 minutes. “Good” and “Easy” push it out up to 30 days — that spacing is what makes it stick.</p>
                </div>
              </aside>
            </div>` : `
            ${!getScenes().length ? emptyLibraryCta() : `<div class="empty-note"><p>${flash.deck === 'due' ? 'Nothing is due right now. Study your selected scenes again, or come back later.' : flash.deck === 'saved' ? 'No bookmarks yet. Bookmark scenes in the library to build your shortlist.' : flash.deck.startsWith('tag:') ? `No scenes carry the ${esc(tagLabel(flash.deck.slice(4)))} tag in your library.` : 'This deck is empty.'}</p>${flash.deck === 'due' ? '<button class="button primary" data-action="flashAll">Study All Scenes</button>' : flash.deck === 'saved' ? '<button class="button primary" data-action="nav" data-view="library">Browse Scene Library</button>' : '<button class="button primary" data-action="nav" data-view="selection">Choose Scenes</button>'}</div>`}`}`;
        }
        function flashRate(rating) {
          const id = flash.order[flash.idx];
          if (id == null || flash.done) return;
          rateCard(id, rating);
          if (!flash.session.includes(id)) flash.session.push(id);
          flash.flipped = false;
          if (flash.idx >= flash.order.length - 1) flash.done = true;
          else flash.idx++;
          renderNav(); renderView();
        }
        function flashNav(delta) {
          const n = flash.idx + delta;
          if (n < 0 || n >= flash.order.length) return;
          flash.idx = n; flash.flipped = false; flash.done = false;
          renderView();
        }

        /* ================= MATCHING ================= */
        function newMatchRound() {
          clearTimeout(match.timer); match.timer=null;
          match.selL=null;match.selR=null;match.pairs=[];match.attempts=0;match.wrong=false;match.done=false;
          const scenes = getScenes();
          if (scenes.length < 5) { match.left = []; match.right = []; return; }
          let pool = shuffle(scenes);
          if (match.category === 'tag') {
            const seen = new Set();
            pool = pool.filter((s) => { const t = tagsOf(s)[0]; if (!t || seen.has(t)) return false; seen.add(t); return true; });
            if (pool.length < 5) { match.left = []; match.right = []; return; }
          }
          const labelOf = (s) => match.category === 'technique' ? s.techniqueLabel : match.category === 'tag' ? tagLabel(tagsOf(s)[0] || 'merit') : s.meaningLabel;
          const seenLabels = new Set();
          const uniquePool = pool.filter((s) => { const lbl = labelOf(s); if (seenLabels.has(lbl)) return false; seenLabels.add(lbl); return true; });
          const picked = uniquePool.slice(0, 5);
          if (picked.length < 5) {match.left=[];match.right=[];return;}
          match.left = picked;
          match.right = shuffle(match.left);
          match.selL = null; match.selR = null; match.pairs = []; match.attempts = 0; match.wrong = false; match.done = false;
        }
        function rightLabel(s) { return match.category === 'technique' ? s.techniqueLabel : match.category === 'tag' ? tagLabel(tagsOf(s)[0] || 'merit') : s.meaningLabel; }
        function vMatching(root) {
          const scenes = getScenes();
          const enough = scenes.length >= 5 && match.left.length===5;
          root.innerHTML = `
            <div class="section-toolbar">
              <div><h2>Match &amp; Mix</h2><p class="section-sub">Connect a scene to the way it tells its story.</p></div>
              <span class="select-wrap"><select aria-label="Matching Category" data-change="matchCategory">
                <option value="technique" ${match.category === 'technique' ? 'selected' : ''}>Scene + Film Technique</option>
                <option value="meaning" ${match.category === 'meaning' ? 'selected' : ''}>Scene + Big Idea</option>
                <option value="tag" ${match.category === 'tag' ? 'selected' : ''}>Scene + Tag</option>
              </select>${icon('sliders', 14)}</span>
            </div>
            ${enough ? `
            <div class="activity-instructions">${icon('link', 18)}<p>Choose one item from each column. A correct pair stays connected.</p><span>${match.pairs.length} / 5 pairs</span></div>
            <div class="match-progress"><i style="width:${match.pairs.length * 20}%"></i></div>
            <div class="matching-grid">
              <div>
                <div class="column-label"><span>The Scene</span><span>5 Moments</span></div>
                <div class="match-list">
                  ${match.left.map((s) => `
                    <button class="match-item ${match.selL === s.id ? 'selected' : ''} ${match.pairs.includes(s.id) ? 'matched' : ''} ${match.wrong && match.selL === s.id ? 'wrong' : ''}"
                      data-action="pickLeft" data-id="${s.id}" aria-pressed="${match.selL === s.id}" ${match.pairs.includes(s.id) || match.wrong ? 'disabled' : ''}>
                      <span class="match-number">${pad2(s.id)}</span><strong>${esc(s.title)}</strong>
                      <small class="match-time mono">${sceneTimeLabel(s.id)}</small>
                      <span class="match-check">${match.pairs.includes(s.id) ? icon('check', 17) : ''}</span>
                    </button>`).join('')}
                </div>
              </div>
              <div class="matching-link" aria-hidden="true">${icon('link', 22)}</div>
              <div>
                <div class="column-label"><span>${match.category === 'technique' ? 'The Technique' : match.category === 'tag' ? 'The Tag' : 'The Big Idea'}</span><span>5 Connections</span></div>
                <div class="match-list">
                  ${match.right.map((s) => `
                    <button class="match-item right-item ${match.selR === s.id ? 'selected' : ''} ${match.pairs.includes(s.id) ? 'matched' : ''} ${match.wrong && match.selR === s.id ? 'wrong' : ''}"
                      data-action="pickRight" data-id="${s.id}" aria-pressed="${match.selR === s.id}"
                      aria-label="${match.category === 'technique' ? 'Technique' : match.category === 'tag' ? 'Tag' : 'Idea'}: ${esc(rightLabel(s))}"
                      ${match.pairs.includes(s.id) || match.wrong ? 'disabled' : ''}>
                      <strong>${esc(rightLabel(s))}</strong>
                      <span class="match-check">${match.pairs.includes(s.id) ? icon('check', 17) : ''}</span>
                    </button>`).join('')}
                </div>
              </div>
            </div>
            <div class="match-bottom" aria-live="polite">
              ${match.done ? `
                <div class="match-success">${icon('checkCircle', 26)}<div><h3>Everything Clicked.</h3><p>5 pairs in ${plural(match.attempts, 'attempt')}. Ready for a fresh mix?</p></div>
                <button class="button yellow" style="margin-left:auto" data-action="newMatch">${icon('shuffle', 16)} New Round</button></div>`
              : match.wrong ? `<p class="error-text">Not quite. Think about the ${match.category === 'technique' ? 'technique' : match.category === 'tag' ? 'tag' : 'idea'}, then try again.</p>`
              : match.selL || match.selR ? `<p>Now pick the ${match.selL ? (match.category === 'technique' ? 'technique' : match.category === 'tag' ? 'tag' : 'idea') : 'scene'} that connects.</p>`
              : `<p>Pick any scene to start matching.</p>`}
            </div>
            <div class="technique-footer">${icon('bulb', 18)}<div><strong>Concrete Examples</strong><p>Matching forces you to tell similar moments apart — the exact skill an essay question rewards.</p></div></div>`
            : `${!scenes.length ? emptyLibraryCta() : `<div class="empty-note"><p>${scenes.length < 5 ? `Match &amp; Mix needs at least 5 scenes, and your library has ${scenes.length}. Select more scenes to come back.` : match.category === 'tag' ? 'The tag round needs 5 scenes with five different primary tags — your library has fewer.' : 'Choose scenes with at least five distinct answers for this category, or try another category.'}</p><div class="hero-actions">${scenes.length >= 5 && match.category === 'tag' ? '<button class="button primary" data-action="matchTechniques">Try Film Techniques</button>' : ''}<button class="button secondary" data-action="nav" data-view="selection">Choose Scenes</button></div></div>`}`}`;
        }
        function matchPick(side, id) {
          if (match.wrong || match.done || match.pairs.includes(id)) return;
          if (side === 'L') { match.selL = match.selL === id ? null : id; }
          else { match.selR = match.selR === id ? null : id; }
          if (match.selL != null && match.selR != null) {
            match.attempts++;
            if (match.selL === match.selR) {
              match.pairs.push(match.selL);
              match.selL = null; match.selR = null;
              if (match.pairs.length === 5) { match.done = true; state.activity.matches++; recordHistory('matching'); save(); markStudied(); }
            } else {
              match.wrong = true;
              match.timer=setTimeout(() => { match.timer=null;match.wrong=false;match.selL=null;match.selR=null;if(currentView==='matching')renderView(); },650);
            }
          }
          renderView();
        }

        /* ================= QUIZ — essay-focused question engine ================= */
        const BARRIERS = [
          { tag: 'racism', theme:'discrimination', text: 'Racism built into rules and spaces' },
          { tag: 'sexism', theme:'discrimination', text: 'Assumptions about what women can do' },
          { tag: 'injustice', theme:'discrimination', text: 'Bureaucratic gatekeeping and red tape' },
          { tag: 'technology', theme:'spacerace', text: 'The disruption of new technology' },
          { tag: 'coldwar', theme:'spacerace', text: 'Geopolitical pressure of the space race' },
        ];
        const sceneText = (s) => `${pad2(s.id)} — ${s.title}`;
        function distractorPool(n, excludeIds, prefer) {
          const scenes = getScenes();
          let pool = scenes.filter((s) => !excludeIds.includes(s.id) && (!prefer || prefer(s)));
          return shuffle(pool).slice(0, n);
        }
        function optionSet(textFn, pairs) {
          // pairs: [{ id, scene }] or [{ id, text }] -> options with unique text; null if fewer than 3 unique texts
          const items = pairs.map((p) => ({ id: p.id, text: p.text != null ? p.text : textFn(p.scene) }));
          const seen = new Set();
          for (const it of items) { if (seen.has(it.text)) return null; seen.add(it.text); }
          return items;
        }
        function buildBank() {
          const scenes = getScenes();
          const bank = [];
          const push = (q) => { if (q && q.options && q.options.length >= 3) bank.push(q); };
          const sceneQ = (scene, ds, textFn) => optionSet(textFn || sceneText, [{ id: scene.id, scene }, ...ds.map((s) => ({ id: s.id, scene: s }))]);

          /* 1 · ARGUMENT → EVIDENCE — match a thesis to its strongest scene */
          THESES.forEach((th) => {
            const scene = sceneById(th.scene); if (!scene) return;
            const ds = distractorPool(3, [scene.id], (s) => !tagsOf(s).includes(th.tags[0]));
            const opts = sceneQ(scene, ds); if (!opts) return;
            push({ kind: 'thesis', kindLabel: 'Argument → Evidence', tag: th.tags[0], scene,
              prompt: 'Which scene is your strongest evidence for this essay argument?',
              clue: `“${th.text}”`, options: shuffle(opts), answer: scene.id,
              explanation: `${scene.fullTitle} — ${scene.essay} That is why it anchors an argument about ${th.tags.map((t) => tagLabel(t).toLowerCase()).join(' and ')}.` });
          });

          /* 2 · THEME EVIDENCE — one question per (scene, tag) pair */
          scenes.forEach((scene) => {
            tagsOf(scene).forEach((tag) => {
              const ds = distractorPool(3, [scene.id], (s) => !tagsOf(s).includes(tag));
              const opts = sceneQ(scene, ds); if (!opts) return;
              push({ kind: 'theme', kindLabel: 'Theme Evidence', tag, scene,
                prompt: `Which of these scenes develops the idea of ${tagLabel(tag).toLowerCase()}?`,
                clue: `${tagLabel(tag)} — ${tagDef(tag)}.`, options: shuffle(opts), answer: scene.id,
                explanation: `Scene ${pad2(scene.id)}, “${scene.title}”, carries this idea: ${scene.essay}` });
            });
          });

          /* 3 · TECHNIQUE → EFFECT — link film language to meaning */
          scenes.forEach((scene) => {
            const ds = distractorPool(3, [scene.id], (s) => !tagsOf(s).some((t) => tagsOf(scene).includes(t)));
            const opts = sceneQ(scene, ds, (s) => s.meaningLabel); if (!opts) return;
            push({ kind: 'tech', kindLabel: 'Technique → Effect', tag: tagsOf(scene)[0] || null, scene,
              prompt: `In “${scene.title}”, the filmmakers rely on ${lower1(scene.techniqueLabel)}. What is the main effect of that choice?`,
              clue: 'Pick the meaning the technique creates — not just what happens.',
              options: shuffle(opts), answer: scene.id,
              explanation: `${scene.techniques} This is what the technique achieves: ${scene.meaningLabel}. ${scene.essay}` });
          });

          /* 4 · TOPIC SENTENCE — state the argument of a paragraph */
          scenes.forEach((scene) => {
            const ds = distractorPool(3, [scene.id], (s) => !tagsOf(s).some((t) => tagsOf(scene).includes(t)));
            const opts = sceneQ(scene, ds, (s) => s.meaningLabel); if (!opts) return;
            push({ kind: 'topic', kindLabel: 'Topic Sentence', tag: tagsOf(scene)[0] || null, scene,
              prompt: `Which topic sentence opens the strongest analytical paragraph on “${scene.title}”?`,
              clue: scene.cueText || scene.description.slice(0, 140),
              options: shuffle(opts), answer: scene.id,
              explanation: `A topic sentence states the argument up front: “${scene.meaningLabel}.” ${scene.essay}` });
          });

          /* 5 · BARRIER ANALYSIS — name the force the scene dramatises */
          scenes.forEach((scene) => {
            const st = scene.barrierTypes||[];
            const hit = BARRIERS.find((b) => st.includes(b.tag)); if (!hit) return;
            const ds = BARRIERS.filter((b) => b !== hit && !st.includes(b.tag)).slice(0, 3);
            if (ds.length < 2) return;
            push({ kind: 'barrier', kindLabel: 'Barrier Analysis', tag: hit.theme, scene,
              prompt: `What kind of barrier does “${scene.title}” put on screen?`,
              clue: 'Name the force the scene is really about.',
              options: shuffle([{ id: scene.id, text: hit.text }, ...ds.map((b, i) => ({ id: -(i + 1), text: b.text }))]),
              answer: scene.id,
              explanation: `${scene.essay} The barrier dramatised here is ${lower1(hit.text)}.` });
          });

          /* 6 · ANALYSIS OR SUMMARY — the skill markers actually grade */
          scenes.forEach((scene) => {
            const first = (scene.description.match(/^[^.]+\./) || [scene.description])[0].trim();
            const correct = `${scene.meaningLabel} — achieved through ${lower1(scene.techniqueLabel)}.`;
            const opts = optionSet((p) => p.text, [
              { id: scene.id, text: correct },
              { id: -11, text: first },
              { id: -12, text: `${scene.character} appears in this scene, which is part of the ${FILM_NAME} storyline.` },
              { id: -13, text: 'This scene is very powerful and emotional, which makes it important.' },
            ]); if (!opts) return;
            push({ kind: 'analysis', kindLabel: 'Analysis Or Summary?', tag: tagsOf(scene)[0] || null, scene,
              prompt: `You are writing a paragraph on “${scene.title}”. Which sentence is real analysis?`,
              clue: 'Analysis names a technique and its effect. Everything else is filler.',
              options: shuffle(opts), answer: scene.id,
              explanation: `The analytical sentence names the technique (${lower1(scene.techniqueLabel)}) and states its effect (${lower1(scene.meaningLabel)}). The others only summarise the plot, repeat a fact, or share an opinion.` });
          });

          /* 7 · BUILDING A PARAGRAPH — find a second, supporting example */
          scenes.forEach((scene) => {
            tagsOf(scene).forEach((tag) => {
              const partners = scenes.filter((s) => s.id !== scene.id && tagsOf(s).includes(tag));
              if (!partners.length) return;
              const partner = shuffle(partners)[0];
              const ds = distractorPool(3, [scene.id, partner.id], (s) => !tagsOf(s).includes(tag));
              const opts = sceneQ(partner, ds); if (!opts) return;
              push({ kind: 'pair', kindLabel: 'Building A Paragraph', tag, scene: partner,
                prompt: `Your paragraph on ${tagLabel(tag).toLowerCase()} uses “${scene.title}”. Which scene adds a second example?`,
                clue: `${tagDef(tag).charAt(0).toUpperCase() + tagDef(tag).slice(1)}. A second example from another story shows the pattern, not a one-off.`,
                options: shuffle(opts), answer: partner.id,
                explanation: `“${partner.title}” develops the same idea${partner.character && scene.character && partner.character !== scene.character ? ` through ${partner.character}` : ''}: ${partner.essay}` });
            });
          });

          /* 8 · TURNING POINTS — structure of the film's argument */
          TURNING_POINTS.forEach((tp) => {
            const scene = sceneById(tp.scene); if (!scene) return;
            const ds = distractorPool(3, [scene.id]);
            const opts = sceneQ(scene, ds); if (!opts) return;
            push({ kind: 'turning', kindLabel: 'Turning Points', tag: tagsOf(scene)[0] || null, scene,
              prompt: 'Which scene marks the moment when…',
              clue: `…${tp.text}?`, options: shuffle(opts), answer: scene.id,
              explanation: `Scene ${pad2(scene.id)}, “${scene.title}”: ${scene.essay}` });
          });

          /* 9 · COUNTER-CLAIMS — test a claim against the evidence */
          NUANCES.forEach((n) => {
            const scene = sceneById(n.scene); if (!scene) return;
            const ds = distractorPool(3, [scene.id]);
            const opts = sceneQ(scene, ds); if (!opts) return;
            push({ kind: 'counter', kindLabel: 'Counter-Claims', tag: tagsOf(scene)[0] || null, scene,
              prompt: 'A classmate writes this in their essay draft. Which scene most complicates the claim?',
              clue: `“${n.claim}”`, options: shuffle(opts), answer: scene.id,
              explanation: `${n.why} That is exactly what “${scene.title}” shows: ${scene.essay}` });
          });

          /* 10 · SCOPE DISCIPLINE — keep every scene on-topic */
          getTagUniverse().forEach((tag) => {
            const tagged = scenes.filter((s) => tagsOf(s).includes(tag));
            const untagged = scenes.filter((s) => !tagsOf(s).includes(tag));
            if (tagged.length < 3 || untagged.length < 1) return;
            shuffle(untagged).slice(0, 2).forEach((scene) => {
              const ds = shuffle(tagged.filter((s) => s.id !== scene.id)).slice(0, 3);
              if (ds.length < 3) return;
              const opts = sceneQ(scene, ds); if (!opts) return;
              push({ kind: 'scope', kindLabel: 'Scope Discipline', tag, scene,
                prompt: `Your whole essay is about ${tagLabel(tag).toLowerCase()} — ${tagDef(tag)}. Which scene is LEAST useful as evidence?`,
                clue: 'Every scene you quote must serve the argument. One of these does not belong.',
                options: shuffle(opts), answer: scene.id,
                explanation: `“${scene.title}” is about ${tagsOf(scene).length ? tagsOf(scene).map((t) => tagLabel(t).toLowerCase()).join(', ') : 'other ideas'} — not ${tagLabel(tag).toLowerCase()}. The other three scenes all develop it.` });
              });
          });
          return bank;
        }
        function newQuiz() {
          const bank = buildBank();
          let pool = quiz.focus !== 'all' ? bank.filter((q) => q.tag === quiz.focus) : bank;
          quiz.effFocus = pool.length >= 4 ? quiz.focus : 'all';
          if (pool.length < 4) pool = bank;
          const count = quiz.len === 'all' ? pool.length : Math.min(quiz.len, pool.length);
          quiz.qs = shuffle(pool).slice(0, count);
          quiz.idx = 0; quiz.picked = null; quiz.answers = []; quiz.done = false; quiz.partial = false;
        }
        let cachedBankMetadata=null;
        function bankMetadata() {
          const key=getScenes().map(s=>s.id).join(',');
          if(cachedBankMetadata?.key!==key){const bank=buildBank();cachedBankMetadata={key,size:bank.length,skills:new Set(bank.map(q=>q.kind)).size};}
          return cachedBankMetadata;
        }
        function vQuiz(root) {
          const scenes = getScenes();
          if (scenes.length < 4) { root.innerHTML = !scenes.length ? emptyLibraryCta() : `<div class="empty-note"><p>The Essay Quiz needs at least 4 scenes so it can offer real choices. Your library has ${scenes.length}.</p><button class="button primary" data-action="nav" data-view="selection">Choose Scenes</button></div>`; return; }
          if (!quiz.qs.length) {
            const bankSize = bankMetadata().size;
            const tags = getTagUniverse();
            if(quiz.focus!=='all'&&!tags.includes(quiz.focus))quiz.focus='all';
            root.innerHTML = `
            <div class="section-toolbar">
              <div><h2>Essay Quiz</h2><p class="section-sub">Every question rehearses a skill your essay needs — evidence, analysis, and the links between them.</p></div>
              <span class="quiet-tag">${bankSize}-Question Bank</span>
            </div>
            <div class="quiz-setup">
              <div class="setup-card">
                <span class="eyebrow">What You Practise</span>
                <div class="setup-grid">
                  ${[['quote', 'Argument → Evidence', 'Match a thesis statement to the scene that proves it.'],
                     ['film', 'Technique → Effect', 'Name what a camera or editing choice actually achieves.'],
                     ['bulb', 'Analysis Vs Summary', 'Tell analytical sentences apart from plot recap.'],
                     ['link', 'Scene Pairing', 'Build a paragraph from two scenes that share an idea.'],
                     ['eye', 'Barrier Analysis', 'Classify the force a scene dramatises — racism, sexism, red tape…'],
                     ['alert', 'Counter-Claims', 'Test oversimplified claims against the best counter-evidence.']].map(([icn, t, d]) => `
                  <div class="setup-item"><span class="setup-icn">${icon(icn, 18)}</span><div><b>${t}</b><p>${d}</p></div></div>`).join('')}
                </div>
                <div class="technique-footer" style="margin-top:4px">${icon('bulb', 18)}<div><strong>No Trivia, No Name-Dropping.</strong><p>Questions never ask who said what — they ask what a scene <em>does</em> for an essay: prove a point, carry a theme, or resist an idea.</p></div></div>
              </div>
              <div class="aside-card setup-controls">
                <h3>Set Up Your Round</h3>
                <label class="setup-label" for="quizLenSelect">Questions</label>
                <span class="select-wrap"><select id="quizLenSelect" aria-label="Number Of Questions" data-change="quizLen">
                  ${[10, 20, 30].map((n) => `<option value="${n}" ${quiz.len === n ? 'selected' : ''}>${n} Questions</option>`).join('')}
                  <option value="all" ${quiz.len === 'all' ? 'selected' : ''}>Everything (${bankSize})</option>
                </select>${icon('sliders', 14)}</span>
                <label class="setup-label" for="quizFocusSelect">Focus</label>
                <span class="select-wrap"><select id="quizFocusSelect" aria-label="Question Focus" data-change="quizFocus">
                  <option value="all" ${quiz.focus === 'all' ? 'selected' : ''}>Mixed Essay Skills</option>
                  ${tags.map((t) => `<option value="${t}" ${quiz.focus === t ? 'selected' : ''}>${esc(tagLabel(t))}</option>`).join('')}
                </select>${icon('sliders', 14)}</span>
                <button class="button primary" data-action="quizStart" style="margin-top:16px">${icon('zap', 16)} Start The Round</button>
                <p class="setup-note">Use the same scene tags you study in the Scene Library.</p>
              </div>
            </div>`;
            return;
          }
          const q = quiz.qs[quiz.idx];
          const score = quiz.answers.filter((a) => a.correct).length;
          if (quiz.done) {
            const missedScenes = new Map();
            quiz.answers.filter(a => !a.correct).forEach(a => missedScenes.set(a.id, (missedScenes.get(a.id) || 0) + 1));
            const skills = {};
            quiz.qs.forEach((qq, i) => { const a = quiz.answers[i]; if (!a) return; const key = qq.kindLabel; (skills[key] = skills[key] || { ok: 0, n: 0 }); skills[key].n++; if (a.correct) skills[key].ok++; });
            const types = {};
            quiz.qs.forEach((qq, i) => { const a = quiz.answers[i]; if (!a || !qq.scene || !qq.scene.analysisType) return; const key = qq.scene.analysisType; (types[key] = types[key] || { ok: 0, n: 0 }); types[key].n++; if (a.correct) types[key].ok++; });
            root.innerHTML = `
            <div class="section-toolbar">
              <div><h2>Essay Quiz</h2><p class="section-sub">${quiz.partial ? 'Partial round — ended early. Here is what the answered questions say about your essay readiness.' : 'Round complete — here is what the results say about your essay readiness.'}</p></div>
              <span class="quiet-tag">${quiz.qs.length} Questions${quiz.partial ? ' · Partial' : ''}</span>
            </div>
            <div class="quiz-results">
              <div class="result-top">
                <div class="completion-icon">${icon('zap', 30)}</div>
                <span class="eyebrow">Your Recall, In Focus</span>
                <h3>${score === quiz.qs.length ? 'Essay-Ready.' : score >= quiz.qs.length * 0.7 ? 'The Connections Are Holding.' : 'The Links Need Another Pass.'}</h3>
                <div class="quiz-score"><b>${score}</b><span>/ ${quiz.qs.length}</span></div>
                <p>${score === quiz.qs.length ? 'A perfect round. Come back later to make it last.' : 'The scenes below deserve another look. Getting feedback is part of learning.'}</p>
                <div class="skill-breakdown" aria-label="Score By Question Skill">
                  <span class="breakdown-cap">By Question Skill</span>
                  ${Object.entries(skills).map(([lbl, v]) => `
                    <div class="skill-row ${v.ok === v.n ? 'perfect' : v.ok === 0 ? 'weak' : ''}"><span>${esc(lbl)}</span><span class="skill-score"><b>${v.ok}</b>/${v.n}</span></div>`).join('')}
                </div>
                ${Object.keys(types).length ? `
                <div class="skill-breakdown" aria-label="Score By Essay Type">
                  <span class="breakdown-cap">By Essay Type</span>
                  ${Object.entries(types).map(([lbl, v]) => `
                    <div class="skill-row ${v.ok === v.n ? 'perfect' : v.ok === 0 ? 'weak' : ''}"><span>${esc(lbl)}</span><span class="skill-score"><b>${v.ok}</b>/${v.n}</span></div>`).join('')}
                </div>` : ''}
                <details class="answer-review">
                  <summary>Review Every Question</summary>
                  <div class="review-list">
                    ${quiz.qs.map((qq, i) => {
                      const a = quiz.answers[i];
                      if (!a) return '';
                      return `<div class="review-row ${a.correct ? 'ok' : 'bad'}">
                        <span class="review-mark" aria-label="${a.correct ? 'Correct' : 'Incorrect'}">${a.correct ? icon('check', 15) : icon('x', 15)}</span>
                        <div class="review-body"><span class="review-kind">${esc(qq.kindLabel)}${qq.tag ? ` · ${esc(tagLabel(qq.tag))}` : ''}</span>
                        <b>${esc(qq.prompt)}</b>
                        <p class="review-exp">${esc(qq.explanation)}</p></div>
                      </div>`;
                    }).join('')}
                  </div>
                </details>
                <button class="button primary" data-action="newQuiz">${icon('shuffle', 16)} Set Up A New Round</button>
                ${quiz.answers.some((a) => !a.correct) ? `<button class="button secondary" data-action="quizRetry" style="margin-top:10px">${icon('rotate', 16)} Retry Missed (${quiz.answers.filter((a) => !a.correct).length} Questions)</button>` : ''}
              </div>
              ${missedScenes.size ? `
              <div class="missed-scenes">
                <span class="eyebrow">Revisit These Moments</span>
                ${Array.from(missedScenes, ([id, count]) => {
                  const s = sceneById(id);
                  return s ? `<button class="revisit-row" data-action="studyScene" data-id="${s.id}"><span class="mono">${pad2(s.id)} · ${sceneTimeLabel(s.id)}</span><strong>${esc(s.title)}</strong><span>${count} missed ${count === 1 ? 'question' : 'questions'} · Study Scene ${icon('right', 15)}</span></button>` : '';
                }).join('')}
              </div>` : ''}
            </div>`;
            return;
          }
          root.innerHTML = `
            <div class="section-toolbar">
              <div><h2>Essay Quiz</h2><p class="section-sub">${quiz.effFocus === 'all' ? 'Mixed Essay Skills.' : `Focused on ${esc(tagLabel(quiz.effFocus).toLowerCase())}.`}</p></div>
              <button class="text-button" data-action="newQuiz" aria-label="Back To Round Setup">${icon('sliders', 15)} Setup</button>
            </div>
            <div class="quiz-topline"><span>Question <b>${quiz.idx + 1}</b> of ${quiz.qs.length}</span><span class="mono">${esc(q.kindLabel)}</span><span class="quiz-live">Correct ${score} · Answered ${quiz.answers.length}</span>${quiz.answers.length ? `<button class="text-button" data-action="quizEndEarly">End Round Early</button>` : ''}</div>
            <div class="match-progress"><i style="width:${Math.round((quiz.idx / quiz.qs.length) * 100)}%"></i></div>
            <section class="quiz-body" aria-label="Quiz Question">
              ${q.tag ? `<div class="quiz-tagrow">${tagChip(q.tag)}</div>` : ''}
              <h3>${esc(q.prompt)}</h3>
              <p class="quiz-clue ${q.kind !== 'tech' && q.kind !== 'topic' && q.kind !== 'barrier' && q.kind !== 'analysis' ? 'scene-name' : ''}">${esc(q.clue)}</p>
              <div class="quiz-options">
                ${q.options.map((o, i) => {
                  const isAns = o.id === q.answer;
                  const picked = quiz.picked === o.id;
                  const cls = quiz.picked == null ? '' : isAns ? 'correct' : picked ? 'incorrect' : '';
                  return `<button class="quiz-option ${cls}" data-action="quizPick" data-id="${o.id}" ${quiz.picked != null ? 'disabled' : ''}>
                    <span class="option-letter">${String.fromCharCode(65 + i)}</span><span>${esc(o.text)}</span>
                    ${quiz.picked != null && isAns ? `<span class="opt-check">${icon('check', 18)}</span>` : quiz.picked != null && picked ? `<span class="opt-check">${icon('x', 18)}</span>` : ''}
                  </button>`;
                }).join('')}
              </div>
              ${quiz.picked != null ? `
              <div class="quiz-feedback ${quiz.picked === q.answer ? 'positive' : 'negative'}" role="status">
                <strong>${quiz.picked === q.answer ? 'Exactly. Here is the connection.' : 'Not quite. Here is what to remember.'}</strong>
                ${esc(q.explanation)}
              </div>
              <div class="quiz-actions">                <button class="button primary" data-action="quizNext">${quiz.idx === quiz.qs.length - 1 ? 'See Results' : 'Next Question'} ${icon('right', 16)}</button></div>` : ''}
            </section>`;
        }
        function quizPick(id) {
          const q = quiz.qs[quiz.idx];
          if (quiz.picked != null) return;
          quiz.picked = id;
          quiz.answers.push({ id: q.scene.id, correct: id === q.answer });
          renderView();
        }
        function quizNext() {
          if (quiz.idx >= quiz.qs.length - 1) {
            quiz.done = true;
            state.activity.quizzes++;
            state.activity.lastScore = Math.round((quiz.answers.filter((a) => a.correct).length / quiz.qs.length) * 100);
            recordHistory('quiz', null, state.activity.lastScore);
            save(); markStudied();
          } else { quiz.idx++; quiz.picked = null; }
          renderView();
        }
        /* ================= RECALL ================= */
        function vRecall(root) {
          const scenes = getScenes();
          if (!scenes.length) { root.innerHTML = emptyLibraryCta(); return; }
          if (recall.sceneId == null || !sceneById(recall.sceneId)) recall.sceneId = scenes[0].id;
          const scene = sceneById(recall.sceneId);
          const note = state.notes[scene.id] ?? '';
          root.innerHTML = `
            <div class="section-toolbar">
              <div><h2>Recall &amp; Explain</h2><p class="section-sub">Make the connection in your own words.</p></div>
              <span class="quiet-tag">${state.activity.explanations.filter((x) => sceneById(x)).length} Of ${scenes.length} Explained</span>
              <span class="select-wrap"><select aria-label="Choose A Scene To Explain" data-change="recallScene">
                ${scenes.map((s) => `<option value="${s.id}" ${s.id === scene.id ? 'selected' : ''}>${pad2(s.id)} — ${esc(s.title)}</option>`).join('')}
              </select>${icon('sliders', 14)}</span>
              <span class="mono recall-time" title="Where this scene plays in the provided film">${sceneTimeLabel(scene.id)}</span>
            </div>
            <div class="recall-layout">
              <div class="writing-area">
                <span class="eyebrow">The Why Behind The Moment</span>
                <h3>${esc(essayPromptFor(scene))}</h3>
                <p class="writing-prompt">Recall a specific moment, name a cinematic technique, and explain its effect. Don't peek at the reference just yet.</p>
                <div class="essay-angle">${icon('tag', 15)}<span><b>Focus Tags:</b> ${tagsOf(scene).map((t) => tagChip(t)).join(' ')}</span></div>
                <label for="recallAnswer">Your Explanation</label>
                <textarea id="recallAnswer" rows="9" maxlength="100000" placeholder="In this scene, the director uses… This helps the audience understand…">${esc(note)}</textarea>
                <div class="writing-meta">
                  <span>${note.trim() ? note.trim().split(/\s+/).length : 0} / 40 words</span>
                  <span class="word-target"><i style="width:${Math.min(100, Math.round(((note.trim() ? note.trim().split(/\s+/).length : 0) / 40) * 100))}%"></i></span>
                  <span id="draftStatus" role="status">${storageWarning ? 'Draft Could Not Be Saved' : saveTimer ? 'Saving Draft…' : note.trim() ? 'Draft Saved' : 'Draft Ready'}</span>
                </div>
                <div class="writing-actions">
                  <button class="button primary" ${note.trim() ? '' : 'disabled'} data-action="checkRecall">${recall.checked ? 'Save Explanation' : 'Check My Explanation'} ${icon('right', 16)}</button>
                  <button class="text-button" data-action="newRecallPrompt">${icon('shuffle', 15)} New Prompt</button>
                  ${note.trim() ? `<button class="text-button" data-action="clearRecallAsk">Clear Draft</button>` : ''}
                </div>
              </div>
              <aside class="explanation-reference">
                ${recall.checked ? `
                <div class="reference-panel">
                  <span class="eyebrow">Check Your Connection</span>
                  <h3>${esc(scene.title)}</h3>
                  ${scene.analysisType ? `<p class="ref-analysis"><span class="theme-chip analysis-chip">${esc(scene.analysisType)}</span></p>` : ''}
                  <div class="answer-block"><span class="answer-label">${esc(displayHeading(scene.techniqueLabel,'Film Technique'))}</span><p>${esc(scene.techniques)}</p></div>
                  <div class="answer-block"><span class="answer-label">${esc(displayHeading(scene.meaningLabel,'Meaning & Effect'))}</span><p>${esc(scene.essay)}</p></div>
                  <div class="self-check">
                    <strong>A Quick Self-Check</strong>
                    ${['I used a specific scene detail.', 'I identified a cinematic technique.', 'I explained its effect and meaning.'].map((c) => `
                      <label><input type="checkbox" data-check="selfCheck"/><span>${c}</span></label>`).join('')}
                    <small>This is a self-check, not an automated grade.</small>
                  </div>
                </div>` : `
                <div class="reference-aside">
                  <div class="reference-art">${cueArt(scene.cue, scene.cueText)}</div>
                  <h3>A Thought, Not A Transcript.</h3>
                  <p>Good analysis explains <em>how</em> a film technique creates meaning. Exact wording is not the goal.</p>
                  <div class="reference-hint">${icon('bulb', 18)}<p>Try saying your explanation aloud before you write it.</p></div>
                </div>`}
              </aside>
            </div>
            <div class="technique-footer">${icon('quote', 18)}<div><strong>Elaborative Interrogation</strong><p>Asking "how?" and "why?" links new information to ideas you already understand. Always check your explanation.</p></div></div>`;
        }
        function recallCheck() {
          const ta = $('#recallAnswer');
          const text = ta ? ta.value : (state.notes[recall.sceneId] || '');
          if (!text.trim()) return;
          state.notes[recall.sceneId] = text;
          if (!state.activity.explanations.includes(recall.sceneId)) state.activity.explanations.push(recall.sceneId);
          recordHistory('explanation', recall.sceneId);
          save(); markStudied();
          recall.checked = true;
          const saved = saveNow();
          renderView();
          if (saved) toast('Explanation saved. Compare the ideas, not exact wording.', 'checkCircle');
        }

        /* ================= LIBRARY ================= */
        function emptyLibraryCta() {
          return `<div class="empty-cta"><div class="empty-cta-art">${icon('grid', 30)}</div><h3>No Scenes Selected Yet</h3><p>Your library is empty, so there is nothing to study. Choose scenes from the built-in catalogue of ${BUILTIN_SCENES.length} to begin.</p><button class="button primary" data-action="nav" data-view="selection">${icon('right', 16)} Choose Scenes</button></div>`;
        }

        const sceneHay = s => `${s.id} ${s.title} ${s.fullTitle} ${s.description} ${s.character} ${tagsOf(s).join(' ')} ${tagsOf(s).map(tagLabel).join(' ')} ${s.cueText||''} ${s.techniqueLabel||''} ${s.meaningLabel||''} ${s.techniques||''} ${s.essay||''} ${s.keyLine||''} ${s.watchFor||''} ${s.historyNote||''} ${s.essayStarter||''} ${techniquesOf(s).map(techniqueLabel).join(' ')}`.toLowerCase();
        const sceneSearch = new Map(BUILTIN_SCENES.map(s=>[s.id,sceneHay(s)]));
        const facetValues = (s,k) => k==='char' ? [s.character] : k==='analysis' ? [s.analysisType] : k==='tag' ? tagsOf(s) : k==='technique' ? techniquesOf(s) : k==='importance' ? [String(importanceOf(s))] : [masteryOf(s.id),...(state.bookmarks.includes(s.id)?['saved']:[])];
        function matchesFilters(s, except=null) {
          return (!library.q.trim() || sceneSearch.get(s.id).includes(library.q.trim().toLowerCase())) && facetKeys.every(k=>k===except||!library[k].length||library[k].some(v=>facetValues(s,k).includes(v)));
        }
        const filmSort = (a,b) => ((Number.isFinite(a.timestamps?.start)?a.timestamps.start:Infinity)-(Number.isFinite(b.timestamps?.start)?b.timestamps.start:Infinity)) || a.id-b.id;
        function filteredScenes() {
          const list=getScenes().filter(s=>matchesFilters(s)); const rank={new:0,learning:1,confident:2};
          return list.sort(library.sort==='importance'?(a,b)=>importanceOf(b)-importanceOf(a)||filmSort(a,b):library.sort==='az'?(a,b)=>a.title.localeCompare(b.title)||a.id-b.id:library.sort==='weak'?(a,b)=>rank[masteryOf(a.id)]-rank[masteryOf(b.id)]||filmSort(a,b):filmSort);
        }
        const facetLabels={char:'Character',analysis:'Essay Type',mastery:'Study Status',tag:'Themes',technique:'Techniques',importance:'Importance'};
        const valueLabel=(k,v)=>k==='tag'?tagLabel(v):k==='technique'?techniqueLabel(v):k==='importance'?`${v}/10`:k==='mastery'?({new:'Not Started',learning:'Learning',confident:'Confident',saved:'Bookmarked'}[v]||v):v;
        const activeFilterCount=()=>facetKeys.reduce((n,k)=>n+library[k].length,0);
        function libraryCountHTML(scenes) { return `Showing ${scenes.length} of ${plural(getScenes().length,'scene')}.`; }
        function activePillsHTML() {
          const entries=facetKeys.flatMap(k=>library[k].map(v=>({k,v,label:valueLabel(k,v)})));
          if(library.q.trim()) entries.unshift({k:'q',v:'',label:`Search: “${library.q.trim()}”`});
          return entries.length ? `<div class="active-pills" aria-label="Active Filters">${entries.map(x=>`<button class="active-pill" data-action="libClearOne" data-kind="${x.k}" data-value="${esc(x.v)}" aria-label="Remove ${esc(x.label)} Filter">${esc(x.label)} ${icon('x',14)}</button>`).join('')}</div>` : '';
        }
        function renderFilterablePreservingFocus(action,fallback,kind='',value='') {
          const scroll=window.scrollY; renderView();
          const candidates=[...viewEl.querySelectorAll('[data-action], [data-change]')];
          const target=candidates.find(el=>(el.dataset.action===action||el.dataset.change===action)&&(!kind||el.dataset.kind===kind)&&(!value||el.value===value));
          const summary=kind?viewEl.querySelector(`details[data-filter-group="${kind}"] summary`):null;
          (target||summary||viewEl.querySelector(`[data-action="${fallback}"]`))?.focus({preventScroll:true}); window.scrollTo(0,scroll);
        }
        function renderLibraryPreservingFocus(action,kind='',value='') { renderFilterablePreservingFocus(action,'libFilters',kind,value); }
        function renderSelectionPreservingFocus(action,kind='',value='') { renderFilterablePreservingFocus(action,'selFilters',kind,value); }
        function vLibrary(root) {
          const all=getScenes(),scenes=filteredScenes(),n=activeFilterCount();
          const mode=libraryPhone.matches?'phone':'desktop';
          const filters=facetKeys.map(k=>{
            const universe=k==='mastery'?['new','learning','confident','saved']:k==='importance'?Array.from({length:10},(_,i)=>String(10-i)):[...new Set(all.flatMap(s=>facetValues(s,k)).filter(Boolean))].sort((a,b)=>valueLabel(k,a).localeCompare(valueLabel(k,b)));
            const values=[...new Set([...universe,...library[k]])]; const pool=all.filter(s=>matchesFilters(s,k));
            const open=library.groups[mode][k]??mode==='desktop';
            return `<details class="filter-disclosure" data-filter-group="${k}" data-mode="${mode}" ${open?'open':''}><summary>${facetLabels[k]}${library[k].length?`<span class="filter-badge">${library[k].length} selected</span>`:''}</summary><fieldset class="filter-group"><legend class="sr-only">${facetLabels[k]}</legend>${library[k].length?`<button class="text-button filter-clear" data-action="libClearGroup" data-kind="${k}" aria-label="Clear ${facetLabels[k]} Filters">Clear</button>`:''}<div class="filter-options">${values.map(v=>{const count=pool.filter(s=>facetValues(s,k).includes(v)).length;return `<label class="filter-option ${library[k].includes(v)?'selected':''}"><input type="checkbox" data-change="libFacet" data-kind="${k}" value="${esc(v)}" ${library[k].includes(v)?'checked':''}><span>${esc(valueLabel(k,v))}</span><b aria-label="${count} matching scenes">${count}</b></label>`}).join('')}</div></fieldset></details>`;
          }).join('');
          root.innerHTML=`
            <div class="section-toolbar"><div><h2>Scene Library</h2><p class="section-sub">Find the evidence you want to study.</p></div></div>
            <div class="print-only print-head" aria-hidden="true"><h1>${esc(FILM_NAME)} — Evidence Cards</h1><p>${scenes.length} of ${plural(all.length,'scene')} · ${new Date().toLocaleDateString()}</p></div>
            <div class="library-toolbar"><span class="search-box">${icon('search',18)}<input type="search" id="librarySearch" placeholder="Search scenes, quotes, techniques" aria-label="Search Scenes" data-input="librarySearch" value="${esc(library.q)}">${library.q?`<button class="search-clear" data-action="libSearchClear" aria-label="Clear Search">${icon('x',18)}</button>`:'<kbd class="search-kbd" aria-hidden="true">/</kbd>'}</span><span class="select-wrap"><select aria-label="Sort Scenes" data-change="libSort">${[['film','Film Order'],['importance','Importance'],['az','Title A–Z'],['weak','Weakest First']].map(([v,l])=>`<option value="${v}" ${library.sort===v?'selected':''}>${l}</option>`).join('')}</select>${icon('sliders',14)}</span><button class="button secondary" data-action="libFilters" aria-controls="libraryFilters" aria-expanded="${library.open}">${icon('sliders',18)} Filters${n?`<b class="filter-badge">${n}</b>`:''}</button></div>
            <section id="libraryFilters" class="filter-panel" aria-label="Scene Filters" ${library.open?'':'hidden'}><div class="filter-panel-head"><p>Choose any values within a group. Combine groups to narrow the results.</p><button class="text-button" data-action="libClear">Clear All</button></div><div class="filter-groups">${filters}</div><div class="filter-panel-foot"><button class="button primary" data-action="libShowResults">Show ${plural(scenes.length,'Scene')} ${icon('right',16)}</button></div></section>
            ${activePillsHTML()}<p class="library-count" tabindex="-1" role="status" aria-live="polite">${libraryCountHTML(scenes)}</p>
            ${scenes.length?`<div class="library-grid">${scenes.map(s=>`<article class="scene-tile"><div class="tile-top"><span class="tile-num">${masteryRing(s.id)}${pad2(s.id)}</span>${state.notes[s.id]?.trim()?`<span class="tile-notedot" role="img" aria-label="Recall Notes Saved">${icon('notes',14)}</span>`:''}<button class="icon-button tile-save ${state.bookmarks.includes(s.id)?'saved':''}" data-action="toggleBookmarkStop" data-id="${s.id}" aria-pressed="${state.bookmarks.includes(s.id)}" aria-label="${state.bookmarks.includes(s.id)?'Remove Bookmark':'Bookmark'}: ${esc(s.title)}">${icon('bookmark',18)}</button></div><button class="tile-main" data-action="openScene" data-id="${s.id}" aria-label="Open Details For ${esc(s.title)}">${cueArt(s.cue,s.cueText,'art')}<span class="tile-title">${esc(s.title)}</span><span class="scene-timestamp">${sceneTimeLabel(s.id)}</span>${importanceBadge(s)}${techniqueChips(s)}<span class="tile-char">${esc(s.character)}</span>${s.analysisType?`<span class="tile-analysis">${esc(s.analysisType)}</span>`:''}<span class="tile-tags">${tagsOf(s).slice(0,3).map(t=>`<i style="color:${tagColor(t)}">#${esc(tagLabel(t))}</i>`).join(' ')}${tagsOf(s).length>3?` <b>+${tagsOf(s).length-3}</b>`:''}</span><span class="tile-cue print-only">${esc(s.cueText)}</span></button></article>`).join('')}</div>`:!all.length?emptyLibraryCta():`<div class="empty-note"><h3>No scenes match these filters.</h3><p>Remove a filter or try a different search.</p><button class="text-button" data-action="libClear">Clear All Filters</button></div>`}`;
        }

        function openSceneModal(id) {          const s = sceneById(id);
          if (!s) return;
          const saved = state.bookmarks.includes(s.id);
          openModal(`
            <div class="modal-head"><h2>${esc(s.title)}</h2><button class="icon-button" data-action="closeModal" aria-label="Close Dialog">${icon('x', 20)}</button></div>
            <div class="modal-body">
              <div class="scene-art-lg">${cueArt(s.cue, s.cueText)}</div>
              <div class="detail-meta">
                <span class="fc-scene-tag">${icon('film', 13)} Scene ${pad2(s.id)}</span>
                <span class="theme-chip">${esc(s.character)}</span>
                ${s.analysisType ? `<span class="theme-chip analysis-chip">${icon('quote', 12)} ${esc(s.analysisType)}</span>` : ''}
                ${(() => { const m = masteryOf(s.id); return m === 'new' ? '' : `<span class="theme-chip mastery-chip mastery-${m}">${m === 'confident' ? 'Confident' : 'Learning'} · ${esc(dueLabel(s.id))}</span>`; })()}
              </div>
              ${tagsOf(s).length ? `<div class="detail-tagrow"><span class="answer-label">Themes</span><div class="detail-tags">${tagsOf(s).map((t) => `<button class="tag-chip tag-chip-btn" style="--tag-color:${tagColor(t)}" data-action="modalTag" data-tag="${esc(t)}" aria-label="Show All ${esc(tagLabel(t))} Scenes In The Library">${icon('tag', 11)} ${esc(tagLabel(t))}</button>`).join('')}</div></div>` : ''}
              <div class="detail-tagrow"><span class="answer-label">Techniques</span>${techniqueChips(s)}</div>
              <div class="detail-block importance-detail"><span class="answer-label">Importance</span>${importanceBadge(s,false)}<p>${esc(s.essayImportance?.reason || '')}</p><p class="importance-help">Higher ratings highlight stronger essay evidence. Choose scenes that fit your argument.</p></div>
              <div class="detail-block"><span class="answer-label">The Moment</span><p>${esc(s.description)}</p></div>
              ${s.keyLine ? `<blockquote class="key-line"><span class="answer-label">Key Line</span><p>“${esc(s.keyLine)}”</p></blockquote>` : ''}
              <section class="movie-clip-card" aria-label="Movie clip for ${esc(s.title)}">
                <div class="clip-heading"><div><span class="answer-label">Movie Clip</span><p class="clip-timecode">${sceneTimeLabel(s.id)}</p></div></div>
                <div class="clip-actions"><button class="button primary small-button" data-action="playSceneClip" data-id="${s.id}">${icon('right', 14)} Play This Clip</button><button class="button secondary small-button" data-action="copyTimecode" data-id="${s.id}">${icon('notes', 14)} Copy Timecode</button></div>
              </section>
              ${s.watchFor ? `<div class="detail-block"><span class="answer-label">What To Watch For</span><p>${esc(s.watchFor)}</p></div>` : ''}
              ${s.historyNote ? `<div class="detail-block history-note-block"><span class="answer-label">History Note</span><p>${esc(s.historyNote)}</p></div>` : ''}
              <div class="detail-block"><span class="answer-label">${esc(displayHeading(s.techniqueLabel,'Film Technique'))}</span><p>${esc(s.techniques)}</p></div>
              <div class="detail-block"><span class="answer-label">${esc(displayHeading(s.meaningLabel,'Meaning & Effect'))}</span><p>${esc(s.essay)}</p></div>
              ${s.essayStarter ? `<div class="detail-block starter-block"><span class="answer-label">Essay Starter</span><p>${esc(s.essayStarter)}</p></div>` : ''}
              <div class="reset-actions">
                <button class="button secondary" data-action="toggleBookmark" data-id="${s.id}">${icon('bookmark', 16)} ${saved ? 'Remove Bookmark' : 'Bookmark'}</button>
                ${state.cards[s.id] ? `<button class="button secondary" data-action="resetCard" data-id="${s.id}">${icon('rotate', 16)} Reset Card</button>` : ''}
                <button class="button primary" data-action="studyScene" data-id="${s.id}">${icon('layers', 16)} Study This Scene</button>
              </div>
            </div>`);
        }

        /* ================= PROGRESS ================= */
        function exportProgress() {
          const payload = { v: 4, exportedAt: new Date().toISOString(), sheet: FILM_NAME, progress: { cards: state.cards, bookmarks: state.bookmarks, notes: state.notes, activity: state.activity, selectedSceneIds:state.selectedSceneIds, history:state.history, watchPos:state.watchPos, progressRange:state.progressRange, progressStart:state.progressStart, progressEnd:state.progressEnd } };
          downloadFile(JSON.stringify(payload, null, 2), 'scenestudy-progress-backup.json', 'application/json');
          toast('Progress backup downloaded.', 'download');
        }
        let pendingRestore = null;
        function requestProgressRestore() { $('#progressFile').click(); }
        function previewProgressRestore(file) {
          if (file.size > 25 * 1024 * 1024) { toast('That backup is too large. Choose a SceneStudy JSON backup under 25 MB.', 'alert'); return; }
          const reader = new FileReader();
          reader.onload = () => {
            let payload;
            try { payload = JSON.parse(String(reader.result)); } catch (e) { toast('That file is not valid JSON — restore cancelled.', 'alert'); return; }
            const p = payload && payload.progress ? payload.progress : (payload && payload.cards ? payload : null);
            if (!p || typeof p !== 'object' || !p.cards || Array.isArray(p.cards) || typeof p.cards !== 'object' || (payload.v != null && ![2,3,4].includes(payload.v))) { toast('No progress found in that file — restore cancelled.', 'alert'); return; }
            const validIds = new Set(BUILTIN_SCENES.map((s) => s.id));
            const idMap = payload.v === 2 ? IDMAP_V2 : null;
            const mapId = (id) => {
              const n = Number(id);
              const resolved=resolveSceneId(n,idMap);return validIds.has(resolved)?resolved:null;
            };
            const restoredCards = cleanCards(p.cards,idMap);
            const restoredNotes = cleanNotes(p.notes,idMap);
            const restoredActivity = cleanActivity(p.activity,idMap);
            const today = new Date().toDateString();
            const priorDay = new Date(); priorDay.setDate(priorDay.getDate()-1);
            const yesterday = priorDay.toDateString();
            if (restoredActivity.lastStudyDay !== today && restoredActivity.lastStudyDay !== yesterday) restoredActivity.streak = 0;
            if (!Number.isFinite(restoredActivity.streak)) restoredActivity.streak = 0;
            const exportedDate = payload.exportedAt ? new Date(payload.exportedAt) : null;
            const when = exportedDate && !isNaN(exportedDate) ? exportedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'an unknown date';
            pendingRestore = { cards: restoredCards, bookmarks: cleanIds(p.bookmarks,idMap), notes: restoredNotes, activity: restoredActivity };
            const supplied=key=>Object.hasOwn(p,key);
            if(supplied('selectedSceneIds'))pendingRestore.selectedSceneIds=cleanIds(p.selectedSceneIds,idMap);
            if(supplied('history'))pendingRestore.history=cleanHistory(p.history,idMap);
            if(supplied('watchPos'))pendingRestore.watchPos=Number.isFinite(p.watchPos)?clamp(p.watchPos,0,FILM_RUNTIME):0;
            if(supplied('progressRange'))pendingRestore.progressRange=['7','30','90','all','custom'].includes(p.progressRange)?p.progressRange:'30';
            for(const key of ['progressStart','progressEnd'])if(supplied(key))pendingRestore[key]=cleanDate(p[key]);
            const extras=[supplied('history')?'activity history':null,supplied('selectedSceneIds')?'scene selection':null,supplied('watchPos')?'film position':null,['progressRange','progressStart','progressEnd'].some(supplied)?'Progress date preferences':null].filter(Boolean);
            const cardsN = Object.keys(restoredCards).length;
            const marksN = pendingRestore.bookmarks.length;
            const notesN = Object.keys(restoredNotes).length;
            const streakN = restoredActivity.streak;
            openModal(`
              <div class="modal-head"><h2>Restore This Backup?</h2><button class="icon-button" data-action="closeModal" aria-label="Close Dialog">${icon('x', 20)}</button></div>
              <div class="modal-body">
                <p class="modal-intro">Exported ${esc(when)}${payload.sheet ? ` from “${esc(payload.sheet)}”` : ''}. This replaces reviews, bookmarks and notes${extras.length?`, plus ${extras.join(', ')}`:''}. ${supplied('history')?'':'Your current activity history is kept.'} ${supplied('selectedSceneIds')?'':'Your current scene selection is kept.'}</p>
                <div class="restore-facts">
                  <div class="fact"><b>${cardsN}</b><span>${cardsN === 1 ? 'card review' : 'card reviews'}</span></div>
                  <div class="fact"><b>${marksN}</b><span>${marksN === 1 ? 'bookmark' : 'bookmarks'}</span></div>
                  <div class="fact"><b>${notesN}</b><span>${notesN === 1 ? 'recall note' : 'recall notes'}</span></div>
                  ${supplied('history')?`<div class="fact"><b>${pendingRestore.history.length}</b><span>history records</span></div>`:''}
                  ${supplied('selectedSceneIds')?`<div class="fact"><b>${pendingRestore.selectedSceneIds.length}</b><span>selected scenes</span></div>`:''}
                </div>
                <div class="reset-actions">
                  <button class="button secondary" data-action="closeModal">Cancel</button>
                  <button class="button primary" data-action="applyProgressRestore">${icon('check', 16)} Restore Backup</button>
                </div>
              </div>`);
          };
          reader.onerror = () => toast('Could not read that file — restore cancelled.', 'alert');
          reader.readAsText(file);
        }
        function applyProgressRestore() {
          if (!pendingRestore) { closeModal(); return; }
          Object.assign(state,pendingRestore);
          pendingRestore = null;
          const saved = saveNow(); resetViewStates(); closeModal();
          renderNav(); renderView();
          if (saved) toast('Backup restored — your progress is back.', 'check');
        }
        function confirmReset() {
          openModal(`
            <div class="modal-head"><h2>Restart Current Progress?</h2><button class="icon-button" data-action="closeModal" aria-label="Close Dialog">${icon('x', 20)}</button></div>
            <div class="modal-body">
              <p class="modal-intro">This clears your current reviews, bookmarks, notes and quiz state. Your Progress history and scene selections stay saved.</p>
              <div class="reset-actions">
                <button class="button secondary" data-action="closeModal">Keep Progress</button>
                <button class="button secondary" data-action="exportProgress">${icon('download', 15)} Export Backup</button>
                <button class="button danger-button" data-action="resetAll">${icon('trash', 15)} Restart Current Progress</button>
              </div>
            </div>`);
        }
        function applyReset() {
          const history = state.history.slice();
          const selectedSceneIds = state.selectedSceneIds.slice();
          const watchPos = state.watchPos;
          const progressRange = state.progressRange;
          const progressStart = state.progressStart;
          const progressEnd = state.progressEnd;
          state = freshState();
          state.history = history;
          state.selectedSceneIds = selectedSceneIds;
          state.watchPos = watchPos;
          state.progressRange = progressRange;
          state.progressStart = progressStart;
          state.progressEnd = progressEnd;
          save();
          const saved = saveNow(); resetViewStates(); closeModal();
          renderNav(); renderView();
          if (saved) toast('Progress reset. A clean slate awaits.', 'checkCircle');
        }
        function progressBuckets(events, from, to, range) {
          const days = Math.max(1, Math.ceil((to - from) / DAY) + 1);
          const unit = range === 'all' || days > 120 ? 'month' : days > 21 ? 'week' : 'day';
          const map = new Map();
          const cursor = new Date(from); cursor.setHours(0,0,0,0); if(unit==='month')cursor.setDate(1);
          while (cursor.getTime() <= to) {
            const d = new Date(cursor);
            if (unit === 'week') d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
            if (unit === 'month') d.setDate(1);
            const key = unit === 'month' ? `${d.getFullYear()}-${d.getMonth()}` : unit === 'week' ? `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` : d.toDateString();
            if (!map.has(key)) map.set(key, { start: d.getTime(), count: 0, quizzes: [] });
            if (unit === 'month') cursor.setMonth(cursor.getMonth() + 1); else cursor.setDate(cursor.getDate() + 1);
          }
          events.forEach((event) => {
            const d = new Date(event.at); d.setHours(0,0,0,0);
            if (unit === 'week') d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
            if (unit === 'month') d.setDate(1);
            const key = unit === 'month' ? `${d.getFullYear()}-${d.getMonth()}` : unit === 'week' ? `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` : d.toDateString();
            const bucket = map.get(key);
            if (bucket) { bucket.count++; if (event.type === 'quiz' && Number.isFinite(event.score)) bucket.quizzes.push(event.score); }
          });
          return [...map.values()].sort((a,b) => a.start-b.start).map((bucket) => ({ ...bucket, label: new Date(bucket.start).toLocaleDateString(undefined, unit === 'day' ? { month:'short', day:'numeric' } : unit === 'week' ? { month:'short', day:'numeric' } : { month:'short', year:'2-digit' }) }));
        }
        function vProgress(root) {
          const scenes = getScenes();
          const confident = scenes.filter((s) => masteryOf(s.id) === 'confident').length;
          const learning = scenes.filter((s) => masteryOf(s.id) === 'learning').length;
          const due = dueCount();
          const a = state.activity;
          const now = new Date(); now.setHours(23,59,59,999);
          let from;
          if (state.progressRange === 'all') from = state.history.length ? Math.min(...state.history.map((event) => event.at)) : now.getTime();
          else if (state.progressRange === 'custom' && state.progressStart && state.progressEnd) from = new Date(`${state.progressStart}T00:00:00`).getTime();
          else { const first=new Date(now); first.setDate(first.getDate()-(([7,30,90].includes(Number(state.progressRange))?Number(state.progressRange):30)-1)); first.setHours(0,0,0,0); from=first.getTime(); }
          let to = state.progressRange === 'custom' && state.progressStart && state.progressEnd ? new Date(`${state.progressEnd}T23:59:59.999`).getTime() : now.getTime();
          from=Math.max(from,new Date('2000-01-01T00:00:00').getTime()); to=Math.min(to,now.getTime());
          const invalidCustom=state.progressRange==='custom' && (!state.progressStart || !state.progressEnd || !Number.isFinite(from) || !Number.isFinite(to) || from>to);
          if (!Number.isFinite(from) || !Number.isFinite(to) || from > to) { const first=new Date(now);first.setDate(first.getDate()-29);first.setHours(0,0,0,0);from=first.getTime();to=now.getTime(); }
          const history = invalidCustom ? [] : state.history.filter((event) => Number.isFinite(event.at) && event.at >= from && event.at <= to).sort((x,y) => y.at-x.at);
          const buckets = progressBuckets(history, from, to, state.progressRange);
          const max = Math.max(1, ...buckets.map((bucket) => bucket.count));
          const quizScores = history.filter((event) => event.type === 'quiz' && Number.isFinite(event.score)).map((event) => event.score);
          const average = quizScores.length ? Math.round(quizScores.reduce((sum,n) => sum+n,0)/quizScores.length) : null;
          const tagStats = getTagUniverse().map((t) => {
            const list = scenes.filter((s) => tagsOf(s).includes(t));
            let sum = 0;
            list.forEach((s) => { const m = masteryOf(s.id); sum += m === 'confident' ? 1 : m === 'learning' ? 0.5 : 0; });
            return { t, n: list.length, pct: list.length ? Math.round((sum / list.length) * 100) : 0 };
          }).sort((x,y) => (x.pct-y.pct) || (y.n-x.n));
          const typeName = { review:'Card Review', quiz:'Essay Quiz', matching:'Match & Mix', explanation:'Scene Explanation' };
          const rangeLabel = state.progressRange === 'all' ? 'All Time' : state.progressRange === 'custom' ? 'Custom Range' : `Last ${state.progressRange} Days`;
          root.innerHTML = `
            <div class="section-toolbar">
              <div><h2>Progress</h2><p class="section-sub">Your practice record stays here, even after a restart.</p></div>
              <div class="progress-tools"><button class="button secondary small-button" data-action="exportNotes">Study Notes</button><button class="button secondary small-button" data-action="exportProgress">Export Backup</button><button class="button secondary small-button" data-action="restoreProgress">Restore Backup</button></div>
            </div>
            <section class="performance-card" aria-labelledby="performanceTitle">
              <div class="performance-head"><div><span class="eyebrow">Your Practice</span><h3 id="performanceTitle">${rangeLabel}</h3></div><label class="range-control">Time Range<span class="select-wrap"><select id="progressRange" data-change="progressRange" aria-label="Progress Time Range"><option value="7" ${state.progressRange==='7'?'selected':''}>Last 7 Days</option><option value="30" ${state.progressRange==='30'?'selected':''}>Last 30 Days</option><option value="90" ${state.progressRange==='90'?'selected':''}>Last 90 Days</option><option value="all" ${state.progressRange==='all'?'selected':''}>All Time</option><option value="custom" ${state.progressRange==='custom'?'selected':''}>Custom Range</option></select>${icon('sliders', 14)}</span></label></div>
              ${state.progressRange==='custom' ? `<div class="custom-range"><label>From<input type="date" id="progressStart" data-change="progressDate" value="${esc(state.progressStart)}"></label><label>To<input type="date" id="progressEnd" data-change="progressDate" value="${esc(state.progressEnd)}"></label></div>` : ''}
              ${invalidCustom ? '<p class="history-empty" role="status">Choose both dates in order, with at least one day between 1 January 2000 and today.</p>' : `<div class="chart-summary"><span class="sum"><b>${history.length}</b><span>${history.length === 1 ? 'Practice Action' : 'Practice Actions'}</span></span><span class="sum"><b>${average == null ? '—' : `${average}%`}</b><span>Average Quiz Score${quizScores.length ? ` · ${quizScores.length} ${quizScores.length === 1 ? 'Quiz' : 'Quizzes'}` : ''}</span></span></div>
              <div class="activity-chart" role="img" aria-label="${history.length} practice actions across ${buckets.length} time periods from ${new Date(from).toLocaleDateString()} to ${new Date(to).toLocaleDateString()}">
                ${buckets.map((bucket) => `<div class="activity-column"><b>${bucket.count}</b><span class="activity-bar-track"><i style="height:${Math.max(bucket.count ? 8 : 0, Math.round(bucket.count/max*100))}%"></i></span><small>${esc(bucket.label)}</small></div>`).join('')}
              </div>
              ${history.length ? `<div class="history-list"><h4>History · ${history.length} ${history.length === 1 ? 'Record' : 'Records'}</h4>${history.slice(0,50).map((event) => `<div class="history-row"><time datetime="${new Date(event.at).toISOString()}">${new Date(event.at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}, ${new Date(event.at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</time><span>${esc(typeName[event.type] || event.type)}${event.sceneId && sceneById(event.sceneId) ? ` · ${esc(sceneById(event.sceneId).title)}` : ''}</span>${event.type==='quiz' ? `<b>${event.score}%</b>` : ''}</div>`).join('')}${history.length>50?`<p class="history-note">Showing the 50 most recent records in this range. The chart includes all ${history.length}.</p>`:''}</div>` : `<p class="history-empty">No practice records in this range yet. Finish a review, quiz, matching round, or scene explanation and it will appear here.</p>`}`}
            </section>
            <div class="progress-grid" role="list"><div class="stat-tile" role="listitem"><div class="stat-num">${confident}</div><div class="stat-label">Confident Scenes</div></div><div class="stat-tile" role="listitem"><div class="stat-num">${learning}</div><div class="stat-label">Learning Scenes</div></div></div>
            ${tagStats.length ? `<h2 class="progress-h2">Mastery By Tag</h2><div class="tagstat-list" role="list">${tagStats.map((ts) => `<div class="tagstat-row" role="listitem">${tagChip(ts.t)}<span class="tagstat-n">${plural(ts.n,'scene')}</span><span class="tagstat-barwrap"><i class="tagstat-bar" style="width:${ts.pct}%;background:${tagColor(ts.t)}"></i></span><b class="tagstat-pct">${ts.pct}%</b><button class="practice-btn" data-action="practiceTag" data-tag="${esc(ts.t)}">Practice</button></div>`).join('')}</div>` : ''}
            <h2 class="progress-h2">Scene By Scene</h2><div class="scene-status-list">${scenes.map((scene) => { const mastery=masteryOf(scene.id); const card=state.cards[scene.id]; const status=card?.reviews && card.dueAt<=Date.now()?'Due Now':mastery==='confident'?'Confident':mastery==='learning'?dueLabel(scene.id):'Not Studied'; return `<div class="status-row"><span class="mono">${pad2(scene.id)} · ${sceneTimeLabel(scene.id)}</span><span class="st-title">${esc(scene.title)}</span>${card?.reviews?`<span class="status-pill count">${plural(card.reviews,'review')}</span>`:''}<span class="status-pill ${status === 'Due Now' ? 'due' : mastery}">${esc(status)}</span></div>`;}).join('')}</div>
            <div class="progress-actions"><button class="button danger-button" data-action="confirmReset">${icon('rotate',16)} Restart Current Progress</button></div>`;
        }

        /* ================= SCENE SELECTION ================= */

        function setSceneSelection(ids) {
          const activeControl=document.activeElement;
          state.selectedSceneIds=cleanIds(ids); save(); const valid=new Set(state.selectedSceneIds);
          reconcileFlashDeck(); flash.session=flash.session.filter(id=>valid.has(id));
          if(recall.sceneId!=null&&!valid.has(recall.sceneId)){recall.sceneId=getScenes()[0]?.id??null;recall.checked=false;}
          if(!match.left.length||match.left.some(s=>!valid.has(s.id)))newMatchRound();
          if(quiz.qs.some(q=>!valid.has(q.scene.id)||q.options.some(o=>o.id>0&&!valid.has(o.id)))){quiz.qs=[];quiz.answers=[];quiz.idx=0;quiz.picked=null;quiz.done=false;}
          renderNav();
          if(currentView!=='selection'){renderView();return;}
          document.querySelectorAll('.scene-choice').forEach(el=>{const input=el.querySelector('input');const selected=valid.has(Number(input.dataset.id));input.checked=selected;el.classList.toggle('selected',selected)});
          $('.section-toolbar .quiet-tag').textContent=`${valid.size} Of ${BUILTIN_SCENES.length} Selected`;
          $('.selection-toolbar > span').innerHTML=`<b>${valid.size}</b> Selected · ${BUILTIN_SCENES.length} Authored Scenes`;
          $('.selection-footer > span').textContent=valid.size?`${valid.size} scenes will appear across your study modes.`:'Select at least one scene to use the study modes.';
          $('[data-action="applySceneSelection"]').disabled=!valid.size;
          const matches=selectionResults();
          $('#selectionResults').textContent=selectionResultLabel(matches,valid);
          $('[data-action="selectSelectionResults"]').disabled=!matches.some(s=>!valid.has(s.id));
          $('[data-action="deselectSelectionResults"]').disabled=!matches.some(s=>valid.has(s.id));
          if(activeControl?.disabled)$('#selectionResults').focus({preventScroll:true});
        }

        function toggleSceneSelection(id) {
          const next = new Set(state.selectedSceneIds);
          if (next.has(id)) next.delete(id); else next.add(id);
          setSceneSelection([...next]);
        }
        function matchesSelectionFilters(s,except=null) {
          return (!selection.q.trim() || sceneSearch.get(s.id).includes(selection.q.trim().toLowerCase())) && facetKeys.every(k=>k===except||!selection[k].length||selection[k].some(v=>facetValues(s,k).includes(v)));
        }
        const selectionFilterCount=()=>facetKeys.reduce((n,k)=>n+selection[k].length,0);
        function selectionResults() {
          const list=BUILTIN_SCENES.filter(s=>matchesSelectionFilters(s)); const rank={new:0,learning:1,confident:2};
          return list.sort(selection.sort==='importance'?(a,b)=>importanceOf(b)-importanceOf(a)||filmSort(a,b):selection.sort==='az'?(a,b)=>a.title.localeCompare(b.title)||a.id-b.id:selection.sort==='weak'?(a,b)=>rank[masteryOf(a.id)]-rank[masteryOf(b.id)]||filmSort(a,b):filmSort);
        }
        function selectionResultLabel(matches,selected) {return `Showing ${matches.length} of ${BUILTIN_SCENES.length} scenes · ${matches.filter(s=>selected.has(s.id)).length} shown scenes selected.`;}
        function selectionPillsHTML() {
          const entries=facetKeys.flatMap(k=>selection[k].map(v=>({k,v,label:valueLabel(k,v)})));
          if(selection.q.trim()) entries.unshift({k:'q',v:'',label:`Search: “${selection.q.trim()}”`});
          return entries.length ? `<div class="active-pills" aria-label="Active Scene Choice Filters">${entries.map(x=>`<button class="active-pill" data-action="selClearOne" data-kind="${x.k}" data-value="${esc(x.v)}" aria-label="Remove ${esc(x.label)} Filter From Scene Choices">${esc(x.label)} ${icon('x',14)}</button>`).join('')}</div>` : '';
        }
        function vSceneSelection(root) {
          const selected = new Set(state.selectedSceneIds);
          const all=BUILTIN_SCENES, matches=selectionResults(), n=selectionFilterCount();
          const mode=libraryPhone.matches?'phone':'desktop';
          const filters=facetKeys.map(k=>{
            const universe=k==='mastery'?['new','learning','confident','saved']:k==='importance'?Array.from({length:10},(_,i)=>String(10-i)):[...new Set(all.flatMap(s=>facetValues(s,k)).filter(Boolean))].sort((a,b)=>valueLabel(k,a).localeCompare(valueLabel(k,b)));
            const values=[...new Set([...universe,...selection[k]])]; const pool=all.filter(s=>matchesSelectionFilters(s,k));
            const open=selection.groups[mode][k]??mode==='desktop';
            return `<details class="filter-disclosure" data-filter-group="${k}" data-filter-scope="selection" data-mode="${mode}" ${open?'open':''}><summary>${facetLabels[k]}${selection[k].length?`<span class="filter-badge">${selection[k].length} selected</span>`:''}</summary><fieldset class="filter-group"><legend class="sr-only">${facetLabels[k]}</legend>${selection[k].length?`<button class="text-button filter-clear" data-action="selClearGroup" data-kind="${k}" aria-label="Clear ${facetLabels[k]} Filters From Scene Choices">Clear</button>`:''}<div class="filter-options">${values.map(v=>{const count=pool.filter(s=>facetValues(s,k).includes(v)).length;return `<label class="filter-option ${selection[k].includes(v)?'selected':''}"><input type="checkbox" data-change="selFacet" data-kind="${k}" value="${esc(v)}" ${selection[k].includes(v)?'checked':''}><span>${esc(valueLabel(k,v))}</span><b aria-label="${count} matching scenes">${count}</b></label>`}).join('')}</div></fieldset></details>`;
          }).join('');
          root.innerHTML = `
            <div class="section-toolbar">
              <div><h2>Choose Scenes</h2><p class="section-sub">Select the scenes you want to study. Build a library around the scenes you want to practise.</p></div>
              <span class="quiet-tag">${selected.size} Of ${all.length} Selected</span>
            </div>
            <div class="library-toolbar selection-controls"><span class="search-box">${icon('search',18)}<input type="search" id="selectionSearch" data-input="selectionSearch" aria-label="Search Scenes To Select" placeholder="Search scenes, characters, techniques" value="${esc(selection.q)}">${selection.q?`<button class="search-clear" data-action="selectionSearchClear" aria-label="Clear Selection Search">${icon('x',18)}</button>`:''}</span><span class="select-wrap"><select aria-label="Sort Scene Choices" data-change="selSort">${[['film','Film Order'],['importance','Importance'],['az','Title A–Z'],['weak','Weakest First']].map(([v,l])=>`<option value="${v}" ${selection.sort===v?'selected':''}>${l}</option>`).join('')}</select>${icon('sliders',14)}</span><button class="button secondary" data-action="selFilters" aria-controls="selectionFilters" aria-expanded="${selection.open}">${icon('sliders',18)} Filters${n?`<b class="filter-badge">${n}</b>`:''}</button></div>
            <section id="selectionFilters" class="filter-panel" aria-label="Scene Choice Filters" ${selection.open?'':'hidden'}><div class="filter-panel-head"><p>Choose any values within a group. Combine groups to narrow the choices.</p><button class="text-button" data-action="selClear">Clear All</button></div><div class="filter-groups">${filters}</div><div class="filter-panel-foot"><button class="button primary" data-action="selShowResults">Show ${plural(matches.length,'Scene')} ${icon('right',16)}</button></div></section>
            ${selectionPillsHTML()}
            <div class="selection-toolbar"><span><b>${selected.size}</b> Selected · ${all.length} Authored Scenes</span><div><button class="text-button" data-action="selectSelectionResults" ${matches.some(s=>!selected.has(s.id))?'':'disabled'}>Select Results</button><button class="text-button" data-action="deselectSelectionResults" ${matches.some(s=>selected.has(s.id))?'':'disabled'}>Deselect Results</button><button class="text-button" data-action="selectAllScenes">Select All</button><button class="text-button" data-action="selectNoScenes">Deselect All</button></div></div>
            <p id="selectionResults" class="library-count" tabindex="-1" role="status" aria-live="polite">${selectionResultLabel(matches,selected)}</p>
            <div class="scene-choice-list" role="group" aria-label="Choose Scenes To Study">
              ${matches.map((scene) => `<label class="scene-choice ${selected.has(scene.id) ? 'selected' : ''}"><input type="checkbox" data-action="toggleSceneSelection" data-id="${scene.id}" ${selected.has(scene.id) ? 'checked' : ''} aria-label="Select ${esc(scene.title)}"><span class="choice-number">${pad2(scene.id)}</span><span class="choice-copy"><b>${esc(scene.title)}</b><small>${esc(scene.character)} · ${sceneTimeLabel(scene.id)}</small>${importanceBadge(scene)}${techniqueChips(scene)}</span><span class="choice-tags">${tagsOf(scene).slice(0,2).map((tag) => `<i>${esc(tagLabel(tag))}</i>`).join('')}</span></label>`).join('')}
            </div>
            ${matches.length?'':`<div class="empty-note"><h3>No scenes match these filters.</h3><p>Remove a filter or try a different search.</p><button class="text-button" data-action="selClear">Clear All Filters</button></div>`}
            <div class="selection-footer"><span>${selected.size ? `${selected.size} scenes will appear across your study modes.` : 'Select at least one scene to use the study modes.'}</span><button class="button primary" data-action="applySceneSelection" ${selected.size ? '' : 'disabled'}>Use Selected Scenes ${icon('right', 16)}</button></div>`;
        }

        /* ================= WATCH ================= */
        function vWatch(root) {
          const scenes = getScenes().slice().sort(filmSort);
          root.innerHTML = `
            <div class="section-toolbar">
              <div><h2>Watch Film</h2><p class="section-sub">The provided film with every selected scene as a chapter. Pick a chapter to jump straight to it.</p></div>
              <span class="quiet-tag">${scenes.length} ${scenes.length === 1 ? 'Chapter' : 'Chapters'}</span>
            </div>
            ${!scenes.length ? emptyLibraryCta() : `
            <div class="watch-layout">
              <div class="watch-player-wrap">
                <video id="filmPlayer" class="film-player" controls playsinline preload="metadata" aria-label="Hidden Figures Film Player">
                  <source src="${MOVIE_SOURCE}" type="video/mp4" />
                </video>
                <p class="clip-help" id="playerStatus" role="status">Loading film…</p><button class="text-button" data-action="retryFilm" hidden>Retry Playback</button>
              </div>
              <ol class="chapter-list" aria-label="Scene Chapters In Film Order">
                ${scenes.map((s) => `
                <li><button class="chapter-row" data-action="watchChapter" data-id="${s.id}" aria-label="Play ${esc(s.title)} At ${sceneTimeLabel(s.id)}">
                  <span class="mono chapter-time">${sceneTimeLabel(s.id)}</span>
                  <span class="chapter-copy"><b>${esc(s.title)}</b><small>${esc(s.character)}</small></span>
                  <span class="chapter-play">${icon('right', 14)}</span>
                </button></li>`).join('')}
              </ol>
            </div>`}`;
          const player = $('#filmPlayer');
          if (player) {
            const status = $('#playerStatus'), retry = $('[data-action="retryFilm"]');
            let loadTimer, clipFrame=null;
            const finishClip = () => {
              const end=watchStopAt;
              if (end==null) return;
              watchStopAt=null;
              player.pause();
              // Reviewed ends exclude the next frame in this 25 fps film.
              try { player.currentTime=Math.max(0,end-1/25); } catch(e) {}
              state.watchPos=player.currentTime;save();
              status.textContent='Clip complete. Press Play to continue watching.';
            };
            const queueClipFrame = () => {
              if (!player.requestVideoFrameCallback || clipFrame!=null || !player.isConnected || player.paused || player.seeking || watchStopAt==null) return;
              clipFrame=player.requestVideoFrameCallback((_now,frame)=>{
                clipFrame=null;
                if (!player.isConnected || player.paused || player.seeking || watchStopAt==null) return;
                if (frame.mediaTime+1/25>=watchStopAt-0.000001) finishClip();
                else queueClipFrame();
              });
            };
            const waitForFilm = () => { clearTimeout(loadTimer); loadTimer=setTimeout(()=>{if(player.isConnected&&player.readyState<1){status.textContent='The hosted film is taking longer to load. You can retry playback.';retry.hidden=false;}},30000); };
            const showFailure = () => { clearTimeout(loadTimer); if (!player.isConnected) return; status.textContent='The film could not be loaded. Try again when the hosted source is available.'; retry.hidden=false; };
            const playClip = () => player.play().then(queueClipFrame).catch(error => {
              if (!player.isConnected || error?.name==='AbortError') return;
              if (error?.name==='NotAllowedError') status.textContent='Press Play to start this clip.';
              else showFailure();
            });
            player.playClip = playClip;
            const startAt = watchTarget != null ? watchTarget : (Number.isFinite(state.watchPos) ? state.watchPos : 0);
            watchTarget = null; const shouldPlay=watchAutoplay; watchAutoplay=false;
            const bounds = scenes.map((s) => ({ id: s.id, start: s.timestamps ? s.timestamps.start : 0, end: s.timestamps ? s.timestamps.end : 0 }));
            let lastSave = 0;
            const markChapter = (t) => {
              const chosen=bounds.find(b=>b.id===watchSceneId&&t>=b.start&&t<b.end);
              const cur=chosen||bounds.filter(b=>t>=b.start&&t<b.end).sort((a,b)=>b.start-a.start||b.id-a.id)[0];
              document.querySelectorAll('.chapter-row.active').forEach((el) => { if (!cur || Number(el.dataset.id) !== cur.id) el.classList.remove('active'); });
              if (cur) { const el = document.querySelector(`.chapter-row[data-id="${cur.id}"]`); if (el) el.classList.add('active'); }
            };
            const begin=()=>{if(!player.isConnected)return;const target=watchTarget!=null?watchTarget:startAt;watchTarget=null;try{if(Number.isFinite(target))player.currentTime=target;}catch(e){}markChapter(target||0);status.textContent='Choose a chapter or press Play to watch the film.';if(shouldPlay||watchAutoplay){watchAutoplay=false;playClip();}};
            player.addEventListener('error',showFailure);
            player.querySelector('source').addEventListener('error',showFailure);
            player.addEventListener('loadstart',waitForFilm);
            player.addEventListener('loadedmetadata',()=>{clearTimeout(loadTimer);retry.hidden=true;});
            waitForFilm();
            player.addEventListener('playing',()=>{if(player.isConnected){status.textContent='Playing the film.';queueClipFrame();}});
            player.addEventListener('seeking',()=>{if(clipFrame!=null){player.cancelVideoFrameCallback?.(clipFrame);clipFrame=null;}});
            player.addEventListener('seeked',queueClipFrame);
            if (player.readyState >= 1) begin(); else player.addEventListener('loadedmetadata', begin, { once: true });
            player.addEventListener('timeupdate', () => {
              let t = player.currentTime;
              if (!player.isConnected) return;
              if (watchStopAt != null && t >= watchStopAt) { finishClip();t=player.currentTime; }
              const now = Date.now();
              if (now - lastSave > 5000) { lastSave = now; state.watchPos = t; save(); }
              markChapter(t);
            });
            player.addEventListener('pause', () => { if(clipFrame!=null){player.cancelVideoFrameCallback?.(clipFrame);clipFrame=null;}state.watchPos = player.currentTime; save(); });
          }
        }

        /* ================= EVENT WIRING ================= */
        const VIEWS = { overview: vOverview, flashcards: vFlashcards, matching: vMatching, quiz: vQuiz, recall: vRecall, library: vLibrary, watch: vWatch, progress: vProgress, selection: vSceneSelection };

        document.addEventListener('click', (e) => {
          const target = e.target.closest('[data-action]');
          if (!target) return;
          if (target.dataset.action === 'closeModal' && target.classList.contains('modal-backdrop') && e.target !== target) return;
          const action = target.dataset.action;
          const id = target.dataset.id != null ? Number(target.dataset.id) : null;
          switch (action) {
            case 'nav': navigate(target.dataset.view); break;
            case 'flashAll': flashSetDeck('all', false); renderView(); break;
            case 'closeModal': closeModal(); break;
            case 'shuffleDeck': flashSetDeck(flash.deck, true); renderView(); toast('Deck mixed. A fresh perspective awaits.', 'shuffle'); break;
            case 'flashPrev': flashNav(-1); break;
            case 'flashNext': flashNav(1); break;
            case 'restartDeck': flashSetDeck(flash.deck, false); renderView(); break;
            case 'flipCard': flash.flipped = !flash.flipped; renderView(); break;
            case 'rate': flashRate(target.dataset.rating); break;
            case 'toggleBookmark': {
              if (target.dataset.id == null) break;
              const bid = Number(target.dataset.id);
              if (state.bookmarks.includes(bid)) { state.bookmarks = state.bookmarks.filter((b) => b !== bid); toast('Bookmark removed.', 'bookmark'); }
              else { state.bookmarks.push(bid); toast('Bookmarked. Find it in the saved deck.', 'bookmark'); }
              if(flash.deck==='saved')reconcileFlashDeck();
              save();
              if (!modalRoot.childElementCount) renderView(); else { openSceneModal(bid); renderNav(); renderView(); }
              break;
            }
            case 'toggleBookmarkStop': {
              const bid2 = Number(target.dataset.id);
              if (state.bookmarks.includes(bid2)) state.bookmarks = state.bookmarks.filter((b) => b !== bid2);
              else state.bookmarks.push(bid2);
              if(flash.deck==='saved')reconcileFlashDeck();
              save(); renderNav(); renderView();
              break;
            }
            case 'pickLeft': matchPick('L', id); break;
            case 'pickRight': matchPick('R', id); break;
            case 'newMatch': newMatchRound(); renderView(); break;
            case 'matchTechniques': match.category = 'technique'; newMatchRound(); renderView(); break;
            case 'quizPick': quizPick(id); break;
            case 'quizNext': quizNext(); break;
            case 'quizEndEarly': {
              if (!quiz.answers.length) { quiz.qs = []; quiz.idx = 0; quiz.picked = null; quiz.answers = []; quiz.done = false; quiz.partial = false; renderView(); break; }
              quiz.qs = quiz.qs.slice(0, quiz.answers.length);
              quiz.done = true;
              quiz.partial = true;
              state.activity.quizzes++;
              state.activity.lastScore = Math.round((quiz.answers.filter((a) => a.correct).length / quiz.answers.length) * 100);
              recordHistory('quiz', null, state.activity.lastScore);
              save(); markStudied(); renderView();
              break;
            }
            case 'quizStart': newQuiz(); renderView(); break;
            case 'quizRetry': {
              const missed = new Set(quiz.answers.filter((a) => !a.correct).map((a) => a.id));
              const pool = buildBank().filter((q) => q.scene && missed.has(q.scene.id));
              if (!pool.length) { toast('No retry questions available — starting fresh.', 'alert'); quiz.qs = []; quiz.idx = 0; quiz.picked = null; quiz.answers = []; quiz.done = false; renderView(); break; }
              quiz.focus = 'all'; quiz.effFocus = 'all';
              quiz.qs = shuffle(pool).slice(0, quiz.len === 'all' ? pool.length : Math.min(Number(quiz.len) || pool.length, pool.length));
              quiz.idx = 0; quiz.picked = null; quiz.answers = []; quiz.done = false; quiz.partial = false;
              renderView();
              break;
            }
            case 'newQuiz': quiz.qs = []; quiz.idx = 0; quiz.picked = null; quiz.answers = []; quiz.done = false; quiz.partial = false; renderView(); break;
            case 'studyScene': closeModal(); flash.focus = id; go('flashcards'); break;
            case 'resetCard': {
              if (id != null) {
                delete state.cards[id];
                if(flash.deck==='due')reconcileFlashDeck();
                const saved=saveNow(); renderNav(); renderView(); openSceneModal(id);
                if(saved)toast('Card reset. It is due for review again.', 'rotate');
              }
              break;
            }
            case 'practiceTag': quiz.focus = target.dataset.tag; quiz.qs = []; quiz.idx = 0; quiz.picked = null; quiz.answers = []; quiz.done = false; quiz.partial = false; go('quiz'); break;
            case 'modalTag': if (!library.tag.includes(target.dataset.tag)) library.tag.push(target.dataset.tag); closeModal(); go('library'); break;
            case 'studyDue': flashSetDeck('due', false); go('flashcards'); break;
            case 'checkRecall': recallCheck(); break;
            case 'clearRecallAsk':
              openModal(`
                <div class="modal-head"><h2>Clear This Draft?</h2><button class="icon-button" data-action="closeModal" aria-label="Close Dialog">${icon('x', 20)}</button></div>
                <div class="modal-body">
                  <p class="modal-intro">Your explanation for this scene will be cleared. You can write it again any time.</p>
                  <div class="reset-actions">
                    <button class="button secondary" data-action="closeModal">Keep Draft</button>
                    <button class="button danger-button" data-action="clearRecallYes">${icon('trash', 15)} Clear Draft</button>
                  </div>
                </div>`);
              break;
            case 'clearRecallYes': {
              delete state.notes[recall.sceneId];
              state.activity.explanations = state.activity.explanations.filter((x) => x !== recall.sceneId);
              recall.checked = false;
              const saved=saveNow(); closeModal(); renderView();
              if(saved)toast('Draft cleared. A fresh explanation awaits.', 'trash');
              break;
            }
            case 'newRecallPrompt': {
              const others = getScenes().filter((s) => s.id !== recall.sceneId);
              if (others.length) { recall.sceneId = shuffle(others)[0].id; recall.checked = false; renderView(); }
              break;
            }
            case 'openScene': openSceneModal(id); break;

            case 'libFilters': library.open = !library.open; renderLibraryPreservingFocus('libFilters'); break;
            case 'libShowResults': { library.open=false;renderView();const results=$('.library-count');results.focus({preventScroll:true});results.scrollIntoView({block:'start'});break; }
            case 'selectionSearchClear': selection.q='';renderView();$('#selectionSearch').focus();break;
            case 'selFilters': selection.open=!selection.open; renderSelectionPreservingFocus('selFilters'); break;
            case 'selShowResults': { selection.open=false; renderView(); const results=$('#selectionResults'); results.focus({preventScroll:true}); results.scrollIntoView({block:'start'}); break; }
            case 'selClear': selection.q=''; for (const k of facetKeys) selection[k]=[]; renderSelectionPreservingFocus('selClear'); break;
            case 'selClearGroup': selection[target.dataset.kind]=[]; renderSelectionPreservingFocus('selClearGroup',target.dataset.kind); break;
            case 'selClearOne': { const k=target.dataset.kind; if(k==='q')selection.q=''; else selection[k]=selection[k].filter(v=>v!==target.dataset.value); renderSelectionPreservingFocus('selClearOne'); break; }
            case 'selectSelectionResults': setSceneSelection([...new Set([...state.selectedSceneIds,...selectionResults().map(s=>s.id)])]);break;
            case 'deselectSelectionResults': {const ids=new Set(selectionResults().map(s=>s.id));setSceneSelection(state.selectedSceneIds.filter(id=>!ids.has(id)));break;}
            case 'libClear': library.q = ''; for (const k of facetKeys) library[k] = []; renderLibraryPreservingFocus('libClear'); break;
            case 'libClearGroup': library[target.dataset.kind] = []; renderLibraryPreservingFocus('libClearGroup',target.dataset.kind); break;
            case 'libClearOne': { const k=target.dataset.kind; if(k==='q')library.q=''; else library[k]=library[k].filter(v=>v!==target.dataset.value); renderLibraryPreservingFocus('libFilters'); break; }
            case 'libSearchClear': library.q=''; renderView(); $('#librarySearch')?.focus(); break;

            case 'exportProgress': exportProgress(); break;
            case 'restoreProgress': requestProgressRestore(); break;
            case 'applyProgressRestore': applyProgressRestore(); break;
            case 'confirmReset': confirmReset(); break;
            case 'resetAll': applyReset(); break;
            case 'selectAllScenes': setSceneSelection(BUILTIN_SCENES.map((scene) => scene.id)); break;
            case 'selectNoScenes':
              if (!state.selectedSceneIds.length) break;
              openModal(`
                <div class="modal-head"><h2>Deselect All ${state.selectedSceneIds.length} Scenes?</h2><button class="icon-button" data-action="closeModal" aria-label="Close Dialog">${icon('x', 20)}</button></div>
                <div class="modal-body">
                  <p class="modal-intro">Every study mode needs at least one scene. You can reselect scenes right away — nothing is deleted.</p>
                  <div class="reset-actions">
                    <button class="button secondary" data-action="closeModal">Keep Scenes</button>
                    <button class="button danger-button" data-action="applyDeselectAll">${icon('trash', 15)} Deselect All</button>
                  </div>
                </div>`);
              break;
            case 'applyDeselectAll': closeModal(); setSceneSelection([]); break;
            case 'toggleSceneSelection': toggleSceneSelection(Number(target.dataset.id)); break;
            case 'applySceneSelection': setView('library'); break;
            case 'playSceneClip': closeModal(); goWatchAt(id); break;
            case 'copyTimecode': {
              const cs = sceneById(id) || BUILTIN_SCENES.find((x) => x.id === id);
              if (cs) {
                const label = `Scene ${pad2(cs.id)} — ${cs.title} (${sceneTimeLabel(cs.id)})`;
                const fallbackCopy = () => {
                  const ta = document.createElement('textarea');
                  ta.value = label; ta.setAttribute('readonly', '');
                  ta.style.position = 'fixed'; ta.style.opacity = '0';
                  document.body.appendChild(ta); ta.select();
                  let ok = false;
                  try { ok = document.execCommand('copy'); } catch (e) {}
                  ta.remove();
                  toast(ok ? 'Timecode copied. Paste it straight into your essay.' : 'Copy failed. Select the timecode above instead.', ok ? 'notes' : 'alert');
                };
                if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(label).then(() => toast('Timecode copied. Paste it straight into your essay.', 'notes')).catch(fallbackCopy);
                else fallbackCopy();
              }
              break;
            }
            case 'retryFilm': { const player=$('#filmPlayer'); if(player){$('#playerStatus').textContent='Loading film…';target.hidden=true;player.load();} break; }
            case 'watchChapter': {
              const clip=clipFor(id),player=$('#filmPlayer'); watchSceneId=id;
              watchStopAt=Number.isFinite(clip.end)&&clip.end>clip.start?clip.end:null;
              if(player&&Number.isFinite(clip.start)){
                state.watchPos=clip.start;save();
                if(player.readyState>=1){player.currentTime=clip.start;player.playClip();}
                else{watchTarget=clip.start;watchAutoplay=true;}
                document.querySelectorAll('.chapter-row').forEach(el=>el.classList.toggle('active',Number(el.dataset.id)===id));
              }break;
            }
            case 'theme': {
              const nextTheme = isDark() ? 'light' : 'dark';
              document.documentElement.dataset.theme = nextTheme;
              try { localStorage.setItem(THEME_KEY, nextTheme); } catch (e) {}
              updateThemeBtns();
              toast(nextTheme === 'dark' ? 'Dark theme on. Easy on the eyes for late-night study.' : 'Light theme on. Bright and focused.', nextTheme === 'dark' ? 'moon' : 'sun');
              break;
            }
            case 'exportNotes': exportNotesMarkdown(); break;
          }
        });

        document.addEventListener('change', (e) => {
          const el = e.target.closest('[data-change]');
          if (el) {
            const kind = el.dataset.change;
            if (kind === 'libFacet') { const k=el.dataset.kind; const val=el.value; library[k]=el.checked ? [...new Set([...library[k],val])] : library[k].filter(v=>v!==val); renderLibraryPreservingFocus('libFacet',k,val); }
            if (kind === 'deck') { flashSetDeck(el.value, false); renderView(); }
            if (kind === 'libSort') { library.sort = el.value; renderView(); }
            if (kind === 'selFacet') { const k=el.dataset.kind; const val=el.value; selection[k]=el.checked ? [...new Set([...selection[k],val])] : selection[k].filter(v=>v!==val); renderSelectionPreservingFocus('selFacet',k,val); }
            if (kind === 'selSort') { selection.sort = el.value; renderView(); }
            if (kind === 'matchCategory') { match.category = el.value; newMatchRound(); renderView(); }
            if (kind === 'quizLen') { quiz.len = el.value === 'all' ? 'all' : Number(el.value); }
            if (kind === 'quizFocus') { quiz.focus = el.value; }
            if (kind === 'recallScene') { recall.sceneId = Number(el.value); recall.checked = false; renderView(); }
            if (kind === 'progressRange') { state.progressRange = el.value; save(); renderView(); }
            if (kind === 'progressDate') { if (el.id === 'progressStart') state.progressStart = el.value; else state.progressEnd = el.value; save(); renderView(); }
          }
          if (e.target.id === 'progressFile' && e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            e.target.value = '';
            previewProgressRestore(f);
          }
        });

        document.addEventListener('input', (e) => {
          if (['librarySearch','selectionSearch'].includes(e.target.dataset.input) && !e.isComposing) {
            const caretStart=e.target.selectionStart, caretEnd=e.target.selectionEnd;
            const searchId=e.target.id;
            (searchId==='librarySearch'?library:selection).q = e.target.value;
            renderView();
            const searchAgain = document.getElementById(searchId);
            if (searchAgain) { searchAgain.focus(); try { searchAgain.setSelectionRange(caretStart,caretEnd); } catch(e) {} }
          }
          if (e.target.id === 'recallAnswer') {
            const text = e.target.value;
            if (!text.trim()) {
              delete state.notes[recall.sceneId];
              const hadReference=recall.checked||state.activity.explanations.includes(recall.sceneId);recall.checked=false;
              state.activity.explanations=state.activity.explanations.filter(id=>id!==recall.sceneId);
              if(hadReference){save();renderView();$('#recallAnswer')?.focus();updateDraftStatus('Saving Draft…');return;}
            }
            else state.notes[recall.sceneId] = text;
            save();
            updateDraftStatus('Saving Draft…');
            const n = text.trim() ? text.trim().split(/\s+/).length : 0;
            const wc = e.target.closest('.writing-area').querySelector('.writing-meta span');
            if (wc) wc.textContent = `${n} / 40 words`;
            const bar = e.target.closest('.writing-area').querySelector('.word-target i');
            if (bar) bar.style.width = `${Math.min(100, Math.round((n / 40) * 100))}%`;
            const btn = $('.writing-actions .button.primary', viewEl);
            if (btn) btn.disabled = !text.trim();
            const actions = e.target.closest('.writing-area').querySelector('.writing-actions');
            let clearBtn = actions && actions.querySelector('[data-action="clearRecallAsk"]');
            if (text.trim() && !clearBtn && actions) {
              const nb = document.createElement('button');
              nb.className = 'text-button';
              nb.dataset.action = 'clearRecallAsk';
              nb.textContent = 'Clear Draft';
              actions.appendChild(nb);
            } else if (!text.trim() && clearBtn) clearBtn.remove();
          }
        });

        document.addEventListener('compositionend', e => {
          if (['librarySearch','selectionSearch'].includes(e.target.dataset.input)) e.target.dispatchEvent(new Event('input', { bubbles: true }));
        });
        document.addEventListener('toggle',e=>{const el=e.target;if(el.dataset?.filterGroup&&el.isConnected&&viewEl.contains(el)){const store=el.dataset.filterScope==='selection'?selection:library;store.groups[el.dataset.mode][el.dataset.filterGroup]=el.open;}},true);
        libraryPhone.addEventListener('change',()=>{if(currentView==='library'||currentView==='selection')renderView();});

        // Flashcard keyboard shortcuts
        document.addEventListener('keydown', (e) => {
          if ($('#main').inert || e.ctrlKey || e.altKey || e.metaKey) return;
          if (currentView !== 'flashcards' || !flash.order.length) return;
          if (e.target.closest('input, textarea, select') || modalRoot.childElementCount) return;
          if (e.code === 'Space' && e.target.tagName !== 'BUTTON') { e.preventDefault(); flash.flipped = !flash.flipped; renderView(); }
          else if (e.key === 'ArrowLeft') { e.preventDefault(); flashNav(-1); }
          else if (e.key === 'ArrowRight') { e.preventDefault(); flashNav(1); }
          else if (e.key === '1' && flash.flipped) { e.preventDefault(); flashRate('again'); }
          else if (e.key === '2' && flash.flipped) { e.preventDefault(); flashRate('good'); }
          else if (e.key === '3' && flash.flipped) { e.preventDefault(); flashRate('easy'); }
        });

        // Quiz keyboard shortcuts: 1-4 pick, Enter/ArrowRight next
        document.addEventListener('keydown', (e) => {
          if ($('#main').inert || e.ctrlKey || e.altKey || e.metaKey) return;
          if (currentView !== 'quiz' || !quiz.qs.length || quiz.done) return;
          if (e.target.closest('input, textarea, select') || modalRoot.childElementCount) return;
          if (e.key==='Enter' && e.target.closest('button')) return;
          const q = quiz.qs[quiz.idx];
          if (!q) return;
          if (['1', '2', '3', '4'].includes(e.key)) {
            const i = Number(e.key) - 1;
            if (q.options[i] && quiz.picked == null) { e.preventDefault(); quizPick(q.options[i].id); }
          } else if ((e.key === 'Enter' || e.key === 'ArrowRight') && quiz.picked != null) {
            e.preventDefault(); quizNext();
          }
        });

        // "/" jumps to the library / selection search
        document.addEventListener('keydown', (e) => {
          if ($('#main').inert || e.ctrlKey || e.altKey || e.metaKey) return;
          if ((currentView !== 'library' && currentView !== 'selection') || e.key !== '/') return;
          if (e.target.closest('input, textarea, select') || modalRoot.childElementCount) return;
          e.preventDefault();
          const inp = currentView === 'library' ? $('#librarySearch') : $('#selectionSearch');
          if (inp) { inp.focus(); inp.select(); }
        });

        // Escape closes modal; mobile nav toggle
        document.addEventListener('keydown', (e) => {
          if(e.key!=='Escape')return;
          if(modalRoot.childElementCount){e.preventDefault();closeModal();}
          else if(document.body.classList.contains('nav-open')){e.preventDefault();setNavOpen(false);}
          else if(currentView==='library'&&library.open){e.preventDefault();library.open=false;renderLibraryPreservingFocus('libFilters');}
          else if(currentView==='selection'&&selection.open){e.preventDefault();selection.open=false;renderSelectionPreservingFocus('selFilters');}
        });
        // Keep keyboard focus inside an open dialog
        document.addEventListener('keydown', (e) => {
          if (e.key !== 'Tab' || !modalRoot.childElementCount) return;
          const dlg = $('.modal', modalRoot);
          if (!dlg) return;
          const items = [...dlg.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter((el) => !el.disabled);
          if (!items.length) { e.preventDefault(); dlg.focus(); return; }
          const first = items[0], last = items[items.length - 1];
          if (e.shiftKey && (document.activeElement === first || document.activeElement === dlg || !dlg.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && (document.activeElement === last || !dlg.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
        });
        $('#menuBtn').innerHTML = icon('menu', 22);
        let navLastFocus = null;
        const mobileQuery=matchMedia('(max-width:900px)');
        function syncOverlays(){
          const modal=!!modalRoot.childElementCount,nav=mobileQuery.matches&&document.body.classList.contains('nav-open');
          $('#sidebar').inert=modal||(mobileQuery.matches&&!nav);
          $('#main').inert=modal||nav;
          $('.mobile-topbar').inert=modal||nav;
          document.body.style.overflow=modal||nav?'hidden':'';
        }
        function setNavOpen(open){
          if(open)navLastFocus=document.activeElement;
          document.body.classList.toggle('nav-open',open);$('#menuBtn').setAttribute('aria-expanded',String(open));syncOverlays();
          if(open)$('#navClose').focus();else if(navLastFocus?.isConnected)navLastFocus.focus();
        }
        $('#menuBtn').addEventListener('click',()=>setNavOpen(!document.body.classList.contains('nav-open')));
        $('#navClose').addEventListener('click',()=>setNavOpen(false));
        $('#sidebarOverlay').addEventListener('click',()=>setNavOpen(false));
        mobileQuery.addEventListener('change',()=>{if(!mobileQuery.matches){document.body.classList.remove('nav-open');$('#menuBtn').setAttribute('aria-expanded','false');}syncOverlays();});
        document.addEventListener('keydown',e=>{
          if(e.key!=='Tab'||!mobileQuery.matches||!document.body.classList.contains('nav-open')||modalRoot.childElementCount)return;
          const items=[...$('#sidebar').querySelectorAll('button')].filter(el=>!el.disabled&&el.getBoundingClientRect().height);
          if(!items.length)return;const first=items[0],last=items.at(-1);
          if(e.shiftKey&&(document.activeElement===first||!$('#sidebar').contains(document.activeElement))){e.preventDefault();last.focus();}
          else if(!e.shiftKey&&(document.activeElement===last||!$('#sidebar').contains(document.activeElement))){e.preventDefault();first.focus();}
        });

        /* ================= THEME ================= */
        const THEME_KEY = 'scenestudy-theme';
        const isDark = () => document.documentElement.dataset.theme === 'dark';
        function updateThemeBtns() {
          const dark = isDark();
          const label = dark ? 'Light Mode' : 'Dark Mode';
          document.querySelectorAll('[data-action="theme"]').forEach((b) => {
            b.innerHTML = `${icon(dark ? 'sun' : 'moon', 18)}<span>${label}</span>`;
            b.setAttribute('aria-label', `Switch To ${label}`);
            b.title = `Switch To ${label}`;
          });
          const meta = document.querySelector('meta[name="theme-color"]');
          if (meta) meta.setAttribute('content', dark ? '#15170f' : '#fcfcf9');
        }

        function exportNotesMarkdown() {
          const L = [];
          L.push(`# ${FILM_NAME} — Study Notes`, '');
          L.push(`_Generated by SceneStudy on ${new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}_`, '');
          getScenes().forEach((s) => {
            const m = masteryOf(s.id);
            L.push(`## ${pad2(s.id)} — ${s.title}`, '');
            const meta = [];
            if (s.character) meta.push(`**Character:** ${s.character}`);
            if (s.analysisType) meta.push(`**Essay type:** ${s.analysisType}`);
            meta.push(`**Importance:** ${importanceOf(s)}/10 — ${s.essayImportance?.reason || ''}`);
            const tg = tagsOf(s);
            if (tg.length) meta.push(`**Themes:** ${tg.map(tagLabel).join(', ')}`);
            meta.push(`**Techniques:** ${techniquesOf(s).map(techniqueLabel).join(', ')}`);
            if (meta.length) L.push(meta.join('  \n'), '');
            if (s.description) L.push(`**What happens.** ${s.description}`, '');
            if (s.keyLine) L.push(`**Key line.** “${s.keyLine}”`, '');
            if (s.techniques || s.techniqueLabel) L.push(`**How it's filmed.** ${exportAnalysis(s.techniqueLabel,s.techniques)}`, '');
            if (s.watchFor) L.push(`**What to watch for.** ${s.watchFor}`, '');
            if (s.essay || s.meaningLabel) L.push(`**Why it matters.** ${exportAnalysis(s.meaningLabel,s.essay)}`, '');
            if (s.historyNote) L.push(`**History note.** ${s.historyNote}`, '');
            if (s.essayStarter) L.push(`**Essay starter.** ${s.essayStarter}`, '');
            L.push(`**Film time.** ${sceneTimeLabel(s.id)}`, '');
            if (s.cueText) L.push(`> Visual cue: ${s.cueText}`, '');
            const note = state.notes[s.id];
            if (note && note.trim()) L.push(`**My notes.** ${note.trim()}`, '');
            L.push(`**Mastery:** ${m === 'confident' ? 'Confident' : m === 'learning' ? 'Learning' : 'Not studied'}${state.bookmarks.includes(s.id) ? ' · bookmarked' : ''}`, '', '---', '');
          });
          const fname = FILM_NAME.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          downloadFile(L.join('\n'), `${fname}-study-notes.md`, 'text/markdown');
          toast('Study notes downloaded as Markdown — ready for Notion or Docs.', 'notes');
        }

        function exportAnalysis(label='',body='') {
          label=label.trim();body=body.trim();
          const normalize=text=>text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
          const a=normalize(label),b=normalize(body);
          if(!a||a===b||(label.length>85&&b.includes(a)))return body||label;
          if(!b)return label;
          return `_${label}_ — ${body}`;
        }

        /* ================= INIT ================= */
        $('#brandMark').innerHTML = BRAND_MARK;
        $('#mobileBrandMark').innerHTML = BRAND_MARK;
        $('#footMark').innerHTML = BRAND_MARK;
        updateThemeBtns();
        resetViewStates();
        renderNav();
        renderView();
        syncOverlays();
      })();
