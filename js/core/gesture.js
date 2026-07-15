let allowed = false;
let timer = 0;

export function allowGesture() {
  allowed = true;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => { allowed = false; }, 800);
}

export function assertGesture() {
  return allowed;
}
