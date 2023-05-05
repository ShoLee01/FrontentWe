import 'next-tick';
(window as any).global = window;

if (typeof process === 'undefined') {
  (window as any).process = {
    env: { DEBUG: undefined },
    version: '',
    nextTick: require('next-tick')
  };
}

(window as any).Buffer = (window as any).Buffer || require('buffer').Buffer;
Object.defineProperty(window, 'crypto', { value: require('crypto-browserify') });

