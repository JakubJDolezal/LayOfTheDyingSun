

<svg width="0" height="0">
  <defs>
    <marker
      id="logo"
      viewBox="0 0 10 10"
      refX="5"
      refY="5"
      markerWidth="10"
      markerHeight="10"
      orient="auto-start-reverse"
    >
      <!-- Here we create a small animated circle as the marker -->
      <circle cx="5" cy="5" r="3" fill="#000">
        <!-- Add animation for the marker to "move" along the edge -->
        <animateMotion dur="2s" repeatCount="indefinite">
          <mpath href="#pathId" />
        </animateMotion>
      </circle>
    </marker>
  </defs>
</svg>
