// Demo-Sign-Up: password-strength meter + confirm-password match check.
// Pure logic (passwordStrength, passwordsMatch) is kept DOM-free so it can
// be unit-tested with node; the DOM wiring below only runs in a browser.
// This is a visual demo: the form still creates no account (action="#").

function passwordStrength(password) {
  if (!password) return { score: 0, label: 'Empty' };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'];
  return { score: score, label: labels[score] };
}

function passwordsMatch(password, confirm) {
  return password.length > 0 && password === confirm;
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function () {
    const password = document.getElementById('Password');
    const confirm = document.getElementById('confirmPassword');
    const meter = document.getElementById('strengthMeter');
    const meterLabel = document.getElementById('strengthLabel');
    const matchMsg = document.getElementById('matchMessage');
    const form = password ? password.closest('form') : null;
    if (!password || !confirm || !meter || !meterLabel || !matchMsg || !form) return;

    function refresh() {
      const result = passwordStrength(password.value);
      meter.value = result.score;
      meter.max = 4;
      meterLabel.textContent = password.value ? result.label : '';
      if (!confirm.value) {
        matchMsg.textContent = '';
      } else if (passwordsMatch(password.value, confirm.value)) {
        matchMsg.textContent = 'Passwords match.';
        matchMsg.className = 'match-ok';
      } else {
        matchMsg.textContent = 'Passwords do not match.';
        matchMsg.className = 'match-error';
      }
    }

    password.addEventListener('input', refresh);
    confirm.addEventListener('input', refresh);

    form.addEventListener('submit', function (event) {
      refresh();
      if (passwordStrength(password.value).score < 2 || !passwordsMatch(password.value, confirm.value)) {
        event.preventDefault();
        matchMsg.textContent = 'Use a stronger password (at least 8 characters, mixed case or a number) and make sure both passwords match.';
        matchMsg.className = 'match-error';
      }
    });
    refresh();
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { passwordStrength: passwordStrength, passwordsMatch: passwordsMatch };
}
