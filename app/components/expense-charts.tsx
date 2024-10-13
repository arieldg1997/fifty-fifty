import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "./ui/chart";
import { Expense, Category } from "./fifty-fifty";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  CartesianGrid,
} from "recharts";

type ExpenseChartsProps = {
  expenses: Expense[];
  categories: Category[];
};

export function ExpenseCharts({ expenses, categories }: ExpenseChartsProps) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const categoryData = categories.map((category) => {
    const totalSpent = expenses
      .filter(
        (expense) =>
          expense.category === category.name &&
          new Date(expense.date).getMonth() === currentMonth &&
          new Date(expense.date).getFullYear() === currentYear
      )
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      name: category.name,
      difference: category.monthlyObjective - totalSpent,
      spent: totalSpent,
    };
  });

  const monthlyData = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleString("default", {
      month: "short",
    });
    const existingMonth = acc.find((item) => item.name === month);
    if (existingMonth) {
      existingMonth.value += expense.amount;
    } else {
      acc.push({ name: month, value: expense.amount });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Category Comparison</CardTitle>
          <CardDescription>
            Comparison of spent amount vs monthly objective for each category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <YAxis type="number" domain={["dataMin", "dataMax"]} />
                <XAxis
                  style={{ textAlign: "end" }}
                  dataKey="name"
                  type="category"
                />
                <Tooltip />
                <ReferenceLine y={0} stroke="#000" />
                <Bar dataKey="difference" fill="#8884d8"></Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Category Spending Distribution</CardTitle>
          <CardDescription>
            Distribution of expenses across different categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="spent"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Monthly Expenses</CardTitle>
          <CardDescription>Total expenses for each month</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
