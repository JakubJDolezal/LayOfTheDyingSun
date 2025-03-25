<script lang="ts">
  export let type: 'text' | 'password' | 'email' | 'number' | 'search' = 'text';
  export let label: string = '';
  export let placeholder: string = '';
  export let value: string | number = '';
  export let disabled: boolean = false;
  export let error: string | null = null;
  export let size: 'xs' | 'sm' | 'md' = 'md';
  export let iconLeft: string | null = null;
  export let iconRight: string | null = null;
</script>

<div class="form-control w-full">
  {#if label}
    <label class="label">
      <span class="label-text">{label}</span>
    </label>
  {/if}

  <div class="relative">
    {#if iconLeft}
      <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <i class={iconLeft}></i>
      </span>
    {/if}

    <input
      type={type}
      class="input input-{size} w-full {error ? 'input-error' : 'input-bordered'} {iconLeft ? 'pl-10' : ''} {iconRight ? 'pr-10' : ''}"
      bind:value
      {placeholder}
      {disabled}
    />

    {#if iconRight}
      <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <i class={iconRight}></i>
      </span>
    {/if}

    <!-- Named slot for append (e.g., buttons, icons) -->
    <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
      <slot name="append"></slot>
    </div>
  </div>

  <slot />

  {#if error}
    <label class="label">
      <span class="label-text-alt text-error">{error}</span>
    </label>
  {/if}
</div>
<style>
  .input {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>