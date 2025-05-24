const API_URL = 'http://localhost:3000';

// Kayıt fonksiyonu
async function register() {
  const username = document.getElementById('registerUsername').value;
  const password = document.getElementById('registerPassword').value;

    if (!username || !password) {
    alert("Lütfen kullanıcı adı ve şifreyi girin.");
    return;
  }

  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  alert(data.message);

  if (response.ok) {
  // Başarılıysa inputları temizle
  document.getElementById('registerUsername').value = '';
  document.getElementById('registerPassword').value = '';
}
}

// Giriş fonksiyonu
async function login() {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  if (!username || !password) {
  alert("Lütfen kullanıcı adı ve şifreyi girin.");
  return;
}

  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();

  if (response.ok) {
    sessionStorage.setItem('token', data.token); // ✅ Artık her sekme/kullanıcı ayrı token tutar
    sessionStorage.setItem('username', data.username);
    window.location.href = 'dashboard.html';
  } else {
    alert(data.message);
  }

}
