$(document).ready(function() {
    var seatMap = $('#seat-map');

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
            return this.style();
        }
    });

    setInterval(function() {
        if (!showID) {
            return;
        }

        $.ajax({
            type: 'GET',
            url: '/api/v1/shows/' + showID + '/purchased_seats',
            dataType: 'JSON',
            success: function(data) {
                data.forEach(function(seat) {
                    seatChart.status(seat, 'unavailable');
                });
            }
        });
    }, 2000);
});