$(document).ready(function() {
    var leftSeatMap = $('#leftSeatMap').seatCharts({
        map: [
            '__aaaaaaaaaaaaaaaaa',
            'aaaaaaaaaaaaaaaaaaa',
            '_aaaaaaaaaaaaaaaaaa',
            '_aaaaaaaaaaaaaaaaaa',
            '_aaaaaaaaaaaaaaaaaa',
            '_aaaaaaaaaaaaaaaaaa',
            '_aaaaaaaaaaaaaaaaaa',
            '_aaaaaaaaaaaaaaaaaa',
            '_aaaaaaaaaaaaaaaaaa',
            '_aaaaaaaaaaaaaaaaaa',
            '_aaaaaaaaaaaaaaaaaa',
            '_aaaaaaaaaaaaaaaaaa',
            '_aaaaaaaaaaaaaaaaaa',
            '__aaaaaaaaaaaaaaaaa'
        ],
        naming: {
            columns: ['38', '36', '34', '32', '30', '28', '26', '24', '22', '20', '18', '16', '14', '12', '10', '8', '6', '4', '2'],
            rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']
        },
        seats: {
            a: {
                price: 99.99,
                classes: 'front-seat' //your custom CSS class
            }
        },
        click: function () {
            if (this.status() == 'available') {
                console.log('added ' + this.data().price);
                //do some stuff, i.e. add to the cart
                return 'selected';
            } else if (this.status() == 'selected') {
                //seat has been vacated
                return 'available';
            } else if (this.status() == 'unavailable') {
                //seat has been already booked
                return 'unavailable';
            } else {
                return this.style();
            }
        }
    });

    var rightSeatMap = $('#rightSeatMap').seatCharts({
        map: [
            'aaaaaaaaaaaaaaaaa__',
            'aaaaaaaaaaaaaaaaaaa',
            'aaaaaaaaaaaaaaaaaa_',
            'aaaaaaaaaaaaaaaaaa_',
            'aaaaaaaaaaaaaaaaaa_',
            'aaaaaaaaaaaaaaaaaa_',
            'aaaaaaaaaaaaaaaaaa_',
            'aaaaaaaaaaaaaaaaaa_',
            'aaaaaaaaaaaaaaaaaa_',
            'aaaaaaaaaaaaaaaaaa_',
            'aaaaaaaaaaaaaaaaaa_',
            'aaaaaaaaaaaaaaaaaa_',
            'aaaaaaaaaaaaaaaaaa_',
            'aaaaaaaaaaaaaaaaa__'
        ],
        naming: {
            columns: ['2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30', '32', '34', '36', '38'],
            rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']
        },
        seats: {
            a: {
                price: 99.99,
                classes: 'front-seat' //your custom CSS class
            }
        },
        click: function () {
            if (this.status() == 'available') {
                console.log('added ' + this.data().price);
                //do some stuff, i.e. add to the cart
                return 'selected';
            } else if (this.status() == 'selected') {
                //seat has been vacated
                return 'available';
            } else if (this.status() == 'unavailable') {
                //seat has been already booked
                return 'unavailable';
            } else {
                return this.style();
            }
        }
    });
});