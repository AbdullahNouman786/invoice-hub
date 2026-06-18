import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiLogOut, FiMoon, FiSun, FiDownload, FiPlus } from 'react-icons/fi';
import './App.css';

// API BASE URL
const API_URL = 'http://localhost:5000/api';
const pageTransition = { type: 'spring', stiffness: 90, damping: 18 };
const cardTransition = { type: 'spring', stiffness: 120, damping: 20 };

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('night');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setCurrentPage('dashboard');
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'day' || savedTheme === 'night') {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} setUser={setCurrentUser} />;
      case 'signup':
        return <SignupPage onNavigate={setCurrentPage} setUser={setCurrentUser} />;
      case 'pricing':
        return <PricingPage onNavigate={setCurrentPage} user={currentUser} />;
      case 'dashboard':
        return currentUser ? <Dashboard user={currentUser} onNavigate={setCurrentPage} /> : <HomePage onNavigate={setCurrentPage} />;
      case 'invoice':
        return <InvoiceGenerator user={currentUser} onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className={`app ${theme}`}>
      <Navbar 
        user={currentUser} 
        onNavigate={setCurrentPage} 
        onLogout={handleLogout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'night' ? 'day' : 'night')}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={pageTransition}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
      <Footer />
    </div>
  );
};

// NAVBAR COMPONENT
const Navbar = ({ user, onNavigate, onLogout, mobileMenuOpen, setMobileMenuOpen, theme, onToggleTheme }) => {
  return (
    <motion.nav className="navbar" initial={{ y: -100 }} animate={{ y: 0 }} transition={pageTransition}>
      <div className="navbar-container">
        <motion.div 
          className="logo"
          whileHover={{ scale: 1.04 }}
          onClick={() => onNavigate('home')}
        >
          📄 InvoiceHub
        </motion.div>

        <div className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          {!user ? (
            <>
              <motion.button className="nav-link" onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }} whileHover={{ scale: 1.05 }}>Home</motion.button>
              <motion.button className="nav-link" onClick={() => { onNavigate('pricing'); setMobileMenuOpen(false); }} whileHover={{ scale: 1.05 }}>Pricing</motion.button>
              <motion.button className="nav-link" onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }} whileHover={{ scale: 1.05 }}>Login</motion.button>
              <motion.button className="nav-link signup" onClick={() => { onNavigate('signup'); setMobileMenuOpen(false); }} whileHover={{ scale: 1.05 }}>Sign Up</motion.button>
            </>
          ) : (
            <>
              <motion.button className="nav-link" onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }} whileHover={{ scale: 1.05 }}>Dashboard</motion.button>
              <motion.button className="nav-link" onClick={() => { onNavigate('invoice'); setMobileMenuOpen(false); }} whileHover={{ scale: 1.05 }}>Create Invoice</motion.button>
              <motion.button className="nav-link user-info" whileHover={{ scale: 1.05 }}>
                👤 {user.email?.split('@')[0]}
              </motion.button>
              <motion.button className="nav-link logout" onClick={onLogout} whileHover={{ scale: 1.05 }}>
                <FiLogOut /> Logout
              </motion.button>
            </>
          )}
        </div>

        <motion.button
          className="theme-toggle"
          onClick={onToggleTheme}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          aria-label="Toggle day and night theme"
        >
          {theme === 'night' ? <><FiSun /> Day</> : <><FiMoon /> Night</>}
        </motion.button>

        <motion.button 
          className="menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          whileHover={{ scale: 1.06 }}
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </motion.button>
      </div>
    </motion.nav>
  );
};

// HOME PAGE
const HomePage = ({ onNavigate }) => {
  return (
    <motion.div className="home-page">
      <section className="hero">
        <motion.div
          className="hero-blob hero-blob-a"
          aria-hidden="true"
          animate={{ y: [0, -18, 0], x: [0, 8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="hero-blob hero-blob-b"
          aria-hidden="true"
          animate={{ y: [0, 14, 0], x: [0, -10, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...pageTransition, delay: 0.05 }}
        >
          <h1>Professional Invoice Generator</h1>
          <p>Create beautiful, professional invoices in seconds. Easy, fast, and powerful.</p>
          <motion.button 
            className="cta-button"
            onClick={() => onNavigate('signup')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Free
          </motion.button>
        </motion.div>

        <motion.div 
          className="hero-image"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="hero-preview-card">📊</div>
        </motion.div>
      </section>

      <section className="features">
        <h2>Why Choose InvoiceHub?</h2>
        <div className="features-grid">
          {[
            { icon: '⚡', title: 'Lightning Fast', desc: 'Create invoices in seconds' },
            { icon: '🎨', title: 'Beautiful Design', desc: 'Professional templates included' },
            { icon: '☁️', title: 'Cloud Based', desc: 'Access anywhere, anytime' },
            { icon: '📱', title: 'Responsive', desc: 'Works on all devices' }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ ...cardTransition, delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

// LOGIN PAGE
const LoginPage = ({ onNavigate, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        setUser(data.user);
        onNavigate('dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Using demo mode...');
      const demoUser = { id: 1, email, name: email.split('@')[0], plan: 'basic' };
      localStorage.setItem('user', JSON.stringify(demoUser));
      setUser(demoUser);
      onNavigate('dashboard');
    }
    setLoading(false);
  };

  return (
    <motion.div className="auth-page">
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={cardTransition}
      >
        <h2>Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <motion.input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              whileFocus={{ scale: 1.01 }}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <motion.input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              whileFocus={{ scale: 1.01 }}
              required
            />
          </div>
          {error && <div className="error-msg">{error}</div>}
          <motion.button 
            type="submit"
            className="submit-btn"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>
        <p>Don't have an account? <motion.a onClick={() => onNavigate('signup')} whileHover={{ color: '#6366f1' }}>Sign up</motion.a></p>
      </motion.div>
    </motion.div>
  );
};
const SignupPage = ({ onNavigate, setUser }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        setUser(data.user);
        onNavigate('pricing');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Using demo mode...');
      const demoUser = { id: Date.now(), name: formData.name, email: formData.email, plan: 'basic' };
      localStorage.setItem('user', JSON.stringify(demoUser));
      setUser(demoUser);
      onNavigate('pricing');
    }
    setLoading(false);
  };

  return (
    <motion.div className="auth-page">
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Create Account</h2>
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>Full Name</label>
            <motion.input 
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="John Doe"
              whileFocus={{ scale: 1.02 }}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <motion.input 
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="your@email.com"
              whileFocus={{ scale: 1.02 }}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <motion.input 
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
              whileFocus={{ scale: 1.02 }}
              required
            />
          </div>
          {error && <div className="error-msg">{error}</div>}
          <motion.button 
            type="submit"
            className="submit-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </motion.button>
        </form>
        <p>Already have an account? <motion.a onClick={() => onNavigate('login')} whileHover={{ color: '#6366f1' }}>Login</motion.a></p>
      </motion.div>
    </motion.div>
  );
};

// PRICING PAGE
const PricingPage = ({ onNavigate, user }) => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for getting started',
      features: ['Up to 10 invoices/month', 'Basic templates', 'Email support'],
      free: true
    },
    {
      name: 'Pro',
      price: '$10',
      description: 'For growing businesses',
      features: ['Unlimited invoices', 'Advanced templates', 'Priority support', 'Invoice analytics'],
      popular: true
    },
    {
      name: 'Ultimate',
      price: '$20',
      description: 'For enterprises',
      features: ['Everything in Pro', 'Custom branding', '24/7 phone support', 'API access']
    }
  ];

  return (
    <motion.div className="pricing-page">
      <motion.div
        className="pricing-glow pricing-glow-left"
        aria-hidden="true"
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pricing-glow pricing-glow-right"
        aria-hidden="true"
        animate={{ opacity: [0.18, 0.42, 0.18], scale: [1, 1.12, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Simple, Transparent Pricing
      </motion.h1>
      <div className="pricing-grid">
        {plans.map((plan, idx) => (
          <motion.div 
            key={idx}
            className={`pricing-card ${plan.popular ? 'popular' : ''} ${plan.free ? 'free' : ''}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ ...cardTransition, delay: idx * 0.08 }}
            whileHover={{ y: -6, scale: 1.01 }}
          >
            {plan.free && <div className="popular-badge free-badge">Free Forever</div>}
            {plan.popular && <div className="popular-badge">Most Popular</div>}
            <h3>{plan.name}</h3>
            <div className="price">{plan.price}<span>/month</span></div>
            <p className="description">{plan.description}</p>
            <ul className="features-list">
              {plan.features.map((feature, i) => (
                <li key={i}>✓ {feature}</li>
              ))}
            </ul>
            <motion.button 
              className={`choose-btn ${plan.popular ? 'popular' : ''} ${plan.free ? 'free' : ''}`}
              onClick={() => user ? onNavigate('invoice') : onNavigate('signup')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {plan.free ? 'Start Free' : 'Choose Plan'}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// DASHBOARD
const Dashboard = ({ user, onNavigate }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/invoices`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setInvoices(data.invoices || []);
    } catch (err) {
      console.log('Demo mode - no backend');
    }
    setLoading(false);
  };

  return (
    <motion.div className="dashboard">
      <motion.div 
        className="dashboard-header"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={pageTransition}
      >
        <h1>Welcome, {user.name || user.email}!</h1>
        <motion.button 
          className="create-invoice-btn"
          onClick={() => onNavigate('invoice')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiPlus /> Create New Invoice
        </motion.button>
      </motion.div>

      <div className="dashboard-stats">
        {[
          { label: 'Total Invoices', value: invoices.length, icon: '📄' },
          { label: 'Plan', value: user.plan || 'Basic', icon: '📊' },
          { label: 'This Month', value: invoices.filter(i => {
            const date = new Date(i.createdAt);
            const now = new Date();
            return date.getMonth() === now.getMonth();
          }).length, icon: '📅' }
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...cardTransition, delay: idx * 0.08 }}
            whileHover={{ y: -3 }}
          >
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <p>{stat.label}</p>
              <h3>{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="invoices-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2>Recent Invoices</h2>
        {loading ? (
          <p>Loading...</p>
        ) : invoices.length > 0 ? (
          <div className="invoices-list">
            {invoices.map((invoice, idx) => (
              <motion.div 
                key={idx}
                className="invoice-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...cardTransition, delay: idx * 0.04 }}
                whileHover={{ x: 3 }}
              >
                <div className="invoice-info">
                  <p className="invoice-id">{invoice.id}</p>
                  <p className="invoice-date">{new Date(invoice.createdAt).toLocaleDateString()}</p>
                </div>
                <p className="invoice-amount">${invoice.amount}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="no-invoices">No invoices yet. Create your first one!</p>
        )}
      </motion.div>
    </motion.div>
  );
};

// INVOICE GENERATOR
const InvoiceGenerator = ({ user, onNavigate }) => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: 'INV-001',
    clientName: '',
    clientEmail: '',
    items: [{ description: '', quantity: 1, rate: 0 }],
    dueDate: '',
    companyName: 'Your Company',
    companyEmail: user?.email || ''
  });

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: '', quantity: 1, rate: 0 }]
    });
  };

  const updateItem = (idx, field, value) => {
    const newItems = [...invoiceData.items];
    newItems[idx][field] = field === 'quantity' || field === 'rate' ? parseFloat(value) || 0 : value;
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const removeItem = (idx) => {
    setInvoiceData({
      ...invoiceData,
      items: invoiceData.items.filter((_, i) => i !== idx)
    });
  };

  const calculateTotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const downloadPDF = () => {
    const element = document.querySelector('.invoice-preview-section');
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(element.innerHTML);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <motion.div className="invoice-generator">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Create Invoice
      </motion.h1>

      <div className="invoice-container">
        <motion.div 
          className="invoice-form"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={cardTransition}
        >
          <h2>Invoice Details</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Invoice Number</label>
              <input 
                type="text"
                value={invoiceData.invoiceNumber}
                onChange={(e) => setInvoiceData({...invoiceData, invoiceNumber: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input 
                type="date"
                value={invoiceData.dueDate}
                onChange={(e) => setInvoiceData({...invoiceData, dueDate: e.target.value})}
              />
            </div>
          </div>

          <h3>Your Company</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Company Name</label>
              <input 
                type="text"
                value={invoiceData.companyName}
                onChange={(e) => setInvoiceData({...invoiceData, companyName: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email"
                value={invoiceData.companyEmail}
                onChange={(e) => setInvoiceData({...invoiceData, companyEmail: e.target.value})}
              />
            </div>
          </div>

          <h3>Client Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Client Name</label>
              <input 
                type="text"
                value={invoiceData.clientName}
                onChange={(e) => setInvoiceData({...invoiceData, clientName: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Client Email</label>
              <input 
                type="email"
                value={invoiceData.clientEmail}
                onChange={(e) => setInvoiceData({...invoiceData, clientEmail: e.target.value})}
              />
            </div>
          </div>

          <h3>Items</h3>
          {invoiceData.items.map((item, idx) => (
            <motion.div 
              key={idx}
              className="item-row"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
                transition={cardTransition}
            >
              <input 
                type="text"
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateItem(idx, 'description', e.target.value)}
              />
              <input 
                type="number"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
              />
              <input 
                type="number"
                placeholder="Rate"
                value={item.rate}
                onChange={(e) => updateItem(idx, 'rate', e.target.value)}
              />
              <span className="item-total">${(item.quantity * item.rate).toFixed(2)}</span>
              {invoiceData.items.length > 1 && (
                <button onClick={() => removeItem(idx)} className="remove-btn">✕</button>
              )}
            </motion.div>
          ))}

          <motion.button 
            className="add-item-btn"
            onClick={addItem}
            whileHover={{ scale: 1.05 }}
          >
            <FiPlus /> Add Item
          </motion.button>

          <motion.button 
            className="download-btn"
            onClick={downloadPDF}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiDownload /> Download PDF
          </motion.button>
        </motion.div>

        <motion.div 
          className="invoice-preview-section"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={cardTransition}
        >
          <div className="invoice-preview-sheet">
            <div className="invoice-header">
              <h1>{invoiceData.companyName}</h1>
              <p>INVOICE</p>
            </div>

            <div className="invoice-details">
              <div>
                <strong>Invoice #:</strong> {invoiceData.invoiceNumber}<br/>
                <strong>Due Date:</strong> {invoiceData.dueDate || 'Not set'}
              </div>
              <div>
                <strong>From:</strong><br/>
                {invoiceData.companyName}<br/>
                {invoiceData.companyEmail}
              </div>
              <div>
                <strong>Bill To:</strong><br/>
                {invoiceData.clientName || 'Client Name'}<br/>
                {invoiceData.clientEmail || 'client@email.com'}
              </div>
            </div>

            <table className="invoice-items">
              <colgroup>
                <col className="invoice-col-description" />
                <col className="invoice-col-qty" />
                <col className="invoice-col-rate" />
                <col className="invoice-col-amount" />
              </colgroup>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.description || '-'}</td>
                    <td>{item.quantity}</td>
                    <td>${item.rate.toFixed(2)}</td>
                    <td>${(item.quantity * item.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="invoice-total">
              <strong>Total: ${calculateTotal().toFixed(2)}</strong>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// FOOTER
const Footer = () => {
  return (
    <motion.footer className="footer" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
      <p>&copy; 2024 InvoiceHub. All rights reserved.</p>
      <p>Made by Hafiz Muhmmad Abdullah</p>
    </motion.footer>
  );
};

export default App;
