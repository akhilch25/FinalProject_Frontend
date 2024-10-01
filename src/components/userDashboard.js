import React, { useState, useEffect } from 'react';
import Header from './userHeader';
import '../App.css';
import GaugeChart from './guageChart';

export default function UserDashboard() {
  return (
    <div>
      <Header />
      <div className='userdash'>
        <GaugeChart performanceRate={60}/>
      </div>
    </div>
  );
}
