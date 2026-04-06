export default function FormField({
  id,
  label,
  error,
  help,
  as = "input",
  className = "",
  children,
  ...props
}) {
  const Component = as;

  return (
    <div className={`field ${error ? "field-invalid" : ""} ${className}`.trim()}>
      <label htmlFor={id}>{label}</label>
      {children || <Component id={id} {...props} />}
      {error ? <span className="field-error">{error}</span> : help ? <span className="field-help">{help}</span> : null}
    </div>
  );
}
