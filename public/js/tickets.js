var selectedSeats = [];

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
});