"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import FeedCard from "../components/FeedCard";

interface Feed {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
});

export default function HomePage() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFeeds = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/feed`
      );

      setFeeds(response.data.data);
    } catch (err) {
      setError("Failed to fetch feeds");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeds();

    socket.off("newFeed");

    socket.on("newFeed", (newFeed: Feed) => {
      setFeeds((prev) => [newFeed, ...prev]);
    });

    return () => {
      socket.off("newFeed");
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-black text-white py-6 shadow-md">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold">
            Realtime Feed
          </h1>

          <p className="text-gray-300 mt-2">
            Live updates powered by Socket.IO
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-xl">
            {error}
          </div>
        )}

        {!loading && !error && feeds.length === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center shadow">
            <h2 className="text-2xl font-semibold text-gray-700">
              No feeds available
            </h2>

            <p className="text-gray-500 mt-2">
              New realtime feeds will appear here.
            </p>
          </div>
        )}

        <div className="grid gap-5">
          {feeds.map((feed) => (
            <div
              key={feed.id}
              className="transition-transform duration-300 hover:scale-[1.01]"
            >
              <FeedCard feed={feed} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}


