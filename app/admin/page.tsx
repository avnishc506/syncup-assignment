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

            setMessage("✅ Feed Added Successfully");

            setTitle("");
            setDescription("");
        } catch (error) {
            setMessage("❌ Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-100 flex items-center justify-center p-5">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">
                        Admin Panel
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Create and publish realtime feeds instantly.
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5"
                >
                    {/* Title */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Feed Title
                        </label>

                        <input
                            type="text"
                            placeholder="Enter feed title..."
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            className="w-full border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/10 outline-none p-4 rounded-2xl transition"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Description
                        </label>

                        <textarea
                            placeholder="Write something..."
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            rows={5}
                            className="w-full border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/10 outline-none p-4 rounded-2xl transition resize-none"
                        />
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-black hover:bg-gray-800 text-white py-4 rounded-2xl font-semibold transition-all duration-300 disabled:opacity-60"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Adding Feed...
                            </span>
                        ) : (
                            "Publish Feed"
                        )}
                    </button>
                </form>

                {/* Message */}
                {message && (
                    <div
                        className={`mt-6 p-4 rounded-2xl text-sm font-medium ${message.includes("Successfully")
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : "bg-red-100 text-red-700 border border-red-200"
                            }`}
                    >
                        {message}
                    </div>
                )}
            </div>
        </main>
    );
}