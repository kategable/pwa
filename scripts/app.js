var app6 = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        items: [
            { message: 'Foo' },
            { message: 'Bar' }
        ],
        products: []
    },
    methods: {
        greet: function () {
            this.items.push({ message: this.message })
        },
        

    },
    mounted:function() {
        var url = "/pwa/data/data.json"
        var promise = Promise.resolve($.getJSON(url))
        promise.then(function (response, statusText, xhrObj) {
            app6.products = response;
             
        }, function (xhrObj, textStatus, err) {
            console.log(err);
        })


    }
})

