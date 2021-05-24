const admin = Vue.createApp({
  data() {
    return { 
      apiUrl:'https://vue3-course-api.hexschool.io',
      apiPath:'bustour',
      // cookiename: "OnlineBusTour",
      currency: "日元",
      products: [],
      isLoggedIn: false,
      logginUser:{
        username: "",
        password: ""
      },
      tempProduct:{
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
    checkLogin: function(){
      let token = document.cookie.replace`(/(?:(?:^|.*;\s*)OnlineBusTour\s*\=\s*([^;]*).*$)|^.*$/, "$1")`;
      axios.defaults.headers.common['Authorization'] = token;
    
      axios.post(`${this.apiUrl}/api/user/check`)
      .then((res) => {
        if(res.data.success){
            console.log(res.data);
            console.log("check success");
            this.isLoggedIn = true;
        } else {
          console.log(res.data);
          console.log("check fail");
          this.isLoggedIn = false;
        };
      })
      .catch((err) => {
        console.log(err);
      });
    },
    showAdminLogin: function(){
    },
    authLogin: function(){
      console.log("authloggin", this.logginUser)
      axios.post(`${this.apiUrl}/admin/signin/`, this.logginUser)
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
    },
    addProduct: function(){
      let token = document.cookie.replace`(/(?:(?:^|.*;\s*)OnlineBusTour\s*\=\s*([^;]*).*$)|^.*$/, "$1")`;
      axios.defaults.headers.common['Authorization'] = token;

			axios.post(`${this.apiUrl}/api/${this.apiPath}/admin/product/`, {
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
				console.log(res.data);
				this.tempProduct = {};
			})
			.catch((err) => {
				console.log(err.response.data);
			});
    },
    editProduct: function(){

    },
    deleteProduct: function(){

    },
    adminLogout: function(){

    },
    clear: function(){

    },
    render: function(){
      this.isLoggedIn = true;
    },
  },
  created(){
    this.checkLogin()
    // this.render();
    // this.getProductAdmin()
  }
})

const vm = admin.mount('#admin')