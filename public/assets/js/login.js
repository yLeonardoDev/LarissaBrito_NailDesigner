// Funcionalidades para login/cadastro

document.addEventListener('DOMContentLoaded', function () {
    const formTabs = document.querySelectorAll('.form-tab');
    const forms = document.querySelectorAll('.form');
    const switchFormLinks = document.querySelectorAll('.switch-form');
    const passwordToggles = document.querySelectorAll('.password-toggle');
    const registerForm = document.getElementById('registerForm');
    const registerPassword = document.getElementById('registerPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const passwordError = document.getElementById('passwordError');

    function switchForm(formType) {

        formTabs.forEach(tab => {
            if (tab.dataset.tab === formType) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        forms.forEach(form => {
            if (form.id === formType + 'Form') {
                form.classList.add('active');
            } else {
                form.classList.remove('active');
            }
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
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!validatePasswords()) {
                confirmPassword.classList.add('animate-shake');
                setTimeout(() => {
                    confirmPassword.classList.remove('animate-shake');
                }, 500);
                return;
            }

            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Conta criada!';
            submitBtn.classList.add('animate-success');
            submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.classList.remove('animate-success');
                submitBtn.style.background = 'linear-gradient(135deg, #ec4899, #db2777)';
                switchForm('login');
            }, 2000);
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Entrando...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.textContent = 'Login realizado!';
                submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }, 1500);
        });
    }

    // Inicialização
    feather.replace();
});