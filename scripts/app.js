var app = new Vue({
    el: '#app',
    user: {},
    userLoaded: false,
    data: {
        message: 'Hello Vue!',
        items: [],
        products: []
    },
    methods: {
        addtoCart: function (item) {
            // localStorage.setItem('cart', JSON.stringify(this.items));
            localDB.addObject("cart", item, 'id').then(function () {
                app.items.push(item)
            }, function () {            
                notifyMe("you already added cart item", 'cart')
            });

        },
        signin: function () {
            app.user = firebase.auth().currentUser;
            app.userLoaded = false;

            if (app.user) {
                app.userLoaded = true;
                // User is signed in.
            } else {
                // No user is signed in.
                facebook();
            }
            //firebase.auth().getRedirectResult().then(function (result) {
            //    if (result.credential) {
            //        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            //        var token = result.credential.accessToken;
            //        // ...
            //    }
            //    // The signed-in user info.
            //    var user = result.user;
            //}).catch(function (error) {
            //    // Handle Errors here.
            //    var errorCode = error.code;
            //    var errorMessage = error.message;
            //    // The email of the user's account used.
            //    var email = error.email;
            //    // The firebase.auth.AuthCredential type that was used.
            //    var credential = error.credential;
            //    // ...
            //});
        }

    },
    mounted: function () {

        localDB.getAll('cart').then(function (res) {
            var items = res;

            if (items.length > 0) {
                app.items = items;
                notifyMe("you have cart items", 'cart')

            }

            var url = "/pwa/data/data.json"
            var promise = Promise.resolve($.getJSON(url))
            promise.then(function (response, statusText, xhrObj) {
                app.products = response;
            },
                function (xhrObj, textStatus, err) {
                    console.log(err);
                    notifyMe('Error getting data',textStatus)
                });
        }),
            function (xhrObj, textStatus, err) {
                console.log(err);
                 
                notifyMe('Eror getting data fromlocaldb',textStatus)
            };
    }


});
app.userLoaded = false;

function facebook() {

    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('email');
    provider.setCustomParameters({
        'display': 'popup'
    });
    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
}
function notifyMe(title,body) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
        return;
    }

    // Let's check whether notification permissions have already been granted

    Notification.requestPermission(function (result) {
        if (result === 'granted') {
            navigator.serviceWorker.ready.then(function (registration) {
                registration.showNotification(title, {
                    body: body,
                    icon: "/pwa/apple-touch-icon.png",
                    vibrate: [200, 100, 200, 100, 200, 100, 200],
                    tag: 'cart'
                });
            });
        }
        else if (result=== "denied") {
            alert("No Notification for you");
            return;
        }
    });
    // If it's okay let's create a notification
    //  var notification = new Notification(title, { icon: "/pwa/apple-touch-icon.png", tag: 'cart' });
  


    // Otherwise, we need to ask the user for permission
  

    // At last, if the user has denied notifications, and you 
    // want to be respectful there is no need to bother them any more.
}