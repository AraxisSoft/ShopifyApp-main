


var chatBtn = document.querySelector('.stat');

window.axios = require('axios');

function sendStats(customer, product){
    axios.post('/api/dsd', {})
    .then(response =>{
        console.log("Response"+ response);

    })
    .catch(error =>{
        console.log("error"+ error);
    })

}

chatBtn.addEventListener('click', function(){
    console.log("button clicked");
    var pid = this.dataset.product;
    var cid = this.dataset.customer;


})