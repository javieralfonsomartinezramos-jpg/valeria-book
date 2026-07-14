export interface PageData {
  name: string;
  path: string;
  index: number;
}

export interface BookElements {
  psLeft: HTMLElement | null;
  psRight: HTMLElement | null;
  bodyL: HTMLElement | null;
  bodyR: HTMLElement | null;
  numL: HTMLElement | null;
  numR: HTMLElement | null;
  flip: HTMLElement | null;
  fFront: HTMLElement | null;
  fBack: HTMLElement | null;
  fBodyF: HTMLElement | null;
  fBodyB: HTMLElement | null;
  fNumF: HTMLElement | null;
  fNumB: HTMLElement | null;
  fShadow: HTMLElement | null;
  foldGrad: HTMLElement | null;
  topbar: HTMLElement | null;
  title: HTMLElement | null;
  bmRibbon: HTMLElement | null;
  bm: HTMLElement | null;
  book: HTMLElement | null;
}
