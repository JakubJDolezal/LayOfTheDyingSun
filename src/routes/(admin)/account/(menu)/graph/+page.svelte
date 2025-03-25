<svelte:head>
  <title>Jaid Gym: Design</title>
  <meta name="Design" content="Design" />
</svelte:head>

<script>
  import {onMount, onDestroy} from "svelte";
  import { Background, SvelteFlowProvider,BackgroundVariant } from "@xyflow/svelte"
  import Flow from './Flow.svelte';
  import DnDProvider from './DnDProvider.svelte';

  onMount(async () => {

  });

</script>

<SvelteFlowProvider>
  <DnDProvider>
    <Flow saveLabelType="save" /> <!-- 🔥 Pass it here -->
  </DnDProvider>
</SvelteFlowProvider>
