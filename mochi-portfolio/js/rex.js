/* Mochi the baby T-Rex — an original SVG character, drawn by hand-coded paths.
   Usage: Rex.svg({ hue: 0 })  -> returns an <svg> string
   Any element with [data-rex] gets Mochi injected by main.js. */
(function () {
  'use strict';

  function svg(opts) {
    opts = opts || {};
    var hue = opts.hue || 0;
    var G = '#7fdba8', S = '#4fae7e', INK = '#3a2830';
    var p = [];

    p.push('<svg class="rex" viewBox="0 0 300 310" role="img" aria-label="Mochi, a cute baby T-Rex" style="--hue:' + hue + 'deg">');

    // sleepy z's (only visible at night)
    p.push('<g class="zzz"><text x="228" y="62" font-size="24">z</text><text x="248" y="38" font-size="32">Z</text></g>');

    p.push('<g stroke="' + S + '" stroke-width="3" stroke-linejoin="round">');

    // tail + pink bumps
    p.push('<g class="tail"><path d="M198 226 C246 250 288 238 294 186 C268 214 238 208 200 200 Z" fill="' + G + '"/>');
    p.push('<path d="M222 205 l6 -12 l8 12z M248 208 l6 -12 l8 11z M272 201 l5 -11 l7 9z" fill="#ffb3cf" stroke="none"/></g>');

    // feet
    p.push('<ellipse cx="116" cy="294" rx="28" ry="14" fill="' + G + '"/>');
    p.push('<ellipse cx="184" cy="294" rx="28" ry="14" fill="' + G + '"/>');

    // body + belly
    p.push('<ellipse cx="150" cy="230" rx="66" ry="60" fill="' + G + '"/>');
    p.push('<ellipse cx="150" cy="242" rx="42" ry="42" fill="#effcd9" stroke="none"/>');

    // tiny arms (the famous tiny arms!)
    p.push('<g class="arm-l"><ellipse cx="96" cy="224" rx="15" ry="9" transform="rotate(-30 96 224)" fill="' + G + '"/></g>');
    p.push('<g class="arm-r"><ellipse cx="204" cy="224" rx="15" ry="9" transform="rotate(30 204 224)" fill="' + G + '"/></g>');

    // head + blush
    p.push('<ellipse cx="150" cy="118" rx="96" ry="78" fill="' + G + '"/>');
    p.push('<ellipse cx="86" cy="146" rx="17" ry="10" fill="#ff9fbf" opacity=".6" stroke="none"/>');
    p.push('<ellipse cx="214" cy="146" rx="17" ry="10" fill="#ff9fbf" opacity=".6" stroke="none"/>');
    p.push('</g>');

    // face
    p.push('<g class="eyes">');
    [112, 188].forEach(function (x) {
      p.push('<g class="eye"><circle cx="' + x + '" cy="116" r="27" fill="#fff"/>' +
        '<g class="pupil"><circle cx="' + x + '" cy="116" r="16" fill="' + INK + '"/>' +
        '<circle cx="' + (x + 6) + '" cy="109" r="5.5" fill="#fff"/><circle cx="' + (x - 5) + '" cy="122" r="2.8" fill="#fff"/></g></g>');
    });
    p.push('<path class="lid" d="M85 116 A27 27 0 0 1 139 116 Z" fill="' + G + '" stroke="' + S + '" stroke-width="3"/>');
    p.push('<path class="lid" d="M161 116 A27 27 0 0 1 215 116 Z" fill="' + G + '" stroke="' + S + '" stroke-width="3"/>');
    p.push('</g>');

    p.push('<circle cx="141" cy="140" r="2.6" fill="' + INK + '" opacity=".55"/><circle cx="159" cy="140" r="2.6" fill="' + INK + '" opacity=".55"/>');
    p.push('<path class="teeth" d="M138 168 L144 179 L150 171Z M162 168 L156 179 L150 171Z" fill="#fff"/>');
    p.push('<path class="smile" d="M124 158 Q150 184 176 158" fill="none" stroke="' + INK + '" stroke-width="4.5" stroke-linecap="round"/>');
    p.push('<g class="mouth-o"><ellipse cx="150" cy="172" rx="20" ry="15" fill="#7a2e48"/><ellipse cx="150" cy="180" rx="10" ry="5" fill="#ff8fb1"/></g>');

    // eggshell hat (click it five times… shhh)
    p.push('<g class="shell" stroke="#e4c79b" stroke-width="3" stroke-linejoin="round">');
    p.push('<path d="M96 76 C92 14 208 14 204 76 L190 64 L176 78 L163 64 L150 78 L137 64 L124 78 L110 64 Z" fill="#fffaf0"/>');
    p.push('<circle cx="132" cy="44" r="5" fill="#f3d9b5" stroke="none"/><circle cx="168" cy="38" r="4" fill="#f3d9b5" stroke="none"/><circle cx="152" cy="56" r="3.5" fill="#f3d9b5" stroke="none"/>');
    p.push('</g>');

    p.push('</svg>');
    return p.join('');
  }

  window.Rex = { svg: svg };
})();
