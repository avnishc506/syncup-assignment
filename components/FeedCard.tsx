interface Feed {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

interface Props {
  feed: Feed;
}

export default function FeedCard({
  feed,
}: Props) {
  return (
    <div className="border p-4 rounded mb-4">
      <h2 className="text-xl font-bold">
        {feed.title}
      </h2>

      <p>{feed.description}</p>

      <small>
        {new Date(
          feed.created_at
        ).toLocaleString()}
      </small>
    </div>
  );
}