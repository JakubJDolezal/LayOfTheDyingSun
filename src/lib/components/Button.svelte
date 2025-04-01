<script lang="ts">
  import Icon from './Icon.svelte';
  import { clsx } from 'clsx';
  interface ButtonProps {
    onclick: () => void;
    type?: 'button' | 'submit' | 'reset';
    icon?: any;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'error';
    outline?: boolean;
    loading?: boolean;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    shape?: 'circle' | 'square';
  }

  let {
    onclick,
    type = 'button',
    icon = undefined,
    disabled = false,
    variant = 'primary',
    outline = false,
    loading = false,
    size = 'md',
    shape = 'square'
  }:ButtonProps = $props();

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
  {onclick}
  {disabled}
>
  {#if icon}
    <Icon data={icon} class={iconSize} />
  {/if}
  <slot />
</button>
