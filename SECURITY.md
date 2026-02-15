# CommerceX - Security & Features Documentation

## 🔐 Security Features

### 1. Authentication & Authorization
- **JWT Token-based Authentication**: Secure token storage in localStorage
- **Role-Based Access Control (RBAC)**: Admin dashboard only accessible to admin users
- **Protected Routes**: Sensitive pages (Profile, Orders, Admin) require authentication
- **Logout Functionality**: Secure token removal and session cleanup

### 2. AuthContext Implementation
```javascript
- Manages user state globally
- Auto-loads user on app startup
- Validates tokens on page refresh
- Handles authentication state across app
- Provides login/logout functions
```

### 3. Admin Protection
- Admin routes are protected with `ProtectedRoute` component
- Requires both authentication AND `role === 'admin'`
- Non-admins cannot access admin routes (access denied message)
- Admin menu item only shows for admin users

### 4. CORS Configuration
- Backend configured with regex pattern: `/^http:\/\/localhost:\d+$/`
- Allows any localhost port during development
- Credentials support enabled for secure API calls

## 🎨 Theme System

### Light/Dark Mode
- **ThemeContext**: Manages theme state globally
- **System Preference Detection**: Respects OS dark mode preference
- **LocalStorage Persistence**: Remembers user's theme choice
- **Smooth Transitions**: CSS transitions for theme changes
- **Tailwind Dark Mode**: Uses class strategy (`dark:` prefix)

### Theme Implementation
```javascript
- Toggle button in header
- Sun/Moon icons for visual feedback
- Persists preference across sessions
- Respects system preferences on first visit
```

## 🛡️ Best Practices Implemented

### Frontend Security
1. **Token Management**: Never exposed in console/network
2. **HTTPS Ready**: App structure ready for production HTTPS
3. **Input Validation**: Form validation on all inputs
4. **Error Handling**: Secure error messages (no sensitive data)
5. **Session Management**: Auto-cleanup on logout

### User Experience
1. **Responsive Design**: Works on all devices
2. **Loading States**: Feedback during async operations
3. **Error Messages**: Clear, user-friendly error feedback
4. **Success Notifications**: Confirmation for actions
5. **Protected Redirects**: Automatic redirect to login if needed

### Admin Features
1. **Admin Badge**: Purple highlight on admin nav item
2. **Access Control**: Visible only to authenticated admins
3. **Product Management**: Add/edit products
4. **Order Management**: View and manage orders
5. **User Separation**: Different views for customers vs admins

## 📱 UI/UX Improvements

### Navigation
- **Conditional Navigation**: Shows relevant menu items based on auth state
- **User Menu**: Dropdown with profile and logout options
- **Theme Toggle**: Easy dark/light mode switching
- **Logo Clickable**: Returns to homepage from any page

### Forms
- **Clear Labels**: All inputs properly labeled
- **Placeholders**: Helpful hints for form fields
- **Error Display**: Prominent error messages
- **Loading States**: Disabled buttons during submission
- **Success Feedback**: Notifications on success

### Visual Feedback
- **Hover Effects**: Interactive elements show feedback
- **Loading Skeletons**: Placeholder content while loading
- **Status Colors**: Order statuses with color coding
- **Icons**: Clear visual indicators for actions

## 🔄 Component Structure

```
App.jsx (Providers)
├── ThemeProvider
├── AuthProvider
├── Layout
│   ├── Header (with theme toggle & conditional nav)
│   ├── Main (children)
│   └── Footer
└── Routes
    ├── Public Routes (Home, Shop, Login, Register)
    ├── Protected Routes (Profile, Orders)
    └── Admin Routes (Admin Dashboard - requires admin role)
```

## 🚀 Usage Examples

### Using Auth in Components
```javascript
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

function MyComponent() {
  const { user, logout } = useContext(AuthContext);
  
  if (!user) return <p>Please login</p>;
  
  return (
    <div>
      <p>Welcome, {user.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Using Theme in Components
```javascript
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

function MyComponent() {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  
  return (
    <button onClick={toggleTheme}>
      {isDark ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
```

### Protected Routes
```javascript
<Route path="/admin/*" element={
  <ProtectedRoute requiredRole="admin">
    <AdminDashboardPage />
  </ProtectedRoute>
} />
```

## 📚 Files Modified/Created

### New Context Files
- `src/contexts/AuthContext.jsx` - Authentication state management
- `src/contexts/ThemeContext.jsx` - Theme management
- `src/hooks/useAuth.js` - Custom hooks for easier access
- `src/components/ProtectedRoute.jsx` - Route protection component

### Updated Files
- `src/App.jsx` - Wrapped with providers
- `src/components/Layout.jsx` - Theme toggle, conditional nav, logout
- `src/styles.css` - Dark mode styles
- `tailwind.config.js` - Dark mode configuration
- `src/pages/LoginPage.jsx` - Auth context integration
- `src/pages/RegisterPage.jsx` - Auth context integration
- All pages with dark mode colors

## 🔒 Security Checklist

- ✅ JWT authentication with token storage
- ✅ Protected admin routes
- ✅ Role-based access control
- ✅ Secure logout with token cleanup
- ✅ Input validation on forms
- ✅ Error handling without sensitive data
- ✅ CORS properly configured
- ✅ Session persistence across refreshes
- ✅ Auto-logout on token expiration (error handling)
- ✅ Credential support in API calls

## 🎯 Next Steps (Production)

1. **Enable HTTPS**: Use SSL certificates in production
2. **Secure Token Storage**: Consider httpOnly cookies instead of localStorage
3. **Token Refresh**: Implement refresh tokens for longer sessions
4. **Rate Limiting**: Add rate limiting on backend
5. **Input Sanitization**: Sanitize user inputs on backend
6. **CORS Whitelist**: Replace regex with specific domain in production
7. **Environment Variables**: Use .env for sensitive config
8. **Monitoring**: Add error tracking and logging
9. **Testing**: Add unit and integration tests
10. **Security Headers**: Add HSTS, CSP headers on backend
