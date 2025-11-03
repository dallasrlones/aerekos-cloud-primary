# Aerekos Cloud - Global Styles

This directory contains global, reusable styles for the Aerekos Cloud application. The styling follows the design system established in the Login page, featuring modern gradients, smooth animations, and responsive design.

## 📁 Files

### `forms.css`
Complete form styling system with:
- **Form Containers**: Beautiful card-style form wrappers
- **Input Styles**: Text inputs, selects, textareas with focus states
- **Button Styles**: Primary, secondary, and danger button variants
- **Alert Components**: Success, error, warning, and info alerts
- **Loading States**: Spinners and disabled states
- **Responsive Design**: Mobile-first approach
- **Dark Mode Support**: Automatic dark mode adaptation

## 🎨 Design System

### Colors
- **Primary Gradient**: `#667eea` → `#764ba2`
- **Text Primary**: `#1e293b`
- **Text Secondary**: `#64748b`
- **Border**: `#e2e8f0`
- **Background**: `#f5f7fa`
- **Danger**: `#ef4444` → `#dc2626`

### Typography
- **Font Family**: System font stack (SF Pro, Segoe UI, Roboto, etc.)
- **Font Sizes**: 14px (labels) to 32px (titles)
- **Font Weights**: 400 (regular), 600 (semibold), 700 (bold)

### Spacing
- **Small**: 8px
- **Medium**: 16px
- **Large**: 24px
- **XLarge**: 32px

### Border Radius
- **Small**: 8px
- **Medium**: 12px
- **Large**: 24px

## 🚀 Usage

### Import in Components

```javascript
import '../../styles/forms.css';
```

### Using the FormContainer Component

```javascript
import FormContainer from './components/forms/FormContainer';

function MyPage() {
  const formObj = {
    email: {
      label: 'Email Address',
      type: 'email',
      name: 'email',
      placeholder: 'you@example.com',
      required: true,
    },
    password: {
      label: 'Password',
      type: 'password',
      name: 'password',
      placeholder: '••••••••',
      required: true,
    }
  };

  return (
    <FormContainer
      formUrl="/api/auth/login"
      formObj={formObj}
      title="Welcome Back"
      subtitle="Sign in to your account"
      submitLabel="Sign In"
      submitCallback={(response) => {
        console.log('Success!', response);
      }}
    />
  );
}
```

### Using Individual Classes

```javascript
function CustomForm() {
  return (
    <div className="form-container">
      <div className="form-header">
        <h1 className="form-title">Custom Form</h1>
        <p className="form-subtitle">With individual classes</p>
      </div>

      <form className="form">
        <div className="input-group">
          <label>Username</label>
          <input type="text" placeholder="Enter username" />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}
```

### Alert Messages

```javascript
<div className="alert alert-success">
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  Operation successful!
</div>

<div className="alert alert-error">
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  Something went wrong!
</div>
```

### Button Variants

```javascript
<button className="btn btn-primary">Primary Action</button>
<button className="btn btn-secondary">Secondary Action</button>
<button className="btn btn-danger">Delete</button>
```

### Loading States

```javascript
<button className="btn btn-primary" disabled>
  <span className="spinner"></span>
  Loading...
</button>
```

## 📦 Global Utilities (from `index.css`)

### Layout Classes
- `.container` - Centered container with max-width
- `.card` - Card component with shadow

### Spacing Utilities
- `.mt-1` to `.mt-4` - Margin top
- `.mb-1` to `.mb-4` - Margin bottom
- `.p-1` to `.p-4` - Padding

### Text Utilities
- `.text-center` - Center text alignment

## 🎯 Best Practices

1. **Use FormContainer for consistency**: Instead of creating custom forms, use the FormContainer component for automatic styling.

2. **Leverage utility classes**: Use the provided utility classes for spacing and layout instead of custom CSS.

3. **Follow the color system**: Use the design system colors for consistency across the app.

4. **Maintain accessibility**: Always include proper labels, ARIA attributes, and focus states.

5. **Test responsiveness**: All forms should work well on mobile, tablet, and desktop.

## 🌓 Dark Mode

Dark mode is automatically handled via CSS media queries. All form components adapt to the user's system preferences.

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 768px
- **Desktop**: > 768px

## 🔧 Customization

To customize the design system, update the CSS variables in `forms.css`:
- Colors: Update gradient values and color codes
- Spacing: Adjust padding and margin values
- Typography: Change font sizes and weights
- Borders: Modify border-radius values

## 📚 Examples

See `FormContainer.example.js` for comprehensive usage examples including:
- Basic forms
- Advanced forms with selects and textareas
- Inline forms
- Checkbox and radio buttons
- File uploads

## 💡 Tips

1. **Don't create new CSS files**: Use the global styles to maintain consistency
2. **Reuse components**: Use FormContainer and global classes instead of custom styling
3. **Follow the pattern**: Look at Login.js and FormContainer.js for implementation patterns
4. **Keep it simple**: The design system is comprehensive - avoid overriding styles

