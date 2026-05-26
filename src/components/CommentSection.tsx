"use client";

import { useEffect, useState } from "react";

interface Comment {
  id: number;
  author_name: string;
  content: { rendered: string };
  date: string;
  parent: number | null;
}

interface CommentPayload {
  post: number;
  content: string;
  parent: number;
  author_name?: string;
  author_email?: string;
}

interface User {
  name: string;
  roles: string[];
}

interface Props {
  postId: number;
}

const CommentsSection = ({ postId }: Props) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [jwt, setJwt] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [commentContent, setCommentContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [replyTo, setReplyTo] = useState<number>(0);

  const isLoggedIn = !!jwt && !!currentUser;

  useEffect(() => {
    const storedJwt = localStorage.getItem("jwt");
    if (storedJwt) {
      setJwt(storedJwt);
    } else {
      setLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    if (!jwt) return;

    setLoadingUser(true);
    fetch("https://api.oyonews.com.ng/wp-json/wp/v2/users/me", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch user info");
        }
        return res.json();
      })
      .then((data) => {
        setCurrentUser({
          name: data.name || data.username,
          roles: data.roles || [],
        });
      })
      .catch(() => {
        localStorage.removeItem("jwt");
        setJwt(null);
        setCurrentUser(null);
      })
      .finally(() => setLoadingUser(false));
  }, [jwt]);

  useEffect(() => {
    if (!postId) return;

    setLoadingComments(true);
    fetch(
      `https://api.oyonews.com.ng/wp-json/wp/v2/comments?post=${postId}&per_page=100`
    )
      .then((res) => res.json())
      .then(setComments)
      .catch((err) => setError(err.message))
      .finally(() => setLoadingComments(false));
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("You must be logged in to post a comment.");
      return;
    }

    if (!commentContent.trim()) return;

    setPosting(true);

    const payload: CommentPayload = {
      post: postId,
      content: commentContent,
      parent: replyTo,
    };

    try {
      const res = await fetch("https://api.oyonews.com.ng/wp-json/wp/v2/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      // Add new comment at the top
      setComments([data, ...comments]);
      setCommentContent("");
      setReplyTo(0);
    } catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("An unexpected error occurred.");
  }
}

  };

  const renderComments = (parentId = 0) =>
    comments
      .filter((comment) =>
        parentId === 0
          ? comment.parent === 0 || comment.parent === null
          : comment.parent === parentId
      )
      .map((comment) => (
        <li
          key={comment.id}
          className="border p-4 mb-4 rounded bg-white shadow-sm"
        >
          <p className="font-semibold text-gray-800">{comment.author_name}</p>
          <div
            dangerouslySetInnerHTML={{ __html: comment.content.rendered }}
            className="text-gray-700 mt-2"
          />
          <p className="text-sm text-gray-500 mt-2">
            {new Date(comment.date).toLocaleString()}
          </p>

          <button
            type="button"
            className="text-blue-600 underline mt-2"
            onClick={() => setReplyTo(comment.id)}
          >
            Reply
          </button>

          {/* Nested replies */}
          <ul className="ml-6 mt-4 border-l pl-4 border-gray-300">
            {renderComments(comment.id)}
          </ul>
        </li>
      ));

  if (loadingComments || loadingUser) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto my-10">
      <h3 className="text-2xl font-bold mb-6 text-red-600">Comments</h3>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        {replyTo > 0 && (
          <p className="text-sm text-gray-600">
            Replying to comment #{replyTo}{" "}
            <button
              onClick={() => setReplyTo(0)}
              className="text-blue-600 underline ml-2"
              type="button"
            >
              Cancel
            </button>
          </p>
        )}

        <textarea
          placeholder={
            isLoggedIn ? "Write your comment..." : "Please log in to comment."
          }
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          className="w-full p-3 border rounded"
          rows={4}
          disabled={!isLoggedIn || posting}
          required
        />

        <button
          type="submit"
          disabled={!isLoggedIn || posting}
          className={`px-4 py-2 rounded text-white ${
            isLoggedIn ? "bg-red-600" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {posting ? "Posting..." : replyTo > 0 ? "Reply" : "Post Comment"}
        </button>
      </form>

      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul>{renderComments()}</ul>
      )}
    </div>
  );
};

export default CommentsSection;
