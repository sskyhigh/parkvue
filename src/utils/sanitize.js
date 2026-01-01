/**
 * Input Sanitization Utilities for ParkVue
 * Provides functions to sanitize and validate user inputs
 */

/**
 * Sanitize general text input by removing HTML tags and dangerous characters
 * @param {string} input - The input string to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeText = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script tags and content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove control characters except newlines and tabs
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Limit length to prevent abuse
    .slice(0, 5000);
};

/**
 * Sanitize email address
 * @param {string} email - Email to sanitize
 * @returns {string} Sanitized email
 */
export const sanitizeEmail = (email) => {
  if (typeof email !== 'string') return '';
  
  return email
    .trim()
    .toLowerCase()
    // Remove any HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove dangerous characters but keep valid email chars
    .replace(/[^\w@.\-+]/g, '')
    .slice(0, 254); // RFC 5321 max length
};

/**
 * Validate and sanitize email format
 * @param {string} email - Email to validate
 * @returns {{isValid: boolean, sanitized: string}} Validation result and sanitized email
 */
export const validateEmail = (email) => {
  const sanitized = sanitizeEmail(email);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  return {
    isValid: emailRegex.test(sanitized),
    sanitized
  };
};

/**
 * Sanitize phone number
 * @param {string} phone - Phone number to sanitize
 * @returns {string} Sanitized phone number
 */
export const sanitizePhone = (phone) => {
  if (typeof phone !== 'string') return '';
  
  return phone
    .trim()
    // Keep only digits, spaces, hyphens, parentheses, and plus sign
    .replace(/[^\d\s\-()+ ]/g, '')
    .slice(0, 20);
};

/**
 * Sanitize numeric input
 * @param {string|number} input - Numeric input to sanitize
 * @returns {string} Sanitized numeric string
 */
export const sanitizeNumeric = (input) => {
  if (typeof input === 'number') return input.toString();
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    // Keep only digits and decimal point
    .replace(/[^\d.]/g, '')
    // Ensure only one decimal point
    .replace(/\.(?=.*\.)/g, '')
    .slice(0, 15);
};

/**
 * Sanitize price input
 * @param {string|number} price - Price to sanitize
 * @returns {number} Sanitized price as number
 */
export const sanitizePrice = (price) => {
  const sanitized = sanitizeNumeric(price);
  const parsed = parseFloat(sanitized);
  
  if (isNaN(parsed) || parsed < 0) return 0;
  // Round to 2 decimal places
  return Math.round(parsed * 100) / 100;
};

/**
 * Sanitize URL input
 * @param {string} url - URL to sanitize
 * @returns {string} Sanitized URL
 */
export const sanitizeUrl = (url) => {
  if (typeof url !== 'string') return '';
  
  const sanitized = url.trim();
  
  // Only allow http, https, and relative URLs
  if (!sanitized.match(/^(https?:\/\/|\/)/i)) {
    return '';
  }
  
  // Remove potentially dangerous protocols
  if (sanitized.match(/^(javascript|data|vbscript|file):/i)) {
    return '';
  }
  
  return sanitized.slice(0, 2048); // Max URL length
};

/**
 * Sanitize address input
 * @param {string} address - Address to sanitize
 * @returns {string} Sanitized address
 */
export const sanitizeAddress = (address) => {
  if (typeof address !== 'string') return '';
  
  return address
    .trim()
    .replace(/<[^>]*>/g, '')
    // Keep alphanumeric, spaces, commas, periods, hyphens, and common address chars
    .replace(/[^a-zA-Z0-9\s,.#'/'-]/g, '')
    .slice(0, 500);
};

/**
 * Sanitize ZIP code
 * @param {string} zipCode - ZIP code to sanitize
 * @returns {string} Sanitized ZIP code
 */
export const sanitizeZipCode = (zipCode) => {
  if (typeof zipCode !== 'string') return '';
  
  return zipCode
    .trim()
    .replace(/[^\d-]/g, '')
    .slice(0, 10); // US ZIP+4 format
};

/**
 * Sanitize name input (for first name, last name, etc.)
 * @param {string} name - Name to sanitize
 * @returns {string} Sanitized name
 */
export const sanitizeName = (name) => {
  if (typeof name !== 'string') return '';
  
  return name
    .trim()
    .replace(/<[^>]*>/g, '')
    // Keep letters, spaces, hyphens, apostrophes
    .replace(/[^a-zA-Z\s'-]/g, '')
    .slice(0, 100);
};

/**
 * Sanitize username
 * @param {string} username - Username to sanitize
 * @returns {string} Sanitized username
 */
export const sanitizeUsername = (username) => {
  if (typeof username !== 'string') return '';
  
  return username
    .trim()
    .toLowerCase()
    // Keep alphanumeric, underscores, and hyphens
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 30);
};

/**
 * Sanitize password (minimal sanitization to preserve special chars)
 * @param {string} password - Password to sanitize
 * @returns {string} Sanitized password
 */
export const sanitizePassword = (password) => {
  if (typeof password !== 'string') return '';
  
  // Only remove null bytes and control characters
  return password
    .replace(/\0/g, '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .slice(0, 128);
};

/**
 * Sanitize textarea/description input
 * @param {string} text - Text to sanitize
 * @param {number} maxLength - Maximum length (default: 5000)
 * @returns {string} Sanitized text
 */
export const sanitizeTextarea = (text, maxLength = 5000) => {
  if (typeof text !== 'string') return '';
  
  return text
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/\0/g, '')
    .slice(0, maxLength);
};

/**
 * Sanitize search query
 * @param {string} query - Search query to sanitize
 * @returns {string} Sanitized query
 */
export const sanitizeSearchQuery = (query) => {
  if (typeof query !== 'string') return '';
  
  return query
    .trim()
    .replace(/<[^>]*>/g, '')
    // Remove SQL injection attempts
    .replace(/['";]/g, '')
    .slice(0, 200);
};

/**
 * Sanitize credit card number (for display purposes only)
 * @param {string} cardNumber - Card number to sanitize
 * @returns {string} Sanitized card number
 */
export const sanitizeCardNumber = (cardNumber) => {
  if (typeof cardNumber !== 'string') return '';
  
  return cardNumber
    .trim()
    .replace(/[^\d]/g, '')
    .slice(0, 19); // Max card number length with spaces
};

/**
 * Sanitize CVV
 * @param {string} cvv - CVV to sanitize
 * @returns {string} Sanitized CVV
 */
export const sanitizeCVV = (cvv) => {
  if (typeof cvv !== 'string') return '';
  
  return cvv
    .trim()
    .replace(/[^\d]/g, '')
    .slice(0, 4);
};

/**
 * Prevent XSS attacks by encoding HTML entities
 * @param {string} input - Input to encode
 * @returns {string} Encoded string
 */
export const encodeHTML = (input) => {
  if (typeof input !== 'string') return '';
  
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

/**
 * Validate and sanitize date input
 * @param {string} date - Date string to validate
 * @returns {{isValid: boolean, sanitized: string}} Validation result
 */
export const validateDate = (date) => {
  if (typeof date !== 'string') {
    return { isValid: false, sanitized: '' };
  }
  
  const sanitized = date.trim();
  const dateObj = new Date(sanitized);
  
  return {
    isValid: !isNaN(dateObj.getTime()),
    sanitized
  };
};

/**
 * Sanitize object with multiple fields
 * @param {Object} obj - Object to sanitize
 * @param {Object} schema - Schema defining sanitization for each field
 * @returns {Object} Sanitized object
 */
export const sanitizeObject = (obj, schema) => {
  const sanitized = {};
  
  for (const [key, sanitizer] of Object.entries(schema)) {
    if (obj.hasOwnProperty(key)) {
      sanitized[key] = sanitizer(obj[key]);
    }
  }
  
  return sanitized;
};

const sanitize = {
  sanitizeText,
  sanitizeEmail,
  validateEmail,
  sanitizePhone,
  sanitizeNumeric,
  sanitizePrice,
  sanitizeUrl,
  sanitizeAddress,
  sanitizeZipCode,
  sanitizeName,
  sanitizeUsername,
  sanitizePassword,
  sanitizeTextarea,
  sanitizeSearchQuery,
  sanitizeCardNumber,
  sanitizeCVV,
  encodeHTML,
  validateDate,
  sanitizeObject
};

export default sanitize;
