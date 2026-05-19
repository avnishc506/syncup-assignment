interface Feed {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

export default function FeedCard({ feed }: { feed: Feed }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 hover:shadow-xl transition">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-bold text-gray-800">
          {feed.title}
        </h2>

        <span className="text-xs text-gray-400">
          {new Date(feed.created_at).toLocaleString()}
        </span>
      </div>

      <p className="text-gray-600 mt-3 leading-relaxed">
        {feed.description}
      </p>
    </div>
  );
}