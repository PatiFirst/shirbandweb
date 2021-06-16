window.onload = localStorage.clear('cart')
const cartNum = document.querySelector('#cart_n')
cartNum.innerHTML = "0"
const subTotal = document.querySelector('#cart-subtotal')
const Total = document.querySelector('#cart-total')
subTotal.innerHTML = "0"
Total.innerHTML = "0"
const cartItems = []
const CRText = document.querySelector('#confirm-text')
CRText.innerHTML = "Try Again"

// setup Product Detail modal / Add Cart
const setupProductDetail = (data) => {
    const modalBody = document.querySelector('.prode-container')
    
    // show Product Detail Modal
    let html = ''
    data.forEach(doc => {
        const product = doc.data()

        // check product detail
        const pdDetailCheck = () => {
            if(product.productDetail){
                productDetail = product.productDetail
            }
            else{
                productDetail = ''
            }
        }
        pdDetailCheck()

        let modal = `
        <!-- Photo -->
        <div class="col-12 col-lg-5 prode_left">
            <div id="show-img">
                <img src="${product.productImg}" class="d-block prode_img">
            </div>
        </div>
        <!-- Detail -->
        <div class="col-12 col-lg-6">
            <h3 class="prode_title mb-4" id="prode-name">${product.productName}</h3>
            <p class="mb-4" id="prode-price">${product.price} &#3647;</p>

            <!-- Form -->
            <form id="prodetail-form" action="addCart()">
                <div class="row align-items-start mb-5">
                    <div class="col-3">
                        <label for="size" class="form-label">Size</label>
                        <select class="form-select" id="prod-size" required>

                        </select>
                    </div>
                    <div class="col-3">
                        <label for="color" class="form-label">Color</label>
                        <select class="form-select" id="prod-color" required>

                        </select>
                    </div>
                    <div class="col-3">
                        <label for="prode-amount" class="form-label">Amount</label>
                        <input type="number" name="amount" id="prode-amount" class="form-control"
                            min="1" value="" required>
                        <p class="form-text">In stock : <span>${product.productStock}</span></p>
                    </div>
                    <div class="col-3 align-self-center">
                        <input type="submit" class="btn btn-warning btn_addcart" value="Add to Cart" data-bs-toggle="modal" data-bs-target="#confirmCartModal">
                    </div>
                </div>
            </form>
            <h5 class="mb-2">Product Detail</h5>
            <p class="lead" id="prode-detail">
            ${productDetail}
            </p>
        </div>
        `
        html += modal
    })
    modalBody.innerHTML = html


    // show Image / select-option / Stock
    const selectSize = document.querySelector('#prod-size')
    const selectColor = document.querySelector('#prod-color')
    const Amount = document.querySelector('#prode-amount')
    let optionSize = `<option selected disabled value="">Size</option>`
    let optionColor = `<option selected disabled value="">Color</option>`
    data.forEach((doc) => {
        const product = doc.data()

        // loop of Size option
        for (let i = 0; i < product.productSize.length; i++) {
            let eachSize = `<option value="${product.productSize[i]}">${product.productSize[i]}</option>`
            optionSize += eachSize
        }

        // loop of Color option
        for (let i = 0; i < product.productColor.length; i++) {
            let eachColor = `<option value="${product.productColor[i]}">${product.productColor[i]}</option>`
            optionColor += eachColor
        }

        // set Amount
        Amount.setAttribute('max', product.productStock)
    })
    selectSize.innerHTML = optionSize
    selectColor.innerHTML = optionColor

    // Add to Cart
    const addCartForm = document.querySelector('#prodetail-form')
    checkLogin()
    addCartForm.addEventListener('submit', (e) => {
        e.preventDefault()

        const size = document.querySelector('#prod-size').value
        const color = document.querySelector('#prod-color').value
        const amount = document.querySelector('#prode-amount').value
        let id, img, name, price, subtotal
        data.forEach((doc) => {
            const product = doc.data()
            id = doc.id
            img = product.productImg
            name = product.productName
            price = product.price
            subtotal = price * amount
        })

        let item = {
            id: id,
            name: name,
            img: img,
            size: size,
            color: color,
            amount: amount,
            price: price,
            subtotal: subtotal
        }
        cartItems.push(item)
        if(cartItems){
            CRText.innerHTML = "Add to Cart Complete"
            addCart(cartItems)
        }
        updateStock(id, amount)
    })
}


// ----------------------------------------------------------------------------------------------------------------

// Cart Modal
function addCart(doc) {
    localStorage.setItem('cart', JSON.stringify(doc))

    let cart = JSON.parse(localStorage.getItem('cart'))
    cartNum.innerHTML = cart.length

    // setup Table
    const cartTable = document.querySelector('#cartTable')
    let html = ''
    let cost = 0
    for (let i = 0; i < cart.length; i++) {
        let content = `

            <tr>
                <th scope="row" id="${i+1}">${i+1}</th>
                <td>
                    <div class="row d-flex flex-wrap justify-content-around">
                        <div class="col-12 col-lg-3">
                            <img src="${cart[i].img}" id="cart-img" alt="">
                        </div>
                        <div class="col-12 col-lg-5 text-center text-lg-start">
                            <p class="my-2" id="cart-name">${cart[i].name}</p>
                            <p>Size: <span id="cart-size">${cart[i].size}</span></p>
                            <p>Color: <span id="cart-color">${cart[i].color}</span></p>
                            <p>Price: <span id="cart-price">${cart[i].price}</span> &#3647;</p>
                        </div>
                    </div>
                </td>
                <td>
                    <p id="cart-amount">${cart[i].amount}</p>
                </td>
                <td>
                    <p><span id="cart-price">${cart[i].subtotal}</span> &#3647;</p>
                </td>
            </tr>
        `
        html += content

        cost += cart[i].subtotal
    }
    cartTable.innerHTML = html
    subTotal.innerHTML = cost
    Total.innerHTML = cost
    localStorage.setItem('total', cost)

    // clean order
    const cleanBtn = document.querySelector('.clean_btn')
    cleanBtn.addEventListener('click', () => {
        let id, amount
        for (let i = 0; i < cart.length; i++) {
            id = cart[i].id
            amount = cart[i].amount
        }
        localStorage.clear('cart')
        updateAddstock(id, amount)
        window.location.reload(true)
    })
}


//------------------------------------------------------------------------------------------------------------------------

// setup UI
const setupUI = (user) => {
    const loginBtn = document.querySelector('.btn_loginnav')
    const profileBtn = document.querySelector('.profile_nav')
    const cartBtn = document.querySelector('.cart_nav')
    const logoutBtn = document.querySelector('.btn_logoutnav')
    const profileName =  document.querySelector('#profile-name')
    if(user){
        // profile name
        db.collection('userDB').doc(user.uid).get().then(doc => {
            profileName.innerHTML = doc.data().firstname
            localStorage.setItem('name', doc.data().firstname)
        })
        // toggle UI element
        loginBtn.style.display = 'none'
        profileBtn.style.display = 'block'
        cartBtn.style.display = 'block'
        logoutBtn.style.display = 'block'

        // set Original Profile Form
        db.collection('userDB').doc(user.uid).get().then(doc => {
            document.querySelector('#prof-firstname').innerHTML =  doc.data().firstname
            document.querySelector('#cart-firstname').innerHTML =  doc.data().firstname
            document.querySelector('#prof-lastname').innerHTML =  doc.data().lastname
            document.querySelector('#cart-lastname').innerHTML =  doc.data().lastname
            document.querySelector('#prof-email').innerHTML =  doc.data().email
            document.querySelector('#prof-address').innerHTML =  doc.data().address
            document.querySelector('#cart-address').innerHTML =  doc.data().address
            document.querySelector('#prof-phone').innerHTML =  doc.data().phone
            document.querySelector('#cart-phone').innerHTML =  doc.data().phone
        })
        
    }
    else{
         // toggle UI element
        loginBtn.style.display = 'block'
        profileBtn.style.display = 'none'
        cartBtn.style.display = 'none'
        logoutBtn.style.display = 'none'
    }
}

/* ==== Show Scroll Top ==== */
const scrollY = window.pageYOffset
function scrollTop() {
    const scrollTop = document.getElementById("scroll-top")

    if(this.scrollY >= 100){
        scrollTop.classList.add("show-scroll")
    }
    else{
        scrollTop.classList.remove('show-scroll')   
    }
}
window.addEventListener("scroll", scrollTop)

// ---------------------------------------------------------------------------------------------------------------------

// setup Product Show
const setupProduct = (data) => {
    const productEach = document.querySelector('.product_each')
        let html = ''
    data.forEach(doc => {
        const product = doc.data()
        const productId = doc.id
        const pdDetailCheck = () => {
            if(product.productDetail){
                productDetail = product.productDetail
            }
            else{
                productDetail = ''
            }
        }
        pdDetailCheck()
        const card = `
        <div class="card p-0 my-2 bg-light product_box mix ${product.productType}">
            <a href="#productModal" data-bs-toggle="modal" id="${productId}" onclick="showDetail(this.id)">
                <div class="product_img">
                    <img src="${product.productImg}" alt="">
                </div>
            </a>
            <div class="card-body p-3 row justify-content-between product_data">
                <div class="col-8">
                    <h4 class="card-title product_title">${product.productName}</h4>
                    <p class="lead product_detail">
                        ${productDetail}
                    </p>
                </div>
                <div class="col-4">
                    <p class="price">${product.price} &#3647;</p>
                </div>
            </div>
        </div>
        `
        html += card
    })

    productEach.innerHTML = html

    /*==== MixItUp Filter */
    const mixer = mixitup('.product_container', {
        selectors: {
            target: '.product_box'
        },
        animation: {
            duration: 400
        }
    });

    const linkProduct = document.querySelectorAll('.product_item')
    function activeProduct() {
        if(linkProduct){
            linkProduct.forEach(l => l.classList.remove('active'))
            this.classList.add('active')
        }
    }
    linkProduct.forEach(l => l.addEventListener('click', activeProduct))
}
//-----------------------------------------------------------------------------------------------------------------
