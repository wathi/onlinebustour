const app = document.getElementById('app');
const logoBtn = document.getElementById('logo');
const loginBtn = document.getElementById('login');
const registerBtn = document.getElementById('register');
const logoutBtn = document.getElementById('logout');

logoBtn.addEventListener('click', (e) => {
  showProductPage();
});

loginBtn.addEventListener('click', (e) => {
  clear();
  login();
});

logoutBtn.addEventListener('click', (e) => {
  logout();
});

// Api Info
const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'bustour';

// No auth show all products
const showProductPage = () => {
  axios.get(`${apiUrl}/api/${apiPath}/products/`)
  .then(function (res) {
    console.log(res.data.products);
    showProduct(res.data.products);
  })
  .catch(function (err) {
    console.log(err);
    apiError();
  });
}

//Show Product as card
const showProduct = (products) => {
  let list = '';
  const currency = "日元";
  products.forEach((product) => {
    list += `
      <div class="py-2">
        <img class="img-md" src="${product.imageUrl}" alt="">
        <h3>${product.content}</h3>
        <p>價格: ${product.origin_price}${currency}</p>
      </div>
    `
  });
  document.getElementById('app').innerHTML = `
  <h3 class="text-center">旅遊計劃</h3>
  <div id="show-product" class="flex">
    ${list}
  </div>
  `;
}

//Login
const login = () => {
  let token = document.cookie.replace(/(?:(?:^|.*;\s*)OnlineBusTour\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  axios.defaults.headers.common['Authorization'] = token;

  axios.post(`${apiUrl}/api/user/check`)
  .then((res) => {
    if(res.data.success){
      showBackendPage();
    } else {
      showLoginPage();
    };
  })
  .catch((err) => {
    console.log(err);
  });
}

// Draw Login Page
const showLoginPage = () => {
  app.innerHTML = `
    <div class="flex flex-direction-column align-items-center">
      <h3 class="text-center mb-2">登入</h3>
      <div class="error-msg"></div>
      <form class="flex flex-direction-column">
        <label for="username">Username</label>
        <input id="username" class="mb-2 p-05" name="username" type="email">
        <label for="password">Password</label>
        <input id="password" class="mb-2 p-05" name="password" type="password">
        <button id="submit-login" class="p-05" type="button">登入</button>
      </form>
    </div>
  `;

  const submitLoginBtn = document.getElementById('submit-login');

  submitLoginBtn.addEventListener('click', (e) => {
    authLogin();
  });
}

//Auth Login username and password
const authLogin = () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  axios.post(`${apiUrl}/admin/signin/`, { username, password })
  .then((res) => {
    console.log(res);
    if(res.data.success){
      showBackendPage();
      document.cookie = `OnlineBusTour=${res.data.token}; expires=${new Date(res.data.expired)}`;
    }
  })
  .catch((err) => {
    console.log(err.response.data);
  });
}

//Get Product by API if logged in
const showBackendPage = () => {
  axios.get(`${apiUrl}/api/${apiPath}/admin/products/`)
  .then((res) => {
    showBackendList(res.data.products);
  })
  .catch((err) => {
    console.log(err);
    apiError();
  });
}

//Show product as list with edit and delete button
const showBackendList = (products) => {
  let list = '';
  const currency = "日元";
  products.forEach((product) => {
    list += `
    <tr>
        <td class="text-center"><h3>${product.content}</h3></td>
        <td class="text-center"></td>
        <td class="text-center"><img class="img-sm" src="${product.imageUrl}" alt=""></td>
        <td class="text-center">${product.origin_price}${currency}</td>   
        <td class="text-center"></td>
        <td class="text-center"><button value="${product.id}" class="edit-product">Edit</button></td>     
        <td class="text-center"><button value="${product.id}" class="delete-product">Delete</button></td>     
    </tr>    
    `
  });
  app.innerHTML = `
  <h3 class="text-center">後台管理</h3>
  <div id="backend">
    <button id="add-product" class="mb-2" type="button">新增</button>
    <table>
        <tr>
          <th class="text-center">名稱</th>
          <th class="text-center">說明</th>
          <th class="text-center">圖片</th>
          <th class="text-center">原價</th>
          <th class="text-center">現價</th>
          <th></th>
          <th></th>
        </tr>
        ${list}
    </table>        
  </div>
  `;

  const addProductBtn = document.getElementById('add-product');
  addProductBtn.addEventListener('click', (e) => {
    addProductPage();
  })



const addProductPage = () => {
  console.log("add product");
  let str = '';
  app.innerHTML = `
    <div class="flex flex-direction-column align-items-center">
      <h3 class="text-center mb-2">新增產品</h3>
      <div class="error-msg"></div>
      <form class="flex flex-direction-column">
        <label for="title">title</label>
        <input id="title" class="mb-2 p-05" name="title" type="text" required>
        <label for="category">category</label>
        <input id="category" class="mb-2 p-05" name="category" type="text" required>
        <label for="unit">unit</label>
        <input id="unit" class="mb-2 p-05" name="unit" type="text">
        <label for="origin_price">origin_price</label>
        <input id="origin_price" class="mb-2 p-05" name="origin_price" type="number" required>
        <label for="price">price</label>
        <input id="price" class="mb-2 p-05" name="price" type="number">
        <label for="description">description</label>
        <input id="description" class="mb-2 p-05" name="description" type="text" required>
        <label for="content">content</label>
        <input id="content" class="mb-2 p-05" name="content" type="text" required>
        <label for="imageUrl">imageUrl</label>
        <input id="imageUrl" class="mb-2 p-05" name="imageUrl" type="url">
        <button id="add" class="p-05" type="button">確定</button>
      </form>
    </div>
  `;

  const addBtn = document.getElementById('add');
  addBtn.addEventListener('click', (e) => {
    addProduct();
  })

}

const addProduct = () => {
  const title = document.getElementById('title').value;
  const category = document.getElementById('category').value;
  const unit = document.getElementById('unit').value;
  const origin_price = parseInt(document.getElementById('origin_price').value) ;
  const price = parseInt(document.getElementById('price').value);
  const description = document.getElementById('description').value;
  const content = document.getElementById('content').value;
  const imageUrl = document.getElementById('imageUrl').value;
  
  axios.post(`${apiUrl}/api/${apiPath}/admin/product/`, {
  "data": {
    "title": title, 
    "category": category,
    "origin_price": origin_price,
    "price": price,
    "unit": unit,
  }
})
  .then((res) => {
    console.log(res);
    showBackendPage();
  })
  .catch((err) => {
    console.log(err);
  });
}

const editProduct = () => {
  //
}

const deleteProductBtn = document.querySelectorAll('.delete-product');
  const deleteProductBtnArr = Array.prototype.slice.call(deleteProductBtn);
  deleteProductBtnArr.forEach((item) => {
    item.addEventListener('click', () => {
      deleteProduct(item.value);
    })
  })
}

const deleteProduct = (productid) => {
  console.log("delete product: ", productid)
  axios.delete(`${apiUrl}/api/${apiPath}/admin/product/${productid}`)
  .then((res) => {
    console.log(res);
    showBackendPage();
  })
  .catch((err) => {
    console.log(err);
  });
}

const logout = () => {
  axios.post(`${apiUrl}/logout/`)
  .then((res) => {
    showLoginPage();
  })
  .catch((err) => {
    console.log(err);
  });
  
}

//Show error message if cannot get any content
const apiError = () => {
  app.innerHTML = `
  <h3 class="text-center">無法顯示內容</h3>
  `;      
}

//Clear everything in #app
const clear = () => {
  app.innerText = "";
}

//run by default
showProductPage();

