import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowRight, RefreshCw, TrendingUp, Globe, Zap } from 'lucide-react';
import './App.css';

function App() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const currencies = [
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
    { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
    { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
    { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷' },
    { code: 'RUB', name: 'Russian Ruble', flag: '🇷🇺' },
    { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷' },
    { code: 'MXN', name: 'Mexican Peso', flag: '🇲🇽' },
    { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
    { code: 'NZD', name: 'New Zealand Dollar', flag: '🇳🇿' },
    { code: 'SEK', name: 'Swedish Krona', flag: '🇸🇪' },
    { code: 'NOK', name: 'Norwegian Krone', flag: '🇳🇴' },
    { code: 'DKK', name: 'Danish Krone', flag: '🇩🇰' },
    { code: 'PLN', name: 'Polish Złoty', flag: '🇵🇱' },
    { code: 'TRY', name: 'Turkish Lira', flag: '🇹🇷' },
    { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦' },
    { code: 'HKD', name: 'Hong Kong Dollar', flag: '🇭🇰' },
    { code: 'THB', name: 'Thai Baht', flag: '🇹🇭' },
    { code: 'MYR', name: 'Malaysian Ringgit', flag: '🇲🇾' },
    { code: 'IDR', name: 'Indonesian Rupiah', flag: '🇮🇩' },
    { code: 'PHP', name: 'Philippine Peso', flag: '🇵🇭' },
    { code: 'VND', name: 'Vietnamese Dong', flag: '🇻🇳' },
    { code: 'EGP', name: 'Egyptian Pound', flag: '🇪🇬' },
    { code: 'NGN', name: 'Nigerian Naira', flag: '🇳🇬' },
    { code: 'PKR', name: 'Pakistani Rupee', flag: '🇵🇰' },
    { code: 'BDT', name: 'Bangladeshi Taka', flag: '🇧🇩' },
    { code: 'LKR', name: 'Sri Lankan Rupee', flag: '🇱🇰' },
    { code: 'NPR', name: 'Nepalese Rupee', flag: '🇳🇵' },
    { code: 'MMK', name: 'Myanmar Kyat', flag: '🇲🇲' },
    { code: 'KHR', name: 'Cambodian Riel', flag: '🇰🇭' },
    { code: 'LAK', name: 'Lao Kip', flag: '🇱🇦' },
    { code: 'MNT', name: 'Mongolian Tugrik', flag: '🇲🇳' },
    { code: 'KZT', name: 'Kazakhstani Tenge', flag: '🇰🇿' },
    { code: 'UZS', name: 'Uzbekistani Som', flag: '🇺🇿' },
    { code: 'TJS', name: 'Tajikistani Somoni', flag: '🇹🇯' },
    { code: 'TMT', name: 'Turkmenistan Manat', flag: '🇹🇲' },
    { code: 'GEL', name: 'Georgian Lari', flag: '🇬🇪' },
    { code: 'AMD', name: 'Armenian Dram', flag: '🇦🇲' },
    { code: 'AZN', name: 'Azerbaijani Manat', flag: '🇦🇿' },
    { code: 'BYN', name: 'Belarusian Ruble', flag: '🇧🇾' },
    { code: 'MDL', name: 'Moldovan Leu', flag: '🇲🇩' },
    { code: 'UAH', name: 'Ukrainian Hryvnia', flag: '🇺🇦' },
    { code: 'RSD', name: 'Serbian Dinar', flag: '🇷🇸' },
    { code: 'HRK', name: 'Croatian Kuna', flag: '🇭🇷' },
    { code: 'BGN', name: 'Bulgarian Lev', flag: '🇧🇬' },
    { code: 'RON', name: 'Romanian Leu', flag: '🇷🇴' },
    { code: 'HUF', name: 'Hungarian Forint', flag: '🇭🇺' },
    { code: 'CZK', name: 'Czech Koruna', flag: '🇨🇿' },
    { code: 'SKK', name: 'Slovak Koruna', flag: '🇸🇰' },
    { code: 'SIT', name: 'Slovenian Tolar', flag: '🇸🇮' },
    { code: 'LVL', name: 'Latvian Lats', flag: '🇱🇻' },
    { code: 'LTL', name: 'Lithuanian Litas', flag: '🇱🇹' },
    { code: 'EEK', name: 'Estonian Kroon', flag: '🇪🇪' },
    { code: 'MTL', name: 'Maltese Lira', flag: '🇲🇹' },
    { code: 'CYP', name: 'Cypriot Pound', flag: '🇨🇾' },
    { code: 'SKK', name: 'Slovak Koruna', flag: '🇸🇰' },
    { code: 'SIT', name: 'Slovenian Tolar', flag: '🇸🇮' },
    { code: 'LVL', name: 'Latvian Lats', flag: '🇱🇻' },
    { code: 'LTL', name: 'Lithuanian Litas', flag: '🇱🇹' },
    { code: 'EEK', name: 'Estonian Kroon', flag: '🇪🇪' },
    { code: 'MTL', name: 'Maltese Lira', flag: '🇲🇹' },
    { code: 'CYP', name: 'Cypriot Pound', flag: '🇨🇾' }
  ];

  const getCurrencyData = (code) => {
    return currencies.find(currency => currency.code === code) || { code, name: code, flag: '🌐' };
  };

  const convertCurrency = async () => {
    if (fromCurrency === toCurrency) {
      setExchangeRate(1);
      setConvertedAmount(amount);
      setLastUpdated(new Date());
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Using a free currency API (you can replace with your preferred API)
      const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      
      if (response.data && response.data.rates) {
        const rate = response.data.rates[toCurrency];
        if (rate) {
          setExchangeRate(rate);
          setConvertedAmount(amount * rate);
          setLastUpdated(new Date());
        } else {
          throw new Error(`Exchange rate not available for ${toCurrency}`);
        }
      } else {
        throw new Error('Invalid response from exchange rate API');
      }
    } catch (err) {
      console.error('Error converting currency:', err);
      setError('Failed to fetch exchange rate. Please try again.');
      
      // Fallback: Use approximate rates for demo
      const fallbackRates = {
        'USD': { 'EUR': 0.85, 'GBP': 0.73, 'JPY': 110, 'INR': 75, 'CAD': 1.25, 'AUD': 1.35 },
        'EUR': { 'USD': 1.18, 'GBP': 0.86, 'JPY': 129, 'INR': 88, 'CAD': 1.47, 'AUD': 1.59 },
        'GBP': { 'USD': 1.37, 'EUR': 1.16, 'JPY': 150, 'INR': 102, 'CAD': 1.71, 'AUD': 1.85 },
        'INR': { 'USD': 0.013, 'EUR': 0.011, 'GBP': 0.0098, 'JPY': 1.47, 'CAD': 0.017, 'AUD': 0.018 }
      };
      
      if (fallbackRates[fromCurrency] && fallbackRates[fromCurrency][toCurrency]) {
        const fallbackRate = fallbackRates[fromCurrency][toCurrency];
        setExchangeRate(fallbackRate);
        setConvertedAmount(amount * fallbackRate);
        setLastUpdated(new Date());
        setError('Using approximate rates (API unavailable)');
      }
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  useEffect(() => {
    convertCurrency();
  }, [fromCurrency, toCurrency, amount]);

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <div className="logo">
              <Globe className="logo-icon" />
              <h1 className="text-gradient">Currency Converter Pro</h1>
            </div>
            <p className="subtitle">Real-time exchange rates with professional precision</p>
          </div>
        </header>

        {/* Main Converter */}
        <main className="main-content">
          <div className="converter-card glass-effect shadow-lg">
            <div className="converter-header">
              <h2>Currency Converter</h2>
              <button 
                className="refresh-btn"
                onClick={convertCurrency}
                disabled={loading}
              >
                <RefreshCw className={loading ? 'spinning' : ''} />
                Refresh
              </button>
            </div>

            {/* Amount Input */}
            <div className="input-group">
              <label>Amount</label>
              <div className="amount-input">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Currency Selection */}
            <div className="currency-selection">
              <div className="currency-group">
                <label>From</label>
                <div className="currency-select">
                  <span className="currency-flag">{getCurrencyData(fromCurrency).flag}</span>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                  >
                    {currencies.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button className="swap-btn" onClick={swapCurrencies}>
                <ArrowRight />
              </button>

              <div className="currency-group">
                <label>To</label>
                <div className="currency-select">
                  <span className="currency-flag">{getCurrencyData(toCurrency).flag}</span>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                  >
                    {currencies.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Result */}
            <div className="result-section">
              {loading ? (
                <div className="loading">
                  <RefreshCw className="spinning" />
                  <span>Converting...</span>
                </div>
              ) : error ? (
                <div className="error">
                  <span>{error}</span>
                </div>
              ) : (
                <div className="result">
                  <div className="result-main">
                    <span className="result-amount">
                      {amount.toLocaleString()} {fromCurrency}
                    </span>
                    <span className="result-equals">=</span>
                    <span className="result-converted">
                      {convertedAmount ? convertedAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }) : '0.00'} {toCurrency}
                    </span>
                  </div>
                  {exchangeRate && (
                    <div className="exchange-rate">
                      <TrendingUp className="rate-icon" />
                      <span>1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Last Updated */}
            {lastUpdated && (
              <div className="last-updated">
                <Zap className="update-icon" />
                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="features">
            <div className="feature-card glass-effect">
              <TrendingUp className="feature-icon" />
              <h3>Real-time Rates</h3>
              <p>Get the latest exchange rates updated in real-time</p>
            </div>
            <div className="feature-card glass-effect">
              <Globe className="feature-icon" />
              <h3>Global Currencies</h3>
              <p>Support for 50+ world currencies with flags</p>
            </div>
            <div className="feature-card glass-effect">
              <Zap className="feature-icon" />
              <h3>Instant Conversion</h3>
              <p>Lightning-fast currency conversion with precision</p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="footer">
          <p>&copy; 2024 Currency Converter Pro. Built with React & modern APIs.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
