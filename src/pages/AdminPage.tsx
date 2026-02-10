import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { ImageUploader } from "@/components/ImageUploader";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  tags: string[] | null;
  read_time: number | null;
  published: boolean | null;
  created_at: string;
}

export default function AdminPage() {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [creating, setCreating] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [readTime, setReadTime] = useState("5");
  const [published, setPublished] = useState(false);

  // Protection handled by ProtectedRoute component

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    setPosts((data as BlogPost[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) fetchPosts();
  }, [isAdmin]);

  const resetForm = () => {
    setTitle(""); setSlug(""); setExcerpt(""); setContent("");
    setTags(""); setReadTime("5"); setPublished(false);
    setEditing(null); setCreating(false);
  };

  const startEdit = (post: BlogPost) => {
    setEditing(post);
    setCreating(false);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt || "");
    setContent(post.content);
    setTags(post.tags?.join(", ") || "");
    setReadTime(String(post.read_time || 5));
    setPublished(post.published || false);
  };

  const handleSave = async () => {
    if (!title || !slug || !content) {
      toast({ title: "Missing fields", description: "Title, slug, and content are required.", variant: "destructive" });
      return;
    }
    const postData = {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      read_time: parseInt(readTime) || 5,
      published,
      author_id: user!.id,
    };

    if (editing) {
      const { error } = await supabase.from("blog_posts").update(postData).eq("id", editing.id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Post updated!" });
        resetForm();
        fetchPosts();
      }
    } else {
      const { error } = await supabase.from("blog_posts").insert(postData);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Post created!" });
        resetForm();
        fetchPosts();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Post deleted" });
      fetchPosts();
    }
  };

  const togglePublish = async (post: BlogPost) => {
    await supabase.from("blog_posts").update({ published: !post.published }).eq("id", post.id);
    fetchPosts();
  };

  if (isLoading || !isAdmin) return null;

  const showForm = creating || editing;

  return (
    <div className="min-h-screen px-6 md:px-16 lg:px-24 py-20">
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            <span className="gradient-text">Admin</span> Dashboard
          </h1>
          {!showForm && (
            <button
              onClick={() => { resetForm(); setCreating(true); }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus size={18} /> New Post
            </button>
          )}
        </div>

        {showForm ? (
          <div className="glass rounded-xl p-6 space-y-4 animate-fade-in-up">
            <h2 className="text-xl font-semibold">{editing ? "Edit Post" : "New Post"}</h2>
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!editing) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
              }}
              className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              placeholder="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              placeholder="Excerpt (optional)"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Content</label>
                <ImageUploader
                  onUploadComplete={(url) => {
                    const imageMarkdown = `\n![Image Description](${url})\n`;
                    setContent((prev) => prev + imageMarkdown);
                    toast({ title: "Image inserted", description: "Image markdown added to the end of content." });
                  }}
                />
              </div>
              <textarea
                placeholder="Content (Markdown supported)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y font-mono text-sm"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                placeholder="Tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="flex-1 px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="number"
                placeholder="Read time (min)"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                className="w-32 px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-sm">Publish immediately</span>
            </label>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                {editing ? "Update" : "Create"}
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => <div key={i} className="glass rounded-xl p-6 h-20 animate-shimmer" />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center">
            <p className="text-muted-foreground">No posts yet. Create your first one!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="glass rounded-xl p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{post.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(post.created_at).toLocaleDateString()} · {post.published ? "Published" : "Draft"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => togglePublish(post)} className="p-2 rounded-lg hover:bg-muted transition-colors" title={post.published ? "Unpublish" : "Publish"}>
                    {post.published ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button onClick={() => startEdit(post)} className="p-2 rounded-lg hover:bg-muted transition-colors text-primary">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(post.id)} className="p-2 rounded-lg hover:bg-muted transition-colors text-destructive">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
