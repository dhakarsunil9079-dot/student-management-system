// Bootstrap-style client validation plus confirmation for destructive actions.
document.querySelectorAll('.needs-validation').forEach(form => {
  form.addEventListener('submit', event => {
    if (!form.checkValidity()) { event.preventDefault(); event.stopPropagation(); }
    form.classList.add('was-validated');
  });
});
document.querySelectorAll('form[data-confirm]').forEach(form => {
  form.addEventListener('submit', event => {
    if (!window.confirm(form.dataset.confirm || 'Are you sure?')) event.preventDefault();
  });
});
// Small dynamic password feedback on the registration page.
const password = document.querySelector('input[name="password"]');
if (password) password.addEventListener('input', () => {
  const hint = password.parentElement.querySelector('.password-hint');
  if (hint) hint.textContent = password.value.length >= 8 ? 'Password length looks good.' : `${Math.max(0, 8-password.value.length)} more character(s) needed.`;
});
