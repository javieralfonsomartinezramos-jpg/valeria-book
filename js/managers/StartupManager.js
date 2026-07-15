/* =================================================================
 *  STARTUP MANAGER — FORENSIC INSTRUMENTATION
 *  Traza completa de las 9 fases + REPORTE FORENSE.
 *  NO modifica lógica, comportamiento ni timing.
 *  ================================================================= */

const _fB = () => window.__FORENSIC;
const _t0_baseline = () => (_fB()?.t0 || performance.now());
const _ts = () => `[${(performance.now() - _t0_baseline()).toFixed(2)}ms]`;

/* ─── Phase suspicion thresholds ─────────────────────── */
const _PHASE_WARN = { 50: '⚠️ lenta', 100: '⚠️ MUY lenta', 300: '🚨 SOSPECHOSA', 500: '🚨 CRÍTICA', 1000: '💀 BLOQUEANTE' };

/* ─── Global forensic accumulators ───────────────────── */
const _FA = window.__STARTUP_FORENSIC = {
  phaseTimings: [],
  promiseTracker: [],
  fnCalls: [],
  errors: [],
  firstFn: null,
  lastFn: null,
  firstPromise: null,
  lastPromise: null,
  firstError: null,
  lastLineBeforeBlock: null,
};

/* ─── Wrappers ────────────────────────────────────────── */

function _fW(fn, label, path) {
  return function (...args) {
    const _t0 = performance.now();
    const _id = _FA.fnCalls.length;
    const _entry = { id: _id, label, path, t0: _t0, args: args.map(a => typeof a === 'object' ? JSON.stringify(a).slice(0, 60) : String(a)).join(', ') };
    _FA.fnCalls.push(_entry);
    if (!_FA.firstFn) _FA.firstFn = _entry;
    _FA.lastFn = _entry;
    console.groupCollapsed(`${_ts()} [CALL #${_id}] ${path} → ${label}`);
    console.log(`  Archivo: ${path}`);
    console.log(`  Función: ${label}`);
    console.log(`  Args:    ${_entry.args}`);
    try {
      const r = fn.apply(this, args);
      if (r instanceof Promise) {
        console.log(`  Promise: ${label} — CREADA`);
        _FA.promiseTracker.push({ label, created: performance.now(), status: 'pending' });
        if (!_FA.firstPromise) _FA.firstPromise = { label, t: performance.now() };
        _FA.lastPromise = { label, t: performance.now(), status: 'pending' };
        r.then(
          v => {
            const _elapsed = performance.now() - _t0;
            _FA.lastPromise.status = 'resolved';
            const _entry2 = _FA.fnCalls.find(e => e.id === _id);
            if (_entry2) _entry2.duration = _elapsed;
            console.log(`  ${_ts()} [PROMISE] ${label} — RESUELTA en ${_elapsed.toFixed(2)}ms`);
            /* Check suspicion thresholds */
            [100, 300, 500, 1000, 2000, 5000].forEach(t => {
              if (_elapsed >= t) console.warn(`    ⚠️  PROMISE SOSPECHOSA: ${label} tardó ${_elapsed.toFixed(0)}ms (>${t}ms)`);
            });
            console.groupEnd();
            return v;
          },
          e => {
            const _elapsed = performance.now() - _t0;
            _FA.lastPromise.status = 'rejected';
            _FA.lastPromise.error = e?.message || String(e);
            const msg = `${_ts()} [PROMISE] 🚨 ${label} — RECHAZADA en ${_elapsed.toFixed(2)}ms: ${e?.message || e}`;
            console.error(msg);
            _FA.errors.push({ type: 'promise_rejected', label, elapsed: _elapsed, error: e?.message || String(e), stack: e?.stack });
            if (!_FA.firstError) _FA.firstError = _FA.errors[_FA.errors.length - 1];
            console.groupEnd();
            throw e;
          }
        );
      } else {
        const _elapsed = performance.now() - _t0;
        const _entry2 = _FA.fnCalls.find(e => e.id === _id);
        if (_entry2) _entry2.duration = _elapsed;
        console.log(`  Resultado: ${r === undefined ? 'undefined' : typeof r === 'object' ? JSON.stringify(r).slice(0, 80) : String(r)}`);
        console.log(`  ${_ts()} [FN] ${label} — completada en ${_elapsed.toFixed(2)}ms`);
        console.groupEnd();
      }
      return r;
    } catch (e) {
      const _elapsed = performance.now() - _t0;
      const _entry2 = _FA.fnCalls.find(e => e.id === _id);
      if (_entry2) _entry2.duration = _elapsed;
      console.error(`${_ts()} [FN] 🚨 ${label} — EXCEPCIÓN: ${e?.message || e}`);
      console.log(`  Archivo: ${path}`);
      console.log(`  Línea:   ${e.lineNumber || '?'}`);
      console.log(`  Columna: ${e.columnNumber || '?'}`);
      console.log(`  Stack:   ${e?.stack || '(no stack)'}`);
      console.trace();
      _FA.errors.push({ type: 'exception', label, path, elapsed: _elapsed, error: e?.message || String(e), stack: e?.stack, line: e.lineNumber, col: e.columnNumber });
      if (!_FA.firstError) _FA.firstError = _FA.errors[_FA.errors.length - 1];
      _FA.lastLineBeforeBlock = { path, label, line: e.lineNumber, t: performance.now() };
      console.groupEnd();
      throw e;
    }
  };
}

/* ─── Phase block wrapper ──────────────────────────────── */

async function runPhaseWithReport(id, name, fn) {
  const _t0 = performance.now();
  const _p0 = ResourceManager.getProgress ? ResourceManager.getProgress() : '?';
  const _loaderEl = document.getElementById('loader');
  const _loaderFill = document.getElementById('loader-fill');
  const _loaderPct = document.getElementById('loader-pct');

  console.log(`\n${'='.repeat(58)}`);
  console.log(`  PHASE ${id}/9 — ${name}`);
  console.log(`${'='.repeat(58)}`);
  console.log(`  Inicio:        ${_ts()}`);
  console.log(`  Hora:          ${performance.now().toFixed(2)}ms`);
  console.log(`  performance.now: ${performance.now().toFixed(2)}`);
  console.log(`  Loader %:      ${_loaderFill ? _loaderFill.style.width : 'N/A'}`);
  console.log(`  Loader class:  "${_loaderEl ? _loaderEl.className : 'N/A'}"`);
  console.log(`  Loader pct:    "${_loaderPct ? _loaderPct.textContent : 'N/A'}"`);
  console.log(`  progress var:  ${_p0}`);

  try {
    const _t1 = performance.now();
    await fn();
    const _elapsed = performance.now() - _t1;
    const _p1 = ResourceManager.getProgress ? ResourceManager.getProgress() : '?';
    const _loaderFill2 = document.getElementById('loader-fill');
    const _loaderPct2 = document.getElementById('loader-pct');

    console.log(`\n  ── RESULTADOS PHASE ${id} ──`);
    console.log(`  Tiempo:        ${_elapsed.toFixed(2)}ms`);
    console.log(`  Loader %:      ${_loaderFill2 ? _loaderFill2.style.width : 'N/A'}`);
    console.log(`  Loader class:  "${_loaderEl ? _loaderEl.className : 'N/A'}"`);
    console.log(`  progress var:  ${_p1}`);

    /* Check suspicion thresholds */
    let flags = [];
    Object.keys(_PHASE_WARN).forEach(t => { if (_elapsed >= parseInt(t)) flags.push(`>${t}ms: ${_PHASE_WARN[t]}`); });
    if (flags.length) {
      console.warn(`  ⚠️  PHASE ${id} — SOSPECHOSA: ${_elapsed.toFixed(0)}ms ${flags.join(', ')}`);
    } else {
      console.log(`  ✓ PHASE ${id} — OK (${_elapsed.toFixed(2)}ms)`);
    }
    console.log(`${'='.repeat(58)}\n`);

    _FA.phaseTimings.push({ id, name, elapsed: _elapsed, status: 'ok', flags });

  } catch (e) {
    const _elapsed = performance.now() - _t0;
    console.log(`\n  ── 💥 ERROR EN PHASE ${id} ──`);
    console.log(`  Archivo:       StartupManager.js`);
    console.log(`  Línea:         ${e.lineNumber || '?'}`);
    console.log(`  Columna:       ${e.columnNumber || '?'}`);
    console.log(`  Función:       ${id}/9 — ${name}`);
    console.log(`  Stack:         ${e?.stack || '(no stack)'}`);
    console.log(`  Mensaje:       ${e?.message || e}`);
    console.log(`  Tiempo:        ${_elapsed.toFixed(2)}ms`);
    console.log(`  Consecuencia:  Fases ${id+1}-9 NUNCA se ejecutarán`);
    console.log(`${'='.repeat(58)}\n`);

    _FA.phaseTimings.push({ id, name, elapsed: _elapsed, status: 'error', error: e?.message || String(e) });
    throw e;
  }
}

/* ─── Imports ───────────────────────────────────────────── */

import { Logger } from '../core/Logger.js';
import { EventBus } from '../core/EventBus.js';
import { StorageManager } from '../core/StorageManager.js';
import { detectLowPerf, isMobile } from '../core/Utils.js';
import { DOMManager } from './DOMManager.js';
import { ResourceManager } from './ResourceManager.js';
import { ImageManager, setLightboxOpenFn } from './ImageManager.js';
import { AnimationManager } from './AnimationManager.js';
import {
  SPREAD_IMAGE_START, TOTAL_SPREADS, getPageName
} from '../config.js';
import { allowGesture } from '../core/gesture.js';
import { getIsFlipping, canGoNext, canGoPrev, getCurrentSpread } from '../core/BookState.js';
import { renderSpread, showCurrentSpread, goToSpread, navigateToSpreadAnimated, initBook } from '../components/BookEngine.js';
import { navigateWithFlip } from '../components/FlipEngine.js';
import { Lightbox } from '../components/Lightbox.js';
import { Sidebar } from '../components/Sidebar.js';
import { AudioManager } from '../services/AudioManager.js';
import { AudioFXService } from '../services/AudioFXService.js';

let started = false;
let resizeTimer = null;

/* ─── Helpers ──────────────────────────────────────────────── */

function _f_applyContrast(enabled) {
  const root = document.documentElement;
  root.setAttribute('data-theme', enabled ? 'highcontrast' : 'dark');
  StorageManager.setContrast(enabled);
  const btn = DOMManager.get('btn-contrast');
  if (btn) btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
}
const applyContrast = _fW(_f_applyContrast, 'applyContrast', 'js/managers/StartupManager.js');

function _f_onSpreadChanged(spreadIdx) {
  const title = DOMManager.get('topbar-title');
  if (title) title.textContent = getPageName(spreadIdx * 2);
  const ribbon = DOMManager.get('bm-ribbon');
  if (ribbon) {
    const total = TOTAL_SPREADS * 2;
    const pct = total > 0 ? Math.round(((spreadIdx * 2 + 1) / total) * 100) : 0;
    ribbon.style.width = pct + '%';
    const bm = DOMManager.get('bookmark');
    if (bm) bm.setAttribute('aria-valuenow', String(pct));
  }
}
const onSpreadChanged = _fW(_f_onSpreadChanged, 'onSpreadChanged', 'js/managers/StartupManager.js');

/* ─── 9 Phases (original code, untouched) ──────────────────── */

function _f_phase1Config() {
  Logger.info('Startup', 'Phase 1/9 — Config');
  DOMManager.init();
  detectLowPerf();
  document.documentElement.setAttribute('data-mobile', isMobile() ? 'true' : 'false');
  applyContrast(StorageManager.getContrast());
}

function _f_phase2Resources() {
  Logger.info('Startup', 'Phase 2/9 — Resources');
  ResourceManager.init();
}

async function _f_phase3State() {
  Logger.info('Startup', 'Phase 3/9 — State');
  await ResourceManager.getPromise();
  ImageManager.init();
  setLightboxOpenFn(idx => Lightbox.open(idx));
}

function _f_phase4Render() {
  Logger.info('Startup', 'Phase 4/9 — Render');
  initBook();
}

function _f_phase5Interface() {
  Logger.info('Startup', 'Phase 5/9 — Interface');
  const topbar = DOMManager.get('topbar');
  if (topbar) topbar.hidden = false;

  updateTitle(getCurrentSpread());   // ← LÍNEA 80 ORIGINAL: updateTitle NO ESTÁ DEFINIDA → ReferenceError
  onSpreadChanged(getCurrentSpread());

  DOMManager.onClick('#nav-prev', () => {
    if (getIsFlipping() || !canGoPrev()) return;
    navigateWithFlip(-1);
  });
  DOMManager.onClick('#nav-next', () => {
    if (getIsFlipping() || !canGoNext()) return;
    navigateWithFlip(1);
  });
  DOMManager.onClick('#btn-index', () => Sidebar.toggle());
  DOMManager.onClick('#btn-contrast', () => {
    applyContrast(document.documentElement.getAttribute('data-theme') !== 'highcontrast');
  });
  DOMManager.onClick('#btn-sound', () => AudioFXService.toggle());
  DOMManager.onClick('#btn-surprise', () => {
    const data = ImageManager.getData();
    if (data.length === 0 || getIsFlipping()) return;
    const idx = Math.floor(Math.random() * data.length);
    navigateToSpreadAnimated(SPREAD_IMAGE_START + idx).then(() => {
      setTimeout(() => { allowGesture(); Lightbox.open(idx); }, 120);
    });
  });
}

function _f_phase6Events() {
  Logger.info('Startup', 'Phase 6/9 — Events');

  EventBus.on('book:spread-changed', onSpreadChanged);
  EventBus.on('book:navigate', data => {
    if (data.animated) navigateToSpreadAnimated(data.spread);
    else goToSpread(data.spread);
  });
  EventBus.on('audiofx:page-turn', () => AudioFXService.play());

  EventBus.on('ui:reach-music', () => {
    import('../components/MusicPlayer.js').then(m => m.MusicPlayer.initUI()).catch(() => {});
  });
  EventBus.on('ui:reach-notes', () => {
    import('../components/Notes.js').then(m => m.Notes.render()).catch(() => {});
  });
  EventBus.on('ui:reach-closing', () => {
    import('../components/Petals.js').then(m => m.Petals.spawn()).catch(() => {});
  });

  DOMManager.onKey('*', e => {
    const lb = DOMManager.get('lightbox');
    if (lb && !lb.hidden) { Lightbox.handleKey(e); return; }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); if (canGoPrev()) navigateWithFlip(-1); }
    else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); if (canGoNext()) navigateWithFlip(1); }
    else if (e.key === 'Home') { e.preventDefault(); goToSpread(0); }
    else if (e.key === 'End') { e.preventDefault(); goToSpread(TOTAL_SPREADS - 1); }
    else if (e.key === 'Escape') { e.preventDefault(); Sidebar.toggle(); }
  });
}

function _f_phase7Audio() {
  Logger.info('Startup', 'Phase 7/9 — Audio');
  AudioFXService.init();
  AudioManager.init();
}

function _f_phase8Secondary() {
  Logger.info('Startup', 'Phase 8/9 — Secondary');
  import('../components/Sidebar.js').then(m => m.Sidebar.init()).catch(() => {});
  AudioManager.updateUI();
}

function _f_phase9Effects() {
  Logger.info('Startup', 'Phase 9/9 — Effects');
  AnimationManager.init();
  import('../components/Particles.js').then(m => m.startParticles()).catch(() => {});

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const mob = isMobile();
      const wasMob = document.documentElement.getAttribute('data-mobile') === 'true';
      if (mob !== wasMob) {
        document.documentElement.setAttribute('data-mobile', mob ? 'true' : 'false');
        renderSpread();
      }
    }, 150);
  });
}

/* ─── Wrapped phases (tracing only, no behavior change) ────── */

const phase1Config = _fW(_f_phase1Config, 'phase1Config_body', 'js/managers/StartupManager.js');
const phase2Resources = _fW(_f_phase2Resources, 'phase2Resources_body', 'js/managers/StartupManager.js');
const phase3State = _fW(_f_phase3State, 'phase3State_body', 'js/managers/StartupManager.js');
const phase4Render = _fW(_f_phase4Render, 'phase4Render_body', 'js/managers/StartupManager.js');
const phase5Interface = _fW(_f_phase5Interface, 'phase5Interface_body', 'js/managers/StartupManager.js');
const phase6Events = _fW(_f_phase6Events, 'phase6Events_body', 'js/managers/StartupManager.js');
const phase7Audio = _fW(_f_phase7Audio, 'phase7Audio_body', 'js/managers/StartupManager.js');
const phase8Secondary = _fW(_f_phase8Secondary, 'phase8Secondary_body', 'js/managers/StartupManager.js');
const phase9Effects = _fW(_f_phase9Effects, 'phase9Effects_body', 'js/managers/StartupManager.js');

/* ─── STARTUP FORENSIC REPORT ─────────────────────────── */

function generateStartupForensicReport(startTime) {
  const totalTime = performance.now() - startTime;
  const totalUseful = _FA.phaseTimings.reduce((s, p) => p.status === 'ok' ? s + p.elapsed : s, 0);
  const deadTime = Math.max(0, totalTime - totalUseful);
  const slowestPhase = _FA.phaseTimings.reduce((a, b) => (b.elapsed || 0) > (a.elapsed || 0) ? b : a, { elapsed: 0, id: '?', name: '(none)' });
  const slowestFn = _FA.fnCalls.reduce((a, b) => ((b.duration || 0) > (a.duration || 0)) ? b : a, { duration: 0, label: '(none)' });
  const phaseCount = _FA.phaseTimings.length;
  const errorPhase = _FA.phaseTimings.find(p => p.status === 'error');

  /* Phase table */
  const phaseRows = _FA.phaseTimings.map(p => {
    const flags = p.flags?.length ? ' *' : '';
    return `  Phase ${p.id}/9: ${p.name.padEnd(14)} ${(p.elapsed || 0).toFixed(1)}ms  [${p.status}]${flags}`;
  }).join('\n');

  console.log(`\n${'='.repeat(60)}`);
  console.log(`  STARTUP FORENSIC REPORT`);
  console.log(`${'='.repeat(60)}`);

  console.log(`\n  -- CRONOLOGIA --`);
  console.log(`  Primera funcion ejecutada:   ${_FA.firstFn ? _FA.firstFn.path + ' -> ' + _FA.firstFn.label : '(none)'}`);
  console.log(`  Ultima funcion ejecutada:    ${_FA.lastFn ? _FA.lastFn.path + ' -> ' + _FA.lastFn.label : '(none)'}`);
  console.log(`  Primera Promise creada:      ${_FA.firstPromise ? _FA.firstPromise.label : '(none)'}`);
  console.log(`  Ultima Promise:              ${_FA.lastPromise ? _FA.lastPromise.label + ' [' + _FA.lastPromise.status + ']' : '(none)'}`);
  console.log(`  Primer error:                ${_FA.firstError ? _FA.firstError.error + ' (en ' + (_FA.firstError.path || _FA.firstError.label) + ')' : '(ninguno)'}`);
  console.log(`  Ultima linea antes bloqueo:  ${_FA.lastLineBeforeBlock ? _FA.lastLineBeforeBlock.path + ':' + _FA.lastLineBeforeBlock.line : '(ninguno)'}`);

  console.log(`\n  -- FASES (${phaseCount}/9) --`);
  console.log(phaseRows);

  console.log(`\n  -- SOSPECHAS --`);
  console.log(`  Fase mas lenta:    Phase ${slowestPhase.id || '?'} (${(slowestPhase.elapsed || 0).toFixed(1)}ms)`);
  console.log(`  Funcion mas lenta: ${slowestFn.label} (${(slowestFn.duration || 0).toFixed(1)}ms)`);
  console.log(`  Promesas pendientes >100ms: ${_FA.promiseTracker.filter(p => (performance.now() - p.created) > 100 && p.status === 'pending').length}`);
  console.log(`  Errores totales:   ${_FA.errors.length}`);

  console.log(`\n  -- TIEMPOS --`);
  console.log(`  Tiempo total:      ${totalTime.toFixed(2)}ms`);
  console.log(`  Tiempo util:       ${totalUseful.toFixed(2)}ms`);
  console.log(`  Tiempo muerto:     ${deadTime.toFixed(2)}ms (${totalTime > 0 ? (deadTime/totalTime*100).toFixed(1) : 0}%)`);

  console.log(`\n  -- CAUSA DEL BLOQUEO --`);
  if (_FA.firstError) {
    console.log(`  Punto exacto: ${_FA.firstError.path || 'StartupManager.js'}`);
    console.log(`  Error:        ${_FA.firstError.error}`);
    if (_FA.firstError.stack) console.log(`  Stack:        ${_FA.firstError.stack.split('\n')[0]}`);
    console.log(`  Consecuencia: Las fases posteriores a la del error NUNCA se ejecutan`);
  } else {
    console.log(`  (ninguno - el arranque completo todas las fases)`);
  }

  console.log(`\n  -- MODULOS AFECTADOS --`);
  console.log(`  Fase que falla:  ${errorPhase ? 'Phase ' + errorPhase.id + '/9 - ' + errorPhase.name : '(ninguna)'}`);
  console.log(`  Fases no ejecut: ${phaseCount < 9 ? 'Fases ' + (phaseCount + 1) + '-9' : '(todas ejecutadas)'}`);
  console.log(`  Modulos perdidos: ${errorPhase ? 'EventBus handlers, Audio, Sidebar, AnimationManager, Particles, FlipEngine handlers' : '(ninguno)'}`);

  console.log(`\n${'='.repeat(60)}`);
}

/* ─── Public API ───────────────────────────────────────────── */

export class StartupManager {
  static async start() {
    if (started) return;
    started = true;
    const _t0 = performance.now();

    console.log(`\n${'━'.repeat(60)}`);
    console.log(`  🚀 StartupManager.start() INICIADO — ${_ts()}`);
    console.log(`  performance.now: ${performance.now().toFixed(2)}`);
    console.log(`  started flag:    ${started}`);
    console.log(`${'━'.repeat(60)}\n`);

    await runPhaseWithReport(1, 'Config',     phase1Config);
    await runPhaseWithReport(2, 'Resources',  phase2Resources);
    await runPhaseWithReport(3, 'State',      phase3State);
    await runPhaseWithReport(4, 'Render',     phase4Render);
    try {
      await runPhaseWithReport(5, 'Interface',  phase5Interface);
      await runPhaseWithReport(6, 'Events',     phase6Events);
      await runPhaseWithReport(7, 'Audio',      phase7Audio);
      await runPhaseWithReport(8, 'Secondary',  phase8Secondary);
      await runPhaseWithReport(9, 'Effects',    phase9Effects);

      Logger.info('Startup', 'All phases complete');
      console.log(`\n${'━'.repeat(60)}`);
      console.log(`  ✅ StartupManager.start() COMPLETADO — ${_ts()}`);
      console.log(`  Duración total: ${(performance.now() - _t0).toFixed(2)}ms`);
      console.log(`${'━'.repeat(60)}\n`);
    } catch (e) {
      console.error(`\n${'━'.repeat(60)}`);
      console.error(`  💥 StartupManager.start() ABORTADO por error — ${_ts()}`);
      console.error(`  Error: ${e?.message || e}`);
      console.error(`  Duración hasta el fallo: ${(performance.now() - _t0).toFixed(2)}ms`);
      console.error(`  Última fase completada: fase ${_FA.phaseTimings.length}/9`);
      console.error(`${'━'.repeat(60)}\n`);
    } finally {
      generateStartupForensicReport(_t0);
    }
  }
}
