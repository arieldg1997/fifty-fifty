import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Expense, Category } from "./fifty-fifty";
import { X } from "lucide-react";
import Swal from "sweetalert2";

type ExpenseFormProps = {
  onAddExpense: (expense: Expense) => void;
  categories: Category[];
};

type Message =
  | { type: "success"; message: string }
  | { type: "error"; message: string };

type Tag = {
  _id: string;
  name: string;
  createdAt: Date;
};

export function ExpenseForm({ onAddExpense, categories }: ExpenseFormProps) {
  const [owner, setOwner] = useState<"Rochi" | "Ari" | "">("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState<Message>({
    type: "success",
    message: "",
  });
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const response = await fetch("/api/tags");
      const data = await response.json();
      setTags(data);
    };
    fetchTags();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    Swal.showLoading();
    e.preventDefault();
    if (!owner || !amount || !category) return;
    const newExpense: Expense = {
      id: uuidv4(),
      owner,
      amount: parseFloat(amount),
      currency,
      date,
      category,
      tags: selectedTags,
      description,
    };

    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newExpense),
      });

      if (response.ok) {
        setMessage({ type: "success", message: "Expense added successfully" });
      }
    } catch (error) {
      setMessage({ type: "error", message: "Error adding expense" });
    }

    onAddExpense(newExpense);
    setOwner("");
    setAmount("");
    setCurrency("EUR");
    setDate("");
    setCategory("");
    setSelectedTags([]);
    setDescription("");
    Swal.close();
    Swal.fire({
      title: "¡Expense added!",
      text: `The expense has been added successfully.`,
      icon: "success",
      confirmButtonText: "Accept",
    });
  };

  const handleTagChange = (value: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(value)
        ? prevTags.filter((tag) => tag !== value)
        : [...prevTags, value]
    );
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags((prevTags) =>
      prevTags.filter((tag) => tag !== tagToRemove)
    );
  };

  return (
    <>
      {message.type === "success" && message.message !== "" && (
        <div className="bg-success text-white p-4 rounded-lg shadow">
          <p>{message.message}</p>
        </div>
      )}
      {message.type === "error" && (
        <div className="bg-error text-white p-4 rounded-lg shadow">
          <p>{message.message}</p>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-4 bg-card rounded-lg shadow"
      >
        <div>
          <Label className="text-lg font-semibold">Owner</Label>
          <div className="flex space-x-2 mt-1">
            <Button
              type="button"
              variant={owner === "Rochi" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setOwner("Rochi")}
            >
              Rochi
            </Button>
            <Button
              type="button"
              variant={owner === "Ari" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setOwner("Ari")}
            >
              Ari
            </Button>
          </div>
        </div>
        <div>
          <Label htmlFor="amount" className="text-lg font-semibold">
            Amount and Currency
          </Label>
          <div className="flex space-x-2 mt-1">
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder="Enter amount"
              className="flex-1"
            />
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="ARS">ARS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="date" className="text-lg font-semibold">
            Date
          </Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="category" className="text-lg font-semibold">
            Category
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.name} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="tags" className="text-lg font-semibold">
            Tags
          </Label>
          <Select onValueChange={handleTagChange}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select tags" />
            </SelectTrigger>
            <SelectContent>
              {tags.map((tag) => (
                <SelectItem key={tag._id} value={tag.name}>
                  {tag.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-sm py-1 px-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-muted-foreground hover:text-foreground"
                >
                  <X size={14} />
                </button>
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="description" className="text-lg font-semibold">
            Description
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a description for the expense"
            className="mt-1"
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={!owner || !amount || !category}
        >
          Add Expense
        </Button>
      </form>
    </>
  );
}
