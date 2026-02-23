import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function ClockCard() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="clock-display">
      <div className="clock-time">{format(now, 'HH:mm:ss')}</div>
      <div className="clock-date">{format(now, 'EEE, MMM d yyyy')}</div>
    </div>
  );
}
