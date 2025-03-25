<!--<script lang="ts">-->
<!--  import {Button, TextField} from "svelte-ux";-->
<!--  import {faPenToSquare, faEllipsisH} from '@fortawesome/free-solid-svg-icons';-->

<!--  export let title: string = 'myNode';-->
<!--  export let nodeType: string = 'Node';-->
<!--  export let content: string = ''; // Content to display in the body of the card-->
<!--  export let footer: string = ''; // Footer content-->
<!--  export let isModalOpen: boolean = false; // Exported prop for modal state-->

<!--  let isEditingTitle = false; // Track whether the title is being edited-->
<!--  let editableTitle = title; // Local copy of the title for editing-->
<!--  const toggleModal = () => {-->
<!--    isModalOpen = !isModalOpen; // Update modal state-->
<!--  };-->
<!--  const saveTitle = () => {-->
<!--    isEditingTitle = false;-->
<!--    title = editableTitle; // Update the prop with the new title-->
<!--  };-->
<!--</script>-->

<!--<div class="node-card">-->
<!--  <div class="node-header">-->
<!--    <div class="node-icon">-->
<!--      <slot name="icon"></slot>-->
<!--    </div>-->
<!--    <div class="node-info">-->
<!--      {#if isEditingTitle}-->
<!--        <TextField-->
<!--          type="text"-->
<!--          bind:value={editableTitle}-->
<!--          on:blur={saveTitle}-->
<!--          on:keydown={(e) => e.key === 'Enter' && saveTitle()}-->
<!--          dense-->
<!--        />-->
<!--      {:else}-->
<!--        <p class="node-title" on:dblclick={() => (isEditingTitle = true)}>-->
<!--          {title}-->
<!--        </p>-->
<!--      {/if}-->
<!--      <p class="node-type">{nodeType}</p>-->
<!--    </div>-->
<!--    <Button icon={faEllipsisH} class="field-slot-icon"></Button>-->
<!--  </div>-->
<!--  {#if content}-->
<!--    <div class="node-content">-->
<!--      <p>{content}</p>-->
<!--    </div>-->
<!--  {/if}-->
<!--  <div class="node-footer">-->
<!--    {#if footer}-->
<!--      <Button icon={faPenToSquare} class="btn-primary" on:click={() => (toggleModal())}>{footer}</Button>-->
<!--    {/if}-->
<!--    </div>-->
<!--</div>-->
