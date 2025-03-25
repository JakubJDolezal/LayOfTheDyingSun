<script context="module" lang="ts">
  let cache = new Map<string, Promise<string>>();
</script>

<script lang="ts">
  import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
  import { clsx } from 'clsx';

  export let size: string | number = '1.5em';
  export let width = size;
  export let height = size;
  export let viewBox = '0 0 24 24';
  export let path: string | string[] = '';
  export let data: IconDefinition | string | null | undefined = undefined;
  export let svg: string | undefined = undefined;
  export let svgUrl: string | undefined = undefined;

  // Accessibility
  export let title: string | undefined = undefined;
  export let desc: string | undefined = undefined;

  $: isLabelled = title || desc;

  export let classes: {
    root?: string;
    path?: string | string[];
  } = {};

  $: if (typeof data === 'object' && data && 'icon' in data) {
    // Font Awesome
    const [_width, _height, _ligatures, _unicode, _path] = data.icon;
    viewBox = `0 0 ${_width} ${_height}`;
    path = _path;
    width = '1.0rem';
    height = '1.0rem';
  } else if (typeof data === 'string') {
    // Also conveniently accept `path`, `svg`, or `svgUrl` as `data`
    const dataStr = data.toLowerCase();
    if (dataStr.includes('<svg')) {
      svg = data;
    } else if (dataStr.includes('http')) {
      svgUrl = data;
    } else {
      path = data;
    }
  }

  // If the SVG includes the font awesome license comment, use `1.0em`
  $: if (svg?.includes('fontawesome.com')) {
    width = '1.0rem';
    height = '1.0rem';
  }

  $: if (svgUrl) {
    let promise;
    if (cache.has(svgUrl)) {
      cache.get(svgUrl)?.then((text) => (svg = text));
    } else {
      promise = fetch(svgUrl)
        .then((resp) => resp.text())
        .catch(() => {
          if (svgUrl && typeof svgUrl === 'string') {
            cache.delete(svgUrl);
          }
          return '';
        });
      cache.set(svgUrl, promise);
      promise.then((text) => {
        svg = text;
      });
    }
  }
</script>

{#if svg || svgUrl || $$slots.default}
  <span
    class={clsx(
      'icon',
      'inline-flex items-center justify-center',
      'fill-current',
      classes.root,
      $$props.class
    )}
    style={$$props.style}
    style:width
    style:height
    style:--width={width}
    style:--height={height}
    role={isLabelled ? 'img' : 'presentation'}
    on:click
  >
    <slot>
      {@html svg ?? ''}
    </slot>
  </span>
{:else}
  <svg
    {width}
    {height}
    {viewBox}
    class={clsx(
      'icon',
      'inline-block',
      'fill-current',
      classes.root,
      $$props.class
    )}
    style={$$props.style}
    role={isLabelled ? 'img' : 'presentation'}
    on:click
  >
    {#if title}
      <title >{title}</title>
    {/if}
    {#if desc}
      <desc>{desc}</desc>
    {/if}
    {#each Array.isArray(path) ? path : [path] as d, i}
      <path
        {d}
        fill="currentColor"
        class={clsx(
          Array.isArray(classes.path) ? classes.path[i] : classes.path
        )}
      />
    {/each}
  </svg>
{/if}

<style>
.icon-container :global(> svg) {
    width: var(--width);
    height: var(--height);
    min-width: 4rem !important;  /* Adjust as needed */
    min-height: 4rem !important; /* Adjust as needed */
}
</style>
