<script lang="ts">
  import { onMount } from "svelte";

  let {
    options = [],
    placeholder = 'Select...',
    disabled = false,
    clearable = true,
    selected,
    onChange
  }: {
    options: { label: string; value: any }[];
    placeholder?: string;
    disabled?: boolean;
    clearable?: boolean;
    selected?: any;
    onChange?: (value: any | null) => void;
  } = $props();

  let open = $state(false);
  let highlightIndex = $state(-1);
  let searchText = $state('');

  let inputEl: HTMLInputElement;
  const dropdownId = 'dropdown-' + Math.random().toString(36).slice(2);
  let filtered = $derived(
    searchText
      ? options.filter((o) => o.label.toLowerCase().includes(searchText.toLowerCase()))
      : options
  );

  function select(option: { label: string; value: any }) {
    selected = option;
    searchText = option.label;
    open = false;
    highlightIndex = -1;
    onChange?.(option.value);
  }

  function clear() {
    selected = null;
    searchText = '';
    onChange?.(null);
  }

  function onKeyDown(e: KeyboardEvent) {
    if (!open) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      highlightIndex = (highlightIndex + 1) % filtered.length;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlightIndex = (highlightIndex - 1 + filtered.length) % filtered.length;
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[highlightIndex]) select(filtered[highlightIndex]);
    } else if (e.key === 'Escape') {
      open = false;
    }
  }

  onMount(() => {
    const closeOnClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.select-container')) {
        open = false;
      }
    };
    document.addEventListener('click', closeOnClickOutside);
    return () => document.removeEventListener('click', closeOnClickOutside);
  });
</script>

<div class="form-control w-full select-container"    role="combobox"
  aria-haspopup="listbox"
  aria-controls={dropdownId}
  aria-expanded={open}
  tabindex="0" onkeydown={onKeyDown}>
  <div class="relative w-full">
    <input
      bind:this={inputEl}
      bind:value={searchText}
      type="text"
      class="input input-bordered w-full pr-10 {disabled ? 'input-disabled' : ''} text-base-content"
      placeholder={placeholder}
      oninput={(e) => (searchText = e.currentTarget.value)}
      onfocus={() => (open = true)}
      {disabled}
      role="combobox"
      aria-haspopup="listbox"
      aria-controls={dropdownId}
      aria-expanded={open}
      aria-activedescendant={highlightIndex > -1 ? `option-${highlightIndex}` : undefined}
      aria-autocomplete="list"
    />

    <!-- Clear button -->
    {#if selected && clearable}
      <button
        class="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
        type="button"
        aria-label="Clear selection"
        onclick={(e) => { e.stopPropagation(); clear();}}
      >
        ✕
      </button>
    {/if}

    <!-- Dropdown arrow -->
    <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
      {open ? '▲' : '▼'}
    </span>
  </div>

  <!-- Dropdown -->
  {#if open}
    <ul
      id={dropdownId}
      role="listbox"
      class="absolute z-50 mt-1 bg-base-100 shadow-lg rounded-box w-full max-h-60 overflow-auto border border-base-300"
    >
      {#if filtered.length > 0}
        {#each filtered as opt, i}
          <li
            id={"option-" + i}
            role="option"
            tabindex="0"
            aria-selected={opt.value === selected?.value}
            class="px-4 py-2 cursor-pointer transition-all duration-100 hover:bg-base-200 text-base-content {i === highlightIndex ? 'bg-base-200' : ''} {opt.value === selected?.value ? 'font-semibold' : ''}"            onclick={() => select(opt)}
            onkeydown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                select(opt);
              }
            }}
          >
            {opt.label}
          </li>
        {/each}
      {:else}
        <li class="px-4 py-2 text-sm italic text-base-content/50">
          No options found
        </li>
      {/if}
    </ul>
  {/if}
</div>
