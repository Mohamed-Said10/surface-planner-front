import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const data = [
  { name: 'Jan', earnings: 1000 },
  { name: 'Feb', earnings: 800 },
  { name: 'Mar', earnings: 2000 },
  { name: 'Apr', earnings: 2200 },
  { name: 'May', earnings: 0 },
  { name: 'Jun', earnings: 4600 },
  { name: 'Jul', earnings: 1600 },
  { name: 'Aug', earnings: 2800 },
  { name: 'Sep', earnings: 1400 },
  { name: 'Oct', earnings: 0 },
  { name: 'Nov', earnings: 2400 },
  { name: 'Dec', earnings: 2600 },
];

export const EarningsBarChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}> 
      <CartesianGrid vertical={false} stroke="#DBDCDF" />

      <XAxis
        dataKey="name"
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 12 }}
      />
      <YAxis
        domain={[0, 5000]}
        ticks={[0,1000, 2000, 3000, 4000, 5000]}
        tickFormatter={(value) => (value === 0 ? '0' : `${value / 1000}k`)}
        tick={{ fontSize: 12 }}
        axisLine={false}
        tickLine={false}
      />
      <Tooltip />
      <Bar dataKey="earnings" fill="#3A7461" radius={[8, 8, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

export default EarningsBarChart