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

const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL!,
  {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
  }
);

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
    } catch (error) {
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

  if (loading) return <h1>Loading...</h1>;

  if (error) return <h1>{error}</h1>;

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">
        Realtime Feed
      </h1>

      {feeds.map((feed) => (
        <FeedCard key={feed.id} feed={feed} />
      ))}
    </div>
  );
}