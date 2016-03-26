var selectedShow;
var selectedSeats = [];
var adultSeatsAmount = 0;
var studentSeatsAmount = 0;

$(document).ready(initShows);

$('body').on('click', '.show-selection-link', function(e) {
    e.preventDefault();

    var selectedShowId = Number($(this).find('div').attr('id').replace('show-', ''));

    $.ajax({
        type: 'GET',
        url: '/api/v1/shows/' + selectedShowId,
        dataType: 'JSON',
        success: function(data) {
            selectedShow = data;

            getTemplate('/views/partials/seatselection.ejs', function(err, template) {
                var seatSelection = ejs.render(template, {show: selectedShow, time: new Date(data.time)});
                $('#content').html(seatSelection);
                $('.breadcrumb li:eq(1)').toggleClass('active');
                initSeatCharts();
            });
        }
    });
}).on('click', '#checkout-button', function(e) {
    e.preventDefault();

    $('#checkout-button').popover({
        trigger: 'manual',
        placement: 'left',
        container: 'body'
    });

    adultSeatsAmount = parseInt($('#adultTickets').val());
    studentSeatsAmount = parseInt($('#studentTickets').val());

    if (selectedSeats.length <= 0) {
        $(this).data('bs.popover').options.content = 'Please select your seats first.';
        $(this).popover('show');
        setTimeout(function() {
            $('#checkout-button').popover('hide');
        }, 3000);
        return;
    } else if (selectedSeats.length !== adultSeatsAmount + studentSeatsAmount) {
        $(this).data('bs.popover').options.content = 'Please ensure that the number of seats selected matches the number of people in your group.';
        $(this).popover('show');
        setTimeout(function() {
            $('#checkout-button').popover('hide');
        }, 3000);
        return;
    }

    getTemplate('/views/partials/checkout.ejs', function(err, template) {
        var checkout = ejs.render(template, {
            stripePublishableKey: window.stripePublishableKey,
            selectedSeats: selectedSeats,
            show: selectedShow,
            time: new Date(selectedShow.time),
            adultSeatsAmount: adultSeatsAmount,
            studentSeatsAmount: studentSeatsAmount,
            totalPrice: (studentSeatsAmount * selectedShow.studentprice) + (adultSeatsAmount * selectedShow.adultprice) + 1
        });
        $('#content').html(checkout);
        $('.breadcrumb li:eq(2)').toggleClass('active');

                        /* RUN ON PURCHASE CONFIRMATION $.ajax({
                            type: 'GET',
                            url: '/api/v1/shows/' + selectedShow.id + '/purchased_seats',
                            dataType: 'JSON',
                            success: function(data) {
                                var seats = selectedSeats.join(',');
                                var problem = false;
                                data.forEach(function(purchasedSeat) {
                                    if (seats.indexOf(purchasedSeat) != -1) {
                                        problem = true;
                                    }
                                });

                                if (!problem) {
                                    $.ajax({
                                        type: 'POST',
                                        url: '/api/v1/checkout',
                                        dataType: 'JSON',
                                        data: {
                                            seats: $('input[name=seats]').val(),
                                            price: (studentSeatsAmount * selectedShow.studentprice) + (adultSeatsAmount * selectedShow.adultprice),
                                            showid: $('input[name=showid]').val(),
                                            showname: $('input[name=showname]').val(),
                                            firstName: $('input[name=firstName]').val(),
                                            lastName: $('input[name=lastName]').val(),
                                            email: $('input[name=email]').val(),
                                            phone: $('input[name=phone]').val(),
                                            address: $('input[name=address]').val(),
                                            city: $('input[name=city]').val(),
                                            state: $('input[name=state]').val(),
                                            zip: $('input[name=zip]').val()
                                        },
                                        success: function(data) {
                                            getTemplate('/views/partials/confirmation.ejs', function(err, template) {
                                                var confirmation = ejs.render(template, {
                                                    confirmationNumber: data.confirmationNumber,
                                                    show: selectedShow,
                                                    time: new Date(selectedShow.time)
                                                });
                                                $('#content').html(confirmation);
                                                $('.breadcrumb li:eq(3)').toggleClass('active');
                                            });
                                        }
                                    });
                                } else {
                                    $('#purchase-button').popover({
                                        content: 'Sorry, but the seats that you originally selected are no longer available. Your credit card has not been charged. Please refresh the page and try again.',
                                        placement: 'left',
                                        container: 'body'
                                    }).popover('show');
                                    setTimeout(function() {
                                        $('#checkout-button').popover('hide');
                                    }, 3000);
                                }
                            }
                        });*/
    });
}).on('click', '#seats-goback-button', function(e) {
    e.preventDefault();

    selectedSeats = [];
    selectedShow = null;

    getTemplate('/views/partials/showselection.ejs', function(err, template) {
        var showSelection = ejs.render(template);
        $('#content').html(showSelection);
        $('.breadcrumb li:eq(1)').toggleClass('active');
        initShows();
    });
}).on('click', '#checkout-goback-button', function(e) {
    e.preventDefault();

    selectedSeats = [];

    getTemplate('/views/partials/seatselection.ejs', function(err, template) {
        var seatSelection = ejs.render(template, {show: selectedShow, time: new Date(selectedShow.time)});
        $('#content').html(seatSelection);
        $('.breadcrumb li:eq(2)').toggleClass('active');
        initSeatCharts();
    });
}).on('click', '#student-info-button', function(e) {
    e.preventDefault();
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
            var showSelectionContainer = $('#show-selection-container');

            $('.spinner').remove();
            showSelectionContainer.removeClass('hidden');

            var html = '';
            data.forEach(function(show) {
                var time = new Date(show.time);
                html += '<a href="#" class="show-selection-link"><div class="col-xs-4" id="show-' + show.id + '"><div class="well"><img src="' + show.logourl + '" width="100%"><h3>' +
                    show.name + '</h3><h4>' + (time.getMonth() + 1) + '/'
                    + time.getDate() + '/'
                    + time.getFullYear() + ' '
                    + ((time.getHours() + 24) % 12 || 12) + ':'
                    + ('0' + time.getMinutes()).slice(-2)
                    + ((time.getHours() >= 12) ? 'PM' : 'AM') + '</h4></div></div></a>';
            });
            showSelectionContainer.html(html);
        }
    });
}

function initSeatCharts() {
    $('#student-info-button').popover({
        trigger: 'hover focus',
        content: 'Anyone currently enrolled in school is a student. Children ages 5 and under are free.',
        placement: 'right',
        container: 'body',
        delay: {
            'show': 100,
            'hide': 600
        }
    });

    $.ajax({
        type: 'GET',
        url: '/api/v1/shows/' + selectedShow.id + '/purchased_seats',
        dataType: 'JSON',
        success: function(seats) {
            var seatMap = $('#seat-map');

            $('.spinner').remove();
            seatMap.removeClass('hidden');

            var seatChart = seatMap.seatCharts({
                map: [
                    '__aaaaaaaaaaaaaaaaa_aaaaaaaaaaaaaaaaa__',
                    'aaaaaaaaaaaaaaaaaaa_aaaaaaaaaaaaaaaaaaa',
                    '_aaaaaaaaaaaaaaaaaa_aaaaaaaaaaaaaaaaaa_',
                    '_aaaaaaaaaaaaaaaaaa_aaaaaaaaaaaaaaaaaa_',
                    '_aaaaaaaaaaaaaaaaaa_aaaaaaaaaaaaaaaaaa_',
                    '_aaaaaaaaaaaaaaaaaa_aaaaaaaaaaaaaaaaaa_',
                    '_aaaaaaaaaaaaaaaaaa_aaaaaaaaaaaaaaaaaa_',
                    '_aaaaaaaaaaaaaaaaaa_aaaaaaaaaaaaaaaaaa_',
                    '_aaaaaaaaaaaaaaaaaa_aaaaaaaaaaaaaaaaaa_',
                    '_aaaaaaaaaaaaaaaaaa_aaaaaaaaaaaaaaaaaa_',
                    '_aaaaaaaaaaaaaaaaaa_aaaaaaaaaaaaaaaaaa_',
                    '_aaaaaaaaaaaaaaaaaa_aaaaaaaaaaaaaaaaaa_',
                    '_aaaaaaaaaaaaaaaaaa_aaaaaaaaaaaaaaaaaa_',
                    '__aaaaaaaaaaaaaaaaa_aaaaaaaaaaaaaaaaa__'
                ],
                naming: {
                    columns: ['37', '35', '33', '31', '29', '27', '25', '23', '21', '19', '17', '15', '13', '11', '9', '7', '5', '3', '1', '', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30', '32', '34', '36', '38'],
                    rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']
                },
                seats: {
                    a: {
                        classes: 'general'
                    }
                },
                click: function() {
                    if (this.status() === 'available' && selectedSeats.length < (parseInt($('#adultTickets').val()) + parseInt($('#studentTickets').val()))) {
                        // Add to array
                        selectedSeats.push(this.node()[0].id);
                        // Update counter
                        $('#seat-number').text(selectedSeats.length);
                        // Update status
                        return 'selected';
                    } else if (this.status() === 'selected') {
                        // Remove from array
                        selectedSeats.splice(selectedSeats.indexOf(this.node()[0].id), 1);
                        // Update counter
                        $('#seat-number').text(selectedSeats.length);
                        // Update status
                        return 'available';
                    } else if (this.status() === 'unavailable') {
                        return 'unavailable';
                    } else {
                        return this.style();
                    }
                }
            });

            seatChart.get(seats).status('unavailable');
        }
    });
}