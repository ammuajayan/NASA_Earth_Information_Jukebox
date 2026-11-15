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
    `,n.addEventListener(`click`,()=>{typeof window.goToStage==`function`&&window.goToStage(`stage-jukebox`),typeof window.selectEvent==`function`?window.selectEvent(t.id,!0):console.error(`selectEvent function is not available.`)}),e.appendChild(n),{el:n,lat:t.lat,lon:t.lon}})}function f(){if(!n||!r)return;let e=window.THREE,i=document.getElementById(`earth-canvas-container`);if(!i)return;let a=i.clientWidth,o=i.clientHeight;if(!a||!o)return;let s=a/2,c=o/2;n.updateMatrixWorld(!0),t.forEach(t=>{let i=u(t.lat,t.lon,1.02);i.applyEuler(n.rotation),i.project(r);let a=u(t.lat,t.lon,1);a.applyEuler(n.rotation);let o=new e.Matrix3().getNormalMatrix(n.matrixWorld),l=a.clone().applyMatrix3(o).normalize(),d=r.position.clone().sub(n.position).normalize();if(l.dot(d)>-.15&&i.z<1){let e=i.x*s+s,n=-(i.y*c)+c;t.el.style.transform=`translate(-50%, -50%) translate(${e}px, ${n}px)`,t.el.style.opacity=`1`,t.el.style.pointerEvents=`auto`}else t.el.style.opacity=`0`,t.el.style.pointerEvents=`none`})}window.EarthExperience={initialize:c,resize:l},window.EarthExperience.destroy=function(){a&&cancelAnimationFrame(a),o&&window.removeEventListener(`resize`,o),i&&(i.dispose(),i.domElement.remove());let s=document.getElementById(`earth-canvas-container`);s&&s.querySelectorAll(`.earth-gps-pin`).forEach(e=>e.remove()),t=[],n=null,r=null,i=null,a=null,o=null,e=!1};var p=[{id:0,category:`ATMOSPHERE & GLOBAL TEMP`,title:`2024 Global Heat & Ocean Warming Anomaly`,date:`July 2024`,coords:`0.00° N, 160.00° W (Pacific & Global)`,satellite:`NASA Aqua / CERES & Terra`,chord:[261.63,329.63,392,493.88],narration:`Listen closely to the warmth of our oceans. In July 2024, NASA's Aqua and Terra satellites recorded Earth's warmest global surface temperatures in modern history. Rising ocean heat acts like a fever across the planet, energizing tropical storms and reshaping jet streams.`,metrics:{tempAnomaly:`+1.35 °C`,co2:`425.1 ppm`,seaIce:`14.2 M km²`,severity:`High`},timeline:[{year:`1980`,val:35,label:`0.35°C`},{year:`1995`,val:52,label:`0.52°C`},{year:`2010`,val:74,label:`0.74°C`},{year:`2020`,val:90,label:`1.02°C`},{year:`2024`,val:100,label:`1.35°C`}]},{id:1,category:`ATMOSPHERIC CARBON (NOAA)`,title:`NOAA Mauna Loa CO₂ Peak Acceleration`,date:`May 2024`,coords:`19.54° N, 155.56° W (Hawaii, USA)`,satellite:`NOAA GML & NASA OCO-2`,chord:[293.66,349.23,440,523.25],narration:`At the NOAA Mauna Loa Observatory in Hawaii, atmospheric carbon dioxide concentrations crossed a new milestone. Continuous monitoring proves how human industrial emissions continue to trap thermal energy in the troposphere, driving global climate shifts.`,metrics:{tempAnomaly:`+1.28 °C`,co2:`426.9 ppm`,seaIce:`13.8 M km²`,severity:`Critical`},timeline:[{year:`1980`,val:30,label:`338 ppm`},{year:`1995`,val:50,label:`360 ppm`},{year:`2010`,val:70,label:`390 ppm`},{year:`2020`,val:88,label:`414 ppm`},{year:`2024`,val:98,label:`426 ppm`}]},{id:2,category:`CRYOSPHERE & SEA ICE`,title:`Antarctic Sea Ice Winter Minimum Retreat`,date:`September 2024`,coords:`75.25° S, 0.07° E (Antarctica)`,satellite:`NASA ICESat-2 & Nimbus Archive`,chord:[329.63,392,493.88,587.33],narration:`At the bottom of the world, NASA's ICESat-2 laser altimeter measured Antarctic sea ice struggling to regrow during winter. Sea ice acts as Earth's bright white shield, reflecting sunlight back into space. As ice thins, dark oceans absorb more solar heat.`,metrics:{tempAnomaly:`+2.10 °C (Polar)`,co2:`424.0 ppm`,seaIce:`16.5 M km² (Low)`,severity:`Severe`},timeline:[{year:`1990`,val:95,label:`18.2M`},{year:`2000`,val:90,label:`17.9M`},{year:`2014`,val:98,label:`18.5M`},{year:`2020`,val:72,label:`16.8M`},{year:`2024`,val:55,label:`16.1M`}]}],m=!1,h=null,g=[],_=.7,v=1;function y(e){try{let t=new(window.AudioContext||window.webkitAudioContext);t.state===`suspended`&&t.resume();let n=t.createOscillator(),r=t.createGain();n.type=`sine`,n.frequency.setValueAtTime(e,t.currentTime),r.gain.setValueAtTime(.001,t.currentTime),r.gain.exponentialRampToValueAtTime(Math.max(.001,_*.1),t.currentTime+.1),r.gain.exponentialRampToValueAtTime(.001,t.currentTime+1.2),n.connect(r),r.connect(t.destination),n.start(),n.stop(t.currentTime+1.2),n.onended=()=>t.close()}catch(e){console.error(`Tone playback error:`,e)}}function b(e){if(!(`speechSynthesis`in window))return;window.speechSynthesis.cancel();let t=new SpeechSynthesisUtterance(e);t.rate=v,t.pitch=1.05,window.speechSynthesis.speak(t)}function x(e){if(e){S(),m=!0,C(!0);try{h=new(window.AudioContext||window.webkitAudioContext),h.state===`suspended`&&h.resume();let t=h.createGain();t.gain.setValueAtTime(.001,h.currentTime),t.gain.exponentialRampToValueAtTime(Math.max(.001,_*.08),h.currentTime+1.5),t.connect(h.destination),e.chord.forEach((e,n)=>{let r=h.createOscillator();r.type=n%2==0?`sine`:`triangle`,r.frequency.setValueAtTime(e,h.currentTime),r.connect(t),r.start(),g.push(r)})}catch(e){console.warn(`Web Audio error:`,e)}if(`speechSynthesis`in window){window.speechSynthesis.cancel();let t=new SpeechSynthesisUtterance(e.narration);t.rate=v,t.pitch=1.05,t.onend=()=>{S()},t.onerror=()=>{S()},window.speechSynthesis.speak(t)}}}function S(){if(m=!1,C(!1),`speechSynthesis`in window&&window.speechSynthesis.cancel(),g.forEach(e=>{try{e.stop()}catch{}}),g=[],h){try{h.close()}catch{}h=null}}function C(e){let t=document.getElementById(`btn-play-pause`),n=document.getElementById(`now-playing-badge`),r=document.getElementById(`equalizer`),i=document.getElementById(`cd-disk`),a=document.getElementById(`tone-arm`);t&&(t.textContent=e?`⏸`:`▶`),n&&(n.textContent=e?`NARRATING & SONIFYING`:`READY TO PLAY`),r&&r.classList.toggle(`playing`,e),i&&i.classList.toggle(`spinning`,e),a&&a.classList.toggle(`engaged`,e)}function w(e){_=Math.max(0,Math.min(1,Number(e)||0))}function T(e){v=Math.max(.5,Math.min(2,Number(e)||1))}window.nasaEvents=p,window.playTone=y,window.speakText=b,window.playMelodiousNarration=x,window.stopMelodiousAudio=S,window.setMasterVolume=w,window.setNarrationSpeed=T,Object.defineProperty(window,"isPlaying",{configurable:!0,get:()=>m}),Object.defineProperty(window,"masterVolume",{configurable:!0,get:()=>_}),Object.defineProperty(window,"narrationSpeed",{configurable:!0,get:()=>v});var E=[{id:`earth-info`,title:`Earth Information Center`,category:`Earth Overview`,period:`NASA visualization collection`,description:`Explore NASA visualizations and stories showing how Earth's systems are changing.`,url:`https://svs.gsfc.nasa.gov/gallery/earth-information-center/`,soundIdea:`Create an introductory Earth soundscape from visual patterns.`},{id:`sonification`,title:`Data Sonification: Caldwell 73`,category:`Data Sonification`,period:`NASA sonification example`,description:`Explore how scientific visual information can be translated into sound.`,url:`https://svs.gsfc.nasa.gov/13786/`,soundIdea:`Use changing brightness and visual intensity to control musical notes.`},{id:`night-lights`,title:`Global Night Lights`,category:`Human Activity`,period:`2012–2023`,description:`Explore changes in artificial lighting across Earth's surface.`,url:`https://svs.gsfc.nasa.gov/5313/`,soundIdea:`Map brightness and changes in city lights to musical intensity.`},{id:`ocean-temperature`,title:`Global Sea Surface Currents and Temperature`,category:`Ocean`,period:`NASA ocean visualization`,description:`Explore ocean surface temperatures and global current patterns.`,url:`https://svs.gsfc.nasa.gov/3912/`,soundIdea:`Map ocean temperature to pitch and current speed to rhythm.`},{id:`aerosols`,title:`GEOS Aerosols`,category:`Atmosphere`,period:`NASA GEOS visualization`,description:`Explore atmospheric aerosols, including dust and smoke.`,url:`https://svs.gsfc.nasa.gov/5669/`,soundIdea:`Map aerosol intensity to layered sound textures.`},{id:`air-quality`,title:`Air Quality Model Runs`,category:`Atmosphere`,period:`NASA model visualization`,description:`Explore atmospheric pollutants and air-quality patterns.`,url:`https://svs.gsfc.nasa.gov/5533/`,soundIdea:`Map pollutant concentration to changes in pitch and volume.`},{id:`perpetual-ocean`,title:`Perpetual Ocean 2`,category:`Ocean`,period:`NASA ocean visualization`,description:`Explore the movement of major ocean currents.`,url:`https://svs.gsfc.nasa.gov/5425/`,soundIdea:`Map current velocity to tempo and direction to stereo movement.`},{id:`carbon-dioxide`,title:`DYAMOND Global Carbon Dioxide`,category:`Climate`,period:`January–March 2020`,description:`Explore a global three-dimensional atmospheric CO2 visualization.`,url:`https://svs.gsfc.nasa.gov/5196/`,soundIdea:`Map CO2 concentration to pitch and its changes to musical progression.`},{id:`lightning`,title:`Lightning Events from the ISS`,category:`Weather`,period:`2017–2023`,description:`Explore lightning observations collected from the International Space Station.`,url:`https://svs.gsfc.nasa.gov/5011/`,soundIdea:`Translate lightning events into rhythmic percussion.`},{id:`atmospheric-river`,title:`Atmospheric River`,category:`Weather`,period:`NASA visualization`,description:`Explore the movement of atmospheric moisture around Earth.`,url:`https://svs.gsfc.nasa.gov/4960/`,soundIdea:`Map moisture intensity and movement to flowing musical patterns.`},{id:`forest-height`,title:`GEDI Forest Height`,category:`Ecosystems`,period:`NASA GEDI visualization`,description:`Explore forest-height observations collected from the International Space Station.`,url:`https://svs.gsfc.nasa.gov/4950/`,soundIdea:`Map forest height and variation to musical notes.`}],D=0,O=`f1`,k=`spring`;window.goToStage=function(e){[`stage-landing`,`stage-3d`,`stage-jukebox`,`stage-astronauts`].forEach(e=>{document.getElementById(e)?.classList.remove(`active`)});let t=document.getElementById(e);t?(t.classList.add(`active`),e===`stage-3d`&&!window.earth3DInitialized&&(window.EarthExperience?.initialize?(window.EarthExperience.initialize(),window.earth3DInitialized=!0):console.error(`EarthExperience not found. Check earth.js.`)),e===`stage-astronauts`&&window.renderAstronautCards?.()):console.error(`Stage not found:`,e)},document.addEventListener(`DOMContentLoaded`,()=>{document.getElementById(`btn-explore`)?.addEventListener(`click`,()=>{window.goToStage(`stage-3d`)}),document.getElementById(`btn-to-jukebox`)?.addEventListener(`click`,()=>{window.goToStage(`stage-jukebox`),A(),window.selectEvent(0,!1)}),document.getElementById(`btn-back-3d`)?.addEventListener(`click`,()=>{window.stopMelodiousAudio?.(),window.goToStage(`stage-3d`)}),window.nasaEvents?.length&&(A(),window.selectEvent(0,!1))});function A(){let e=document.getElementById(`playlist-container`);e&&window.nasaEvents&&(e.innerHTML=window.nasaEvents.map((e,t)=>`

    <div class="track-card ${t===D?`active`:``}"
         onclick="selectEvent(${t}, true)">

      <div class="track-card-top">
        <span>TRACK ${String(t+1).padStart(2,`0`)} • ${e.category}</span>
        <span>${e.date}</span>
      </div>

      <h4>${e.title}</h4>
      <p>${e.satellite}</p>

    </div>

  `).join(``))}window.selectEvent=function(e,t=!0){if(!window.nasaEvents?.[e]){console.error(`NASA event not found:`,e);return}D=e;let n=window.nasaEvents[e],r=document.getElementById(`deck-title`),i=document.getElementById(`deck-coords`);r&&(r.textContent=n.title),i&&(i.textContent=`📍 ${n.coords}`),A(),j(O),t&&window.playMelodiousNarration?.(n)},document.getElementById(`btn-play-pause`)?.addEventListener(`click`,()=>{window.isPlaying?window.stopMelodiousAudio?.():window.nasaEvents?.[D]&&window.playMelodiousNarration?.(window.nasaEvents[D])}),document.getElementById(`btn-stop`)?.addEventListener(`click`,()=>{window.stopMelodiousAudio?.()}),document.getElementById(`btn-next`)?.addEventListener(`click`,()=>{if(!window.nasaEvents?.length)return;let e=(D+1)%window.nasaEvents.length;window.selectEvent(e,!0)}),document.getElementById(`btn-prev`)?.addEventListener(`click`,()=>{if(!window.nasaEvents?.length)return;let e=(D-1+window.nasaEvents.length)%window.nasaEvents.length;window.selectEvent(e,!0)}),document.getElementById(`volume-slider`)?.addEventListener(`input`,e=>{let t=Number(e.target.value);window.setMasterVolume?.(t);let n=document.getElementById(`vol-val`);n&&(n.textContent=`${Math.round(t*100)}%`)}),document.getElementById(`speed-slider`)?.addEventListener(`input`,e=>{let t=Number(e.target.value);window.setNarrationSpeed?.(t);let n=document.getElementById(`speed-val`);n&&(n.textContent=`${t.toFixed(2)}x`)}),document.querySelectorAll(`.tab-btn`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.tab-btn`).forEach(e=>{e.classList.remove(`active`)}),e.classList.add(`active`),O=e.dataset.tab,j(O)})}),window.setSeasonView=function(e){[`spring`,`summer`,`autumn`,`winter`].includes(e)&&(k=e,j(`f7`))};function j(e){let t=document.getElementById(`feature-viewport`);if(!t)return;if(e===`f8`){M(t);return}if(!window.nasaEvents)return;let n=window.nasaEvents[D];if(n)switch(e){case`f1`:t.innerHTML=`

        <span class="badge">${n.category}</span>

        <h2>${n.title}</h2>

        <p style="color:var(--text-dim);margin-top:4px;">
          Observed by <strong>${n.satellite}</strong> • ${n.date}
        </p>

        <div class="narration-script">
          “${n.narration}”
        </div>

        <button class="primary-btn" id="btn-event-narration">
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
      `,document.getElementById(`btn-event-narration`)?.addEventListener(`click`,()=>{window.playMelodiousNarration?.(n)});break;case`f2`:t.innerHTML=`

        <h2>2. Scientific Data Sonification Synthesizer</h2>

        <p style="color:var(--text-dim);">
          Earth telemetry translated into musical frequencies.
        </p>

        <div class="card-grid">

          ${n.chord.map((e,t)=>`

            <div class="data-box" style="text-align:center;">

              <h4>TELEMETRY FREQ ${t+1}</h4>

              <div class="big-val">${e} Hz</div>

              <button class="ghost-btn tone-preview-btn"
                data-frequency="${e}"
                style="margin-top:10px;">
                ▶ Audition Tone
              </button>

            </div>

          `).join(``)}

        </div>
      `,t.querySelectorAll(`.tone-preview-btn`).forEach(e=>{e.addEventListener(`click`,()=>{window.playTone?.(Number(e.dataset.frequency))})});break;case`f3`:t.innerHTML=`

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
          Atmospheric sampling tracking carbon accumulation.
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
          Passive microwave satellite monitoring of polar ice caps.
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
      `;break;case`f6`:{let e=n.timeline||[],r=e.map((e,t)=>`${50+t*130},${180-e.val/100*130}`).join(` `);t.innerHTML=`

        <h2>6. Historical Multi-Decadal Progression</h2>

        <p style="color:var(--text-dim);margin-bottom:12px;">
          Comparative index across selected observation milestones.
        </p>

        <div style="
          background:rgba(0,0,0,0.4);
          border:1px solid var(--border-glass);
          border-radius:12px;
          padding:20px;
        ">

          <svg viewBox="0 0 600 220"
            style="width:100%;height:200px;overflow:visible;">

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
              points="50,180 ${r} 560,180"
              fill="url(#trendGrad)"/>

            <polyline
              fill="none"
              stroke="#00ffcc"
              stroke-width="3"
              points="${r}"/>

            ${e.map((e,t)=>{let n=50+t*130,r=180-e.val/100*130;return`

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

          ${e.map(e=>`

            <div class="data-box" style="padding:12px;text-align:center;">

              <span style="font-size:0.75rem;color:var(--text-dim);">
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
      `;break}case`f7`:{let e={spring:{title:`Spring (Vernal Equinox)`,desc:`As Earth's axial tilt leans toward the Sun, snowpack melts rapidly, triggering greening waves across continents.`,albedo:`Decreasing`,color:`#10b981`},summer:{title:`Summer (Solstice & Peak Thermal)`,desc:`Peak solar irradiance warms continental interiors. Arctic sea ice reaches minimum extent.`,albedo:`Lowest polar reflection`,color:`#f3e600`},autumn:{title:`Autumn (Autumnal Equinox)`,desc:`Solar angle decreases. Deciduous forests display widespread leaf senescence and color changes.`,albedo:`Transitioning toward frost`,color:`#f97316`},winter:{title:`Winter (Solstice & Cryosphere Growth)`,desc:`The Northern Hemisphere tilts away from the Sun, expanding snow cover and maximizing Earth's albedo.`,albedo:`Highest annual reflection`,color:`#38bdf8`}}[k];t.innerHTML=`

        <h2>7. Seasonal Earth Dynamics & Albedo Shift</h2>

        <p style="color:var(--text-dim);margin-bottom:16px;">
          How Earth's 23.5° axial tilt transforms planetary reflectance.
        </p>

        <div class="season-selector">

          <button class="season-btn ${k===`spring`?`active`:``}"
            data-season="spring">🌱 Spring</button>

          <button class="season-btn ${k===`summer`?`active`:``}"
            data-season="summer">☀️ Summer</button>

          <button class="season-btn ${k===`autumn`?`active`:``}"
            data-season="autumn">🍂 Autumn</button>

          <button class="season-btn ${k===`winter`?`active`:``}"
            data-season="winter">❄️ Winter</button>

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
            style="margin-bottom:16px;font-size:0.85rem;padding:10px 20px;">
            🔊 Listen to Seasonal Narration
          </button>

          <div class="card-grid">

            <div class="data-box">
              <h4>ALBEDO STATUS</h4>
              <div style="font-size:0.95rem;color:var(--cyan);margin-top:6px;">
                ${e.albedo}
              </div>
            </div>

            <div class="data-box">
              <h4>SATELLITE</h4>
              <div style="font-size:0.95rem;color:#fff;margin-top:6px;">
                MODIS & VIIRS Imaging
              </div>
            </div>

          </div>

        </div>
      `,t.querySelectorAll(`[data-season]`).forEach(e=>{e.addEventListener(`click`,()=>{window.setSeasonView(e.dataset.season)})}),document.getElementById(`btn-speak-season`)?.addEventListener(`click`,()=>{window.speakText?.(`${e.title}. ${e.desc}`)});break}default:t.innerHTML=`
        <h2>Feature not found</h2>
        <p>Please select another tab.</p>
      `}}function M(e){if(!Array.isArray(E)){e.innerHTML=`
      <h2>NASA EIC Library unavailable</h2>
      <p>Check eic-resources.js.</p>
    `;return}e.innerHTML=`

    <div class="eic-library">

      <span class="badge">
        NASA SCIENTIFIC VISUALIZATION ARCHIVE
      </span>

      <h2>8. NASA Earth Information Center Library</h2>

      <p style="
        color:var(--text-dim);
        line-height:1.7;
        margin:12px 0 22px;
      ">
        Explore NASA Earth observation visualizations.
        Discover how satellites and scientific missions help us
        understand our changing planet. Select a resource to visit
        its NASA visualization or preview our experimental sound concept.
      </p>

      <div class="card-grid">

        ${E.map((e,t)=>`

          <div class="data-box eic-resource-card"
            style="padding:20px;">

            <span style="
              color:var(--cyan);
              font-size:0.75rem;
              font-weight:bold;
              letter-spacing:1px;
            ">
              RESOURCE ${String(t+1).padStart(2,`0`)}
              • ${e.category}
            </span>

            <h3 style="margin:12px 0 8px;">
              ${e.title}
            </h3>

            <p style="
              color:var(--text-dim);
              font-size:0.85rem;
              line-height:1.6;
              margin-bottom:10px;
            ">
              ${e.description}
            </p>

            <p style="
              color:var(--yellow);
              font-size:0.8rem;
              margin-bottom:12px;
            ">
              ${e.period}
            </p>

            <div style="
              border-left:2px solid var(--cyan);
              padding:9px 12px;
              margin-bottom:16px;
              background:rgba(0,255,204,0.05);
              font-size:0.82rem;
              line-height:1.5;
            ">
              <strong>Our sound concept:</strong><br>
              ${e.soundIdea}
            </div>

            <div style="
              display:flex;
              gap:10px;
              flex-wrap:wrap;
            ">

              <a
                href="${e.url}"
                target="_blank"
                rel="noopener noreferrer"
                class="ghost-btn"
                style="text-decoration:none;"
              >
                Explore NASA ↗
              </a>

              <button
                class="ghost-btn eic-sound-btn"
                data-index="${t}"
              >
                ♪ Preview Sound
              </button>

            </div>

          </div>

        `).join(``)}

      </div>

      <p style="
        color:var(--text-dim);
        font-size:0.78rem;
        margin-top:22px;
      ">
        Source: NASA Scientific Visualization Studio.
        Sound previews are experimental interpretations created
        by this project, not official NASA audio.
      </p>

    </div>
  `;let t=[261.63,293.66,329.63,349.23,392,440,493.88,523.25,587.33,659.25,698.46];e.querySelectorAll(`.eic-sound-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let n=Number(e.dataset.index),r=t[n];Number.isFinite(r)&&window.playTone?.(r)})})}var N=[{name:`Yuri Gagarin`,mission:`Vostok 1 (1961)`,tagline:`I see Earth! It is so beautiful.`,achievement:`First human to journey into outer space, completing one orbit of Earth.`,soundFreq:440,imgSrc:`https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcRGFCms2Q70JCKRBzr0zkWY2Np5Ar9scy3K9fXUMwv-MdcomJo7avGfm2a-kIiq4qAL-qlk2eISJVFyHMxW_oAjifw5EXExl3q0x0ZQUJ6BneeExEeVTcNzupazl_Vm93DNCTIFIyHV44E&s=19`},{name:`John Glenn`,mission:`Friendship 7 (1962)`,tagline:`Zero G and I feel fine.`,achievement:`First American to orbit Earth, later returning to space at age 77.`,soundFreq:493.88,imgSrc:`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR58bTvul1rdspdKHAYmuAZ-IlDtc0pmuGEJ1rapk3yljN4bCr21XP4u8bIojhu7wKF6Mrp4SsuiguuvTeWx-1h2aRFviUof-5XzyvpB5iMNQ&s=10`},{name:`Valentina Tereshkova`,mission:`Vostok 6 (1963)`,tagline:`Hey sky, take off your hat, I am coming in!`,achievement:`First woman to fly in space, orbiting Earth 48 times.`,soundFreq:523.25,imgSrc:`https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTMTEPYJsEO-BLSel4XlV80befSE5ua9cNxERce2RRxKAk7WXxlJjLlKyIqpwTiT_RQ0rWKPjLZSmRL5M4`},{name:`Neil Armstrong`,mission:`Apollo 11 (1969)`,tagline:`One small step for man, one giant leap for mankind.`,achievement:`First human to set foot on the Moon, witnessing Earth rise.`,soundFreq:587.33,imgSrc:`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpnIoIwHrsVa5DAcnb2PMvN-4dmMrj8obSdzpTf7dF-ESo4FlirVVPZctiflKra5AptzgWaridvIQ4iJuYMBLBlIQnGeA72gH1h3SAy08gew&s=10`},{name:`Buzz Aldrin`,mission:`Apollo 11 (1969)`,tagline:`Magnificent desolation.`,achievement:`Lunar module pilot on Apollo 11 and second human to walk on the Moon.`,soundFreq:622.25,imgSrc:`https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Buzz_Aldrin.jpg/960px-Buzz_Aldrin.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=thumbnail`},{name:`Sally Ride`,mission:`STS-7 Challenger (1983)`,tagline:`The stars do not look bigger, but they do look brighter.`,achievement:`First American woman in space, studying Earth's ozone layer.`,soundFreq:659.25,imgSrc:`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkAgVu_-5i1xxlAaVGLvrIVX9bBROyoCZio5iCxhoBvA&s`},{name:`Mae Jemison`,mission:`STS-47 Endeavour (1992)`,tagline:`The future belongs to those who can see potential.`,achievement:`First African American woman in space, conducting bone cell research.`,soundFreq:698.46,imgSrc:`https://cdn.britannica.com/42/93242-050-54D76369/Mae-Jemison-space-shuttle-Endeavour.jpg`},{name:`Chris Hadfield`,mission:`Expedition 34/35 (2013)`,tagline:`Earth is our shared fragile home.`,achievement:`Commander of the ISS who popularized orbital photography and music.`,soundFreq:783.99,imgSrc:`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTPbpT8ujcRkbuIZSpsftCC-ZPfsxlKdEH9Pego3Wz6e3t_34iGXxHzxNzoS0gC666qUwCF_fKLQ7jF5xgNHug3GydCS4BslAUYM4G8g&s=10`}];function P(){let e=document.getElementById(`astro-grid-container`);e?e.innerHTML=N.map(e=>`

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

          <span style="font-size:0.7rem;color:var(--text-dim);">
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

  `).join(``):console.error(`Astronaut grid container not found.`)}window.toggleCardFlip=function(e,t){e.target.closest(`button`)||t.classList.toggle(`flipped`)},window.playAstroSound=function(e,t){e.stopPropagation();try{let e=window.AudioContext||window.webkitAudioContext;if(!e){console.error(`Web Audio API is not supported.`);return}let n=new e,r=n.createOscillator(),i=n.createGain();r.type=`sine`,r.frequency.setValueAtTime(t,n.currentTime),i.gain.setValueAtTime(.001,n.currentTime),i.gain.exponentialRampToValueAtTime(.12,n.currentTime+.1),i.gain.exponentialRampToValueAtTime(.001,n.currentTime+1.5),r.connect(i),i.connect(n.destination),r.start(),r.stop(n.currentTime+1.5),r.onended=()=>n.close()}catch(e){console.error(`Astronaut tone playback failed:`,e)}},window.speakAstroDetails=function(e,t,n,r,i){if(e.stopPropagation(),!(`speechSynthesis`in window)){console.error(`Speech synthesis is not supported.`);return}window.speechSynthesis.cancel();let a=`${t}, mission ${n}. Tagline: ${r}. Achievement: ${i}`,o=new SpeechSynthesisUtterance(a);o.rate=1,o.pitch=1.05,window.speechSynthesis.speak(o)},window.renderAstronautCards=P;