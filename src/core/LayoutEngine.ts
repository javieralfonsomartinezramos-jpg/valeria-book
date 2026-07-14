export interface LayoutResult {
  content: DocumentFragment;
  overflow: ChildNode[];
}

const MEASURE_CONTAINER_ID = 'layout-measure';

function getMeasureContainer(): HTMLElement {
  let el = document.getElementById(MEASURE_CONTAINER_ID);
  if (!el) {
    el = document.createElement('div');
    el.id = MEASURE_CONTAINER_ID;
    el.style.cssText = 'position:fixed;left:-9999px;top:0;width:440px;visibility:hidden;pointer-events:none;z-index:-1';
    document.body.appendChild(el);
  }
  return el;
}

export function measureAndFit(
  children: ChildNode[],
  maxHeight: number,
  containerWidth?: number
): LayoutResult {
  const mc = getMeasureContainer();
  mc.innerHTML = '';
  const w = containerWidth || 440;
  mc.style.width = w + 'px';
  mc.style.maxHeight = maxHeight + 'px';
  mc.style.overflow = 'hidden';

  const fitted = document.createDocumentFragment();
  const overflow: ChildNode[] = [];
  let totalHeight = 0;

  for (let i = 0; i < children.length; i++) {
    const node = children[i].cloneNode(true) as ChildNode;
    mc.appendChild(node);
    const h = mc.scrollHeight;
    mc.removeChild(node);

    if (h > maxHeight && totalHeight > 0) {
      overflow.push(children[i]);
      for (let j = i + 1; j < children.length; j++) {
        overflow.push(children[j]);
      }
      break;
    }

    fitted.appendChild(children[i].cloneNode(true));
    totalHeight = h;
  }

  mc.innerHTML = '';
  return { content: fitted, overflow };
}

export function hasOverflow(element: HTMLElement): boolean {
  return element.scrollHeight > element.clientHeight + 2;
}

export function fitContentToContainer(
  container: HTMLElement,
  items: HTMLElement[],
  maxHeight?: number
): HTMLElement[] {
  const mh = maxHeight || container.clientHeight;
  const overflow: HTMLElement[] = [];
  let totalH = 0;

  container.innerHTML = '';

  for (const item of items) {
    container.appendChild(item);
    const h = container.scrollHeight;
    if (h > mh && totalH > 0) {
      container.removeChild(item);
      overflow.push(item);
    } else {
      totalH = h;
    }
  }

  return overflow;
}
