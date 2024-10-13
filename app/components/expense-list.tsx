import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Expense } from "./fifty-fifty";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import Swal from "sweetalert2";

type ExpenseListProps = {
  expenses: Expense[];
  onDeleteExpense: (expenseId: string) => void;
};

export function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
  const [filter, setFilter] = useState("");

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.category.toLowerCase().includes(filter.toLowerCase()) ||
      expense.tags.some((tag) =>
        tag.toLowerCase().includes(filter.toLowerCase())
      )
  );

  const handleDeleteExpense = async (expenseId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Are you sure you want to delete the expense? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      const loadingSwal = Swal.fire({
        title: "Deleting...",
        text: "Please wait while we delete the expense.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await fetch("/api/expenses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: expenseId }),
      });

      const response = await fetch("/api/expenses");
      const data: Expense[] = await response.json();

      onDeleteExpense(expenseId);

      Swal.fire({
        title: "Deleted!",
        text: `The expense with id "${expenseId}" has been deleted.`,
        icon: "success",
        confirmButtonText: "Accept",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="mt-4">
        <Input
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by category or tag"
        />
      </div>
      <hr />
      <ul className="space-y-4">
        {filteredExpenses.map((expense) => (
          <li key={expense.id}>
            <Card>
              <CardContent className="p-4 relative">
                <Button
                  variant="outline"
                  className="bg-transparent text-sm text-muted-foreground absolute top-4 right-4"
                  onClick={() => handleDeleteExpense(expense.id)}
                >
                  <Trash size={20} color="#8884d8" />
                </Button>
                <p className="text-lg font-semibold">
                  {expense.amount} {expense.currency} by {expense.owner}
                </p>
                <p className="text-md" style={{ color: "#8884d8" }}>
                  {expense.category}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(expense.date).toISOString().slice(0, 10)}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {expense.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-sm py-1 px-2"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p>{expense.description}</p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
