import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { MessageSquare, Trash2 } from "lucide-react";

interface Comment {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    profiles: {
        display_name: string | null;
        avatar_url: string | null;
    } | null;
}

interface CommentsSectionProps {
    postId: string;
}

export function CommentsSection({ postId }: CommentsSectionProps) {
    const { user, isAdmin } = useAuth();
    const { toast } = useToast();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchComments = async () => {
        try {
            const { data, error } = await supabase
                .from("comments" as any)
                .select(`
          id,
          content,
          created_at,
          user_id,
          profiles:user_id (
            display_name,
            avatar_url
          )
        `)
                .eq("post_id", postId)
                .order("created_at", { ascending: true });

            if (error) throw error;
            setComments(data as unknown as Comment[]);
        } catch (error: any) {
            console.error("Error fetching comments:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();

        // Optional: Real-time subscription could go here
        const channel = supabase
            .channel('public:comments')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` }, () => {
                fetchComments();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [postId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newComment.trim()) return;

        setSubmitting(true);
        try {
            const { error } = await supabase
                .from("comments")
                .insert({
                    content: newComment.trim(),
                    post_id: postId,
                    user_id: user.id
                });

            if (error) throw error;

            setNewComment("");
            toast({ title: "Comment posted!" });
            fetchComments();
        } catch (error: any) {
            toast({ title: "Error posting comment", description: error.message, variant: "destructive" });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;
        try {
            const { error } = await supabase
                .from("comments")
                .delete()
                .eq("id", commentId);

            if (error) throw error;
            toast({ title: "Comment deleted" });
            fetchComments();
        } catch (error: any) {
            toast({ title: "Error deleting comment", description: error.message, variant: "destructive" });
        }
    };

    if (loading) return <div className="text-center py-4 text-muted-foreground">Loading comments...</div>;

    return (
        <div className="mt-12 pt-8 border-t border-border">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <MessageSquare size={20} /> Comments ({comments.length})
            </h3>

            <div className="space-y-6 mb-8">
                {comments.length === 0 ? (
                    <p className="text-muted-foreground italic">No comments yet. Be the first to share your thoughts!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="glass dark:bg-white/5 p-4 rounded-xl animate-fade-in-up">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                                        {comment.profiles?.display_name?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                    <div>
                                        <span className="font-medium text-sm block">{comment.profiles?.display_name || "User"}</span>
                                        <span className="text-xs text-muted-foreground">{new Date(comment.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                {(user?.id === comment.user_id || isAdmin) && (
                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                                        title="Delete comment"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                            <p className="text-sm text-foreground/90 whitespace-pre-wrap pl-10">{comment.content}</p>
                        </div>
                    ))
                )}
            </div>

            {user ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-y"
                    />
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting || !newComment.trim()}
                            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Posting..." : "Post Comment"}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="glass p-6 rounded-xl text-center">
                    <p className="text-muted-foreground mb-4">Log in to join the conversation.</p>
                    <Link
                        to="/auth"
                        className="inline-block px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                    >
                        Login to Comment
                    </Link>
                </div>
            )}
        </div>
    );
}
