var selectedSeats = [];

$(document).ready(function() {
    initSeatCharts();
});

$('body').on('click', '#checkoutButton', function() {
    if (selectedSeats.length <= 0) {
        $('#checkoutButton').popover('show');
        return;
    }

    getTemplate('/views/partials/checkout.ejs', function(err, template) {
        var checkout = ejs.render(template);
        $('#content').html(checkout);
        $('.breadcrumb li:eq(1)').toggleClass('active');

        /**
         BrainTree Setup
         */
        $.ajax({
            type: 'GET',
            url: '/api/v1/token',
            dataType: 'JSON',
            success: function(data) {
                braintree.setup(data.clientToken, 'custom', {
                    id: 'payment-form',
                    hostedFields: {
                        number: {
                            selector: '#card-number',
                            placeholder: 'Credit Card Number'
                        },
                        cvv: {
                            selector: '#cvv',
                            placeholder: 'CVV'
                        },
                        expirationDate: {
                            selector: '#expiration-date',
                            placeholder: 'Expiration'
                        },
                        styles: {
                            'input': {
                                'font-family': '"Helvetica Neue", Helvetica, Arial, sans-serif',
                                'font-size': '14px'
                            },
                            '::-moz-placeholder': {'color': '#999'},
                            ':-ms-input-placeholder': {'color': '#999'},
                            '::-webkit-input-placeholder': {'color': '#999'}
                        }
                    }
                });
            }
        });
    });
}).on('click', '#checkoutGoBackButton', function() {
    selectedSeats = [];
    getTemplate('/views/partials/seatselection.ejs', function(err, template) {
        var seatSelection = ejs.render(template);
        $('#content').html(seatSelection);
        $('.breadcrumb li:eq(1)').toggleClass('active');
        initSeatCharts();
    });
});

function getTemplate(file, callback) {
    $.ajax(file, {
        type: 'GET',
        success: function(data, textStatus, xhr) {
            return callback(null, data);
        },
        error: function(xhr, textStatus, error) {
            return callback(error);
        }
    });
}

function initSeatCharts() {
    $('#leftSeatMap').seatCharts({
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
            columns: ['37', '35', '33', '31', '29', '27', '25', '23', '21', '19', '17', '15', '13', '11', '9', '7', '5', '3', '1'],
            rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']
        },
        seats: {
            a: {
                price: 5.00,
                classes: 'general'
            }
        },
        click: function () {
            if (this.status() == 'available') {
                // Add to array
                selectedSeats.push(this.node()[0].id);
                // Update counter
                $('#seatnumber').text(selectedSeats.length);
                // Update status
                return 'selected';
            } else if (this.status() == 'selected') {
                // Remove from array
                selectedSeats.splice(selectedSeats.indexOf(this.node()[0].id), 1);
                // Update counter
                $('#seatnumber').text(selectedSeats.length);
                // Update status
                return 'available';
            } else if (this.status() == 'unavailable') {
                return 'unavailable';
            } else {
                return this.style();
            }
        }
    });

    $('#rightSeatMap').seatCharts({
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
                price: 5.00,
                classes: 'general'
            }
        },
        click: function () {
            if (this.status() == 'available') {
                // Add to array
                selectedSeats.push(this.node()[0].id);
                // Update counter
                $('#seatnumber').text(selectedSeats.length);
                // Update status
                return 'selected';
            } else if (this.status() == 'selected') {
                // Remove from array
                selectedSeats.splice(selectedSeats.indexOf(this.node()[0].id), 1);
                // Update counter
                $('#seatnumber').text(selectedSeats.length);
                // Update status
                return 'available';
            } else if (this.status() == 'unavailable') {
                return 'unavailable';
            } else {
                return this.style();
            }
        }
    });
}