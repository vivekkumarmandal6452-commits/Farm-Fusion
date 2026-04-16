import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const fallbackGraphData = [
  { day: "Mon", Wheat: 2100, Paddy: 1950, Maize: 1880 },
  { day: "Tue", Wheat: 2120, Paddy: 1930, Maize: 1895 },
  { day: "Wed", Wheat: 2150, Paddy: 1900, Maize: 1910 },
  { day: "Thu", Wheat: 2160, Paddy: 1940, Maize: 1935 },
  { day: "Fri", Wheat: 2200, Paddy: 2050, Maize: 1980 },
];

export default function MarketGraph({ marketInsights, title, badge }) {
  const graphData = marketInsights?.trends?.length ? marketInsights.trends : fallbackGraphData;

  return (
    <div className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(16,24,40,0.12)]">
      <p className="inline-flex rounded-full bg-[#1B5E20] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white">
        {badge || "Market Graph"}
      </p>
      <h3 className="mt-4 text-2xl font-black text-slate-900">
        {title || "Weekly Mandi Trend"}
      </h3>
      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="4 4" stroke="#d1d5db" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="Wheat" stroke="#1B5E20" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="Paddy" stroke="#FFAB00" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="Maize" stroke="#2563eb" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
