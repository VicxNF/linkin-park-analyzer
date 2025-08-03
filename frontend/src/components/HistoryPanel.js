import React from 'react';
import './HistoryPanel.css';

const HistoryPanel = ({ isVisible, history, onClose }) => {
  const panelClass = isVisible ? 'history-panel visible' : 'history-panel';

  return (
    <div className={panelClass}>
      <div className="history-header">
        <h3>Historial de Análisis</h3>
        <button className="close-history-btn" onClick={onClose}>×</button>
      </div>
      <div className="history-list">
        {history.length === 0 ? (
          <p className="empty-history-text">No hay análisis recientes.</p>
        ) : (
          history.map(item => (
            <div key={item.id} className="history-item">
              <blockquote className="history-snippet">{item.snippet}</blockquote>
              <p className="history-analysis">{item.analysis}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;