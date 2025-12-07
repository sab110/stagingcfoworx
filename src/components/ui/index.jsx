/**
 * RoyaltiesAgent - Unified UI Component Library
 * Consistent design system for all components
 */

import React from 'react';

// ============================================================================
// DESIGN TOKENS
// ============================================================================
export const tokens = {
  colors: {
    primary: '#059669',
    primaryHover: '#047857',
    primaryLight: '#D1FAE5',
    primaryDark: '#064E3B',
    accent: '#0EA5E9',
    accentHover: '#0284C7',
    slate50: '#F8FAFC',
    slate100: '#F1F5F9',
    slate200: '#E2E8F0',
    slate300: '#CBD5E1',
    slate400: '#94A3B8',
    slate500: '#64748B',
    slate600: '#475569',
    slate700: '#334155',
    slate800: '#1E293B',
    slate900: '#0F172A',
    success: '#10B981',
    successLight: '#ECFDF5',
    warning: '#F59E0B',
    warningLight: '#FFFBEB',
    error: '#EF4444',
    errorLight: '#FEF2F2',
    info: '#3B82F6',
    infoLight: '#EFF6FF',
  },
  fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    card: '0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 4px rgba(0, 0, 0, 0.05), 0 12px 24px rgba(0, 0, 0, 0.05)',
  },
};

// ============================================================================
// SPINNER COMPONENT
// ============================================================================
export function Spinner({ 
  size = 'md', 
  color = 'primary', 
  className = '',
  style = {} 
}) {
  const sizes = {
    xs: { width: 14, height: 14, border: 2 },
    sm: { width: 20, height: 20, border: 2 },
    md: { width: 32, height: 32, border: 3 },
    lg: { width: 48, height: 48, border: 4 },
    xl: { width: 64, height: 64, border: 4 },
  };

  const colors = {
    primary: { track: tokens.colors.slate200, spin: tokens.colors.primary },
    white: { track: 'rgba(255, 255, 255, 0.3)', spin: '#ffffff' },
    slate: { track: tokens.colors.slate200, spin: tokens.colors.slate500 },
    accent: { track: tokens.colors.slate200, spin: tokens.colors.accent },
  };

  const sizeConfig = sizes[size] || sizes.md;
  const colorConfig = colors[color] || colors.primary;

  return (
    <>
      <div 
        className={`ui-spinner ${className}`}
        style={{
          width: sizeConfig.width,
          height: sizeConfig.height,
          border: `${sizeConfig.border}px solid ${colorConfig.track}`,
          borderTopColor: colorConfig.spin,
          borderRadius: '50%',
          animation: 'ui-spin 1s linear infinite',
          ...style,
        }}
        role="status"
        aria-label="Loading"
      />
      <style>{spinnerKeyframes}</style>
    </>
  );
}

// ============================================================================
// LOADING SCREEN COMPONENT
// ============================================================================
export function LoadingScreen({ 
  message = 'Loading...', 
  submessage = '',
  showLogo = true,
  fullScreen = true,
}) {
  return (
    <div style={{
      ...(fullScreen ? loadingScreenStyles.fullScreen : loadingScreenStyles.container),
      fontFamily: tokens.fontFamily,
    }}>
      <div style={loadingScreenStyles.content}>
        {showLogo && (
          <div style={loadingScreenStyles.logoContainer}>
            <div style={loadingScreenStyles.logo}>
              <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
                <path 
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        )}
        <Spinner size="lg" color="primary" />
        <p style={loadingScreenStyles.message}>{message}</p>
        {submessage && (
          <p style={loadingScreenStyles.submessage}>{submessage}</p>
        )}
      </div>
      <style>{spinnerKeyframes}</style>
    </div>
  );
}

const loadingScreenStyles = {
  fullScreen: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.slate50,
    padding: '24px',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 24px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  logoContainer: {
    marginBottom: '32px',
  },
  logo: {
    width: '64px',
    height: '64px',
    background: `linear-gradient(135deg, ${tokens.colors.primary} 0%, ${tokens.colors.primaryHover} 100%)`,
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
  },
  message: {
    marginTop: '24px',
    fontSize: '18px',
    fontWeight: '600',
    color: tokens.colors.slate800,
    margin: '24px 0 0 0',
  },
  submessage: {
    marginTop: '8px',
    fontSize: '14px',
    color: tokens.colors.slate500,
    margin: '8px 0 0 0',
  },
};

// ============================================================================
// ERROR SCREEN COMPONENT
// ============================================================================
export function ErrorScreen({ 
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry = null,
  onBack = null,
  fullScreen = true,
}) {
  return (
    <div style={{
      ...(fullScreen ? errorScreenStyles.fullScreen : errorScreenStyles.container),
      fontFamily: tokens.fontFamily,
    }}>
      <div style={errorScreenStyles.content}>
        <div style={errorScreenStyles.iconContainer}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={tokens.colors.error} strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h2 style={errorScreenStyles.title}>{title}</h2>
        <p style={errorScreenStyles.message}>{message}</p>
        <div style={errorScreenStyles.actions}>
          {onRetry && (
            <button onClick={onRetry} style={errorScreenStyles.primaryButton}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
              </svg>
              Try Again
            </button>
          )}
          {onBack && (
            <button onClick={onBack} style={errorScreenStyles.secondaryButton}>
              Go Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const errorScreenStyles = {
  fullScreen: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.slate50,
    padding: '24px',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 24px',
  },
  content: {
    textAlign: 'center',
    maxWidth: '400px',
  },
  iconContainer: {
    width: '64px',
    height: '64px',
    backgroundColor: tokens.colors.errorLight,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: tokens.colors.slate900,
    marginBottom: '12px',
    marginTop: 0,
  },
  message: {
    fontSize: '15px',
    color: tokens.colors.slate500,
    lineHeight: '1.6',
    marginBottom: '32px',
    margin: '0 0 32px 0',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  },
  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: `linear-gradient(135deg, ${tokens.colors.primary} 0%, ${tokens.colors.primaryHover} 100%)`,
    color: '#fff',
    border: 'none',
    borderRadius: tokens.borderRadius.lg,
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
  },
  secondaryButton: {
    padding: '12px 24px',
    background: '#fff',
    color: tokens.colors.slate700,
    border: `1px solid ${tokens.colors.slate200}`,
    borderRadius: tokens.borderRadius.lg,
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};

// ============================================================================
// ALERT/MESSAGE COMPONENT
// ============================================================================
export function Alert({ 
  type = 'info', 
  children, 
  onClose = null,
  style = {},
}) {
  const typeStyles = {
    success: {
      background: tokens.colors.successLight,
      border: `1px solid #A7F3D0`,
      color: '#065F46',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
    },
    error: {
      background: tokens.colors.errorLight,
      border: `1px solid #FECACA`,
      color: '#991B1B',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      ),
    },
    warning: {
      background: tokens.colors.warningLight,
      border: `1px solid #FCD34D`,
      color: '#92400E',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
    },
    info: {
      background: tokens.colors.infoLight,
      border: `1px solid #BFDBFE`,
      color: '#1E40AF',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
      ),
    },
  };

  const config = typeStyles[type] || typeStyles.info;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '14px 16px',
      borderRadius: tokens.borderRadius.lg,
      fontSize: '14px',
      fontWeight: '500',
      fontFamily: tokens.fontFamily,
      ...config,
      ...style,
    }}>
      <span style={{ flexShrink: 0, marginTop: '1px' }}>{config.icon}</span>
      <span style={{ flex: 1 }}>{children}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            color: 'inherit',
            opacity: 0.7,
            flexShrink: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      )}
    </div>
  );
}

// ============================================================================
// BUTTON COMPONENT
// ============================================================================
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon = null,
  onClick,
  type = 'button',
  style = {},
  ...props
}) {
  const variants = {
    primary: {
      background: `linear-gradient(135deg, ${tokens.colors.primary} 0%, ${tokens.colors.primaryHover} 100%)`,
      color: '#fff',
      border: 'none',
      boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
    },
    secondary: {
      background: '#fff',
      color: tokens.colors.slate700,
      border: `1px solid ${tokens.colors.slate200}`,
      boxShadow: tokens.shadows.sm,
    },
    outline: {
      background: 'transparent',
      color: tokens.colors.primary,
      border: `1px solid ${tokens.colors.primary}`,
      boxShadow: 'none',
    },
    ghost: {
      background: 'transparent',
      color: tokens.colors.slate600,
      border: 'none',
      boxShadow: 'none',
    },
    danger: {
      background: `linear-gradient(135deg, ${tokens.colors.error} 0%, #DC2626 100%)`,
      color: '#fff',
      border: 'none',
      boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
    },
  };

  const sizes = {
    sm: { padding: '8px 16px', fontSize: '13px', borderRadius: tokens.borderRadius.md },
    md: { padding: '12px 20px', fontSize: '14px', borderRadius: tokens.borderRadius.lg },
    lg: { padding: '16px 28px', fontSize: '16px', borderRadius: tokens.borderRadius.xl },
  };

  const variantStyle = variants[variant] || variants.primary;
  const sizeStyle = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontFamily: tokens.fontFamily,
        fontWeight: '600',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.6 : 1,
        transition: 'all 0.2s ease',
        width: fullWidth ? '100%' : 'auto',
        ...variantStyle,
        ...sizeStyle,
        ...style,
      }}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size="xs" color={variant === 'primary' || variant === 'danger' ? 'white' : 'slate'} />
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && <span style={{ display: 'flex' }}>{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}

// ============================================================================
// PAGINATION COMPONENT
// ============================================================================
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems = null,
  itemsPerPage = null,
  showItemCount = true,
}) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= Math.min(5, totalPages); i++) pages.push(i);
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
      }
    }
    
    return pages;
  };

  const buttonStyle = (isActive = false, isDisabled = false) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '36px',
    height: '36px',
    padding: '0 12px',
    background: isActive ? tokens.colors.primary : '#fff',
    color: isActive ? '#fff' : isDisabled ? tokens.colors.slate300 : tokens.colors.slate600,
    border: isActive ? 'none' : `1px solid ${tokens.colors.slate200}`,
    borderRadius: tokens.borderRadius.md,
    fontSize: '13px',
    fontWeight: isActive ? '600' : '500',
    fontFamily: tokens.fontFamily,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.5 : 1,
    transition: 'all 0.15s ease',
  });

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 20px',
      borderTop: `1px solid ${tokens.colors.slate200}`,
      background: tokens.colors.slate50,
      borderRadius: `0 0 ${tokens.borderRadius.lg} ${tokens.borderRadius.lg}`,
      fontFamily: tokens.fontFamily,
    }}>
      {showItemCount && totalItems !== null && (
        <span style={{ fontSize: '13px', color: tokens.colors.slate500 }}>
          {totalItems} total
        </span>
      )}
      
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <button 
          onClick={() => onPageChange(1)} 
          disabled={currentPage === 1}
          style={buttonStyle(false, currentPage === 1)}
        >
          First
        </button>
        <button 
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          style={buttonStyle(false, currentPage === 1)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        
        {getPageNumbers().map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={buttonStyle(page === currentPage)}
          >
            {page}
          </button>
        ))}
        
        <button 
          onClick={() => onPageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
          style={buttonStyle(false, currentPage === totalPages)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
        <button 
          onClick={() => onPageChange(totalPages)} 
          disabled={currentPage === totalPages}
          style={buttonStyle(false, currentPage === totalPages)}
        >
          Last
        </button>
      </div>

      {showItemCount && (
        <span style={{ fontSize: '13px', color: tokens.colors.slate500 }}>
          Page {currentPage} of {totalPages}
        </span>
      )}
    </div>
  );
}

// ============================================================================
// EMPTY STATE COMPONENT
// ============================================================================
export function EmptyState({
  icon = null,
  title = 'No data',
  description = 'No items to display.',
  action = null,
  actionLabel = 'Get Started',
  onAction = null,
}) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '60px 24px',
      fontFamily: tokens.fontFamily,
    }}>
      {icon && (
        <div style={{
          width: '64px',
          height: '64px',
          background: tokens.colors.slate100,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          color: tokens.colors.slate400,
        }}>
          {icon}
        </div>
      )}
      <h3 style={{
        fontSize: '18px',
        fontWeight: '600',
        color: tokens.colors.slate800,
        marginBottom: '8px',
        marginTop: 0,
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: '14px',
        color: tokens.colors.slate500,
        marginBottom: action || onAction ? '24px' : 0,
        margin: action || onAction ? '0 0 24px 0' : 0,
      }}>
        {description}
      </p>
      {(action || onAction) && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

// ============================================================================
// BADGE COMPONENT
// ============================================================================
export function Badge({ 
  children, 
  variant = 'default',
  size = 'md',
  style = {},
}) {
  const variants = {
    default: { background: tokens.colors.slate100, color: tokens.colors.slate600 },
    primary: { background: tokens.colors.primaryLight, color: tokens.colors.primaryDark },
    success: { background: tokens.colors.successLight, color: '#065F46' },
    warning: { background: tokens.colors.warningLight, color: '#92400E' },
    error: { background: tokens.colors.errorLight, color: '#991B1B' },
    info: { background: tokens.colors.infoLight, color: '#1E40AF' },
  };

  const sizes = {
    sm: { padding: '2px 8px', fontSize: '11px' },
    md: { padding: '4px 10px', fontSize: '12px' },
    lg: { padding: '6px 12px', fontSize: '13px' },
  };

  const variantStyle = variants[variant] || variants.default;
  const sizeStyle = sizes[size] || sizes.md;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: tokens.borderRadius.md,
      fontWeight: '600',
      fontFamily: tokens.fontFamily,
      textTransform: 'uppercase',
      letterSpacing: '0.025em',
      ...variantStyle,
      ...sizeStyle,
      ...style,
    }}>
      {children}
    </span>
  );
}

// ============================================================================
// CARD COMPONENT
// ============================================================================
export function Card({ 
  children, 
  padding = 'md',
  hover = false,
  style = {},
  ...props 
}) {
  const paddings = {
    none: 0,
    sm: '16px',
    md: '24px',
    lg: '32px',
  };

  return (
    <div 
      style={{
        background: '#fff',
        border: `1px solid ${tokens.colors.slate200}`,
        borderRadius: tokens.borderRadius.xl,
        padding: paddings[padding] || paddings.md,
        boxShadow: tokens.shadows.card,
        transition: hover ? 'all 0.2s ease' : 'none',
        fontFamily: tokens.fontFamily,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================================================
// SHARED KEYFRAMES
// ============================================================================
const spinnerKeyframes = `
  @keyframes ui-spin {
    to { transform: rotate(360deg); }
  }
`;

// Inject global keyframes once
if (typeof document !== 'undefined' && !document.querySelector('style[data-ui-keyframes]')) {
  const styleEl = document.createElement('style');
  styleEl.setAttribute('data-ui-keyframes', 'true');
  styleEl.textContent = spinnerKeyframes;
  document.head.appendChild(styleEl);
}

export default {
  Spinner,
  LoadingScreen,
  ErrorScreen,
  Alert,
  Button,
  Pagination,
  EmptyState,
  Badge,
  Card,
  tokens,
};

