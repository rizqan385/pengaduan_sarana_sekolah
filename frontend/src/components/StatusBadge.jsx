import React from 'react';
import { Clock, RefreshCw, CheckCircle2 } from 'lucide-react';

const StatusBadge = ({ status }) => {
  if (status === 'Menunggu') {
    return (
      <span className="badge menunggu">
        <Clock size={14} /> Menunggu
      </span>
    );
  }
  
  if (status === 'Proses') {
    return (
      <span className="badge proses">
        <RefreshCw size={14} /> Diproses
      </span>
    );
  }
  
  if (status === 'Selesai') {
    return (
      <span className="badge selesai">
        <CheckCircle2 size={14} /> Selesai
      </span>
    );
  }

  return <span className="badge">{status}</span>;
};

export default StatusBadge;
