'use strict'
// Register Service Worker
//https://web-push-codelab.glitch.me/
var swRegistration;
var isSubscribed;
var applicationServerPublicKey = urlB64ToUint8Array("BHJsdnOuZNPqmee9cuvQpddXJ2bM0fLdWyM5tHuomEXBJ8EDmLhP8HXhLX6YfPFTKOeaUmH3ejER_em01-ijrJk");
const pushButton = document.querySelector('.js-push-btn');
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/pwa/service-worker.js').then(function (registration) {
    swRegistration = registration;
    initializeUI();
    // Registration was successful
  }).catch(function (err) {
    // registration failed :(
    pushButton.innerHTML  = 'Push Not Supported';
    console.log('ServiceWorker registration failed: ', err);
  });
}

// Setup Push notifications
 function buttonClick() {
  pushButton.disabled = true;
  if (isSubscribed) {
    unsubscribeUser();
  } else {
    subscribeUser();
  }
};

 
function updateBtn() {
  if (Notification.permission === 'denied') {
  
    pushButton.innerHTML  = 'Push Messaging Blocked.';
    pushButton.disabled = true;
    updateSubscriptionOnServer(null);
    return;
  }
  if (isSubscribed) {
    pushButton.innerHTML  = 'Disable Push Messaging';
  } else {
    pushButton.innerHTML  = 'Enable Push Messaging';
  }

  pushButton.disabled = false;
}
var isPushEnabled = false;
function unsubscribeUser() {
  swRegistration.pushManager.getSubscription()
    .then(function (subscription) {
      if (subscription) {
        return subscription.unsubscribe();
      }
    })
    .catch(function (error) {
      console.log('Error unsubscribing', error);
    })
    .then(function () {
      updateSubscriptionOnServer(null);

      console.log('User is unsubscribed.');
      isSubscribed = false;

      updateBtn();
    });
}
function subscribeUser() {
  const applicationServerKey = applicationServerPublicKey;
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
    .then(function (subscription) {
      console.log('User is subscribed.');
      pushButton.textContent = 'Unsubscribe';
      updateSubscriptionOnServer(subscription);

      isSubscribed = true;

      updateBtn();
    })
    .catch(function (err) {
      console.log('Failed to subscribe the user: ', err);
      updateBtn();
    });
}
function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
function initializeUI() {



  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
    .then(function (subscription) {
      isSubscribed = !(subscription === null);

      updateSubscriptionOnServer(subscription);

      if (isSubscribed) {
        console.log('User IS subscribed.');
      } else {
        console.log('User is NOT subscribed.');
      }

      updateBtn();
    });
}
function updateSubscriptionOnServer(subscription) {
  // TODO: Send subscription to application server

  const subscriptionJson = document.querySelector('.js-subscription-json');
  const subscriptionDetails =
    document.querySelector('.js-subscription-details');

  if (subscription) {
    subscriptionJson.textContent = JSON.stringify(subscription);

  } else {
    subscriptionJson.textContent = 'not subscribed';
    
  }
}

function subscribe() {
  // Disable the button so it can't be changed while  
  // we process the permission request  

  navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
    var options = {
      userVisibleOnly: true,
      applicationServerKey: applicationServerPublicKey
    };
    serviceWorkerRegistration.pushManager.subscribe(options)
      .then(function (subscription) {
        // The subscription was successful  
        isPushEnabled = true;
        notifyMe("end point to push server", subscription.endpoint);
        console.log("end point to push server: " + subscription.endpoint);

        // TODO: Send the subscription.endpoint to your server  
        // and save it to send a push message at a later date
        // return sendSubscriptionToServer(subscription);
      })
      .catch(function (e) {
        if (Notification.permission === 'denied') {
          // The user denied the notification permission which  
          // means we failed to subscribe and the user will need  
          // to manually change the notification permission to  
          // subscribe to push messages  
          console.warn('Permission for Notifications was denied');

        } else {
          // A problem occurred with the subscription; common reasons  
          // include network errors, and lacking gcm_sender_id and/or  
          // gcm_user_visible_only in the manifest.  
          console.error('Unable to subscribe to push.', e);

        }
      });
  });
}

function showNotification(title, tag) {
  Notification.requestPermission(function (result) {
    if (result === 'granted') {
      navigator.serviceWorker.ready.then(function (registration) {
        registration.showNotification(title, {
          body: 'Buzz! Buzz!',
          icon: "/pwa/apple-touch-icon.png",
          vibrate: [200, 100, 200, 100, 200, 100, 200],
          tag: tag
        });
      });
    }
  });
}