// login.js - VERSÃO CORRIGIDA E TESTADA
document.addEventListener('DOMContentLoaded', function () {
    const formTabs = document.querySelectorAll('.form-tab');
    const forms = document.querySelectorAll('.form');
    const switchFormLinks = document.querySelectorAll('.switch-form');
    const passwordToggles = document.querySelectorAll('.password-toggle');
    const registerForm = document.getElementById('registerForm');
    const registerPassword = document.getElementById('registerPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const passwordError = document.getElementById('passwordError');
    const loginForm = document.getElementById('loginForm');
   
    const BASE_PATH = '/LarissaBrito';
    const API_URLS = {
        register: BASE_PATH + '/backend/php/cadastro.php',
        login: BASE_PATH + '/backend/php/login.php'
    };

    function switchForm(formType) {
        formTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === formType);
        });

        forms.forEach(form => {
            form.classList.toggle('active', form.id === formType + 'Form');
        });
    }

    function togglePasswordVisibility(inputId) {
        const passwordInput = document.getElementById(inputId);
        const icon = document.querySelector(`[data-target="${inputId}"]`);

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.setAttribute('data-feather', 'eye-off');
        } else {
            passwordInput.type = 'password';
            icon.setAttribute('data-feather', 'eye');
        }
        feather.replace();
    }

    function validatePasswords() {
        if (!registerPassword || !confirmPassword) return true;

        const password = registerPassword.value;
        const confirm = confirmPassword.value;

        if (password && confirm && password !== confirm) {
            passwordError.classList.add('show');
            confirmPassword.style.borderColor = '#dc2626';
            return false;
        } else {
            passwordError.classList.remove('show');
            confirmPassword.style.borderColor = '#fbcfe8';
            return true;
        }
    }

    function setButtonLoading(button, isLoading) {
        const buttonText = button.querySelector('.button-text');
        const loadingSpinner = button.querySelector('.loading-spinner');

        if (isLoading) {
            button.disabled = true;
            if (buttonText) buttonText.style.display = 'none';
            if (loadingSpinner) loadingSpinner.style.display = 'flex';
        } else {
            button.disabled = false;
            if (buttonText) buttonText.style.display = 'block';
            if (loadingSpinner) loadingSpinner.style.display = 'none';
        }
    }

    function showAlert(message, type = 'success') {
        const existingAlert = document.querySelector('.alert-message');
        if (existingAlert) {
            existingAlert.remove();
        }

        // Cria novo alerta
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert-message alert-${type}`;
        alertDiv.innerHTML = `
            <i data-feather="${type === 'success' ? 'check-circle' : 'alert-circle'}" class="w-4 h-4 inline mr-2"></i>
            ${message}
        `;

        const activeForm = document.querySelector('.form.active');
        if (activeForm) {
            activeForm.insertBefore(alertDiv, activeForm.firstChild);
            feather.replace();
        }

        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }

    async function processRegister(formData) {
        try {
            console.log('📤 Enviando cadastro para:', API_URLS.register);
            console.log('📝 Dados:', Object.fromEntries(formData));

            const response = await fetch(API_URLS.register, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Resposta cadastro:', result);

            if (result.success) {
                showAlert('✅ ' + result.message, 'success');
                return true;
            } else {
                showAlert('❌ ' + result.message, 'error');
                return false;
            }

        } catch (error) {
            console.error('❌ Erro no cadastro:', error);
            showAlert('❌ Erro: ' + error.message, 'error');
            return false;
        }
    }

    async function processLogin(formData) {
        try {
            console.log('📤 Enviando login para:', API_URLS.login);
            console.log('📝 Dados:', Object.fromEntries(formData));

            const response = await fetch(API_URLS.login, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Resposta login:', result);

            if (result.success) {
                showAlert('✅ ' + result.message, 'success');

                if (result.user) {
                    localStorage.setItem('userEmail', result.user.email);
                    localStorage.setItem('userName', result.user.nome);
                    localStorage.setItem('userId', result.user.id);
                }

                return true;
            } else {
                showAlert('❌ ' + result.message, 'error');
                return false;
            }

        } catch (error) {
            console.error('❌ Erro no login:', error);
            showAlert('❌ Erro: ' + error.message, 'error');
            return false;
        }
    }

    formTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            switchForm(this.dataset.tab);
        });
    });

    switchFormLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            switchForm(this.dataset.tab);
        });
    });

    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function () {
            const target = this.getAttribute('data-target');
            togglePasswordVisibility(target);
        });
    });

    if (registerPassword && confirmPassword) {
        registerPassword.addEventListener('input', validatePasswords);
        confirmPassword.addEventListener('input', validatePasswords);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (!validatePasswords()) {
                confirmPassword.classList.add('animate-shake');
                setTimeout(() => {
                    confirmPassword.classList.remove('animate-shake');
                }, 500);
                return;
            }

            const submitBtn = this.querySelector('.submit-btn');
            setButtonLoading(submitBtn, true);

            const formData = new FormData(this);
            const success = await processRegister(formData);

            if (success) {
                this.reset();
                setTimeout(() => {
                    switchForm('login');
                }, 2000);
            }

            setButtonLoading(submitBtn, false);
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const submitBtn = this.querySelector('.submit-btn');
            setButtonLoading(submitBtn, true);

            const formData = new FormData(this);
            const success = await processLogin(formData);

            if (success) {
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }

            setButtonLoading(submitBtn, false);
        });
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        .animate-shake {
            animation: shake 0.5s ease-in-out;
        }
        .loading-spinner {
            display: none;
            justify-content: center;
            align-items: center;
        }
        .submit-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none !important;
        }
    `;
    document.head.appendChild(style);
    feather.replace();
});