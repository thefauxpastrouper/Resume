import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { blogApi, type BlogPost } from "@/lib/api";
import { Clock, Calendar } from "lucide-react";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogApi.list(true)
      .then((data) => {
        setPosts(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen px-6 md:px-16 lg:px-24 py-20">
      <div className="max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in-up">
          <span className="gradient-text">Blog</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-12 animate-fade-in-up stagger-1" style={{ opacity: 0 }}>
          Thoughts on development, blockchain, and technology.
        </p>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-xl p-6 animate-shimmer h-40" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center">
            <p className="text-muted-foreground text-lg">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="block glass rounded-xl p-6 hover-lift transition-all"
              >
                <h2 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {post.read_time || 5} min read
                  </span>
                </div>
                {post.tags && (typeof post.tags === "string" ? JSON.parse(post.tags) : post.tags).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {(typeof post.tags === "string" ? JSON.parse(post.tags) : post.tags).map((tag: string) => (
                      <span key={tag} className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
