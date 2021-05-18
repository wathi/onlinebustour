const app = {
    apiUrl:'https://vue3-course-api.hexschool.io',
    apiPath:'bustour',
    str:"",
    currency: "日元",
    getProduct: function(){
        this.clear();
        axios.get(`${this.apiUrl}/api/${this.apiPath}/products/`)
        .then((res) => {
            this.str += `  
                <h3 class="text-center">旅遊計劃</h3>
                <div id="show-product" class="flex">
            `; 
            res.data.products.forEach((product) => {
                this.str += `
                  <div class="py-2">
                    <img class="img-md" src="${product.imageUrl}" alt="">
                    <h3>${product.content}</h3>
                    <p>價格: ${product.origin_price}${this.currency}</p>
                  </div>
                `
              });
            this.str += `  
                </div>
            `; 
           this.render();
        })
        .catch((err) => {
          console.log(err.response.data);
					this.error();
        
        });
    },
    checkLogin: function(){
        let token = document.cookie.replace(/(?:(?:^|.*;\s*)OnlineBusTour\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = token;
      
        axios.post(`${this.apiUrl}/api/user/check`)
        .then((res) => {
          if(res.data.success){
              console.log(res.data);
              console.log("check success");
            this.getProductAdmin();
          } else {
            console.log(res.data);
            console.log("check fail");
            this.showAdminLogin();
          };
        })
        .catch((err) => {
          console.log(err);
        });
    },
    showAdminLogin: function(){
        this.clear();
        this.str = `
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
        this.render();
        const submitLoginBtn = document.getElementById('submit-login');    
        submitLoginBtn.addEventListener('click', (e) => {
        this.authLogin();
      });
    },
    authLogin: function(){
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        axios.post(`${this.apiUrl}/admin/signin/`, { username, password })
        .then((res) => {
          console.log(res.data);
          if(res.data.success){
            document.cookie = `OnlineBusTour=${res.data.token}; expires=${new Date(res.data.expired)}`;
            this.getProductAdmin();
            console.log("login success")
          } 
          if(!res.data.success) {
            this.showAdminLogin();
            console.log("login fail")
          }
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    },
    getProductAdmin: function(){
        this.clear();
        axios.get(`${this.apiUrl}/api/${this.apiPath}/admin/products/`)
        .then((res) => {
            this.str += `              
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
                  `;
            res.data.products.forEach((product) => {
                this.str += `
                <tr>
                    <td class="text-center"><h3>${product.content}</h3></td>
                    <td class="text-center"></td>
                    <td class="text-center"><img class="img-sm" src="${product.imageUrl}" alt=""></td>
                    <td class="text-center">${product.origin_price}${this.currency}</td>   
                    <td class="text-center"></td>
                    <td class="text-center"><button value="${product.id}" class="edit-product">Edit</button></td>     
                    <td class="text-center"><button value="${product.id}" class="delete-product">Delete</button></td>     
                </tr>    
                `
              });
              this.str += `
                </table>        
              </div>
              `;
            this.render();

						const addProductBtn = document.getElementById('add-product');
						addProductBtn.addEventListener('click', (e) => {
							this.showAddProductForm();
						})

						const deleteProductBtn = document.querySelectorAll('.delete-product');
						const deleteProductBtnArr = Array.prototype.slice.call(deleteProductBtn);
						deleteProductBtnArr.forEach((item) => {
							item.addEventListener('click', () => {
								this.deleteProduct(item.value);
							})
						})

        })
        .catch((err) => {
          console.log(err);
        });

    },
    showAddProductForm: function(){
			this.clear();
			this.str += `
				<div class="flex flex-direction-column align-items-center">
					<h3 class="text-center mb-2">新增產品</h3>
					<div class="error-msg"></div>
					<form class="flex flex-direction-column">
						<label for="title">標題</label>
						<input id="title" class="mb-2 p-05" name="title" type="text" required>
						<label for="category">分類</label>
						<input id="category" class="mb-2 p-05" name="category" type="text" required>
						<label for="unit">單位</label>
						<input id="unit" class="mb-2 p-05" name="unit" type="text">
						<label for="origin_price">原價</label>
						<input id="origin_price" class="mb-2 p-05" name="origin_price" type="number" required>
						<label for="price">現價</label>
						<input id="price" class="mb-2 p-05" name="price" type="number">
						<label for="description">說明</label>
						<input id="description" class="mb-2 p-05" name="description" type="text" required>
						<label for="content">內容</label>
						<input id="content" class="mb-2 p-05" name="content" type="text" required>
						<label for="imageUrl">圖片地址</label>
						<input id="imageUrl" class="mb-2 p-05" name="imageUrl" type="url">
						<button id="add" class="p-05" type="button">確定</button>
					</form>
				</div>
			`;
			this.render();
			const addBtn = document.getElementById('add');
			addBtn.addEventListener('click', (e) => {
				this.addProduct();
			})	
    },
		addProduct: function(){
			const title = document.getElementById('title').value;
			const category = document.getElementById('category').value;
			const unit = document.getElementById('unit').value;
			const origin_price = parseInt(document.getElementById('origin_price').value) ;
			const price = parseInt(document.getElementById('price').value);
			const description = document.getElementById('description').value;
			const content = document.getElementById('content').value;
			const imageUrl = document.getElementById('imageUrl').value;
			
			axios.post(`${this.apiUrl}/api/${this.apiPath}/admin/product/`, {
				"data": {
					"title": title, 
					"category": category,
					"origin_price": origin_price,
					"price": price,
					"unit": unit,
					"description": description,
					"content": content,
					"imageUrl": imageUrl,
				}
			})
			.then((res) => {
				console.log(res.data);
				this.getProductAdmin();
			})
			.catch((err) => {
				console.log(err.response.data);
			});
		},
    editProduct: function(){
			//
    },
    deleteProduct: function(productid){
			console.log("delete product: ", productid)
			axios.delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${productid}`)
			.then((res) => {
				console.log(res.data);
				this.getProductAdmin();
			})
			.catch((err) => {
				console.log(err.response.data);
			});
    },
    adminLogout: function (){
			axios.post(`${this.apiUrl}/logout/`)
			.then((res) => {
				console.log(res.data)
				if(res.data.success){
					this.showAdminLogin();
				}
			})
			.catch((err) => {
				console.log(err.response.data);
			});
    },
    clear: function (){
        this.str = "";
    },
    error: function (){
			this.str = `
				<div class="text-center error-msg">
					<h3>出現錯誤</h3>
				</div>
			`;
			this.render();
    },
    render: function() {
        document.getElementById('app').innerHTML = `${this.str}`;  
    },
    firstRender: function() {
        const logoBtn = document.getElementById('logo');
        const loginBtn = document.getElementById('login');
        const logoutBtn = document.getElementById('logout');

        logoBtn.addEventListener('click', (e) => {
            this.getProduct();
        });

        loginBtn.addEventListener('click', (e) => {
            this.clear();
            this.checkLogin();
        });
          
        logoutBtn.addEventListener('click', (e) => {
            this.adminLogout();
        });

        this.getProduct();
    }    
}

app.firstRender();



