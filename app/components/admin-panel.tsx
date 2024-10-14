import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";

interface Tag {
  _id: string;
  name: string;
  createdAt: Date;
}

interface Category {
  _id: string;
  name: string;
  monthlyObjective: number;
  createdAt: Date;
}

interface AdminPanelProps {
  categories: Category[];
  tags: Tag[];
  onAddCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  onAddTag: (tag: Tag) => void;
  onDeleteTag: (tagId: string) => void;
}

export function AdminPanel({
  categories,
  tags,
  onAddCategory,
  onDeleteCategory,
  onAddTag,
  onDeleteTag,
}: AdminPanelProps) {
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryObjective, setNewCategoryObjective] = useState<string>("");
  const [newTag, setNewTag] = useState<string>("");

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag) return;
    Swal.showLoading();

    await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newTag }),
    });

    const response = await fetch("/api/tags");
    const data: Tag[] = await response.json();
    onAddTag(data[data.length - 1]);
    setNewTag("");
    Swal.close();
    Swal.fire({
      title: "¡Tag agregado!",
      text: `El tag "${newTag}" ha sido agregado exitosamente.`,
      icon: "success",
      confirmButtonText: "Aceptar",
    });
  };

  const handleDeleteTag = async (tagName: string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Seguro que deseas eliminar el tag "${tagName}"? Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminarlo",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      Swal.showLoading();

      await fetch("/api/tags", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tagName }),
      });

      const response = await fetch("/api/tags");
      const data: Tag[] = await response.json();
      onDeleteTag(tagName);
      Swal.close();

      // Mostrar una alerta de éxito al eliminar el tag
      Swal.fire({
        title: "¡Eliminado!",
        text: `El tag "${tagName}" ha sido eliminado.`,
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const addCategory = async () => {
    if (newCategory && newCategoryObjective) {
      Swal.showLoading();

      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCategory,
          monthlyObjective: parseFloat(newCategoryObjective),
        }),
      });
      if (response.ok) {
        const response = await fetch("/api/categories");
        const data: Category[] = await response.json();
        onAddCategory(data[data.length - 1]);
        setNewCategory("");
        setNewCategoryObjective("");

        Swal.fire({
          title: "¡Categoría agregada!",
          text: `La categoría "${newCategory}" ha sido agregada con éxito.`,
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      }
      Swal.close();
    }
  };

  const removeCategory = async (categoryToRemove: string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Seguro que deseas eliminar la categoría "${categoryToRemove}"? Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminarla",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      Swal.showLoading();

      await fetch("/api/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryToRemove }),
      });
      Swal.close();
      onDeleteCategory(categoryToRemove);
      Swal.fire({
        title: "¡Eliminada!",
        text: `La categoría "${categoryToRemove}" ha sido eliminada.`,
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="mt-5 p-4 border rounded-lg shadow-md bg-white">
        <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="New Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Monthly objective"
            value={newCategoryObjective}
            onChange={(e) => setNewCategoryObjective(e.target.value)}
          />
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition duration-200"
            onClick={addCategory}
          >
            +
          </Button>
        </div>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li
              key={category.name}
              className="flex justify-between items-center bg-gray-100 p-2 rounded-lg shadow"
            >
              <span className="text-gray-700">
                {category.name} - Objective: {category.monthlyObjective}
              </span>
              <Button
                variant="destructive"
                className="bg-red-500 text-white hover:bg-red-600 rounded-lg transition duration-200"
                onClick={() => removeCategory(category.name)}
              >
                x
              </Button>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 border rounded-lg shadow-md bg-white">
        <h2 className="text-2xl font-bold mb-4">Manage Tags</h2>
        <form onSubmit={handleAddTag} className="flex space-x-2 mb-4">
          <Input
            placeholder="New tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
          <Button
            type="submit"
            className="bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition duration-200"
          >
            +
          </Button>
        </form>
        <ul className="space-y-2">
          {tags.map((tag) => (
            <li
              key={tag.name}
              className="flex justify-between items-center bg-gray-100 p-2 rounded-lg shadow"
            >
              <span className="text-gray-700">{tag.name}</span>
              <Button
                variant="destructive"
                onClick={() => handleDeleteTag(tag.name)}
                className="bg-red-500 text-white hover:bg-red-600 rounded-lg transition duration-200"
              >
                x
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
