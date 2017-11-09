var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        items: [
        ],
        products: []
    },
    methods: {
        addtoCart: function(item) {
            // localStorage.setItem('cart', JSON.stringify(this.items));
            localDB.addObject("cart", item, 'id').then(function() {
                app.items.push(item)
            },function() {
                alert("didnt add")
            });

        },


    },
    mounted: function() {
        var items = [];
        localDB.getAll('cart').then(function(res) {
                items = res;

                if (items.length>0) {
                    app.items =items;
                    showNotification("you have cart items",'cart')

                }

                var url = "/pwa/data/data.json"
                var promise = Promise.resolve($.getJSON(url))
                promise.then(function(response, statusText, xhrObj) {
                        app.products = response;
                    },
                    function(xhrObj, textStatus, err) {
                        console.log(err);
                    });
            }),
            function(xhrObj, textStatus, err) {
                console.log(err);
            };
    }


});



function notifyMe(title) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
      //  var notification = new Notification(title, { icon: "/pwa/apple-touch-icon.png", tag: 'cart' });
        self.registration.showNotification(title, {
            body: body,
            icon: "/pwa/apple-touch-icon.png",
            tag: 'cart'
        })
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                self.registration.showNotification(title, {
                    body: body,
                    icon: "/pwa/apple-touch-icon.png",
                    tag: 'cart'
                })
            }
        });
    }

    // At last, if the user has denied notifications, and you 
    // want to be respectful there is no need to bother them any more.
}