var app6 = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        items: [
            { message: 'Foo' },
            { message: 'Bar' }
        ]
    },
    methods: {
        greet: function () {
            this.items.push({ message: this.message })
        }
    }
})

