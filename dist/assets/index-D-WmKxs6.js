(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=!1,t=[],n=null,r=null,i=null,a=null,o=null,s=[{id:0,title:`Pacific Ocean Warming`,lat:0,lon:-160,color:`#00ffcc`},{id:1,title:`Mauna Loa CO₂ Observatory`,lat:19.54,lon:-155.56,color:`#f3e600`},{id:2,title:`Antarctic Sea Ice Station`,lat:-75.25,lon:.07,color:`#38bdf8`}];function c(){let t=document.getElementById(`earth-canvas-container`);if(!t){console.error(`Earth container not found!`);return}if(e){l();return}if(!window.THREE){console.error(`Three.js is not loaded. Check the Three.js script in index.html.`);return}let s=window.THREE,c=t.clientWidth||window.innerWidth,u=t.clientHeight||window.innerHeight,p=new s.Scene,m=new s.PerspectiveCamera(45,c/u,.1,1e3);m.position.z=3.2,r=m;let h=new s.WebGLRenderer({antialias:!0,alpha:!0});h.setSize(c,u),h.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),h.domElement.style.width=`100%`,h.domElement.style.height=`100%`,h.domElement.style.display=`block`,t.appendChild(h.domElement),i=h;let g=new s.TextureLoader,_=g.load(`https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg`),v=g.load(`https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg`),y=g.load(`https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png`),b=new s.Group;p.add(b),n=b;let x=new s.Mesh(new s.SphereGeometry(1,64,64),new s.MeshStandardMaterial({map:_,specularMap:v,roughness:.5,metalness:.1}));b.add(x);let S=new s.Mesh(new s.SphereGeometry(1.015,64,64),new s.MeshStandardMaterial({map:y,transparent:!0,opacity:.4,blending:s.AdditiveBlending,depthWrite:!1}));b.add(S);let C=new s.Mesh(new s.SphereGeometry(1.04,64,64),new s.MeshBasicMaterial({color:65484,transparent:!0,opacity:.12,side:s.BackSide}));b.add(C),p.add(new s.AmbientLight(16777215,.9));let w=new s.DirectionalLight(16777215,1.4);w.position.set(5,3,5),p.add(w),d(t);let T=!1,E={x:0,y:0};t.addEventListener(`mousedown`,e=>{T=!0,E={x:e.clientX,y:e.clientY}}),window.addEventListener(`mouseup`,()=>{T=!1}),t.addEventListener(`mouseleave`,()=>{T=!1}),t.addEventListener(`mousemove`,e=>{T&&(b.rotation.y+=(e.clientX-E.x)*.005,b.rotation.x+=(e.clientY-E.y)*.005,E={x:e.clientX,y:e.clientY})});function D(){a=requestAnimationFrame(D),T||(b.rotation.y+=.0015,S.rotation.y+=.002),f(),h.render(p,m)}D(),o=l,window.addEventListener(`resize`,o),e=!0,console.log(`3D Earth initialized successfully!`)}function l(){let e=document.getElementById(`earth-canvas-container`);if(!e||!r||!i)return;let t=e.clientWidth||window.innerWidth,n=e.clientHeight||window.innerHeight;r.aspect=t/n,r.updateProjectionMatrix(),i.setSize(t,n),f()}function u(e,t,n){let r=window.THREE,i=(90-e)*(Math.PI/180),a=(t+180)*(Math.PI/180),o=-(n*Math.sin(i)*Math.cos(a)),s=n*Math.sin(i)*Math.sin(a),c=n*Math.cos(i);return new r.Vector3(o,c,s)}function d(e){window.THREE,e.querySelectorAll(`.earth-gps-pin`).forEach(e=>e.remove()),t=s.map(t=>{let n=document.createElement(`div`);return n.className=`earth-gps-pin`,n.innerHTML=`
      <div class="pin-dot"
        style="
          background:${t.color};
          box-shadow:0 0 12px ${t.color};
        ">
      </div>

      <div class="pin-label">
        <span>📍 ${t.title}</span>
      </div>
    `,n.addEventListener(`click`,()=>{typeof window.goToStage==`function`&&window.goToStage(`stage-jukebox`),typeof window.selectEvent==`function`?window.selectEvent(t.id,!0):console.error(`selectEvent function is not available.`)}),e.appendChild(n),{el:n,lat:t.lat,lon:t.lon}})}function f(){if(!n||!r)return;let e=window.THREE,i=document.getElementById(`earth-canvas-container`);if(!i)return;let a=i.clientWidth,o=i.clientHeight;if(!a||!o)return;let s=a/2,c=o/2;n.updateMatrixWorld(!0),t.forEach(t=>{let i=u(t.lat,t.lon,1.02);i.applyEuler(n.rotation),i.project(r);let a=u(t.lat,t.lon,1);a.applyEuler(n.rotation);let o=new e.Matrix3().getNormalMatrix(n.matrixWorld),l=a.clone().applyMatrix3(o).normalize(),d=r.position.clone().sub(n.position).normalize();if(l.dot(d)>-.15&&i.z<1){let e=i.x*s+s,n=-(i.y*c)+c;t.el.style.transform=`translate(-50%, -50%) translate(${e}px, ${n}px)`,t.el.style.opacity=`1`,t.el.style.pointerEvents=`auto`}else t.el.style.opacity=`0`,t.el.style.pointerEvents=`none`})}window.EarthExperience={initialize:c,resize:l},window.EarthExperience.destroy=function(){a&&cancelAnimationFrame(a),o&&window.removeEventListener(`resize`,o),i&&(i.dispose(),i.domElement.remove());let s=document.getElementById(`earth-canvas-container`);s&&s.querySelectorAll(`.earth-gps-pin`).forEach(e=>e.remove()),t=[],n=null,r=null,i=null,a=null,o=null,e=!1};var p=[{id:0,category:`ATMOSPHERE & GLOBAL TEMP`,title:`2024 Global Heat & Ocean Warming Anomaly`,date:`July 2024`,coords:`0.00° N, 160.00° W (Pacific & Global)`,satellite:`NASA Aqua / CERES & Terra`,chord:[261.63,329.63,392,493.88],narration:`Listen closely to the warmth of our oceans. In July 2024, NASA's Aqua and Terra satellites recorded Earth's warmest global surface temperatures in modern history. Rising ocean heat acts like a fever across the planet, energizing tropical storms and reshaping jet streams.`,metrics:{tempAnomaly:`+1.35 °C`,co2:`425.1 ppm`,seaIce:`14.2 M km²`,severity:`High`},timeline:[{year:`1980`,val:35,label:`0.35°C`},{year:`1995`,val:52,label:`0.52°C`},{year:`2010`,val:74,label:`0.74°C`},{year:`2020`,val:90,label:`1.02°C`},{year:`2024`,val:100,label:`1.35°C`}]},{id:1,category:`ATMOSPHERIC CARBON (NOAA)`,title:`NOAA Mauna Loa CO₂ Peak Acceleration`,date:`May 2024`,coords:`19.54° N, 155.56° W (Hawaii, USA)`,satellite:`NOAA GML & NASA OCO-2`,chord:[293.66,349.23,440,523.25],narration:`At the NOAA Mauna Loa Observatory in Hawaii, atmospheric carbon dioxide concentrations crossed a new milestone. Continuous monitoring proves how human industrial emissions continue to trap thermal energy in the troposphere, driving global climate shifts.`,metrics:{tempAnomaly:`+1.28 °C`,co2:`426.9 ppm`,seaIce:`13.8 M km²`,severity:`Critical`},timeline:[{year:`1980`,val:30,label:`338 ppm`},{year:`1995`,val:50,label:`360 ppm`},{year:`2010`,val:70,label:`390 ppm`},{year:`2020`,val:88,label:`414 ppm`},{year:`2024`,val:98,label:`426 ppm`}]},{id:2,category:`CRYOSPHERE & SEA ICE`,title:`Antarctic Sea Ice Winter Minimum Retreat`,date:`September 2024`,coords:`75.25° S, 0.07° E (Antarctica)`,satellite:`NASA ICESat-2 & Nimbus Archive`,chord:[329.63,392,493.88,587.33],narration:`At the bottom of the world, NASA's ICESat-2 laser altimeter measured Antarctic sea ice struggling to regrow during winter. Sea ice acts as Earth's bright white shield, reflecting sunlight back into space. As ice thins, dark oceans absorb more solar heat.`,metrics:{tempAnomaly:`+2.10 °C (Polar)`,co2:`424.0 ppm`,seaIce:`16.5 M km² (Low)`,severity:`Severe`},timeline:[{year:`1990`,val:95,label:`18.2M`},{year:`2000`,val:90,label:`17.9M`},{year:`2014`,val:98,label:`18.5M`},{year:`2020`,val:72,label:`16.8M`},{year:`2024`,val:55,label:`16.1M`}]}],m=!1,h=null,g=[],_=.7,v=1;function y(e){try{let t=new(window.AudioContext||window.webkitAudioContext);t.state===`suspended`&&t.resume();let n=t.createOscillator(),r=t.createGain();n.type=`sine`,n.frequency.setValueAtTime(e,t.currentTime),r.gain.setValueAtTime(.001,t.currentTime),r.gain.exponentialRampToValueAtTime(Math.max(.001,_*.1),t.currentTime+.1),r.gain.exponentialRampToValueAtTime(.001,t.currentTime+1.2),n.connect(r),r.connect(t.destination),n.start(),n.stop(t.currentTime+1.2),n.onended=()=>t.close()}catch(e){console.error(`Tone playback error:`,e)}}function b(e){if(!(`speechSynthesis`in window))return;window.speechSynthesis.cancel();let t=new SpeechSynthesisUtterance(e);t.rate=v,t.pitch=1.05,window.speechSynthesis.speak(t)}function x(e){if(e){S(),m=!0,C(!0);try{h=new(window.AudioContext||window.webkitAudioContext),h.state===`suspended`&&h.resume();let t=h.createGain();t.gain.setValueAtTime(.001,h.currentTime),t.gain.exponentialRampToValueAtTime(Math.max(.001,_*.08),h.currentTime+1.5),t.connect(h.destination),e.chord.forEach((e,n)=>{let r=h.createOscillator();r.type=n%2==0?`sine`:`triangle`,r.frequency.setValueAtTime(e,h.currentTime),r.connect(t),r.start(),g.push(r)})}catch(e){console.warn(`Web Audio error:`,e)}if(`speechSynthesis`in window){window.speechSynthesis.cancel();let t=new SpeechSynthesisUtterance(e.narration);t.rate=v,t.pitch=1.05,t.onend=()=>{S()},t.onerror=()=>{S()},window.speechSynthesis.speak(t)}}}function S(){if(m=!1,C(!1),`speechSynthesis`in window&&window.speechSynthesis.cancel(),g.forEach(e=>{try{e.stop()}catch{}}),g=[],h){try{h.close()}catch{}h=null}}function C(e){let t=document.getElementById(`btn-play-pause`),n=document.getElementById(`now-playing-badge`),r=document.getElementById(`equalizer`),i=document.getElementById(`cd-disk`),a=document.getElementById(`tone-arm`);t&&(t.textContent=e?`⏸`:`▶`),n&&(n.textContent=e?`NARRATING & SONIFYING`:`READY TO PLAY`),r&&r.classList.toggle(`playing`,e),i&&i.classList.toggle(`spinning`,e),a&&a.classList.toggle(`engaged`,e)}function w(e){_=Math.max(0,Math.min(1,Number(e)||0))}function T(e){v=Math.max(.5,Math.min(2,Number(e)||1))}window.nasaEvents=p,window.playTone=y,window.speakText=b,window.playMelodiousNarration=x,window.stopMelodiousAudio=S,window.setMasterVolume=w,window.setNarrationSpeed=T,Object.defineProperty(window,"isPlaying",{configurable:!0,get:()=>m}),Object.defineProperty(window,"masterVolume",{configurable:!0,get:()=>_}),Object.defineProperty(window,"narrationSpeed",{configurable:!0,get:()=>v});var E=0,D=`f1`,O=`spring`;window.goToStage=function(e){[`stage-landing`,`stage-3d`,`stage-jukebox`,`stage-astronauts`].forEach(e=>{let t=document.getElementById(e);t&&t.classList.remove(`active`)});let t=document.getElementById(e);t?(t.classList.add(`active`),e===`stage-3d`&&!window.earth3DInitialized&&(window.EarthExperience&&typeof window.EarthExperience.initialize==`function`?(window.EarthExperience.initialize(),window.earth3DInitialized=!0):console.error(`EarthExperience not found. Check earth.js and its script loading.`)),e===`stage-astronauts`&&window.renderAstronautCards?.()):console.error(`Stage not found:`,e)},document.addEventListener(`DOMContentLoaded`,()=>{let e=document.getElementById(`btn-explore`);e&&e.addEventListener(`click`,()=>{window.goToStage(`stage-3d`)});let t=document.getElementById(`btn-to-jukebox`);t&&t.addEventListener(`click`,()=>{window.goToStage(`stage-jukebox`),k(),window.selectEvent(0,!1)});let n=document.getElementById(`btn-back-3d`);n&&n.addEventListener(`click`,()=>{window.stopMelodiousAudio?.(),window.goToStage(`stage-3d`)})});function k(){let e=document.getElementById(`playlist-container`);e&&window.nasaEvents&&(e.innerHTML=window.nasaEvents.map((e,t)=>`
    <div class="track-card ${t===E?`active`:``}"
         onclick="selectEvent(${t}, true)">

      <div class="track-card-top">
        <span>TRACK 0${t+1} • ${e.category}</span>
        <span>${e.date}</span>
      </div>

      <h4>${e.title}</h4>
      <p>${e.satellite}</p>

    </div>
  `).join(``))}window.selectEvent=function(e,t=!0){if(!window.nasaEvents||!window.nasaEvents[e]){console.error(`NASA event not found:`,e);return}E=e;let n=window.nasaEvents[e],r=document.getElementById(`deck-title`),i=document.getElementById(`deck-coords`);r&&(r.textContent=n.title),i&&(i.textContent=`📍 ${n.coords}`),k(),I(D),t&&window.playMelodiousNarration?.(n)};var A=document.getElementById(`btn-play-pause`);A&&A.addEventListener(`click`,()=>{window.isPlaying?window.stopMelodiousAudio?.():window.nasaEvents?.[E]&&window.playMelodiousNarration?.(window.nasaEvents[E])});var j=document.getElementById(`btn-stop`);j&&j.addEventListener(`click`,()=>{window.stopMelodiousAudio?.()});var M=document.getElementById(`btn-next`);M&&M.addEventListener(`click`,()=>{if(!window.nasaEvents?.length)return;let e=(E+1)%window.nasaEvents.length;window.selectEvent(e,!0)});var N=document.getElementById(`btn-prev`);N&&N.addEventListener(`click`,()=>{if(!window.nasaEvents?.length)return;let e=(E-1+window.nasaEvents.length)%window.nasaEvents.length;window.selectEvent(e,!0)});var P=document.getElementById(`volume-slider`);P&&P.addEventListener(`input`,e=>{window.setMasterVolume?.(e.target.value);let t=document.getElementById(`vol-val`);t&&(t.textContent=`${Math.round((window.masterVolume??.7)*100)}%`)});var F=document.getElementById(`speed-slider`);F&&F.addEventListener(`input`,e=>{window.setNarrationSpeed?.(e.target.value);let t=document.getElementById(`speed-val`);t&&(t.textContent=`${(window.narrationSpeed??1).toFixed(2)}x`)}),document.querySelectorAll(`.tab-btn`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.tab-btn`).forEach(e=>{e.classList.remove(`active`)}),e.classList.add(`active`),D=e.getAttribute(`data-tab`),I(D)})}),window.setSeasonView=function(e){[`spring`,`summer`,`autumn`,`winter`].includes(e)&&(O=e,I(`f7`))};function I(e){let t=document.getElementById(`feature-viewport`);if(!t||!window.nasaEvents)return;let n=window.nasaEvents[E];if(n)switch(e){case`f1`:t.innerHTML=`
        <span class="badge">${n.category}</span>

        <h2>${n.title}</h2>

        <p style="color:var(--text-dim); margin-top:4px;">
          Observed by <strong>${n.satellite}</strong> • ${n.date}
        </p>

        <div class="narration-script">
          “${n.narration}”
        </div>

        <button class="primary-btn"
          onclick="playMelodiousNarration(nasaEvents[${n.id}])">
          ♪ Play Audio Narration
        </button>

        <div class="card-grid">

          <div class="data-box">
            <h4>NASA TEMP ANOMALY</h4>
            <div class="big-val">${n.metrics.tempAnomaly}</div>
          </div>

          <div class="data-box">
            <h4>NOAA CO₂ LEVEL</h4>
            <div class="big-val">${n.metrics.co2}</div>
          </div>

          <div class="data-box">
            <h4>SEA-ICE EXTENT</h4>
            <div class="big-val">${n.metrics.seaIce}</div>
          </div>

        </div>
      `;break;case`f2`:t.innerHTML=`
        <h2>2. Scientific Data Sonification Synthesizer</h2>

        <p style="color:var(--text-dim);">
          Earth telemetry translated into musical frequencies.
        </p>

        <div class="card-grid">

          ${n.chord.map((e,t)=>`
            <div class="data-box" style="text-align:center;">

              <h4>TELEMETRY FREQ ${t+1}</h4>

              <div class="big-val">${e} Hz</div>

              <button class="ghost-btn" style="margin-top:10px;"
                onclick="playTone(${e})">
                ▶ Audition Tone
              </button>

            </div>
          `).join(``)}

        </div>
      `;break;case`f3`:t.innerHTML=`
        <h2>3. NASA Global Surface Temperature Data</h2>

        <p style="color:var(--text-dim);">
          Analyzing multi-decadal global temperature anomalies.
        </p>

        <div class="card-grid" style="margin-top:16px;">

          <div class="data-box">
            <h4>CURRENT ANOMALY</h4>

            <div class="big-val" style="color:var(--yellow);">
              ${n.metrics.tempAnomaly}
            </div>
          </div>

          <div class="data-box">
            <h4>SEVERITY INDEX</h4>

            <div class="big-val" style="color:var(--cyan);">
              ${n.metrics.severity}
            </div>
          </div>

        </div>
      `;break;case`f4`:t.innerHTML=`
        <h2>4. NOAA Mauna Loa Atmospheric CO₂</h2>

        <p style="color:var(--text-dim);">
          Direct atmospheric sampling tracking carbon accumulation.
        </p>

        <div class="card-grid" style="margin-top:16px;">

          <div class="data-box">
            <h4>RECORDED CONCENTRATION</h4>

            <div class="big-val" style="color:var(--cyan);">
              ${n.metrics.co2}
            </div>
          </div>

          <div class="data-box">
            <h4>ANNUAL GROWTH RATE</h4>
            <div class="big-val">+2.8 ppm/yr</div>
          </div>

        </div>
      `;break;case`f5`:t.innerHTML=`
        <h2>5. Polar Sea-Ice Extent & Cryosphere</h2>

        <p style="color:var(--text-dim);">
          Continuous passive microwave satellite monitoring of polar ice caps.
        </p>

        <div class="card-grid" style="margin-top:16px;">

          <div class="data-box">
            <h4>RECORDED EXTENT</h4>

            <div class="big-val" style="color:var(--yellow);">
              ${n.metrics.seaIce}
            </div>
          </div>

          <div class="data-box">
            <h4>DECADAL DECLINE</h4>
            <div class="big-val">-12.6% / decade</div>
          </div>

        </div>
      `;break;case`f6`:{let e=n.timeline.map((e,t)=>`${50+t*130},${180-e.val/100*130}`).join(` `);t.innerHTML=`
        <h2>6. Historical Multi-Decadal Progression & Trend Graph</h2>

        <p style="color:var(--text-dim); margin-bottom:12px;">
          Comparative index growth across selected observation milestones.
        </p>

        <div style="
          background:rgba(0,0,0,0.4);
          border:1px solid var(--border-glass);
          border-radius:12px;
          padding:20px;
        ">

          <svg viewBox="0 0 600 220"
            style="width:100%; height:200px; overflow:visible;">

            <line x1="40" y1="30" x2="560" y2="30"
              stroke="rgba(255,255,255,0.08)"
              stroke-dasharray="4"/>

            <line x1="40" y1="105" x2="560" y2="105"
              stroke="rgba(255,255,255,0.08)"
              stroke-dasharray="4"/>

            <line x1="40" y1="180" x2="560" y2="180"
              stroke="rgba(255,255,255,0.15)"/>

            <defs>
              <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#00ffcc" stop-opacity="0.35"/>
                <stop offset="100%" stop-color="#00ffcc" stop-opacity="0"/>
              </linearGradient>
            </defs>

            <polygon
              points="50,180 ${e} 560,180"
              fill="url(#trendGrad)"/>

            <polyline
              fill="none"
              stroke="#00ffcc"
              stroke-width="3"
              points="${e}"/>

            ${n.timeline.map((e,t)=>{let n=50+t*130,r=180-e.val/100*130;return`
                <g>

                  <circle cx="${n}" cy="${r}" r="6"
                    fill="#f3e600"
                    stroke="#050811"
                    stroke-width="2"/>

                  <text x="${n}" y="${r-14}"
                    fill="#fff"
                    font-size="11"
                    font-weight="bold"
                    text-anchor="middle">
                    ${e.label}
                  </text>

                  <text x="${n}" y="205"
                    fill="#94a3b8"
                    font-size="12"
                    text-anchor="middle">
                    ${e.year}
                  </text>

                </g>
              `}).join(``)}

          </svg>

        </div>

        <div class="card-grid" style="margin-top:16px;">

          ${n.timeline.map(e=>`
            <div class="data-box"
              style="padding:12px; text-align:center;">

              <span style="font-size:0.75rem; color:var(--text-dim);">
                ${e.year} Milestone
              </span>

              <div style="
                font-size:1.2rem;
                font-weight:bold;
                color:var(--cyan);
                margin-top:4px;
              ">
                ${e.label}
              </div>

            </div>
          `).join(``)}

        </div>
      `;break}case`f7`:{let e={spring:{title:`Spring (Vernal Equinox)`,desc:`As Earth's axial tilt leans toward the Sun, snowpack melts rapidly, triggering greening waves across continents.`,albedo:`Decreasing`,color:`#10b981`},summer:{title:`Summer (Solstice & Peak Thermal)`,desc:`Peak solar irradiance warms continental interiors. Arctic sea ice reaches minimum extent.`,albedo:`Lowest polar reflection`,color:`#f3e600`},autumn:{title:`Autumn (Autumnal Equinox)`,desc:`Solar angle decreases. Deciduous forests display widespread leaf senescence and color changes.`,albedo:`Transitioning toward frost`,color:`#f97316`},winter:{title:`Winter (Solstice & Cryosphere Growth)`,desc:`The Northern Hemisphere tilts away from the Sun, expanding snow cover and maximizing Earth's albedo.`,albedo:`Highest annual reflection`,color:`#38bdf8`}}[O];t.innerHTML=`
        <h2>7. Seasonal Earth Dynamics & Albedo Shift</h2>

        <p style="color:var(--text-dim); margin-bottom:16px;">
          How Earth's 23.5° axial tilt transforms planetary reflectance.
        </p>

        <div class="season-selector">

          <button class="season-btn ${O===`spring`?`active`:``}"
            onclick="setSeasonView('spring')">
            🌱 Spring
          </button>

          <button class="season-btn ${O===`summer`?`active`:``}"
            onclick="setSeasonView('summer')">
            ☀️ Summer
          </button>

          <button class="season-btn ${O===`autumn`?`active`:``}"
            onclick="setSeasonView('autumn')">
            🍂 Autumn
          </button>

          <button class="season-btn ${O===`winter`?`active`:``}"
            onclick="setSeasonView('winter')">
            ❄️ Winter
          </button>

        </div>

        <div class="season-card">

          <h3 style="color:${e.color};">
            ${e.title}
          </h3>

          <p style="
            line-height:1.6;
            margin-bottom:14px;
            color:var(--text-light);
          ">
            ${e.desc}
          </p>

          <button id="btn-speak-season"
            class="primary-btn"
            style="margin-bottom:16px; font-size:0.85rem; padding:10px 20px;">
            🔊 Listen to Seasonal Narration
          </button>

          <div class="card-grid">

            <div class="data-box">
              <h4>ALBEDO STATUS</h4>

              <div style="font-size:0.95rem; color:var(--cyan); margin-top:6px;">
                ${e.albedo}
              </div>
            </div>

            <div class="data-box">
              <h4>SATELLITE</h4>

              <div style="font-size:0.95rem; color:#fff; margin-top:6px;">
                MODIS & VIIRS Imaging
              </div>
            </div>

          </div>

        </div>
      `;let n=document.getElementById(`btn-speak-season`);n&&n.addEventListener(`click`,()=>{window.speakText?.(`${e.title}. ${e.desc}`)});break}default:t.innerHTML=`
        <h2>Feature not found</h2>
        <p>Please select another tab.</p>
      `}}var L=[{name:`Yuri Gagarin`,mission:`Vostok 1 (1961)`,tagline:`I see Earth! It is so beautiful.`,achievement:`First human to journey into outer space, completing one orbit of Earth.`,soundFreq:440,imgSrc:`https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcRGFCms2Q70JCKRBzr0zkWY2Np5Ar9scy3K9fXUMwv-MdcomJo7avGfm2a-kIiq4qAL-qlk2eISJVFyHMxW_oAjifw5EXExl3q0x0ZQUJ6BneeExEeVTcNzupazl_Vm93DNCTIFIyHV44E&s=19`},{name:`John Glenn`,mission:`Friendship 7 (1962)`,tagline:`Zero G and I feel fine.`,achievement:`First American to orbit Earth, later returning to space at age 77.`,soundFreq:493.88,imgSrc:`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR58bTvul1rdspdKHAYmuAZ-IlDtc0pmuGEJ1rapk3yljN4bCr21XP4u8bIojhu7wKF6Mrp4SsuiguuvTeWx-1h2aRFviUof-5XzyvpB5iMNQ&s=10`},{name:`Valentina Tereshkova`,mission:`Vostok 6 (1963)`,tagline:`Hey sky, take off your hat, I am coming in!`,achievement:`First woman to fly in space, orbiting Earth 48 times.`,soundFreq:523.25,imgSrc:`https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTMTEPYJsEO-BLSel4XlV80befSE5ua9cNxERce2RRxKAk7WXxlJjLlKyIqpwTiT_RQ0rWKPjLZSmRL5M4`},{name:`Neil Armstrong`,mission:`Apollo 11 (1969)`,tagline:`One small step for man, one giant leap for mankind.`,achievement:`First human to set foot on the Moon, witnessing Earth rise.`,soundFreq:587.33,imgSrc:`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpnIoIwHrsVa5DAcnb2PMvN-4dmMrj8obSdzpTf7dF-ESo4FlirVVPZctiflKra5AptzgWaridvIQ4iJuYMBLBlIQnGeA72gH1h3SAy08gew&s=10`},{name:`Buzz Aldrin`,mission:`Apollo 11 (1969)`,tagline:`Magnificent desolation.`,achievement:`Lunar module pilot on Apollo 11 and second human to walk on the Moon.`,soundFreq:622.25,imgSrc:`https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Buzz_Aldrin.jpg/960px-Buzz_Aldrin.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=thumbnail`},{name:`Sally Ride`,mission:`STS-7 Challenger (1983)`,tagline:`The stars do not look bigger, but they do look brighter.`,achievement:`First American woman in space, studying Earth's ozone layer.`,soundFreq:659.25,imgSrc:`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkAgVu_-5i1xxlAaVGLvrIVX9bBROyoCZio5iCxhoBvA&s`},{name:`Mae Jemison`,mission:`STS-47 Endeavour (1992)`,tagline:`The future belongs to those who can see potential.`,achievement:`First African American woman in space, conducting bone cell research.`,soundFreq:698.46,imgSrc:`https://cdn.britannica.com/42/93242-050-54D76369/Mae-Jemison-space-shuttle-Endeavour.jpg`},{name:`Chris Hadfield`,mission:`Expedition 34/35 (2013)`,tagline:`Earth is our shared fragile home.`,achievement:`Commander of the ISS who popularized orbital photography and music.`,soundFreq:783.99,imgSrc:`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTPbpT8ujcRkbuIZSpsftCC-ZPfsxlKdEH9Pego3Wz6e3t_34iGXxHzxNzoS0gC666qUwCF_fKLQ7jF5xgNHug3GydCS4BslAUYM4G8g&s=10`}];function R(){let e=document.getElementById(`astro-grid-container`);e?e.innerHTML=L.map(e=>`

    <div class="astro-card"
      onclick="toggleCardFlip(event, this)">

      <div class="astro-card-inner">

        <div class="astro-card-front">

          <div>
            <img
              src="${e.imgSrc}"
              class="astro-avatar"
              alt="${e.name}"
              loading="lazy"
            >

            <h3>${e.name}</h3>

            <span class="astro-mission">
              ${e.mission}
            </span>
          </div>

          <div class="astro-tagline">
            “${e.tagline}”
          </div>

          <span style="font-size:0.7rem; color:var(--text-dim);">
            Click to flip card ↺
          </span>

        </div>

        <div class="astro-card-back">

          <h4>MISSION PROFILE</h4>

          <p>${e.achievement}</p>

          <div style="
            display:flex;
            gap:8px;
            width:100%;
            margin-top:auto;
          ">

            <button class="sound-trigger-btn"
              onclick="playAstroSound(event, ${e.soundFreq})">
              🎵 Tone
            </button>

            <button class="sound-trigger-btn"
              style="
                background:rgba(243,230,0,0.15);
                border-color:var(--yellow);
                color:var(--yellow);
              "
              onclick="speakAstroDetails(
                event,
                '${e.name}',
                '${e.mission}',
                '${e.tagline}',
                '${e.achievement}'
              )">
              🔊 Read
            </button>

          </div>

        </div>

      </div>

    </div>

  `).join(``):console.error(`Astronaut grid container not found.`)}window.toggleCardFlip=function(e,t){e.target.tagName===`BUTTON`||e.target.closest(`button`)||t.classList.toggle(`flipped`)},window.playAstroSound=function(e,t){e.stopPropagation();try{let e=window.AudioContext||window.webkitAudioContext;if(!e){console.error(`Web Audio API is not supported.`);return}let n=new e,r=n.createOscillator(),i=n.createGain();r.type=`sine`,r.frequency.setValueAtTime(t,n.currentTime),i.gain.setValueAtTime(.001,n.currentTime),i.gain.exponentialRampToValueAtTime(.12,n.currentTime+.1),i.gain.exponentialRampToValueAtTime(.001,n.currentTime+1.5),r.connect(i),i.connect(n.destination),r.start(),r.stop(n.currentTime+1.5),r.onended=()=>n.close()}catch(e){console.error(`Astronaut tone playback failed:`,e)}},window.speakAstroDetails=function(e,t,n,r,i){if(e.stopPropagation(),!(`speechSynthesis`in window)){console.error(`Speech synthesis is not supported.`);return}window.speechSynthesis.cancel();let a=`${t}, mission ${n}. Tagline: ${r}. Achievement: ${i}`,o=new SpeechSynthesisUtterance(a);o.rate=1,o.pitch=1.05,window.speechSynthesis.speak(o)},window.renderAstronautCards=R;