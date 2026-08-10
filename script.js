function getStoredUsers() {
  try {
    return JSON.parse(localStorage.getItem('appUsers') || '[]');
  } catch (err) {
    return [];
  }
}

function saveStoredUsers(users) {
  localStorage.setItem('appUsers', JSON.stringify(users));
}

async function loginUser(username, password) {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.success) {
      return { success: true, username: data.username || username };
    }

    return { success: false, message: data.message || 'خطأ في تسجيل الدخول' };
  } catch (err) {
    const users = getStoredUsers();
    const matched = users.find(user => user.username.toLowerCase() === username.toLowerCase() && user.password === password);

    if (matched) {
      return { success: true, username: matched.username };
    }

    return { success: false, message: 'تعذر الاتصال بالخادم. يرجى المحاولة لاحقًا' };
  }
}

async function registerUser(username, password) {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.success) {
      return { success: true, message: data.message || 'تم إنشاء الحساب بنجاح!' };
    }

    return { success: false, message: data.message || 'حدث خطأ أثناء الحفظ' };
  } catch (err) {
    const users = getStoredUsers();
    const exists = users.some(user => user.username.toLowerCase() === username.toLowerCase());

    if (exists) {
      return { success: false, message: 'اسم المستخدم هذا مستخدم بالفعل!' };
    }

    users.push({ username, password });
    saveStoredUsers(users);

    return { success: true, message: 'تم إنشاء الحساب بنجاح!' };
  }
}

async function loadUsers() {
  try {
    const response = await fetch('/api/users');
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        return data.users || [];
      }
    }
  } catch (err) {
    // تجاهل وضياع الاتصال بالخادم وسنستخدم التخزين المحلي بدلًا منه
  }

  return getStoredUsers().map(user => ({ username: user.username }));
}

// نموذج تسجيل الدخول
document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const usernameInput = document.getElementById('username').value.trim();
  const passwordInput = document.getElementById('password').value.trim();
  const errorMsg = document.getElementById('errorMessage');

  errorMsg.innerText = '';

  const result = await loginUser(usernameInput, passwordInput);

  if (result.success) {
    sessionStorage.setItem('loggedInUser', result.username);
    window.location.href = 'home.html';
  } else {
    errorMsg.innerText = result.message || 'خطأ في تسجيل الدخول';
  }
});

// التحكم في النافذة المنبثقة (Modal)
const modal = document.getElementById('registerModal');
const openModalBtn = document.getElementById('openRegisterModal');
const closeModalBtn = document.getElementById('closeRegisterModal');

openModalBtn.onclick = () => { modal.style.display = 'flex'; };
closeModalBtn.onclick = () => { modal.style.display = 'none'; };

window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

// نموذج تسجيل حساب جديد
document.getElementById('registerForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const regUsername = document.getElementById('regUsername').value.trim();
  const regPassword = document.getElementById('regPassword').value.trim();
  const regMessage = document.getElementById('regMessage');

  regMessage.innerText = 'جاري الحفظ...';
  regMessage.style.color = '#333';

  const result = await registerUser(regUsername, regPassword);

  if (result.success) {
    regMessage.style.color = 'green';
    regMessage.innerText = result.message;

    setTimeout(() => {
      modal.style.display = 'none';
      document.getElementById('registerForm').reset();
      regMessage.innerText = '';
    }, 1500);
  } else {
    regMessage.style.color = 'red';
    regMessage.innerText = result.message || 'حدث خطأ أثناء الحفظ';
  }
});