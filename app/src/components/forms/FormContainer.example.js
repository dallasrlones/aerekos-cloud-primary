/**
 * FormContainer Usage Examples
 * 
 * The FormContainer is a reusable form component with built-in styling
 * matching the Aerekos Cloud design system (similar to Login.js styling).
 */

import FormContainer from './FormContainer';

// Example 1: Basic Form
export function BasicFormExample() {
    const formObj = {
        name: {
            label: 'Full Name',
            type: 'text',
            name: 'name',
            placeholder: 'John Doe',
            required: true,
        },
        email: {
            label: 'Email Address',
            type: 'email',
            name: 'email',
            placeholder: 'you@example.com',
            required: true,
            helpText: 'We will never share your email.'
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
            formUrl="/api/auth/register"
            formObj={formObj}
            title="Create Account"
            subtitle="Sign up for Aerekos Cloud"
            submitLabel="Create Account"
            submitCallback={(response) => {
                console.log('Success!', response);
                // Navigate or do something with response
            }}
        />
    );
}

// Example 2: Form with Select and Textarea
export function AdvancedFormExample() {
    const formObj = {
        deviceName: {
            label: 'Device Name',
            type: 'text',
            name: 'deviceName',
            placeholder: 'My Device',
            required: true,
        },
        deviceType: {
            label: 'Device Type',
            type: 'select',
            name: 'deviceType',
            required: true,
            options: [
                { value: 'server', label: 'Server' },
                { value: 'workstation', label: 'Workstation' },
                { value: 'mobile', label: 'Mobile' }
            ]
        },
        description: {
            label: 'Description',
            type: 'textarea',
            name: 'description',
            placeholder: 'Describe your device...',
            rows: 5,
            helpText: 'Optional description for your device'
        }
    };

    return (
        <FormContainer
            formUrl="/api/devices"
            formObj={formObj}
            title="Add New Device"
            subtitle="Register a device with Aerekos Cloud"
            submitLabel="Add Device"
        />
    );
}

// Example 3: Inline Form (without container wrapper)
export function InlineFormExample() {
    const formObj = {
        key: {
            label: 'API Key Name',
            type: 'text',
            name: 'keyName',
            placeholder: 'Production API Key',
            required: true,
        }
    };

    return (
        <div className="card">
            <h3>Generate API Key</h3>
            <FormContainer
                formUrl="/api/keys/generate"
                formObj={formObj}
                submitLabel="Generate Key"
                showContainer={false}  // Renders without the styled container
            />
        </div>
    );
}

// Example 4: Checkbox and Radio
export function CheckboxRadioExample() {
    const formObj = {
        username: {
            label: 'Username',
            type: 'text',
            name: 'username',
            required: true,
        },
        subscribe: {
            label: 'Newsletter',
            type: 'checkbox',
            name: 'subscribe',
            inlineLabel: 'Subscribe to newsletter'
        },
        plan: {
            label: 'Plan Type',
            type: 'radio',
            name: 'plan',
            inlineLabel: 'Free Plan',
            required: true
        }
    };

    return (
        <FormContainer
            formUrl="/api/settings"
            formObj={formObj}
            title="User Settings"
        />
    );
}

// Example 5: File Upload
export function FileUploadExample() {
    const formObj = {
        projectName: {
            label: 'Project Name',
            type: 'text',
            name: 'projectName',
            required: true,
        },
        projectFile: {
            label: 'Upload File',
            type: 'file',
            name: 'projectFile',
            helpText: 'Maximum file size: 10MB'
        }
    };

    return (
        <FormContainer
            formUrl="/api/projects/upload"
            formObj={formObj}
            title="Upload Project"
            submitLabel="Upload"
        />
    );
}

/**
 * Field Configuration Options:
 * 
 * - label: Display label for the field
 * - type: 'text', 'email', 'password', 'number', 'date', 'time', 'checkbox', 'radio', 'select', 'textarea', 'file'
 * - name: Field name (used as the key in form data)
 * - placeholder: Placeholder text
 * - required: Boolean to make field required
 * - disabled: Boolean to disable field
 * - helpText: Help text shown below the field
 * - icon: React element for input icon (only works with text-based inputs)
 * - options: Array of options for select (can be strings or {value, label} objects)
 * - rows: Number of rows for textarea
 * - inlineLabel: Label shown inline with checkbox/radio
 * 
 * FormContainer Props:
 * 
 * - formUrl: API endpoint to POST form data (required)
 * - formObj: Object with field configurations (required)
 * - title: Form title (optional)
 * - subtitle: Form subtitle (optional)
 * - submitLabel: Submit button text (default: 'Submit')
 * - submitCallback: Callback function called on successful submission (optional)
 * - showContainer: Boolean to show/hide the styled container (default: true)
 */

