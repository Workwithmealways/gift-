import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { LogOut, Gift } from 'lucide-react';

const giftImages = [
  '/images/gift1.jpg',
  '/images/gift2.jpg',
  '/images/gift3.jpg',
  '/images/gift4.jpg',
];

function App() {
  const [formData, setFormData] = useState({
    name: '',
    interests: '',
    personality: '',
    occasion: '',
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/suggestions', formData);
      setSuggestions(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Show/hide tooltip in 30s intervals
  React.useEffect(() => {
    const interval = setInterval(() => {
      setShowTooltip((prev) => !prev);
    }, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Auto scroll images
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % giftImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`app-container ${showSidebar ? 'shift' : ''}`}>
      <header className="header">
      <button className="toggle-btn" onClick={() => setShowSidebar(!showSidebar)}>☰</button>
        
        <div className="header-center">
        <h1 className="header-title">Gift Recommendation Platform</h1>
        </div>
        <LogOut className="logout-icon" title="Logout" />
      </header>

      {/* Sidebar */}
      <div className={`sidebar ${showSidebar ? 'open' : ''}`}>
        <ul>
          <li>Home</li>
          <li>Settings</li>
          <li>Profile</li>
        </ul>
      </div>

      {/* Image Slider */}
      <div className="slider-section">
        <img src={giftImages[currentImage]} alt="gift" className="slider-image" />
        <p className="quote">“The perfect gift speaks louder than words.”</p>
      </div>

      {/* Suggestion Toggle Icon (Floating with Tooltip) */}
      <div className="suggestion-toggle" onClick={() => setShowForm(!showForm)}>
        {showTooltip && <div className="tooltip">👉 For more suggestions, click here!</div>}
        <Gift size={36} />
      </div>

      {/* Main Content */}
      <main className="main-content">
        {showForm && (
          <div className="content">
            <form onSubmit={handleSubmit}>
              {['name', 'interests', 'personality', 'occasion'].map((field) => (
                <div className="mb-4" key={field}>
                  <label className="block text-gray-700 mb-2 capitalize">{field}</label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
              <button type="submit">Get Suggestions</button>
            </form>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="suggestions-wrapper">
            <h2 className="text-2xl font-semibold mb-4 text-center">Suggested Gifts</h2>
            <ul className="suggestions-list">
              {suggestions.map((gift, index) => (
                <li key={index}>
                  <h3>{gift.name}</h3>
                  {gift.imageUrl && (
                    <img src={gift.imageUrl} alt={gift.name} />
                  )}
                  <p>Available at: <strong>{gift.site}</strong></p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>&copy; 2025 Gift Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
