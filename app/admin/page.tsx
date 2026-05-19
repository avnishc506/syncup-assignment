"use client";

import { useState } from "react";
import axios from "axios";

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/feed`,
        {
          title,
          description,
        }
      );

      setMessage("Feed Added");

      setTitle("");
      setDescription("");
    } catch (error) {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">
        Admin Panel
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-lg"
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="border p-3 rounded"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          className="border p-3 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white p-3 rounded"
        >
          {loading ? "Adding..." : "Add Feed"}
        </button>
      </form>

      {message && (
        <p className="mt-4">{message}</p>
      )}
    </div>
  );
}