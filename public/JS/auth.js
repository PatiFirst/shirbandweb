// get product data
db.collection('productDB').get().then(snapshot => {
    setupProduct(snapshot.docs)
})

// get product detail data
function showDetail(id) {
    db.collection('productDB').where(firebase.firestore.FieldPath.documentId(), '==', id).get().then((snapshot)=>{
        setupProductDetail(snapshot.docs)
    })
}

// listen  for auth status change
let userID
auth.onAuthStateChanged(user => {
    if(user){
        userID = user.uid
        setupUI(user)
    }
    else{
        console.log('user logged out')
        setupUI()
    }
})

// register
const regisForm = document.querySelector('#regis-form')
regisForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // get user info
    const email = document.getElementById('regis-email').value
    const password = document.getElementById('regis-password').value
    const repassword = document.getElementById('regis-repassword').value

    // register the user
    if (password == repassword){
        auth.createUserWithEmailAndPassword(email, password)
        .then(cred => {
            return db.collection('userDB').doc(cred.user.uid).set({
                email: email,
                firstname: document.getElementById('firstname').value,
                lastname: document.getElementById('lastname').value,
                address: document.getElementById('address').value,
                phone: document.getElementById('phone').value,
                id: cred.user.uid
            })
        })
        .then(() => {
            setTimeout(() => {
                regisForm.reset()
                loadPage()
            }, 500)
            function loadPage() {
                window.location.reload(true)
            }
        })
        .catch((err) => {
            // console.log(err.message)
            regisForm.querySelector('.error').innerHTML = err.message
        })
    }
    else if (password != repassword){
        alert("Password not match")
    }

})

// log out
const logout = document.querySelector('#logout')
logout.addEventListener('click', (e) => {
    e.preventDefault()
    auth.signOut().then(() => {
        setTimeout(() => {
            loadPage()
        }, 500)
        function loadPage() {
            // window.location.href = '/public/landing.html'
            window.location.reload(true)
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
    const emailAdmin = "admin@mail.com"
    const passAdmin = "admin"

    // check admin
    if(email == emailAdmin && password == passAdmin){
        location.href = "https://projectwebshirband.web.app/admin.html";
    }
    else{
        auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            loginForm.reset();
            setTimeout(() => {
                loadPage()
            }, 500)
            function loadPage() {
                window.location.reload(true)
            }
        })
        .catch((err) => {
            loginForm.querySelector('.error').innerHTML = err.message
        })   
    }
})

//update stock
function updateStock(productId, amount){
    db.collection('productDB').doc(productId).get().then(snapshot => {
        let stock = snapshot.data().productStock

        db.collection('productDB').doc(productId).update({
            productStock: stock - amount
        })
    })
}
// update add stock if clear order
function updateAddstock(id, amount){
    db.collection('productDB').doc(id).get().then(snapshot => {
        let stock = snapshot.data().productStock
        let Numamount = parseInt(amount)
        db.collection('productDB').doc(id).update({
            productStock: stock + Numamount
        })
    })
}

// confirm order
const confirmBtn = document.querySelector('.confirmOrder_btn')
confirmBtn.addEventListener('click', () => {
    const delivery = document.querySelector('input[name="sendDelivery"]:checked')
    const payment = document.querySelector('input[name="HowPayment"]:checked')
    let storage = JSON.parse(localStorage.getItem('cart'))
    if(delivery == null && payment == null){
        alert("Please select your option")
    }
    else if(delivery == null && payment == null && storage == null){
        alert("Please add product to cart and select your option")
        window.location.reload(true)
    }

    else{
        let total = localStorage.getItem('total')
        let userName = localStorage.getItem('name')
        let order = []
        for (let i = 0; i < storage.length; i++) {
            let eachOrder = {
                pdOrderName: storage[i].name,
                pdOrderSize: storage[i].size,
                pdOrderColor: storage[i].color,
                pdOrderImg: storage[i].img,
                pdOrderAmount: storage[i].amount
            }
            order.push(eachOrder)
        }
        db.collection('userDB').doc(userID).collection('orderDB').add({
            pdOrder: order,
            pdOrderDelivery: delivery.value,
            pdOrderPayment: payment.value,
            pdOrderTotal: total,
            pdOrderUserId: userID,
            pdOrderUserName: userName
        }).then(order => {
            alert(`Your Order ID is ${order.id}`)
            setTimeout(() => {
                window.location.reload(true)
            }, 3000)
        })

    }

})

function checkLogin(){
    auth.onAuthStateChanged(user => {
        if(user){
            return
        }
        else{
            alert("Please Login")
            window.location.reload(true)
        }
        
    })
}