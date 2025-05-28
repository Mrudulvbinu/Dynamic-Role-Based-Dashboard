export const saveFormToLocal = (form) => {
  const forms = JSON.parse(localStorage.getItem('forms') || '[]');
  const existingIndex = forms.findIndex(f => f.id === form.id);
  
  if (existingIndex >= 0) {
    forms[existingIndex] = form;
  } else {
    forms.push({ ...form, id: uuidv4(), createdAt: new Date() });
  }
  
  localStorage.setItem('forms', JSON.stringify(forms));
};

export const loadFormsFromLocal = () => {
  return JSON.parse(localStorage.getItem('forms') || '[]');
};