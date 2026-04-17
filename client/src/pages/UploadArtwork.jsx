import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createArtwork } from '../services/api';
import { addArtwork } from '../redux/artworkSlice';
import toast from 'react-hot-toast';

const CATEGORIES = ['Painting', 'Sculpture', 'Photography', 'Digital Art', 'Sketch', 'Mixed Media', 'Other'];

const UploadArtwork = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: 'Painting', medium: '', dimensions: '', basePrice: '', tags: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) { toast.error('Please upload an image'); return; }
    if (!form.basePrice || Number(form.basePrice) <= 0) { toast.error('Please enter a valid price'); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      formData.append('image', image);
      const { data } = await createArtwork(formData);
      dispatch(addArtwork(data.data));
      toast.success('🎨 Artwork uploaded successfully!');
      navigate('/artist-dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="container" style={{ padding: '100px 24px 80px', maxWidth: '800px' }}>
      <div className="page-header">
        <h1>Upload Artwork</h1>
        <p>Share your creativity with collectors worldwide</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Image Upload */}
        <div className="form-group">
          <label className="form-label">Artwork Image *</label>
          <div className="img-upload-area" onClick={() => document.getElementById('imgInput').click()}>
            {preview ? (
              <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px' }} />
            ) : (
              <div className="img-upload-placeholder">
                <span style={{ fontSize: '3rem' }}>🖼️</span>
                <p>Click to upload artwork image</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>JPG, PNG, GIF, WEBP — Max 10MB</p>
              </div>
            )}
          </div>
          <input id="imgInput" type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label" htmlFor="title">Title *</label>
            <input id="title" name="title" className="form-input" placeholder="e.g. Sunset Over the Hills" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="category">Category *</label>
            <select id="category" name="category" className="form-input" value={form.category} onChange={handleChange} required>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="description">Description *</label>
          <textarea id="description" name="description" className="form-input" placeholder="Describe your artwork — inspiration, technique, story..." value={form.description} onChange={handleChange} required />
        </div>

        <div className="grid-3">
          <div className="form-group">
            <label className="form-label" htmlFor="medium">Medium</label>
            <input id="medium" name="medium" className="form-input" placeholder="e.g. Acrylic on canvas" value={form.medium} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="dimensions">Dimensions</label>
            <input id="dimensions" name="dimensions" className="form-input" placeholder="e.g. 24 x 36 inches" value={form.dimensions} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="basePrice">Base Price (₹) *</label>
            <input id="basePrice" name="basePrice" type="number" className="form-input" placeholder="e.g. 5000" value={form.basePrice} onChange={handleChange} min="1" required />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="tags">Tags (comma separated)</label>
          <input id="tags" name="tags" className="form-input" placeholder="landscape, nature, impressionist" value={form.tags} onChange={handleChange} />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ flex: 1 }}>
            {loading ? '⏳ Uploading...' : '🎨 Upload Artwork'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/artist-dashboard')}>Cancel</button>
        </div>
      </form>

      <style>{`
        .img-upload-area {
          border: 2px dashed var(--border);
          border-radius: var(--radius-lg);
          height: 250px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
          background: var(--bg-secondary);
          overflow: hidden;
        }
        .img-upload-area:hover { border-color: var(--gold); background: var(--gold-glow); }
        .img-upload-placeholder { text-align: center; color: var(--text-secondary); display: flex; flex-direction: column; gap: 8px; align-items: center; }
      `}</style>
    </div>
  );
};

export default UploadArtwork;
