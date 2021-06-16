// register
const regisForm = document.querySelector('#regis-form')
regisForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // get user info
    const email = document.getElementById('regis-email').value
    const password = document.getElementById('regis-password').value

    // register the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        setTimeout(() => {
            loadPage()
        }, 500)
        function loadPage() {

            window.location.href = '/public/index.html'
        }
    })

})

// log in
const loginForm = document.querySelector('#login-form')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    
    // get user info
    const email = document.getElementById('login-email').value
    const password = document.getElementById('login-password').value

    auth.signInWithEmailAndPassword(email, password).then(() => {
        loginForm.reset();
        setTimeout(() => {
            loadPage()
        }, 500)
        function loadPage() {
            window.location.href = '/public/index.html'
        }
    })
})