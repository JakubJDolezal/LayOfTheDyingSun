<script lang="ts">
  import Icon from './Icon.svelte';
  import { clsx } from 'clsx';

  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let icon: any = undefined;
  export let disabled: boolean = false;
  export let variant: 'primary' | 'secondary' | 'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'error' = 'primary';
  export let outline: boolean = false;
  export let loading: boolean = false;
  export let size: 'xs' | 'sm' | 'md' | 'lg' = 'md';
  export let shape: 'circle' | 'square' = 'square';

  // Map button sizes to icon sizes
  const iconSizeMap = {
    xs: 'w-3 h-3', // Extra small
    sm: 'w-4 h-4', // Small
    md: 'w-5 h-5', // Medium (default)
    lg: 'w-6 h-6'  // Large
  };

  const iconSize = iconSizeMap[size] || 'w-5 h-5'; // Default to `md`
</script>

<button
  type={type}
  class={clsx(
    'btn',
    `btn-${variant}`,
    outline,
    `btn-${size}`,
    `btn-${shape}`,
    loading && 'loading',
  )}
  on:click
  {disabled}
>
  {#if icon}
    <Icon data={icon} class={iconSize} />
  {/if}
  <slot />
</button>
