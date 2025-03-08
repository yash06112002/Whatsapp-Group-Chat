import React from "react";
import "./MessageCounter.css";

function MessageCounter({ manualCount, botCount }) {
  return (
    <div className="message-counter">
      <div className="counter-item">
        <span className="counter-label">Manual messages left:</span>
        <span className="counter-value">{manualCount}</span>
      </div>
      <div className="counter-item">
        <span className="counter-label">Bot messages left:</span>
        <span className="counter-value">{botCount}</span>
      </div>
    </div>
  );
}

export default MessageCounter;
