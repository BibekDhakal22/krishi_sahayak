import { useState } from 'react';
import './GovSchemes.css';

const SCHEMES = [
  {
    title: 'Prime Minister Agriculture Modernization Project (PMAMP)',
    nepali: 'प्रधानमन्त्री कृषि आधुनिकीकरण परियोजना',
    ministry: 'Ministry of Agriculture and Livestock Development',
    benefit: 'Subsidies up to 50% on agricultural machinery, irrigation equipment, and modern farming tools.',
    eligibility: 'Nepali farmers with agricultural land. Priority to smallholder farmers.',
    howToApply: 'Visit your local Agriculture Knowledge Center (AKC) or District Agriculture Development Office (DADO).',
    category: 'subsidy', icon: '🌾'
  },
  {
    title: 'Agricultural Loan Subsidy Program',
    nepali: 'कृषि ऋण अनुदान कार्यक्रम',
    ministry: 'Nepal Rastra Bank / Agriculture Development Bank',
    benefit: 'Interest subsidy of 5-6% on agricultural loans up to Rs. 1.5 million for crop production.',
    eligibility: 'Farmers with land ownership documents. Collateral-free loans up to Rs. 500,000.',
    howToApply: 'Apply at Agriculture Development Bank (ADB/N) or any commercial bank with agricultural loan desk.',
    category: 'loan', icon: '🏦'
  },
  {
    title: 'Crop Insurance Program',
    nepali: 'बाली बीमा कार्यक्रम',
    ministry: 'Ministry of Agriculture / Beema Samiti',
    benefit: 'Government pays 75% of insurance premium. Coverage for major crops against natural disasters.',
    eligibility: 'All Nepali farmers growing insurable crops (Rice, Wheat, Maize, Potato, Vegetables).',
    howToApply: 'Contact Agriculture Insurance Company (AIC) or local cooperative. Premium: 1.5-5% of crop value.',
    category: 'insurance', icon: '🛡️'
  },
  {
    title: 'Organic Farming Promotion Program',
    nepali: 'जैविक खेती प्रवर्द्धन कार्यक्रम',
    ministry: 'Ministry of Agriculture and Livestock Development',
    benefit: 'Free organic farming training, subsidized bio-fertilizers, premium market access for organic produce.',
    eligibility: 'Farmers willing to convert to organic farming for minimum 3 years.',
    howToApply: 'Register at local Agriculture Service Center. Training provided by NARC and DOA.',
    category: 'training', icon: '🌿'
  },
  {
    title: 'Youth in Agriculture Program',
    nepali: 'युवा कृषि कार्यक्रम',
    ministry: 'Ministry of Agriculture and Livestock Development',
    benefit: 'Startup grants up to Rs. 500,000, free training, mentorship and market linkage support for youth.',
    eligibility: 'Youth aged 18-40 with interest in commercial farming. Priority to educated youth.',
    howToApply: 'Apply online at agriculture.gov.np or visit District Agriculture Development Office.',
    category: 'grant', icon: '👨‍🌾'
  },
  {
    title: 'Greenhouse Subsidy Program',
    nepali: 'प्लास्टिक घर अनुदान कार्यक्रम',
    ministry: 'Department of Agriculture (DoA)',
    benefit: 'Up to 50% subsidy on greenhouse/tunnel construction costs for vegetable farming.',
    eligibility: 'Farmers in hilly and mountain regions. Minimum land area 1 ropani.',
    howToApply: 'Submit application at local Agriculture Service Center with land ownership certificate.',
    category: 'subsidy', icon: '🏡'
  },
  {
    title: 'Irrigation Infrastructure Subsidy',
    nepali: 'सिँचाई पूर्वाधार अनुदान',
    ministry: 'Department of Water Resources and Irrigation',
    benefit: 'Subsidies on drip and sprinkler irrigation systems. Up to 75% cost covered by government.',
    eligibility: 'Farmer groups and cooperatives with minimum 5 members and collective land.',
    howToApply: 'Apply through Water User Association or District Irrigation Office.',
    category: 'subsidy', icon: '💧'
  },
  {
    title: 'Cold Storage Subsidy',
    nepali: 'शीत भण्डार अनुदान',
    ministry: 'Ministry of Agriculture and Livestock Development',
    benefit: 'Up to 40% subsidy for establishment of cold storage facilities for vegetables and fruits.',
    eligibility: 'Farmer cooperatives, agribusiness companies. Minimum capacity 10 metric tons.',
    howToApply: 'Submit project proposal to Agribusiness Promotion and Statistics Division (ABPSD).',
    category: 'grant', icon: '🏪'
  },
];

const CATEGORIES = ['all', 'subsidy', 'loan', 'insurance', 'training', 'grant'];
const catColors = { subsidy: '#e8f5e9', loan: '#e3f2fd', insurance: '#fff3e0', training: '#f3e5f5', grant: '#fce4ec' };
const catTextColors = { subsidy: '#2e7d32', loan: '#1565c0', insurance: '#e65100', training: '#6a1b9a', grant: '#c62828' };

export default function GovSchemes() {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  const filtered = SCHEMES.filter(s =>
    (category === 'all' || s.category === category) &&
    (s.title.toLowerCase().includes(search.toLowerCase()) || s.nepali.includes(search))
  );

  return (
    <div className="schemes-page">
      <div className="schemes-hero">
        <h2>🏛️ Government Agriculture Schemes</h2>
        <p>Nepal government subsidies, loans and programs for farmers</p>
        <p className="nepali">नेपाल सरकारका कृषि अनुदान, ऋण र कार्यक्रमहरू</p>
      </div>

      <div className="schemes-controls">
        <input className="schemes-search" placeholder="🔍 Search schemes..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <div className="cat-pills">
          {CATEGORIES.map(c => (
            <button key={c} className={`cat-pill ${category === c ? 'active' : ''}`}
              onClick={() => setCategory(c)}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="schemes-list">
        {filtered.map((scheme, i) => (
          <div key={i} className="scheme-card">
            <div className="scheme-header" onClick={() => setExpanded(expanded === i ? null : i)}>
              <div className="scheme-icon-wrap">{scheme.icon}</div>
              <div className="scheme-title-wrap">
                <h3>{scheme.title}</h3>
                <p className="scheme-nepali">{scheme.nepali}</p>
                <div className="scheme-meta">
                  <span className="cat-badge" style={{ background: catColors[scheme.category], color: catTextColors[scheme.category] }}>
                    {scheme.category}
                  </span>
                  <span className="ministry-text">🏛️ {scheme.ministry}</span>
                </div>
              </div>
              <span className="expand-btn">{expanded === i ? '▲' : '▼'}</span>
            </div>

            {expanded === i && (
              <div className="scheme-details">
                <div className="detail-item">
                  <h4>💰 Benefits</h4>
                  <p>{scheme.benefit}</p>
                </div>
                <div className="detail-item">
                  <h4>✅ Eligibility</h4>
                  <p>{scheme.eligibility}</p>
                </div>
                <div className="detail-item">
                  <h4>📋 How to Apply</h4>
                  <p>{scheme.howToApply}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="schemes-footer-note">
        ℹ️ Information is based on current Nepal government programs. Visit <strong>agriculture.gov.np</strong> or your local Agriculture Service Center for the most up-to-date details.
      </div>
    </div>
  );
}