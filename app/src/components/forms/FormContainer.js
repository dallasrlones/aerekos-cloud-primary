// this will be a form wrapper
import { useState, useEffect } from 'react';
import { privatePOST, privatePUT } from '../../services/httpService';
import '../../styles/forms.css';

function Field({ field, onChange, value }) {
    const renderInput = () => {
        const baseProps = {
            name: field.name,
            onChange: onChange,
            placeholder: field.placeholder,
            required: field.required,
            disabled: field.disabled,
            value: value || ''
        };

        switch (field.type) {
            case 'checkbox':
            case 'radio':
                return (
                    <label className={`${field.type}-label`}>
                        <input 
                            type={field.type} 
                            name={field.name} 
                            onChange={onChange}
                            required={field.required}
                            disabled={field.disabled}
                            checked={value || false}
                        />
                        {field.inlineLabel}
                    </label>
                );
            
            case 'select':
                return (
                    <select {...baseProps}>
                        <option value="">Select {field.label}</option>
                        {field.options && field.options.map((option, idx) => (
                            <option key={idx} value={typeof option === 'object' ? option.value : option}>
                                {typeof option === 'object' ? option.label : option}
                            </option>
                        ))}
                    </select>
                );
            
            case 'textarea':
                return <textarea {...baseProps} rows={field.rows || 4} />;
            
            default:
                return <input type={field.type || 'text'} {...baseProps} />;
        }
    };

    return (
        <div className="input-group">
            {field.type !== 'checkbox' && field.type !== 'radio' && (
                <label htmlFor={field.name}>
                    {field.label}
                    {field.required && <span className="required">*</span>}
                </label>
            )}
            {field.icon ? (
                <div className="input-wrapper">
                    {field.icon && <span className="input-icon">{field.icon}</span>}
                    {renderInput()}
                </div>
            ) : (
                renderInput()
            )}
            {field.helpText && <span className="help-text">{field.helpText}</span>}
        </div>
    );
}

export default function FormContainer({ 
    type,
    formUrl, 
    formObj, 
    submitCallback,
    title, 
    subtitle,
    submitLabel = 'Submit',
    showContainer = true 
}) {
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Initialize form data from formObj values
    useEffect(() => {
        const initialData = {};
        Object.entries(formObj).forEach(([key, field]) => {
            if (field.value !== undefined) {
                initialData[field.name] = field.value;
            }
        });
        setFormData(initialData);
    }, [formObj]);

    const onChange = (e) => {
        const { name, type, value, checked } = e.target;
        setFormData({ 
            ...formData, 
            [name]: type === 'checkbox' ? checked : value 
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await (type === 'UPDATE' ? privatePUT : privatePOST)(formUrl, {
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            console.log(response);
            
            if (response.error) {
                setError(response.error || 'Something went wrong');
            } else {
                setSuccess(type === 'UPDATE' ? 'Successfully updated!' : 'Success! Form submitted.');
                if (submitCallback) submitCallback(response);
            }
        } catch (err) {
            setError(err.message || 'Failed to submit form');
        } finally {
            setIsLoading(false);
        }
    };

    const formContent = (
        <>
            {(title || subtitle) && (
                <div className="form-header">
                    {title && <h1 className="form-title">{title}</h1>}
                    {subtitle && <p className="form-subtitle">{subtitle}</p>}
                </div>
            )}

            <form onSubmit={onSubmit} className="form">
                {Object.entries(formObj).map(([key, field]) => (
                    <Field 
                        key={key} 
                        field={field} 
                        onChange={onChange}
                        value={formData[field.name] !== undefined ? formData[field.name] : ''}
                    />
                ))}

                {error && (
                    <div className="alert alert-error">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {success}
                    </div>
                )}

                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <span className="spinner"></span>
                            Submitting...
                        </>
                    ) : (
                        submitLabel
                    )}
                </button>
            </form>
        </>
    );

    return showContainer ? (
        <div className="form-container">
            {formContent}
        </div>
    ) : formContent;
}