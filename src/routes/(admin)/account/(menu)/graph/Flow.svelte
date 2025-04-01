<script module>
  export const nodeDataDict=$state({ })
</script>
<script lang="ts">
  import { goto } from "$app/navigation"
  import {
    Background,
    BackgroundVariant,
    Controls,
    type Edge,
    MiniMap,
    type Node,
    SvelteFlow,
    useSvelteFlow, useViewport, useInternalNode
  } from "@xyflow/svelte"
  import Sidebar from "./Sidebar.svelte"
  import "@xyflow/svelte/dist/style.css"
  import { useDnD } from "./utils"

  import SwitchNode from "./Nodes/SwitchNode.svelte"
  import ModelNode from "./Nodes/ModelNode.svelte"
  import InputNode from "./Nodes/InputNode.svelte"
  import { faFileExport, faSave } from "@fortawesome/free-solid-svg-icons"
  import Button from "$lib/components/Button.svelte"
  import { supabase } from "$lib/supabaseClient" // Ensure Supabase client is correctly imported
  import { onMount } from "svelte"
  import { applyFallbackColors } from "$lib/colors" // Import 'get' for handling Svelte stores
  let drawerOpen=false
  const MIN_DISTANCE = 450;

  let { screenToFlowPosition , getInternalNode} = $derived(useSvelteFlow());
  const viewport = useViewport();
/*
  let dataModelLoc=writable([])
      let isDataLoaded=false;

*/



  let { saveLabelType } = $props();

  let nodes = $state.raw<Node[]>([])
  let edges = $state.raw<Edge[]>([]);


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
      // ✅ Inject fallback color logic here
      applyFallbackColors(result.graph.nodes);

      console.log("Loaded graph from API:", result.graph);
      nodes=result.graph.nodes;
      edges=result.graph.edges;
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
    const id=crypto.randomUUID()
    let newNode = {
      id: id,
      type: $type,
      position,
      data: {},
      origin: [0.5, 0.0],
      name:  `${$type} node`
    } satisfies Node;
    if($type==='modelnode')
    {
        newNode = {
        id: id,
        type: $type,
        position,
        data: {
          show_color: false,
          categories: [],
          handle_positions: [{ id: `${id}-0`, x: -182, y: 0, type: 'target' }]
        },
        origin: [0.5, 0.0],
        name:  `${$type} node`
        } satisfies Node;
    }


    nodes = [...nodes, newNode];
  };



  const nodeTypes = {
    switchNode: SwitchNode,
    modelNode: ModelNode,
    inputNode:InputNode,
  };



  function downloadGraph() {
    const json = {
      nodes: nodes.map(({ id, type, position }) => ({
        id,
        type,
        position,
        data: $state.snapshot(nodeDataDict)[id]
      })),
      edges: edges
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
      nodes: nodes.map(({ id, type, position }) => ({
        id,
        type,
        position,
        data: $state.snapshot(nodeDataDict)[id]
      })),
      edges: edges,
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
  const zoom=viewport.current.zoom
  return ($state.snapshot(nodeDataDict)[node.id].handle_positions ?? []).map(h => {
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

  for (const other of allNodes) {
    if (other.id === node.id) continue; // skip itself
    console.log('Node')
    const otherHandles = getAbsoluteHandles(other);
    console.log(otherHandles)
    console.log(nodeHandles)
    console.log($state.snapshot(nodeDataDict))

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
function onNodeDrag({ targetNode: node }) {
  console.log(nodes)

  // 1) Find the handle pair that is closest for the *dragged* node
  const closestEdge = getClosestEdge(node, nodes);

  let edgeAlreadyExists = false;

  let updated = edges.map((edge) => {
    if (edgeAlreadyExists) return edge;

    if (closestEdge) {
      if (
        edge.source === closestEdge.source &&
        edge.target === closestEdge.target &&
        edge.sourceHandle === closestEdge.sourceHandle &&
        edge.targetHandle === closestEdge.targetHandle
      ) {
        edgeAlreadyExists = true;
        return edge;
      }

      if (edge.class === 'temp') {
        if (
          edge.source !== closestEdge.source ||
          edge.target !== closestEdge.target ||
          edge.sourceHandle !== closestEdge.sourceHandle ||
          edge.targetHandle !== closestEdge.targetHandle
        ) {
          edgeAlreadyExists = true;
          return closestEdge;
        }
      }
    } else if (edge.class === 'temp') {
      return null; // remove temp edge
    }

    return edge;
  }).filter(Boolean);

  if (closestEdge && !edgeAlreadyExists) {
    updated.push(closestEdge);
  }

  edges = updated;
}

function onNodeDragStop() {
  edges = edges.map(edge => {
    if (edge.class === 'temp') {
      return { ...edge, class: '' };
    }
    return edge;
  });
}
</script>

<main class="flow-container">

  <SvelteFlow class="grl-dg__graph"  bind:nodes bind:edges {nodeTypes} fitView ondragover={onDragOver} ondrop={onDrop}  onnodedrag={onNodeDrag} onnodedragstop={onNodeDragStop}>
    <Controls buttonBgColor="var(--surface-200)" buttonColor="var(--primary-content)"/>
    <Background bgColor="var(--surface-200)" variant={BackgroundVariant.Lines}/>
    <MiniMap bgColor="var(--surface-100)" nodeColor="var(--surface-300)"/>
  </SvelteFlow>




  <Sidebar>
    <div class="btn-footer bg-[var(--surface-100)] w-48 right-1">
      <div class="btn-group">
        <Button icon={faFileExport} onclick={downloadGraph}>Export</Button>

        {#if saveLabelType === 'save'}
          <Button icon={faSave} onclick={save}>Save</Button>
        {:else if saveLabelType === 'initialSave'}
          <Button size="lg" icon={faSave} onclick={intialSave}>Confirm</Button>
        {/if}
      </div>
    </div>
  </Sidebar>
</main>