<script lang="ts">
  import { goto } from '$app/navigation';
  import { writable } from 'svelte/store';
  import {
    SvelteFlow,
    Controls,
    Background,
    BackgroundVariant,
    MiniMap,
    useSvelteFlow,
    type Node, type Edge
  } from '@xyflow/svelte';
  import Sidebar from './Sidebar.svelte';
  import '@xyflow/svelte/dist/style.css';
  import { useDnD } from './utils';
  import SwitchNode from "./Nodes/SwitchNode.svelte";
  import ModelNode from "./Nodes/ModelNode.svelte";
  import InputNode from "./Nodes/InputNode.svelte";
  import {
    faFileExport,faSave
  } from '@fortawesome/free-solid-svg-icons';
  import Button from "$lib/components/Button.svelte"
  import { supabase } from "$lib/supabaseClient"; // Ensure Supabase client is correctly imported
  import { get } from "svelte/store";
  import { onMount } from "svelte" // Import 'get' for handling Svelte stores
  let drawerOpen=false
  const MIN_DISTANCE = 450;

  const  getViewport  = useSvelteFlow();
  let dataModelLoc=writable([])
  export let saveLabelType: 'save' | 'initialSave' = 'save'; // default fallback
  const nodes = writable([

  ]);

  const edges = writable([
  ]);
  let isDataLoaded=false;


  async function loadGraph() {
    const { data: session } = await supabase.auth.getSession();

    if (!session) {
      console.error("User is not authenticated");
      return;
    }

    try {
      const response = await fetch("/api/load-graph", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (result.errorMessage) {
        console.error("Failed to load graph:", result.errorMessage);
        return;
      }

      if (result.graph && Object.keys(result.graph).length > 0) {
        console.log("Loaded graph from API:", result.graph);
        nodes.set(result.graph.nodes);
        edges.set(result.graph.edges);
      } else {
        console.log("No graph found, using default.");
      }
    } catch (error) {
      console.error("Error loading graph:", error);
    }
  }

  onMount(() => {
    loadGraph(); // Call the function inside a non-async function
  });
  const { screenToFlowPosition } = useSvelteFlow();

  const type = useDnD();

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();

    if (!$type) {
      return;
    }

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY
    });
    const newNode = {
      id: crypto.randomUUID(),
      type: $type,
      position,
      data: {},
      origin: [0.5, 0.0],
      name:  `${$type} node`
    } satisfies Node;
    $nodes.push(newNode);
    $nodes = $nodes;



  };



  const nodeTypes = {
    switchNode: SwitchNode,
    modelNode: ModelNode,
    inputNode:InputNode,
  };



  function downloadGraph() {
    const json = {
      nodes: $nodes.map(({ id, type, position, data }) => ({ id, type, position, data })),
      edges: $edges
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "graph.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }


async function save() {
  const { data: session } = await supabase.auth.getSession();
  if (!session) {
    console.error("No session found. User must log in.");
    return false;
  }

  const graph = {
    graph: {
      nodes: get(nodes).map(({ id, type, position, data }) => ({ id, type, position, data })),
      edges: get(edges),
    },
  };

  const response = await fetch("/api/save-graph", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(graph),
  });

  const result = await response.json();

  if (result.errorMessage) {
    console.error("Failed to save graph:", result.errorMessage);
    return false;
  }

  console.log("Graph saved successfully!");
  return true;
}

async function intialSave() {
  const success = await save();
  if (success) {
    goto('/account');
  } else {
    console.error("Save failed — not redirecting");
  }
}

// Same bounding-box code (if you still want to filter or do coarse checks)
function getBoundingBox(n: Node) {
  const width = n.measured?.width ?? 0;
  const height = n.measured?.height ?? 0;
  const ox = n.origin?.[0] ?? 0;
  const oy = n.origin?.[1] ?? 0;

  const left = n.position.x - width * ox;
  const top = n.position.y - height * oy;
  return {
    left,
    top,
    right: left + width,
    bottom: top + height
  };
}

// Helper to get the *absolute/canvas* coordinates of all handles
function getAbsoluteHandles(node: Node) {
  const box = getBoundingBox(node);
  // If the node handle_positions are relative to the top-left corner,
  // add them to box.left/top to get absolute positions
  const zoom=getViewport.getZoom()
  return (node.data.handle_positions ?? []).map(h => {
    return {
      id: h.id,
      type: h.type,
      // We assume (h.x, h.y) are relative to the node’s top-left corner
      absX: box.left*zoom + h.x*zoom,
      absY: box.top*zoom + h.y*zoom
    };
  });
}

// Measures the distance between two handle positions in absolute coords
function distance(h1: { absX: number; absY: number },
                  h2: { absX: number; absY: number }) {
  const dx = h1.absX - h2.absX;
  const dy = h1.absY - h2.absY;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Given one node and a list of all nodes, returns the "closest" edge information:
 *   - which node + handle are "source" vs "target"
 *   - the handle IDs
 *   - 'temp' class or similar
 *
 * You can still combine bounding-box checks (for instance, to skip nodes far away),
 * or simply check all handle pairs if you prefer.
 */
function getClosestEdge(node: Node, allNodes: Node[]): Edge | null {
  let minDist = MIN_DISTANCE;
  let closestEdge: Edge | null = null;
  const nodeHandles = getAbsoluteHandles(node);
  // console.log(node)

  for (const other of allNodes) {
    if (other.id === node.id) continue; // skip itself
    console.log('Node')
    console.log(other)
    const otherHandles = getAbsoluteHandles(other);
    console.log(otherHandles)
    console.log(nodeHandles)

    // Compare all handle pairs: only connect source→target or target→source
    for (const h1 of nodeHandles) {
      for (const h2 of otherHandles) {
        if (h1.type === h2.type) {
          // Both are “source” or both are “target” => skip
          continue;
        }


        // They are source-target or target-source, measure handle distance
        const dist = distance(h1, h2);

        if (dist < minDist) {
          minDist = dist;
          // Figure out which is source vs target
          let sNode, sHandle;
          let tNode, tHandle;

          if (h1.type === 'source') {
            sNode = node.id;
            sHandle = h1.id;
            tNode = other.id;
            tHandle = h2.id;
          } else {
            // h1 is target, so h2 must be source
            sNode = other.id;
            sHandle = h2.id;
            tNode = node.id;
            tHandle = h1.id;
          }

          closestEdge = {
            id: `edge-${sNode}-${sHandle}-to-${tNode}-${tHandle}`,
            source: sNode,
            sourceHandle: sHandle,
            target: tNode,
            targetHandle: tHandle,
            class: 'temp'
          };
        }
      }
    }
  }

  return closestEdge;
}

// Example usage in your drag handler
function onNodeDrag({ detail: { targetNode: node } }) {
  // Suppose these are your Svelte store arrays or arrays in React state
  // “$nodes” is the array of all nodes
  // “$edges” is the array of all edges
  // (Below we treat them as normal arrays.)
  // console.log(node)

  // 1) Find the handle pair that is closest for the *dragged* node
  const closestEdge = getClosestEdge(node, $nodes);

  let edgeAlreadyExists = false;

  $edges.forEach((edge, i) => {
    if (edgeAlreadyExists) return;

    if (closestEdge) {
      // If the same source/target/handles already exist, set a flag
      if (
        edge.source === closestEdge.source &&
        edge.target === closestEdge.target &&
        edge.sourceHandle === closestEdge.sourceHandle &&
        edge.targetHandle === closestEdge.targetHandle
      ) {
        edgeAlreadyExists = true;
        return;
      }

      // If we see a "temp" edge that differs from the new one, replace it
      if (edge.class === 'temp') {
        if (
          edge.source !== closestEdge.source ||
          edge.target !== closestEdge.target ||
          edge.sourceHandle !== closestEdge.sourceHandle ||
          edge.targetHandle !== closestEdge.targetHandle
        ) {
          $edges[i] = closestEdge;
          edgeAlreadyExists = true;
        }
      }
    } else if (edge.class === 'temp') {
      // If there is no valid closestEdge but we have a temp edge, remove that
      $edges.splice(i, 1);
    }
  });

  // If we found a valid new edge that didn't already exist or replace a temp edge, add it
  if (closestEdge && !edgeAlreadyExists) {
    $edges.push(closestEdge);
  }

  // Update your edges store (if you’re using Svelte or something that requires re-assignment)
  $edges = $edges;
}

  function onNodeDragStop() {
    $edges.forEach(edge => {
      if (edge.class === 'temp') {
        edge.class = '';
      }
    });
    $edges = $edges;
  }
</script>

<main class="flow-container">

  <SvelteFlow class="grl-dg__graph" {nodes} {edges} {nodeTypes} fitView on:dragover={onDragOver} on:drop={onDrop}  on:nodedrag={onNodeDrag} on:nodedragstop={onNodeDragStop}>
    <Controls buttonBgColor="var(--surface-200)" buttonColor="var(--primary-content)"/>
    <Background bgColor="var(--surface-200)" variant={BackgroundVariant.Lines}/>
    <MiniMap bgColor="var(--surface-100)" nodeColor="var(--surface-300)"/>
  </SvelteFlow>




  <Sidebar>
    <div class="btn-footer bg-[var(--surface-100)] w-48 right-1">
      <div class="btn-group">
        <Button icon={faFileExport} on:click={downloadGraph}>Export</Button>

        {#if saveLabelType === 'save'}
          <Button icon={faSave} on:click={save}>Save</Button>
        {:else if saveLabelType === 'initialSave'}
          <Button size="lg" icon={faSave} on:click={intialSave}>Confirm</Button>
        {/if}
      </div>
    </div>
  </Sidebar>
</main>