import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { blogApi, type BlogPost } from "@/lib/api";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { CommentsSection } from "@/components/CommentsSection";

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    blogApi.get(slug)
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch(() => {
        setPost(null);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!post) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-xl text-muted-foreground">Post not found</p>
      <Link to="/blog" className="text-primary hover:underline flex items-center gap-1">
        <ArrowLeft size={16} /> Back to blog
      </Link>
    </div>
  );

  const tags = post.tags
    ? (typeof post.tags === "string" ? JSON.parse(post.tags) : post.tags)
    : [];

  return (
    <div className="min-h-screen px-6 md:px-16 lg:px-24 py-20">
      <div className="max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to blog
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {new Date(post.created_at).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {post.read_time || 5} min read
          </span>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {tags.map((tag: string) => (
              <span key={tag} className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="prose max-w-none whitespace-pre-wrap">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <CommentsSection postId={post.id} />
      </div>
    </div>
  );
}
