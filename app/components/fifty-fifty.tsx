"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpenseForm } from "./expense-form";
import { ExpenseList } from "./expense-list";
import { ExpenseCharts } from "./expense-charts";
import { AdminPanel } from "./admin-panel";
import Swal from "sweetalert2";

export type Expense = {
  id: string;
  owner: string;
  amount: number;
  currency: string;
  date: string;
  category: string;
  tags: string[];
  description: string;
};

export interface Tag {
  _id: string;
  name: string;
  createdAt: Date;
}

export interface Category {
  _id: string;
  name: string;
  monthlyObjective: number;
  createdAt: Date;
}

export default function FiftyFifty() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const addExpense = (expense: Expense) => {
    console.log("agregando expensa");
    setExpenses([...expenses, expense]);
  };

  const deleteExpense = (expenseId: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== expenseId));
  };

  const addCategory = async (category: Category) => {
    setCategories([...categories, category]);
  };

  const deleteCategory = (categoryId: string) => {
    setCategories(categories.filter((category) => category._id !== categoryId));
  };

  const addTag = async (tag: Tag) => {
    setTags([...tags, tag]);
  };

  const deleteTag = (tagId: string) => {
    setTags(tags.filter((tag) => tag._id !== tagId));
  };

  // Cargar categorías y etiquetas al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      Swal.showLoading();
      try {
        // Usa Promise.all para realizar las solicitudes de forma concurrente
        const [categoriesResponse, tagsResponse, expensesResponse] =
          await Promise.all([
            fetch("/api/categories"),
            fetch("/api/tags"),
            fetch("/api/expenses"),
          ]);

        // Verifica que todas las respuestas sean exitosas
        if (
          !categoriesResponse.ok ||
          !tagsResponse.ok ||
          !expensesResponse.ok
        ) {
          throw new Error("Error fetching data");
        }

        // Convierte las respuestas a JSON de manera concurrente
        const [categoriesData, tagsData, expensesData] = await Promise.all([
          categoriesResponse.json(),
          tagsResponse.json(),
          expensesResponse.json(),
        ]);

        // Actualiza el estado con los datos obtenidos
        setCategories(categoriesData);
        setTags(tagsData);
        setExpenses(expensesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Maneja el error adecuadamente (por ejemplo, mostrar un mensaje al usuario)
      }
      Swal.close();
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-md md:max-w-2xl lg:max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">
        Fifty Fifty
      </h1>
      <Tabs defaultValue="add" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="add">Add Expense</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
        </TabsList>
        <TabsContent value="add">
          <ExpenseForm onAddExpense={addExpense} categories={categories} />
        </TabsContent>
        <TabsContent value="history">
          <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />
        </TabsContent>
        <TabsContent value="charts">
          <ExpenseCharts expenses={expenses} categories={categories} />
        </TabsContent>
        <TabsContent value="admin">
          <AdminPanel
            categories={categories}
            tags={tags}
            onAddCategory={addCategory}
            onDeleteCategory={deleteCategory}
            onAddTag={addTag}
            onDeleteTag={deleteTag}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
