const API_URL = 'http://localhost:3000';
const token = sessionStorage.getItem('token');
const username = sessionStorage.getItem('username');
//console.log(JSON.parse(atob(token.split('.')[1])));

// Token yoksa login sayfasına yönlendir
if (!token) {
  window.location.href = 'index.html';
}

// Hoş geldin mesajı
const welcomeEl = document.getElementById('welcome');
if (username) {
  welcomeEl.textContent = `Hoş geldin, ${username}!`;
}

// Çıkış butonu işlevi
const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', () => {
  sessionStorage.clear(); // Token ve username'i temizle
  window.location.href = 'index.html'; // Giriş sayfasına dön
});
// Kullanıcı dosyalarını getir ve listele
async function fetchFiles() {
  const response = await fetch(`${API_URL}/files`, {
    headers: {
      'Authorization': token
    }
  });

  const files = await response.json();
  const fileList = document.getElementById('fileList');
  fileList.innerHTML = ''; // Önceki listeyi temizle

  files.forEach(file => {
    const listItem = document.createElement('li');
    listItem.textContent = file.filename;
    fileList.appendChild(listItem);

    

    // Silme butonu
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Sil';
    deleteBtn.className = 'delete-button';
    deleteBtn.onclick = () => deleteFile(file.filename);

    listItem.appendChild(deleteBtn);
    fileList.appendChild(listItem);
  });
}

// Dosya yükleme
async function uploadFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (!file) {
    alert("Lütfen bir dosya seçin.");
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': token
    },
    body: formData
  });

  const data = await response.json();
  alert(data.message);

  if (response.ok) {
    fileInput.value = ''; // Input'u temizle
    fetchFiles(); // Listeyi güncelle
  }
}

// Dosya silme
async function deleteFile(filename) {
  const confirmed = confirm(`${filename} dosyasını silmek istediğine emin misin?`);
  if (!confirmed) return;

  const response = await fetch(`${API_URL}/files/${filename}`, {
    method: 'DELETE',
    headers: {
      'Authorization': token
    }
  });

  const data = await response.json();
  alert(data.message);

  if (response.ok) {
    fetchFiles(); // Listeyi güncelle
  }
}

// Sayfa yüklendiğinde dosyaları getir
window.onload = fetchFiles;
