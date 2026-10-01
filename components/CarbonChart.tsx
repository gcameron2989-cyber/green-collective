'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { ACTION_REGISTRY } from '@/lib/actions';

interface ChartDataPoint {
  date: string;
  carbonSaved: number;
}

export default function CarbonChart() {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchSubmissions = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: subs, error } = await supabase
        .from('submissions')
        .select('eco_action_id, created_at, quantity')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error || !subs) {
        setLoading(false);
        return;
      }

      const grouped: { [date: string]: number } = {};
      subs.forEach((sub) => {
        const dateStr = new Date(sub.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
        const action = ACTION_REGISTRY.find((a) => a.id === sub.eco_action_id);
        const impact = action ? action.impactValue * (sub.quantity || 1) : 0;
        grouped[dateStr] = (grouped[dateStr] || 0) + impact;
      });

      let runningTotal = 0;
      const chartArray: ChartDataPoint[] = Object.keys(grouped).map((date) => {
        runningTotal += grouped[date];
        return {
          date,
          carbonSaved: Number(runningTotal.toFixed(2)),
        };
      });

      setData(chartArray);
      setLoading(false);
    };

    fetchSubmissions();
  }, [supabase]);

  if (loading) {
    return <div className="p-8 text-xs font-mono text-[#526760]">Loading analytics...</div>;
  }

  if (data.length === 0) {
    return (
      <div className="border border-[#102f26]/15 bg-[#f9f8f6] p-8 text-center">
        <p className="font-mono text-xs uppercase tracking-wider text-[#39705d]">
          No logged actions found yet
        </p>
        <p className="mt-2 text-sm text-[#526760]">
          Log your daily habits to see your cumulative carbon savings chart populate here.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-[#102f26]/15 bg-[#f9f8f6] p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between border-b border-[#102f26]/10 pb-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#39705d] font-semibold">
            Impact Progression
          </p>
          <h3 className="text-xl font-medium text-[#102f26]">Cumulative Carbon Diverted (kg CO₂e)</h3>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="carbonGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#39705d" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#39705d" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#102f26/10" />
            <XAxis dataKey="date" stroke="#526760" fontSize={11} tickLine={false} />
            <YAxis stroke="#526760" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#102f26',
                border: 'none',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="carbonSaved"
              stroke="#102f26"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#carbonGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
