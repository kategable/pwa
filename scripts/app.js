var app6 = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        items: [
           
        ],
        products: []
    },
    methods: {
        addtoCart: function (item) {
            this.items.push(item)
            localStorage.setItem('cart', JSON.stringify(this.items));
        },
        

    },
    mounted: function () {
        var items = localStorage.getItem('cart');
        if (items) {
            this.items = JSON.parse(items);
            localStorage.setItem('cart', JSON.stringify(this.items));

            notifyMe("you have cart items")

        }

        var url = "/pwa/data/data.json"
        var promise = Promise.resolve($.getJSON(url))
        promise.then(function (response, statusText, xhrObj) {
            app6.products = response;
             
        }, function (xhrObj, textStatus, err) {
            console.log(err);
        })


    }
})



function notifyMe(msg) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification(msg, { icon:"/pwa/apple-touch-icon.png", tag:'cart'});
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                var notification = new Notification(msg, { icon: "/pwa/apple-touch-icon.png", tag: 'cart'});

            }
        });
    }

    // At last, if the user has denied notifications, and you 
    // want to be respectful there is no need to bother them any more.
}