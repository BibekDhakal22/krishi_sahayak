import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Forum.css';

const CATEGORIES = ['all', 'crop', 'pest', 'weather', 'market', 'general'];
const catColors = { crop: '#e8f5e9', pest: '#ffebee', weather: '#e3f2fd', market: '#fff8e1', general: '#f3e5f5' };
const catText = { crop: '#2e7d32', pest: '#c62828', weather: '#1565c0', market: '#f57f17', general: '#6a1b9a' };

export default function Forum() {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState('all');
  const [selected, setSelected] = useState(null);
  const [replies, setReplies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' });
  const [replyText, setReplyText] = useState('');
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchPosts();
  }, [category]);

  const fetchPosts = async () => {
    const res = await axios.get('http://localhost:5000/api/forum/posts',
      { params: category !== 'all' ? { category } : {} });
    setPosts(res.data);
  };

  const fetchReplies = async (postId) => {
    const res = await axios.get(`http://localhost:5000/api/forum/posts/${postId}/replies`);
    setReplies(res.data);
  };

  const openPost = (post) => {
    setSelected(post);
    fetchReplies(post.id);
  };

  const submitPost = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/forum/posts', newPost, { headers });
      toast.success('Post created!');
      setShowForm(false);
      setNewPost({ title: '', content: '', category: 'general' });
      fetchPosts();
    } catch { toast.error('Failed to post'); }
  };

  const submitReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      await axios.post(`http://localhost:5000/api/forum/posts/${selected.id}/replies`,
        { content: replyText }, { headers });
      setReplyText('');
      fetchReplies(selected.id);
      toast.success('Reply added!');
    } catch { toast.error('Failed to reply'); }
  };

  const likePost = async (postId) => {
    await axios.post(`http://localhost:5000/api/forum/posts/${postId}/like`, {}, { headers });
    fetchPosts();
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="forum-page">
      <div className="forum-hero">
        <h2>👨‍🌾 Farmer Community Forum</h2>
        <p>Ask questions, share knowledge and help fellow Nepali farmers</p>
        <p className="nepali">प्रश्न सोध्नुहोस्, ज्ञान साझा गर्नुहोस् र साथी किसानहरूलाई मद्दत गर्नुहोस्</p>
      </div>

      <div className="forum-layout">
        <div className="forum-sidebar">
          <button className="btn-new-post" onClick={() => setShowForm(!showForm)}>
            ✏️ Ask a Question
          </button>

          <div className="forum-cats">
            <h4>Categories</h4>
            {CATEGORIES.map(c => (
              <button key={c} className={`cat-btn ${category === c ? 'active' : ''}`}
                onClick={() => setCategory(c)}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
                <span className="cat-count">{posts.filter(p => c === 'all' || p.category === c).length}</span>
              </button>
            ))}
          </div>

          <div className="forum-tips">
            <h4>💡 Community Tips</h4>
            <p>Be respectful and helpful. Share your farming experience to help others grow better crops.</p>
          </div>
        </div>

        <div className="forum-main">
          {showForm && (
            <div className="new-post-form">
              <h3>✏️ Ask a Question</h3>
              <form onSubmit={submitPost}>
                <input placeholder="Question title..." value={newPost.title}
                  onChange={e => setNewPost({...newPost, title: e.target.value})} required />
                <textarea placeholder="Describe your question in detail..." rows={4}
                  value={newPost.content}
                  onChange={e => setNewPost({...newPost, content: e.target.value})} required />
                <div className="form-row">
                  <select value={newPost.category} onChange={e => setNewPost({...newPost, category: e.target.value})}>
                    {CATEGORIES.filter(c => c !== 'all').map(c => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                  <button type="submit" className="btn-post">Post Question</button>
                </div>
              </form>
            </div>
          )}

          {selected ? (
            <div className="post-detail">
              <button className="btn-back" onClick={() => setSelected(null)}>← Back to Forum</button>
              <div className="post-full">
                <div className="post-meta">
                  <span className="cat-badge-small" style={{ background: catColors[selected.category], color: catText[selected.category] }}>
                    {selected.category}
                  </span>
                  <span className="post-author">👤 {selected.author}</span>
                  <span className="post-date">📅 {formatDate(selected.created_at)}</span>
                </div>
                <h2>{selected.title}</h2>
                <p className="post-content-full">{selected.content}</p>
                <div className="post-actions">
                  <button className="btn-like" onClick={() => likePost(selected.id)}>
                    👍 {selected.likes} Likes
                  </button>
                </div>
              </div>

              <div className="replies-section">
                <h4>💬 {replies.length} Replies</h4>
                {replies.map((reply, i) => (
                  <div key={i} className="reply-card">
                    <div className="reply-header">
                      <span className="reply-author">👤 {reply.author}</span>
                      <span className="reply-date">{formatDate(reply.created_at)}</span>
                    </div>
                    <p>{reply.content}</p>
                  </div>
                ))}

                {token && (
                  <form onSubmit={submitReply} className="reply-form">
                    <textarea placeholder="Write your answer..." rows={3}
                      value={replyText} onChange={e => setReplyText(e.target.value)} required />
                    <button type="submit" className="btn-reply">Post Reply</button>
                  </form>
                )}
              </div>
            </div>
          ) : (
            <div className="posts-list">
              {posts.length === 0 ? (
                <div className="no-posts">
                  <span>💬</span>
                  <h3>No posts yet in this category</h3>
                  <p>Be the first to ask a question!</p>
                </div>
              ) : (
                posts.map((post, i) => (
                  <div key={i} className="post-card" onClick={() => openPost(post)}>
                    <div className="post-card-top">
                      <span className="cat-badge-small" style={{ background: catColors[post.category], color: catText[post.category] }}>
                        {post.category}
                      </span>
                      <span className="post-date">📅 {formatDate(post.created_at)}</span>
                    </div>
                    <h3>{post.title}</h3>
                    <p className="post-preview">{post.content.substring(0, 120)}...</p>
                    <div className="post-footer">
                      <span>👤 {post.author}</span>
                      <span>💬 {post.reply_count} replies</span>
                      <span>👍 {post.likes} likes</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}