import React from 'react';
import { OverlayTrigger, Tooltip as BootstrapTooltip } from 'react-bootstrap';
import '../Tooltip.css';

function Tooltip(props) {
  const { children, text, className } = props; // Accepting className prop
  return (
    <OverlayTrigger
      placement="top"
      overlay={<BootstrapTooltip>{text}</BootstrapTooltip>}
    >
      <div className={`custom-tooltip ${className}`}>{children}</div> {/* Applying custom class name */}
    </OverlayTrigger>
  );
}

export default Tooltip;
