export function isValidEmail(email) {
  const re = /^\S+@\S+\.\S+$/;
  return re.test(email);
}

export function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 8;
}

export function validateTask({ title, description, assignedTo, priority, deadline }) {
  const errors = {};
  if (!title || title.trim() === '') errors.title = 'Title is required';
  if (!description || description.trim() === '') errors.description = 'Description is required';
  if (!assignedTo || assignedTo.trim() === '') errors.assignedTo = 'Must assign to someone';
  if (!priority) errors.priority = 'Priority is required';
  if (!deadline) errors.deadline = 'Deadline is required';
  else if (new Date(deadline) < new Date()) errors.deadline = 'Deadline cannot be in the past';
  return { valid: Object.keys(errors).length === 0, errors };
}
