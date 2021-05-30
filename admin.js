const admin = Vue.createApp({
  data() {
    return { 
      apiUrl:'https://vue3-course-api.hexschool.io',
      apiPath:'bustour',
      // cookiename: "OnlineBusTour",
      currency: "日元",
      products: [],
      isLoggedIn: false,
      addProductFormShow: false,
      editProductFormShow: false,
      logginUser:{},
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

    authLogin: function(){
      console.log("authloggin", this.logginUser)
      axios.post(`${this.apiUrl}/admin/signin`, this.logginUser)
      .then((res) => {
        console.log(res.data);
        if(res.data.success){
          document.cookie = `OnlineBusTour=${res.data.token}; expires=${new Date(res.data.expired)}`;
          this.isLoggedIn = true;
          this.getProductAdmin();
          console.log("login success")
        } 
        if(!res.data.success) {
          this.isLoggedIn = false;
          console.log("login fail")
        }
      })
      .catch((err) => {
        console.log(err.response.data);
      });
    },
    getProductAdmin: function(){
      axios.get(`${this.apiUrl}/api/${this.apiPath}/products/all`)
      .then((res) => {
          console.log(res.data.products)
          res.data.products.forEach((product) => {
            this.products.push(product)
          });
          console.log(this.products)
      })
      .catch((err) => {
        console.log(err.response.data);
        this.error();
      
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

    render: function(){
      this.isLoggedIn = true;
    },
  },
  mounted(){
    let token = document.cookie.replace`(/(?:(?:^|.*;\s*)OnlineBusTour\s*\=\s*([^;]*).*$)|^.*$/, "$1")`;
    axios.defaults.headers.common['Authorization'] = token;
  
    axios.post(`${this.apiUrl}/api/user/check`)
    .then((res) => {
      if(res.data.success){
          console.log(res.data);
          console.log("check success");
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
    //return 
  },
  props: ['apiUrl'],
  methods:{
    adminLogout: function (){
			axios.post(`${this.apiUrl}/logout/`)
			.then((res) => {
				console.log(res.data)
				if(res.data.success){
          document.cookie = `OnlineBusTour = ; expires = ${new Date()}`;
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
          <submit-btn btn-id="submit-login" class="p-05" type="button" v-on:click="authLogin" btn-name="登入"></submit-btn>
      </form>
    </div>
  `,
  data(){
    return {
    }
  },
  props:[],
  methods:{
    
  }
})

admin.component('get-product-admin',{
  template: ``,
  data(){
    //return
  },
  props:[],
  methods:{
    
  }
})

admin.component('add-product',{
  template: ``,
  data(){
    //return
  },
  props:[],
  methods:{

  }
})

admin.component('edit-product',{
  template: ``,
  data(){
    //return
  },
  props:[],
  methods:{

  }
})

admin.component('delete-product',{
  template: ``,
  data(){
    //return
  },
  props:[],
  methods:{

  }
})

admin.component('submit-btn',{
  template: `
    <button :id="btnId" class="p-05" type="button" @click="btnSubmit"> {{ btnName }} </button>
  `,
  data(){
    //return
  },
  props:['btnId', 'btnName'],
  methods:{
    btnSubmit(){

    }
  }
})

admin.component('cancel-btn',{
  template: ``,
  data(){
    //return
  },
  props:[],
  methods:{

  }
})

admin.component('edit-btn',{
  template: ``,
  data(){
    //return
  },
  props:[],
  methods:{

  }
})

admin.component('delete-btn',{
  template: ``,
  data(){
    //return
  },
  props:[],
  methods:{

  }
})



admin.mount('#admin')