// add product
const addProductForm = document.querySelector('#addproductForm')


addProductForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    
    const type = document.querySelector('#addCollection').value
    const name = document.querySelector('#addproduct-name').value
    const detail = document.querySelector('#addproduct-detail').value
    const price = document.querySelector('#addproduct-price').value
    const stock = document.querySelector('#addproduct-stock').value
    let size = []
    let sizebox = document.getElementsByName('addProductSize')
    for(var checkbox of sizebox){
        if(checkbox.checked){
            size.push(checkbox.value)
        }
    }
    let color = []
    let colorbox = document.getElementsByName('addproductColor')
    for(var checkbox of colorbox){
        if(checkbox.checked){
            color.push(checkbox.value)
        }
    }

    db.collection('productDB').add({
        productType: type,
        productName: name,
        productDetail: detail,
        productSize: size,
        productColor: color,
        price: price,
        productStock: stock,
        productImg: "no"
    }).then((docRef)=>{
        uploadImg(docRef.id)
        setTimeout(() => {
            alert('Add product Complete')
            window.location.reload(true)
        }, 5000)
    })
})

function uploadImg(id){
    const ref = firebase.storage().ref()
    const image = document.querySelector('#addproduct-img').files[0]
    
    const name = new Date() + '-' + image.name

    const metadata = {
        contentType: image.type
    }
    const task = ref.child(name).put(image, metadata)

    task
    .then(snapshot => snapshot.ref.getDownloadURL())
    .then(url => {
        db.collection('productDB').doc(id).update({
            productImg: url
        })
        console.log("OK")
    })
}



const productBtn = document.querySelector('.product_btn')
const orderBtn = document.querySelector('.order_btn')
const mainCon = document.querySelector('.main')

function checkProfile(id){
    db.collection('userDB').where(firebase.firestore.FieldPath.documentId(), '==', id).get().then((user) => {
        showProfile(user.docs)
    })
}

function showProfile(data) {
    const name = document.querySelector('#proname')
    const address = document.querySelector('#address')
    const phone = document.querySelector('#phone')
    const email = document.querySelector('#email')
    data.forEach((doc) =>{
        const user = doc.data()
        name.innerHTML = user.firstname
        address.innerHTML = user.address
        phone.innerHTML = user.phone
        email.innerHTML = user.email
    })
}

function checkRemove(id){
    db.collection('productDB').doc(id).delete()
    setTimeout(() => {
        alert('Remove Complete')
        window.location.reload(true)
    }, 3000)
}

function checkOrder(id){
    db.collection('userDB').doc(id).collection('orderDB').get().then((user) => {
        showOrder(user.docs)
    })
}

function showOrder(data) {
    const orderInfo = document.querySelector('#myBody')
    let html = ''
    data.forEach((doc) => {   
        const order = doc.data()
        const pdOrder = order.pdOrder
        for (let i = 0; i < pdOrder.length; i++) {
            let body = `
                <tr>
                    <th scope="row">${i+1}</th>
                    <td>
                        <div class="row justify-content-around d-flex flex-wrap" >
                            <div class="col-12 col-lg-5">
                                <img src="${order.pdOrder[i].pdOrderImg}" id="product-img">
                            </div>
                            <div class="col-12 col-lg-3 text-center text-lg-start ">
                                <p class="my-2" id="product-name">${order.pdOrder[i].pdOrderName}</p>
                            </div>
                    </td>
                    <td>
                        <span>${order.pdOrder[i].pdOrderSize}</span>
                    </td>
                    <td>
                    <span id="product-color">${order.pdOrder[i].pdOrderColor} </span>
                    </td>
                    <td>
                        <span id="product-price">${order.pdOrder[i].pdOrderAmount}</span>
                    </td>
    
                </tr>
            `
            html += body
        }
    })
    // console.log(html)
    orderInfo.innerHTML = html
}



// setup Product content
productBtn.addEventListener('click', (e) => {
    e.preventDefault()
    // setup Product content
    db.collection('productDB').get().then(snapshot => {
        setupProduct(snapshot.docs)
    })


    // show Head Product Table
    let productMain = `
    <div id="product" class="product">
        <div class="d-flex flex-wrap justify-content-end align-items-center my-5 me-3">
            <h1 class="fw-bold me-3">Product</h1>
            <a href="#addProductModal" role="button" class="btn btn-success" data-bs-toggle="modal">Add
                Product</a>
        </div>

        <table class="table table-hover text-center">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Product</th>
                    <th scope="col">Price</th>
                    <th scope="col">Status</th>
                    <th scope="col">Remove</th>
                </tr>
            </thead>
            <tbody id="myTable">

            </tbody>

        </table>
    </div>
    `
    mainCon.innerHTML = productMain
    
    // show Body of Product table
    const setupProduct = (data => {
        const tBody = document.querySelector('#myTable')
        let body = ''

        data.forEach((doc,index) =>{
            const product = doc.data()
            const productId = doc.id
            const content = `
            <tr id="${productId}">
                <th scope="row">${index+1}</th>
                <td>
                    <div class="row justify-content-around d-flex flex-wrap" >
                        <div class="col-12 col-lg-3">
                            <img src="${product.productImg}" id="product-img">
                        </div>
                        <div class="col-12 col-lg-5 text-center text-lg-start ">
                            <p class="my-2" id="product-name">${product.productName}</p>
                            <p class="my-2" id="product-size">
                                Size :
                                <span>${product.productSize}</span>
                            </p>
                            <p class="my-2" >
                                Color :
                                <span id="product-color">${product.productColor} </span>
                            </p>
                        </div>
                    </div>
                </td>
                <td>
                    <span id="product-price">${product.price}</span> &#3647;
                </td>
                <td>
                    <p id="product-status">In stock: ${product.productStock}</p>
                </td>
                <td>
                    <p role="button" class="btn btn-sm btn-danger removeProduct" id="${productId}" onclick="checkRemove(this.id)">X</p>

                </td>
            </tr>
            `  
            body += content
        })
        tBody.innerHTML = body
    })
})


// setup Order content
orderBtn.addEventListener('click', (e) => {
    e.preventDefault()

    db.collection('userDB').get().then((user) => {
        setupUserData(user.docs)
    })

    // show Head Order Table
    let orderMain = `
        <div id="order" class="order">
            <h1 class="text-end fw-bold mt-5 me-5">Order</h1>

            <table class="table table-hover text-center">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Order in cart</th>
                        <th scope="col">Total</th>
                        <th scope="col">Delivery / Payment</th>
                    </tr>
                </thead>

                <tbody id="myTable">
                    
                    
                </tbody>

            </table>
        </div>
    `
    mainCon.innerHTML = orderMain

    // show Body of Order table
    const setupUserData = (data => {
        const tBody = document.querySelector('#myTable')
        let body = ''
        data.forEach((doc) =>{
            let userID = doc.id

            db.collection('userDB').doc(userID).collection('orderDB').get().then((order) => {
                setupOrder(order.docs)
            }) 
        })

        const setupOrder = (data) => {
            data.forEach((doc, index)=>{
                const order = doc.data()
                const cart = order.pdOrder.length
                    const content = `
                        <tr>
                        <th scope="row">${index+1}</th>
                            <td>
                            <a href="#profileModal" data-bs-toggle="modal" class="profile" id="${order.pdOrderUserId}" onclick="checkProfile(this.id)">${order.pdOrderUserName}</a>
                            </td>
                            <td>
                            <a href="#orderModal" data-bs-toggle="modal" id="${order.pdOrderUserId}" onclick="checkOrder(this.id)"><span class="order-cart">${cart}</span></a>
                            </td>
                            <td>
                            <span id="order-price">${order.pdOrderTotal}</span> &#3647;
                            </td>
                            <td>
                                <p>Delivery: <span id="order-delivery">${order.pdOrderDelivery}</span></p>
                                <p>Payment: <span id="order-payment">${order.pdOrderPayment}</span></p>
                            <td>
                        </tr>
                    `
                    body += content

                
            })
            tBody.innerHTML = body
        }
    })
            
    

})


// active of nav-link button
const linkProduct = document.querySelectorAll('.nav-link')
function activeProduct() {
    if(linkProduct){
        linkProduct.forEach(l => l.classList.remove('active'))
        this.classList.add('active')
    }
}
linkProduct.forEach(l => l.addEventListener('click', activeProduct))

// ----------------------------------------------------------------------------------------------------------------------------------
const logoutBtn = document.querySelector('.btn-logout')
logoutBtn.addEventListener('click', () => {

    location.href = "https://projectwebshirband.web.app/home.html";
})