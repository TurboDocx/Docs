import React from 'react';
import FormSelect from '@theme-original/ApiExplorer/FormSelect';

// Yes/no parameters list `enum: [true, false]`, so Try it shows them in a select. React renders
// nothing for boolean children, which left the options blank: pass every option as text.
export default function FormSelectWrapper({options, ...props}) {
  return <FormSelect {...props} options={Array.isArray(options) ? options.map(String) : options} />;
}
