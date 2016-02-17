var selectedShow = 0;
var selectedSeats = [];

$(document).ready(initShows);

$('body').on('click', '.show-selection-link', function() {
    selectedShow = Number($(this).find('div').attr('id').replace('show-', ''));
    getTemplate('/views/partials/seatselection.ejs', function(err, template) {
        var seatSelection = ejs.render(template);
        $('#content').html(seatSelection);
        $('.breadcrumb li:eq(1)').toggleClass('active');
        initSeatCharts();
    });
}).on('click', '#checkout-button', function() {
    if (selectedSeats.length <= 0) {
        $('#checkout-button').popover('show');
        return;
    }

    getTemplate('/views/partials/checkout.ejs', function(err, template) {
        $.ajax({
            type: 'GET',
            url: '/api/v1/shows/' + selectedShow,
            dataType: 'JSON',
            success: function(data) {
                var checkout = ejs.render(template, {selectedSeats: selectedSeats, show: data, time: new Date(data.time)});
                $('#content').html(checkout);
                $('.breadcrumb li:eq(2)').toggleClass('active');

                // Braintree Setup
                $.ajax({
                    type: 'GET',
                    url: '/api/v1/token',
                    dataType: 'JSON',
                    success: function(data) {
                        braintree.setup(data.clientToken, 'custom', {
                            id: 'payment-form',
                            onReady: function() {
                                $('.spinner').remove();
                                $('#payment-form').removeClass('hidden');
                            },
                            onPaymentMethodReceived: function(obj) {
                                $.ajax({
                                    type: 'POST',
                                    url: '/api/v1/checkout',
                                    dataType: 'JSON',
                                    data: {
                                        seats: $("input[name=seats]").val(),
                                        show: $("input[name=show]").val(),
                                        paymentMethodNonce: obj['nonce'],
                                        firstName: $("input[name=firstName]").val(),
                                        lastName: $("input[name=lastName]").val(),
                                        email: $("input[name=email]").val(),
                                        phone: $("input[name=phone]").val(),
                                        address: $("input[name=address]").val(),
                                        city: $("input[name=city]").val(),
                                        state: $("input[name=state]").val(),
                                        zip: $("input[name=zip]").val()
                                    },
                                    success: function(data) {
                                        getTemplate('/views/partials/confirmation.ejs', function(err, template) {
                                            var confirmation = ejs.render(template, {
                                                confirmationNumber: data.confirmationNumber
                                            });
                                            $('#content').html(confirmation);
                                            $('.breadcrumb li:eq(3)').toggleClass('active');
                                        });
                                    }
                                });
                            },
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
                                    placeholder: 'MM/YY'
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

                $('#secure-popover-text').popover({
                    trigger: 'click hover focus',
                    content: 'All credit card information is processed by our external provider, <a href="https://www.braintreepayments.com/" target="_blank">BrainTree</a> (a PayPal company), and fully encrypted every step of the way.',
                    html: true,
                    placement: 'right',
                    container: 'body',
                    delay: {
                        "show": 100,
                        "hide": 600
                    }
                });
            }
        });
    });
}).on('click', '#seats-goback-button', function() {
    selectedSeats = [];
    getTemplate('/views/partials/showselection.ejs', function(err, template) {
        var showSelection = ejs.render(template);
        $('#content').html(showSelection);
        $('.breadcrumb li:eq(1)').toggleClass('active');
        initShows();
    });
}).on('click', '#checkout-goback-button', function() {
    selectedSeats = [];
    getTemplate('/views/partials/seatselection.ejs', function(err, template) {
        var seatSelection = ejs.render(template);
        $('#content').html(seatSelection);
        $('.breadcrumb li:eq(2)').toggleClass('active');
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

function initShows() {
    $.ajax({
        type: 'GET',
        url: '/api/v1/shows',
        dataType: 'JSON',
        success: function(data) {
            var html = '';
            data.forEach(function(show) {
                var time = new Date(show.time);
                html += '<a href="#" class="show-selection-link"><div class="col-xs-4" id="show-' + show.id + '"><div class="well"><img src="' + show.logourl + '" width="100%"><h3>' +
                    show.name + '</h3><h4>' + (time.getMonth() + 1) + '/'
                    + time.getDate() + '/'
                    + time.getFullYear() + ' '
                    + ((time.getHours() + 24) % 12 || 12) + ':'
                    + ('0' + time.getMinutes()).slice(-2)
                    + ((time.getHours() >= 12) ? "PM" : "AM") + '</h4></div></div></a>';
            });
            $('#show-selection-container').html(html);
        }
    });
}

function initSeatCharts() {
    $.ajax({
        type: 'GET',
        url: '/api/v1/shows/' + selectedShow + '/purchased_seats',
        dataType: 'JSON',
        success: function(seats) {
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
                    columns: ['37', '35', '33', '31', '29', '27', '25', '23', '21', '19', '17', '15', '13', '11', '9', '7', '5', '3', '1'],
                    rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']
                },
                seats: {
                    a: {
                        classes: 'general'
                    }
                },
                click: function () {
                    if (this.status() == 'available') {
                        // Add to array
                        selectedSeats.push(this.node()[0].id);
                        // Update counter
                        $('#seat-number').text(selectedSeats.length);
                        // Update status
                        return 'selected';
                    } else if (this.status() == 'selected') {
                        // Remove from array
                        selectedSeats.splice(selectedSeats.indexOf(this.node()[0].id), 1);
                        // Update counter
                        $('#seat-number').text(selectedSeats.length);
                        // Update status
                        return 'available';
                    } else if (this.status() == 'unavailable') {
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
                        classes: 'general'
                    }
                },
                click: function () {
                    if (this.status() == 'available') {
                        // Add to array
                        selectedSeats.push(this.node()[0].id);
                        // Update counter
                        $('#seat-number').text(selectedSeats.length);
                        // Update status
                        return 'selected';
                    } else if (this.status() == 'selected') {
                        // Remove from array
                        selectedSeats.splice(selectedSeats.indexOf(this.node()[0].id), 1);
                        // Update counter
                        $('#seat-number').text(selectedSeats.length);
                        // Update status
                        return 'available';
                    } else if (this.status() == 'unavailable') {
                        return 'unavailable';
                    } else {
                        return this.style();
                    }
                }
            });

            leftSeatMap.get(seats).status('unavailable');
            rightSeatMap.get(seats).status('unavailable');
        }
    });
}