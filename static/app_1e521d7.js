var util={getCookie:function(e){return document.cookie.length>0&&(c_start=document.cookie.indexOf(e+"="),-1!=c_start)?(c_start=c_start+e.length+1,c_end=document.cookie.indexOf(";",c_start),-1==c_end&&(c_end=document.cookie.length),unescape(document.cookie.substring(c_start,c_end))):""},setCookie:function(e,t,s){var r=new Date;r.setDate(r.getDate()+s),document.cookie=e+"="+escape(t)+(null==s?"":"; expires="+r.toGMTString())},checkCookie:function(){username=getCookie("username"),null!=username&&""!=username?alert("Welcome again "+username+"!"):(username=prompt("Please enter your name:",""),null!=username&&""!=username&&setCookie("username",username,365))}},app={apiDomain:"https://api.shequcun.com",_xsrf:util.getCookie("_xsrf"),uid:util.getCookie("uid"),user:{}},address_list,address_index=0;Vue.config.delimiters=["(%","%)"],Vue.http.options.emulateJSON=!0,Vue.http.headers.common["X-Xsrftoken"]=app._xsrf;var fun={errcodeFun:function(e){if(!e)return!0;if(e.errcode){switch(e.errcode){case 2001:alert(e.errmsg),router.go({name:"login",params:{}});break;default:alert(e.errmsg)}return!1}return!0},set_user:function(e){app.user=e,store.set("user",e)},get_user:function(){return app.user||store.get("user")},set_address_list:function(e){address_list=e},get_address_list:function(){return void 0!==address_list?address_list:!1},get_address_list_ajax:function(e){Vue.http.get("/api/address/list",{},function(t){fun.errcodeFun(t),fun.set_address_list(t),e(t)}).error(function(){})},get_address:function(e){if(!address_list)return console.warn("address_list为空"),{};for(var t=0;t<address_list.length;t++)if(e==address_list[t].id)return console.log(address_list[t]),address_list[t]}};Vue.component("c-dimmer",{props:["active"],template:'<div class="c-dimmer" v-class="active : active" data-am-dimmer=""></div>'}),Vue.component("c-load",{props:["hasShow"],template:'<div class="load" v-show="hasShow">加载中</div>'}),Vue.component("c-textarea",{props:["hasShow","text","btnText","placeholder"],template:'<div id="c-textarea" class="f-z" v-show="hasShow"><textarea class="f-z-sm" rows="7" v-attr="placeholder:placeholder" v-model="text"></textarea><div class="btn-box"><button class="btn" v-on="click:save()">(% btnText %)</button></div></div>',methods:{save:function(){this.hasShow=!1}}}),Vue.component("c-bottom-buy",Vue.extend({data:function(){return{count:1,type:2}},created:function(){this.$on("return_recom_item",function(){this.$set("type",this.$parent.data.type)})},methods:{buy:function(){var e=this,t=this.$parent.data;return store.set("cart",[{id:t.id,type:t.type,img:t.imgs[0],title:t.title,price:t.price,count:e.count}]),(app.user.id||store.get("user"))&&store.get("user").id?void router.go({name:"buy",params:{}}):void router.go({name:"login",params:{}})}},template:'<div class="c-bottom-buy row-1"><div v-show="2==type"></div><div class="action" v-show="2!=type"><button class="btn reduce" v-attr="disabled:count>1?false:true" v-on="click: count--">━</button><span class="count">(%count%)</span><button class="btn increase" v-on="click: count++">╋</button></div><a class="btn add" v-on="click: buy()">立即购买</a></div>'}));var Index=Vue.extend({template:"#index-template",data:function(){return{status:"",list:[]}},methods:{getList:function(){}},created:function(){this.$http.get("/api/home",{page:1},function(e){fun.errcodeFun(e),this.$set("recom_item_list",e.recom_item_list)}).error(function(){})},ready:function(){}}),RecomItem=Vue.extend({template:"#recom-item-template",data:function(){return{show_qr_code:!1}},created:function(){var e=this.$route.params.id;this.$http.get("/api/recom_item",{id:e},function(e){this.status="",this.$set("data",e),setTimeout(function(){$("#slide").swipeSlide({continuousScroll:!0,speed:3e3,transitionType:"cubic-bezier(0.22, 0.69, 0.72, 0.88)",firstCallback:function(e,t,s){s.find(".dot").children().first().addClass("cur")},callback:function(e,t,s){s.find(".dot").children().eq(e).addClass("cur").siblings().removeClass("cur")}})},500),this.$broadcast("return_recom_item")}).error(function(){})},ready:function(){},attached:function(){},methods:{buy:function(){}}}),Buy=Vue.extend({template:"#buy-template",data:function(){return{address:{},cart_list:[],memo:"",has_freight:!1,freight:1e3,limit:9900,all_price:0,show_textarea:!1}},created:function(){var e=store.get("cart");return e?(this.$set("cart_list",e),this.count_all_price(),this.$on("return_address_list",function(e){this.$set("address",e[address_index])}),void this.$dispatch("get_address_list")):void router.go({name:"index",params:{}})},methods:{input:function(){this.show_textarea=!0},count_all_price:function(){for(var e,t=this.cart_list,s=0,r=0;r<t.length;r++)e=t[r],s=e.count*e.price,2!=e.type&&(this.has_freight=!0);this.has_freight&&s<this.limit&&(s+=this.freight),this.$set("all_price",s)},created_order:function(){var e=this;e.address.id||alert("请选择收货地址");var t={combo_id:"",combo_idx:"",coupon_id:"",type:3,items:"",extras:"",spares:"",name:e.address.name,mobile:e.address.mobile,address:e.address.address,memo:e.memo,paytype:3},s=[];for(var r in e.cart_list){var i=e.cart_list[r];s.push(""+i.id+":"+i.count)}t.extras=s.join(","),this.$http.post("/api/order",t,function(t){if(fun.errcodeFun(t)){if(e.all_price!=t.fee)return void alert("金额计算错误");store.remove("cart"),console.log("去支付"),router.go({name:"pay_result",params:{}})}}).error(function(){})}}}),PayResult=Vue.extend({template:"#pay-result-template"}),Login=Vue.extend({template:"#login-template",data:function(){return{mobile:"",smscode:"",text:"获取验证码",remaintime:60,has_disabled_send_smscode:!1,djs:null}},created:function(){},methods:{sendSms:function(){var e=this;11===this.mobile.trim().length&&(this.has_disabled_send_smscode||this.$http.post("/api/auth/send_smscode",{mobile:this.mobile},function(t){return t&&t.errcode?void alert(t.errmsg):(e.text="("+e.remaintime+"s)重新获取",e.has_disabled_send_smscode=!0,void(e.djs=setInterval(function(){e.remaintime--,e.remaintime>0?e.text="("+e.remaintime+"s)重新获取":(clearInterval(e.djs),e.text="获取验证码",e.remaintime=60,e.has_disabled_send_smscode=!1)},1e3)))}).error(function(){}))},submit:function(){11===this.mobile.trim().length&&this.smscode.trim().length&&this.$http.post("/api/auth/login",{mobile:this.mobile,smscode:this.smscode},function(e){return e&&e.errcode?void alert(e.errmsg):(fun.set_user(e.user),fun.set_address_list(e.address_list),void router.replace({name:"buy",params:{}}))}).error(function(){})}}}),Address=Vue.extend({template:"#address-template",data:function(){return{address_list:[]}},created:function(){this.$on("return_address_list",function(e){this.$set("address_list",e)}),this.$dispatch("get_address_list")},methods:{selectAddress:function(e,t){for(var s=fun.get_address_list(),r=0;r<s.length;r++)s[r].default=!1;e.default=!0,address_index=t,router.replace({name:"buy",params:{}})},edit:function(e,t,s){router.go({name:"address_detail",params:{id:e.id}}),s.stopPropagation()}}}),AddressDetail=Vue.extend({template:"#address-detail-template",data:function(){return{address:{id:0,name:"",mobile:"",city:"北京",region:"",address:""}}},created:function(){this.$http.jsonp(app.apiDomain+"/util/region",{pid:1},function(e){this.$set("region_list",e.regions),this.$dispatch("get_address",this.address_id)}).error(function(){}),this.address_id=this.$route.params.id,this.$on("return_address",function(e){this.address=e,console.log(this.address)})},methods:{input:function(){store.set("InputData",{placeholder:"请输入街道、小区名称",btnText:"保存地址",goPath:"address_detail",params:{id:this.address.id}}),router.go({name:"input",params:{}})},select_region:function(){},save:function(){this.$http.post("/api/address/save",this.address,function(e){return e&&e.errcode?void alert(e.errmsg):(this.$dispatch("remove_address_list"),void router.go({name:"address",params:{}}))}).error(function(){})}}}),Memo=Vue.extend({template:"#memo-template",data:function(){return{memo:""}}}),Input=Vue.extend({template:"#input-template",data:function(){var e=store.get("InputData");return!e&&console.warn("缺少必要参数！"),e},methods:{submit:function(){router.replace({name:this.goPath,params:this.params})}},created:function(){console.log(this),console.log(router)}}),App=Vue.extend({data:function(){return{a:1,b:2}},created:function(){this.$once("return_address_list",function(e){fun.set_address_list(e)}),this.$on("get_address_list",function(){return void 0!==address_list&&null!==address_list?(this.$emit("return_address_list",address_list)&&this.$broadcast("return_address_list",address_list),!1):void this.$http.get("/api/address/list",{},function(e){fun.errcodeFun(e);var t=e;return this.$emit("return_address_list",t)&&this.$broadcast("return_address_list",t),!1}).error(function(){})}),this.$on("get_address",function(e){if(!address_list)return console.warn("address_list为空"),this.$once("return_address_list",function(){this.$emit("get_address",e)}),void this.$emit("get_address_list",{on:"get_address",param:e});for(var t=0;t<address_list.length;t++)e==address_list[t].id&&this.$broadcast("return_address",address_list[t])}),this.$on("remove_address_list",function(){address_list=null})},compiled:function(){this.$broadcast("a",{a:1})},ready:function(){this.$broadcast("a",{a:1})}}),router=new VueRouter;router.map({"/":{name:"index",component:Index},"/recomitem/:id":{name:"recom_item_detail",component:RecomItem},"/buy":{name:"buy",component:Buy},"/login":{name:"login",component:Login},"/address":{name:"address",component:Address},"/address/:id":{name:"address_detail",component:AddressDetail},"/pay_result":{name:"pay_result",component:PayResult},"/input":{name:"input",component:Input},"*":{component:Index}}),router.redirect({}),router.start(App,"#app");