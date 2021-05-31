const admin = Vue.createApp({
  data() {
    return { 
      apiUrl:'https://vue3-course-api.hexschool.io',
      apiPath:'bustour',
      currency: "日元",
      products: [],
      addProductFormShow: false,
      editProductFormShow: false,
      tempProduct:{},
      emptyProduct:{
        category: "",
        content: "",
        description: "",
        id: "",
        is_enabled: 1,
        origin_price: 0,
        price: 0,
        title: "",
        unit: "",
        num: 0,
        imageUrl : "",
      }
    }
  },
  methods: {
    getProductAdmin: function(){
      axios.get('https://vue3-course-api.hexschool.io/api/bustour/admin/products/all')
      .then((res) => {
          console.log(res.data)
          if(res.data.success){
            res.data.products.forEach((product) => {
              this.products.push(product)
              console.log(this.products)
            });
          }
      })
      .catch((err) => {
        console.dir(err);
      
      });
    },
    showAddProductForm: function(){
      this.addProductFormShow = true;
      Object.assign(this.tempProduct, this.emptyProduct);
    },
    hideAddProductForm: function(){
      this.addProductFormShow = false;
      this.tempProduct = {};
    },
    addProduct: function(){
      this.tokenToHeader();

			axios.post(`${this.apiUrl}/api/${this.apiPath}/admin/product`, {
				data: {
					title: this.tempProduct.title, 
					category: this.tempProduct.category,
					origin_price: this.tempProduct.origin_price,
					price: this.tempProduct.price,
					unit: this.tempProduct.unit,
					description: this.tempProduct.description,
					content: this.tempProduct.content,
					imageUrl: this.tempProduct.imageUrl,
				}
			})
			.then((res) => {
				console.log(res);
				this.tempProduct = {};
        this.hideAddProductForm();
			})
			.catch((err) => {
				console.log(err.response.data);
			});
    },
    getEditProduct: function(item){
      this.products.forEach((product) => {
        if(product.id === item.id){
          Object.assign(this.tempProduct, product);
        }
      })
      this.editProductFormShow = true;
    },
    clearEditProductForm(){
      this.tempProduct = {};
      this.editProductFormShow = false;
    },
    editProduct: function(){
      console.log(this.tempProduct.id)
      axios.put(`${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`, {
				data: {
					title: this.tempProduct.title, 
					category: this.tempProduct.category,
					origin_price: this.tempProduct.origin_price,
					price: this.tempProduct.price,
					unit: this.tempProduct.unit,
					description: this.tempProduct.description,
					content: this.tempProduct.content,
					imageUrl: this.tempProduct.imageUrl,
				}
			})
			.then((res) => {
				console.log(res);
				this.tempProduct = {};
        this.hideEditProductForm();
			})
			.catch((err) => {
				console.log(JSON.stringify(err))
			});
    },

    deleteProduct: function(productid){
      this.tokenToHeader();
			console.log("delete product: ", productid)
			axios.delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${productid}`)
			.then((res) => {
				console.log(res.data);
			})
			.catch((err) => {
				console.log(err.response.data);
			});
    },
  },
  mounted(){
    let token = document.cookie.replace`(/(?:(?:^|.*;\s*)OnlineBusTour\s*\=\s*([^;]*).*$)|^.*$/, "$1")`;
    axios.defaults.headers.common['Authorization'] = token;
  
    axios.post(`${this.apiUrl}/api/user/check`)
    .then((res) => {
      if(res.data.success){
          console.log(res.data, new Date(expired));
          console.log("check success");          
          this.getProductAdmin();

      } else {
        console.log(res.data);
        console.log("check fail");
      };
    })
    .catch((err) => {
      console.log(err);
    });

  }
})

admin.component('nav-bar',{
  template: `
    <nav>
      <div class="container flex space-between align-items-center">
        <div class="nav-left">
          <button id="logo" class="button-link">Online Bus Tour</button>
        </div>
        <div class="nav-right">
          <ul class="flex">
            <li class="list-style-none py-2">
              <button id="login" class="button-link">後台管理</button>
            </li>
            <li class="list-style-none py-2">
              <button id="logout" class="button-link" @click="adminLogout">登出</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  data(){
    return {

    }
  },
  props: ['apiUrl'],
  methods:{
    adminLogout: function (){
			axios.post(`${this.apiUrl}/logout/`)
			.then((res) => {
				console.log(res.data)
				if(res.data.success){
          document.cookie = `OnlineBusTour = ; expires = ${new Date(1970-1-1)}`;
				}
			})
			.catch((err) => {
				console.log(err.response.data);
			});
    },
  }
})

admin.component('login-admin',{
  template: `
    <div id="admin-login" class="flex flex-direction-column align-items-center">
      <h3 class="text-center mb-2">登入</h3>
      <div class="error-msg"></div>
      <form class="flex flex-direction-column">
          <label for="username">用戶名</label>
          <input id="username" class="mb-2 p-05" name="username" type="email" v-model="logginUser.username">
          <label for="password">密碼</label>
          <input id="password" class="mb-2 p-05" name="password" type="password" v-model="logginUser.password">
          <submit-btn btn-id="submit-login" class="p-05" type="button" btn-name="登入" @click="authLogin"></submit-btn>
      </form>
    </div>
  `,
  data(){
    return {
      logginUser:{
        username:"",
        password:""
      },
    }
  },
  props: ['apiUrl'],
  methods:{
    authLogin: function(){
      console.log("authloggin", this.logginUser)
      axios.post(`${this.apiUrl}/admin/signin`, this.logginUser)
      .then((res) => {
        console.log(res.data);
        if(res.data.success){
          document.cookie = `OnlineBusTour=${res.data.token}; expires=${new Date(res.data.expired)}`;
          console.log("login success", res.data.token, new Date(res.data.expired))
          // window.onload("product.html")
        } 
        if(!res.data.success) {
          console.log("login fail")
        }
      })
      .catch((err) => {
        console.dir(err);
      });
    },
  }
})

admin.component('show-product-admin',{
  template: `
  <h3 class="text-center">後台管理</h3>
  <add-btn btn-Id="add-product-btn" btnName="新增"></add-btn>
  <div id="admin-product" class="flex flex-center" >
    <table>
      <thead>
        <tr>
          <th class="text-center">名稱</th>
          <th class="text-center">說明</th>
          <th class="text-center">圖片</th>
          <th class="text-center">原價</th>
          <th class="text-center">現價</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <template v-for="product in products" :key="product.id">
          <tr>
            <td class="text-center"><h3>{{ product.content }}</h3></td>
            <td class="text-center">{{ product.description }}</td>
            <td class="text-center"><img class="img-sm" :src="product.imageUrl" alt=""></td>
            <td class="text-center">{{ product.origin_price }}{{ currency }}</td>   
            <td class="text-center">{{ product.price }}{{ currency }}</td>
            <td class="text-center"><button value="product.id" class="edit-product" @click="getEditProduct(product)">修改</button></td>     
            <td class="text-center"><button value="product.id" class="delete-product" @click="deleteProduct(product.id)">刪除</button></td>     
          </tr>
        </template> 
      </tbody>
    </table>
  </div>
  
  `,
  data(){
    return {

    }
  },
  props:['products','currency'],
  methods:{
    
  }
})

admin.component('add-product',{
  template: `
  `,
  data(){
    return {

    }
  },
  props:[],
  methods:{

  }
})

admin.component('edit-product',{
  template: ``,
  data(){
    return {

    }
  },
  props:[],
  methods:{

  }
})

admin.component('delete-product',{
  template: ``,
  data(){
    return {

    }
  },
  props:[],
  methods:{

  }
})

admin.component('submit-btn',{
  template: `
    <button :id="btnId" class="p-05" type="button"> {{ btnName }} </button>
  `,
  data(){
    return {

    }
  },
  props:['btnId', 'btnName'],
  methods:{

  }
})

admin.component('cancel-btn',{
  template: ``,
  data(){
    return {

    }
  },
  props:[],
  methods:{

  }
})

admin.component('add-btn',{
  template: `
    <button id="btnId" class="mb-2" type="button" @click="check"> {{ btnName }} </button>
  `,
  data(){
    return {

    }
  },
  props:['btnId', 'btnName'],
  methods:{
    check: function(){
      console.log(new Date());
    }
  }
})

admin.component('edit-btn',{
  template: ``,
  data(){
    return {

    }
  },
  props:[],
  methods:{

  }
})

admin.component('delete-btn',{
  template: ``,
  data(){
    return {

    }
  },
  props:[],
  methods:{

  }
})



admin.mount('#admin')